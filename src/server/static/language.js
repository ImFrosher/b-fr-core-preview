
var translations = {
    en: {
        "language": 'English',
        "firstDefferCheck": `We are checking your connection with %!arg!%, please allow us a couple seconds.`,
        "noSteamId": `You are not logged in to Steam.`,
        "noDiscordId": `You are not logged in to Discord.`,
        "noLicenseId": `No rockstar license detected.`,
        "noId": `Error occured when retriving id.`,
        "badAuthenticationType": `Bad authentication type. (config error)`,
        "databaseInsertError": `Error occured when inserting data to database. (database error)`,
    },
    pl: {
        "language": 'Polish',
        "firstDefferCheck": `Sprawdzamy twoją połączenie z %!arg!%, proszę pozwól nam na kilka sekund.`,
        "noSteamId": `Nie jestes polaczony z platforma Steam.`,
        "noDiscordId": `Nie jestes polaczony z platforma Discord.`,
        "noLicenseId": `Nie wykryto licencji rockstar.`,
        "noId": `Wystąpił błąd podczas pobierania id.`,
        "badAuthenticationType": `Zły typ autentykacji. (config error)`,
        "databaseInsertError": `Wystąpił błąd podczas dodawania do bazy danych. (database error)`,
    }
}

export function getFromDictionary(key, ...args){
    var lang = cfg.language;
    if(args.length > 1){
        var temp = translations[lang][key];
        for (let index = 0; index < args.length; index++) {
            const element = args[index];
            temp = temp.replace(/%!arg!%/, element);
        }
        return temp;
    }else{
        return en[key].replace(/%!arg!%/g, args.join(" "));
    }
}
