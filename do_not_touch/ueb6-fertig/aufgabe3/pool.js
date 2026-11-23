const { Pool } = require('pg');

let cfg = require('./config.json')

let pool = new Pool({ // GEÄNDERT: Verbindungspool anlegen
    host: cfg.database.host, // Adresse des Datenbankservers
    user: cfg.database.user, // Benutzer aus der Konfiguration
    password: cfg.database.password, // Passwort aus der Konfiguration
    database: cfg.database.db // pg erwartet den Schlüssel database
});
pool.on('error', err => console.error(err)); // NEU: Verbindungsabbruch melden statt Server-Absturz

module.exports = pool;