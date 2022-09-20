import * as mysql from 'mysql';
import cfg from './static/config.js';

import { playerState } from './player';

const connection = mysql.createConnection({ // Creates the connection to the database.
    host: cfg["database"]["host"],
    user: cfg["database"]["user"],
    password: cfg["database"]["password"],
    database: cfg["database"]["database"],
    port: cfg["database"]["port"]
});


export function insertPlayer(id: string, ip: string): Promise<boolean>{ // Inserts the player into the database.
    return new Promise<boolean>((resolve, reject) => { // Creates a promise.
        connection.query(`CREATE TABLE IF NOT EXISTS players (id VARCHAR(255) NOT NULL, ip VARCHAR(255) NOT NULL, PRIMARY KEY (id))`, async (err, result) => { // Creates the table if it doesn't exist.
            if (err) { 
                console.error(err); // Logs the error.
                reject(new Error("Error while creating table! (players)")); // Rejects the promise.
            }
            connection.query("REPLACE INTO `players` SET `id` = ?, `ip` = ?;", [id, ip], (err, result) => { // Inserts the player into the database.
                if (err) {
                    console.error(err); // Logs the error.
                    reject(new Error("Error while inserting player!")); // Rejects the promise.
                }
                resolve(true); // Resolves the promise.
            });
        });
    });
};


export function saveStateToDatabase(id: string, state: playerState): Promise<boolean>{
    return new Promise<boolean>((resolve, reject) => { 
        connection.query(`CREATE TABLE IF NOT EXISTS states (id VARCHAR(255) NOT NULL, health INT(10) NOT NULL, armor INT(10) NOT NULL, xPos INT(10) NOT NULL, yPos INT(10) NOT NULL, zPos INT(10) NOT NULL);`, async (err, result) => { // Creates the table if it doesn't exist.
            if(err){
                console.error(err); // Logs the error.
                reject(new Error("Error while creating table! (states)")); // Rejects the promise.
            }
            connection.query("REPLACE INTO `states` SET `id` = ?, `health` = ?, `armor` = ?, `xPos` = ?, `yPos` = ?, `zPos` = ?;", [id, state.health, state.armor, state.x, state.y, state.z], (err, result) => {   // Inserts the player state into the database.
                if (err) {
                    console.error(err); // Logs the error.
                    reject(new Error("Error while inserting state!")); // Rejects the promise.
                }
                resolve(true); // Resolves the promise.
            }); 

        });
    });
}


export function restoreStateFromDatabase(id: string): Promise<playerState>{ // Restores the player state from the database.
    return new Promise<playerState>((resolve, reject) => {
        connection.query(`SELECT * FROM states WHERE id = ?`, [id], (err, result) => { // Selects the player state from the database.
            if(err){
                console.error(err); // Logs the error.
                reject(new Error("Error while restoring state!")); // Rejects the promise.
            }

            //bad way of obtaining result from query, going to change later
            resolve(new playerState(result[0].health, result[0].armor, result[0].xPos, result[0].yPos, result[0].zPos)); // Resolves the promise.
        });
    });
}