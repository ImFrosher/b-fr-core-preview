import { computeIdFromSource } from './misc';
import { saveStateToDatabase, restoreStateFromDatabase } from './database';

declare function SetEntityHealth(entity: number, health: number): void; // this function is not included in the types (don't know why), but it is when game injects it's runtime
declare function SetEntityCoords(
    entity: number,
    xPos: number,
    yPos: number,
    zPos: number,
    alive: boolean,
    deadFlag: boolean,
    ragdollFlag: boolean,
    clearArea: boolean
    ): void; // this function is not included in the types (don't know why), but it is when game injects it's runtime


onNet('b-fr-core:playerInit', () => { // this event is emitted by the client when the player is spawned
    const player = (global as any).source; // this is the source of the player that emitted the event
    initializePlayer(player); // initialize the player
})

function initializePlayer(source: any): void {
    const hash = computeIdFromSource(source); // compute the hash from the source

    new ServerPlayer(source, hash); // create a new ServerPlayer object
}

class ServerPlayerManager {
    static players: ServerPlayer[] = []; // this is the array of all players

    public static getPlayerBySource(source: any): ServerPlayer | null { // this function is used to get a player by their source
        return this.players.find(p => p.source === source);
    }

    public static getPlayerByHash(identifier: string): ServerPlayer | null { // this function is used to get a player by their hash
        return this.players.find(p => p.identifier === identifier);
    }

    public static put(player: ServerPlayer): void { // this function is used to add a player to the array
        this.players.push(player);
    }

    public static remove(player: ServerPlayer): void { // this function is used to remove a player from the array
        this.players = this.players.filter(p => p !== player);
    }

    public static getPlayers(): ServerPlayer[] { // this function is used to get all players
        return this.players;
    }

}

class ServerPlayer { // this is the class for the player state
    source: any; 
    identifier: string;
    joined: number;
    constructor(source: any, identifier: string) { 
        this.source = source;
        this.identifier = identifier;

        this.init(); // initialize the player
    }
    init(): void { // this function is called when the player is initialized
        if (ServerPlayerManager.getPlayerBySource(this.source) != null || ServerPlayerManager.getPlayerByHash(this.identifier) != null) { // if the player is already initialized
            ServerPlayerManager.remove(ServerPlayerManager.getPlayerBySource(this.source)); // remove the player from the array
            ServerPlayerManager.remove(ServerPlayerManager.getPlayerByHash(this.identifier)); // remove the player from the array
        }
        ServerPlayerManager.put(this); // add the player to the array
        this.joined = Date.now() / 1000; // set the joined time

    }

    //TODO: saveItems(): void {};
    //TODO: restoreItems(): void {};
    //TODO: saveState(): void {}; (health, armor etc. POSITION)
    //TODO: restoreState(): void {}; (stamina, health, armor etc. POSITION)

    saveState(): void { // this function is used to save the player state
        const ped = GetPlayerPed(this.source); // get the ped of the player
        const [playerX, playerY, playerZ] = GetEntityCoords(ped); // get the position of the player
        const health = GetEntityHealth(ped); // get the health of the player
        const armor = GetPedArmour(ped); // get the armor of the player


        const state = new playerState(health, armor, playerX, playerY, playerZ); // create a new playerState object

        saveStateToDatabase(this.identifier, state).then(result => { // save the state to the database
            if (result == false) {
                console.error(`[b-fr-core] Failed to save state for player ${this.identifier}`); // if the save failed, log an error
            }
        });
    };

    restoreState(): void { // this function is used to restore the player state
        const ped = GetPlayerPed(this.source); // get the ped of the player
        restoreStateFromDatabase(this.identifier).then(result => { // restore the state from the database
            SetEntityHealth(ped, result.health); // set the health of the player
            SetPedArmour(ped, result.armor); // set the armor of the player
            SetEntityCoords(ped, result.x, result.y, result.z, false, false, false, false); // set the position of the player
        });
    };


    kick(reason: string): void { // this function is used to kick the player
        DropPlayer(this.source, reason); // kick the player
    }
}


export class playerState { // this is the class for the player state
    health: number;
    armor: number;
    x: number;
    y: number;
    z: number;
    constructor(health: number, armor: number, x: number, y: number, z: number) {
        this.health = health;
        this.armor = armor;
        this.x = x;
        this.y = y;
        this.z = z;
    }
}

on('playerDropped', () => { // this event is emitted when the player is dropped
    const src = (global as any).source; // this is the source of the player that emitted the event
    const serverPlayer = ServerPlayerManager.getPlayerBySource(src); // get the player by their source
    if (serverPlayer != null) { // if the player is not null
        serverPlayer.saveState(); // save the player state
        ServerPlayerManager.remove(serverPlayer); // remove the player from the array
    }
})