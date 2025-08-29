import { app } from 'electron';
import path from 'path';
import Database from 'better-sqlite3';
import type { Manta } from '../manta';

const dbPath =
  process.env.NODE_ENV === 'development'
    ? 'localdata.db'
    : path.join(app.getPath('userData'), 'localdata.db');

const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

db.exec(`CREATE TABLE IF NOT EXISTS mantas (
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

export function getManta(id: string) {
  const stmt = db.prepare<string[], Manta>('SELECT * FROM mantas WHERE id = ?');
  return stmt.get(id);
}

export function getMantas() {
  const stmt = db.prepare<string[], Manta>('SELECT * FROM mantas');
  return stmt.all();
}

export default db;
