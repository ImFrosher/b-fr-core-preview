import cfg from './static/config.js';
import crypto from 'crypto';

export function getIds(player: any): string[] { // Gets the player identifiers.
    const ids: string[] = [];
    for (let i = 0; i < GetNumPlayerIdentifiers(player); i++) { // Loops through the player identifiers.
        const identifier = GetPlayerIdentifier(player, i); // Gets the player identifier.
        ids.push(identifier);
    }
    return ids;
}

export function computeIdFromSource(player: any) { // Computes the id from the player source.
    const identifiers = getIds(player); // Gets the player identifiers.

    let id: string | null = null;


    // explanation about this switch case is in the server.ts file
    switch (cfg.authenticationType) { // replace this switch case with something else, because it's ugly right now, but working : )
        case "steam":
            {
                let steamIdentifier: string | null = null;
                steamIdentifier = identifiers.find(identifier => identifier.startsWith("steam:"))
                if (steamIdentifier == null) return;
                id = steamIdentifier;
                if (cfg.hasing == false) break;
                const hasher = crypto.createHmac('sha256', cfg.secretHashingKey);
                id = hasher.update(id).digest('hex');
                break;
            }
        case "discord":
            {
                let discordIdentifier: string | null = null;
                discordIdentifier = identifiers.find(identifier => identifier.startsWith("discord:"))
                if (discordIdentifier == null) return;
                id = discordIdentifier;
                if (cfg.hasing == false) break;
                const hasher = crypto.createHmac('sha256', cfg.secretHashingKey);
                id = hasher.update(id).digest('hex');
                break;
            }
        case "license":
            {
                let licenseIdentifier: string | null = null;
                licenseIdentifier = identifiers.find(identifier => identifier.startsWith("license:"))
                if (licenseIdentifier == null) return;
                id = licenseIdentifier;
                if (cfg.hasing == false) break;
                const hasher = crypto.createHmac('sha256', cfg.secretHashingKey);
                id = hasher.update(id).digest('hex');
                break;
            }
        case "both":
            {
                let steamIdentifier: string | null = null;
                steamIdentifier = identifiers.find(identifier => identifier.startsWith("steam:"))
                if (steamIdentifier == null) return;
                let discordIdentifier: string | null = null;
                discordIdentifier = identifiers.find(identifier => identifier.startsWith("discord:"))
                if (discordIdentifier == null) return;
                const hasher = crypto.createHmac('sha256', cfg.secretHashingKey);
                id = hasher.update(steamIdentifier + discordIdentifier).digest('hex');
                break;
            }
        default:
            id = null;
            return;
    }
    return id;
}