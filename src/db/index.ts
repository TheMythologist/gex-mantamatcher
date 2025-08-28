import { app } from 'electron';
import path from 'path';
import sqlite3 from 'sqlite3';

const dbPath =
  process.env.NODE_ENV === 'development'
    ? 'localdata.db'
    : path.join(app.getPath('userData'), 'localdata.db');

const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS rows (
    id TEXT PRIMARY KEY,
    data TEXT,
    source TEXT
  )`);
});

export default db;
