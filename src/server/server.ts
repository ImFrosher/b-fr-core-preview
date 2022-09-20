import cfg from './static/config.js';
import lang from './static/language.js';
import crypto from 'crypto';
import { getIds } from './misc';

import { insertPlayer } from './database';





function OnPlayerConnecting(name: string, setKickReason: string, deferrals: any){ // Emitted when a player is connecting to the server.
  deferrals.defer(); // Defers the player connection.

  const player = (global as any).source; // Gets the player source.
  const identifiers = getIds(player); // Gets the player identifiers.

  setTimeout(() => { // MANDATORY timeout for 0 seconds, otherwise this will not work.
      deferrals.update(lang.getFromDictionary("firstDefferCheck", cfg.authenticationType));


      let id: string | null = null; // Sets the id to null.

      switch(cfg.authenticationType){ // Checks the authentication type.
        case "steam": // If the authentication type is steam.
          {
            let steamIdentifier: string | null = null; // Sets the steam identifier to null.
            steamIdentifier = identifiers.find(identifier => identifier.startsWith("steam:")); // Finds the steam identifier.
            if(steamIdentifier == null) return deferrals.done(lang.getFromDictionary("noSteamId")); // If the steam identifier is null, then it will return and kick the player.
            id = steamIdentifier; // Sets the id to the steam identifier.
            if(cfg.hasing == false) break; // If the hashing is false, then it will break.
            const hasher = crypto.createHmac('sha256', cfg.secretHashingKey); // Creates the hasher.
            id = hasher.update(id).digest('hex'); // Hashes the id.
            break;
          }
        case "discord": // If the authentication type is discord.
          {
            let discordIdentifier: string | null = null; // Sets the discord identifier to null.
            discordIdentifier = identifiers.find(identifier => identifier.startsWith("discord:")); // Finds the discord identifier.
            if(discordIdentifier == null) return deferrals.done(lang.getFromDictionary("noDiscordId")); // If the discord identifier is null, then it will return and kick the player.
            id = discordIdentifier; // Sets the id to the discord identifier.
            if(cfg.hasing == false) break; // If the hashing is false, then it will break.
            const hasher = crypto.createHmac('sha256', cfg.secretHashingKey); // Creates the hasher.
            id = hasher.update(id).digest('hex'); // Hashes the id.
            break;
          }
        case "license": // If the authentication type is license.
          { 
            let licenseIdentifier: string | null = null; // Sets the license identifier to null.
            licenseIdentifier = identifiers.find(identifier => identifier.startsWith("license:")); // Finds the rockstar license identifier. 
            if(licenseIdentifier == null) return deferrals.done(lang.getFromDictionary("noLicenseId")); // If the rockstar license identifier is null, then it will return and kick the player.
            id = licenseIdentifier; // Sets the id to the rockstar license identifier.
            if(cfg.hasing == false) break; // If the hashing is false, then it will break.
            const hasher = crypto.createHmac('sha256', cfg.secretHashingKey); // Creates the hasher.
            id = hasher.update(id).digest('hex'); // Hashes the id.
            break;
          }
        case "both": // If the authentication type is both.
          {
            let steamIdentifier: string | null = null; // Sets the steam identifier to null.
            steamIdentifier = identifiers.find(identifier => identifier.startsWith("steam:")); // Finds the steam identifier.
            if(steamIdentifier == null) return deferrals.done(lang.getFromDictionary("noSteamId")); // If the steam identifier is null, then it will return and kick the player.
            let discordIdentifier: string | null = null; // Sets the discord identifier to null.
            discordIdentifier = identifiers.find(identifier => identifier.startsWith("discord:")); // Finds the discord identifier.
            if(discordIdentifier == null) return deferrals.done(lang.getFromDictionary("noDiscordId")); // If the discord identifier is null, then it will return and kick the player.
            const hasher = crypto.createHmac('sha256', cfg.secretHashingKey); // Creates the hasher.
            id = hasher.update(steamIdentifier + discordIdentifier).digest('hex'); // Hashes the id.
            break;
          }
        default: // If the authentication type is not valid.
          id = null; // Sets the id to null.
          deferrals.done(lang.getFromDictionary("badAuthenticationType")); // Kicks the player, because the authentication type is not valid.
          break;
      }
      
      if(id == null) return deferrals.done(lang.getFromDictionary("noId")); // If the id is null, then it will return and kick the player.

      insertPlayer(id, identifiers.find(identifier => identifier.startsWith("ip:"))).then(result =>{ // Inserts the player into the database.
        if(result == false) return deferrals.done(lang.getFromDictionary("databaseInsertError")); // If the result is false, then it will return and kick the player.
        deferrals.done(); // If the result is true, then it will let the player join.
      })
  }, 0)
}

on('playerConnecting', OnPlayerConnecting);