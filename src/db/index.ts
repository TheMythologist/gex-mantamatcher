import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('localdata.db');
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS rows (
    id TEXT PRIMARY KEY,
    data TEXT,
    source TEXT
  )`);
});

export default db;
