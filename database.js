const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");
const path = require("path");

// Path to database file
const DB_PATH = path.join(__dirname, "classifier.db");

// Create/open database
const db = new sqlite3.Database(DB_PATH);

// Load schema.sql
const schemaPath = path.join(__dirname, "schema.sql");
const schema = fs.readFileSync(schemaPath, "utf8");

// Initialize database schema on startup
db.serialize(() => {
    db.exec(schema, (err) => {
        if (err) {
            console.error("Failed to initialize database:", err.message);
        } else {
            console.log("Database initialized successfully.");
        }
    });
});


 // Run INSERT / UPDATE / DELETE queries

function run(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
            if (err) return reject(err);
            resolve(this); // contains lastID, changes
        });
    });
}


 // Get all rows

function all(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });
}


module.exports = {
    run,
    all,
};