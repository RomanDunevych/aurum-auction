const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./auction.db');

db.serialize(() => {
    // Створення таблиць
    db.run(`CREATE TABLE IF NOT EXISTS Users (id INTEGER PRIMARY KEY, username TEXT, email TEXT, role TEXT, password TEXT)`);
    db.run(`CREATE TABLE IF NOT EXISTS Categories (id INTEGER PRIMARY KEY, name TEXT)`);
    db.run(`CREATE TABLE IF NOT EXISTS Lots (
        id INTEGER PRIMARY KEY, 
        title TEXT, 
        description TEXT, 
        start_price REAL, 
        current_price REAL, 
        image_url TEXT, 
        category_id INTEGER, 
        status_id INTEGER, 
        end_time DATETIME
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS Bids (id INTEGER PRIMARY KEY, lot_id INTEGER, user_id INTEGER, amount REAL, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`);

    db.get(`SELECT COUNT(*) as count FROM Categories`, (err, row) => {
        if (row && row.count === 0) {
            db.run(`INSERT INTO Categories (name) VALUES ('Електроніка'), ('Авто'), ('Мистецтво'), ('Одяг')`);
        }
    });

    db.get(`SELECT COUNT(*) as count FROM Users`, (err, row) => {
        if (row && row.count === 0) {
            db.run(`INSERT INTO Users (username, email, role, password) VALUES ('Admin', 'admin@aurum.com', 'admin', 'admin123')`);
            db.run(`INSERT INTO Users (username, email, role, password) VALUES ('User', 'user@test.com', 'user', 'user123')`);
        }
    });
});

module.exports = db;