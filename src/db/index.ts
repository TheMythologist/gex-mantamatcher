import { app } from 'electron';
import path from 'path';
import Database from 'better-sqlite3';
import type { Manta } from '../manta';
import type { MantaFilterType } from '../app/MantaFilter';

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

db.exec(`
  CREATE VIRTUAL TABLE IF NOT EXISTS mantas_fts
  USING fts5(
    notes,
    pattern,
    injury,
    content='mantas',
    content_rowid='rowid'
  );
`);
db.exec(`
  CREATE TRIGGER IF NOT EXISTS mantas_ai AFTER INSERT ON mantas BEGIN
    INSERT INTO mantas_fts(rowid, notes, pattern, injury)
    VALUES (new.rowid, new.notes, new.pattern, new.injury);
  END;

  CREATE TRIGGER IF NOT EXISTS mantas_ad AFTER DELETE ON mantas BEGIN
    INSERT INTO mantas_fts(mantas_fts, rowid, notes, pattern, injury)
    VALUES('delete', old.rowid, old.notes, old.pattern, old.injury);
  END;

  CREATE TRIGGER IF NOT EXISTS mantas_au AFTER UPDATE ON mantas BEGIN
    INSERT INTO mantas_fts(mantas_fts, rowid, notes, pattern, injury)
    VALUES('delete', old.rowid, old.notes, old.pattern, old.injury);
    INSERT INTO mantas_fts(rowid, notes, pattern, injury)
    VALUES (new.rowid, new.notes, new.pattern, new.injury);
  END;
`);

export function getManta(id: string) {
  const stmt = db.prepare<string[], Manta>('SELECT * FROM mantas WHERE id = ?');
  return stmt.get(id);
}

export function getMantas(filter?: MantaFilterType) {
  const conditions: string[] = [];
  const values: (string | number)[] = [];

  if (filter?.species) {
    conditions.push('species = ?');
    values.push(filter.species);
  }
  if (filter?.sex && filter.sex !== 'U') {
    conditions.push('sex = ?');
    values.push(filter.sex);
  }
  if (filter?.pigmentation && filter.pigmentation !== 'U') {
    conditions.push('pigmentation = ?');
    values.push(filter.pigmentation);
  }
  if (filter?.dotNumber) {
    conditions.push('ibDots LIKE ?');
    values.push(
      filter.pigmentation === 'M' || filter.pigmentation === 'L'
        ? '-'
        : filter.dotNumber > 10
          ? '%10+%'
          : `%${filter.dotNumber}%`,
    );
  }
  if (filter?.dotPattern && filter.dotPattern !== 'U') {
    conditions.push('pattern LIKE ?');
    values.push(`%${filter.dotPattern}%`);
  }
  if (filter?.lungPattern && filter.lungPattern !== 'U') {
    conditions.push('pattern LIKE ?');
    values.push(`%${filter.lungPattern}%`);
  }
  if (filter?.shadingType && filter.shadingType !== 'U') {
    conditions.push('pattern LIKE ?');
    values.push(`%${filter.shadingType}%`);
  }
  if (filter?.patchType && filter.patchType !== 'U') {
    conditions.push('pattern LIKE ?');
    values.push(`%${filter.patchType}%`);
  }
  if (filter?.searchNotes) {
    conditions.push('notes LIKE ?');
    values.push(`%${filter.searchNotes}%`);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  const sql = `SELECT * FROM mantas ${whereClause}`;

  const stmt = db.prepare(sql);
  return stmt.all(...values);
}

export function searchMantas(searchTerm: string) {
  const stmt = db.prepare(`
    SELECT word, distance FROM mantas_spellfix
    WHERE word MATCH ? ORDER BY distance LIMIT 5
  `);
  return stmt.all(searchTerm);
}

export default db;
