import { app } from 'electron';
import path from 'path';
import sqlite3 from 'sqlite3';

const dbPath =
  process.env.NODE_ENV === 'development'
    ? 'localdata.db'
    : path.join(app.getPath('userData'), 'localdata.db');

const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS mantas (
    id TEXT PRIMARY KEY,
    species TEXT,
    sex TEXT,
    pigmentation TEXT,
    notes TEXT,
    hasCephalicFinInjury TEXT,
    hasBentPectoralOrTruncationInjury TEXT,
    hasFishingLineInjury TEXT,
    ibDots TEXT,
    pattern TEXT,
    injury TEXT,
    fullRow TEXT,
    source TEXT
  )`);
});

export function getManta(id: string) {
  return new Promise<string[]>((resolve, reject) => {
    db.get<string[]>('SELECT * FROM mantas WHERE id = ?', [id], (err, row) => {
      if (err) reject(err);
      resolve(row);
    });
  });
}

export function getMantas() {
  return new Promise((resolve, reject) => {
    db.all<string[]>('SELECT * FROM mantas', (err, rows) => {
      if (err) reject(err);
      resolve(rows);
    });
  });
}

export default db;
