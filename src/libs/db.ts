import e from "express";

const sqlite3 = require("sqlite3").verbose();
const dbName = "ecommerce.db";

let db = new sqlite3.Database(dbName, (err: any) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log(`Connected to the ${dbName} database.`);

    db.run(
      `CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT NOT NULL,
            price INTEGER NOT NULL,
            category TEXT NOT NULL,
            stock INTEGER NOT NULL
        )`,
      (err: any) => {
        if (err) {
          console.error(err.message);
        } else {
          console.log("Products table created or already exists.");
        }
      }
    );
  }
});

export default db;
