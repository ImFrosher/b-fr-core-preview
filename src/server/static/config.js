var cfg =
{
    "authenticationType": "license", // LICENSE | STEAM | DISCORD | BOTH (will create a combined authentication (discord, steam) system based on hash sha256 (recommended if leaks occur - your players are safe)
    "language": "en", // Language of the server | currently available (en/pl)

    "hashing": true, // true / false
    "secretHashingKey": "", // Secret key for hashing (use random string)

    // DATABASE
    "database": {
        "type": "mysql", // only mysql supported
        "host": "localhost", // Host of the database
        "port": 3306, // Port of the database
        "user": "root", // User of the database
        "password": "", // Password of the database
        "database": "bfr" // Name of the database
    },
}

module.exports = cfg;
