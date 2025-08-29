import type { BrowserWindow } from 'electron';
import { google } from 'googleapis';
import path from 'path';
import type { Database } from 'sqlite3';

const SHEET_ID = '1yUPPdRQj_c0ugSIqowFX90mZnQN32gX7Z6y6nYIUrlY';
const RANGE = 'Mantas (NLP)!A5:AT';

const SERVICE_ACCOUNT_KEY_FILE =
  process.env.NODE_ENV === 'development'
    ? 'service-account.json'
    : path.join(process.resourcesPath, 'service-account.json');

function getSheetsClient() {
  const auth = new google.auth.GoogleAuth({
    keyFile: SERVICE_ACCOUNT_KEY_FILE,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  return google.sheets({ version: 'v4', auth });
}

export async function pullFromSheets(win: BrowserWindow, db: Database) {
  const sheets = getSheetsClient();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: RANGE,
  });

  if (!res.ok) return;

  const rows: string[][] = res.data.values || [];
  if (rows.length === 0) return;

  rows.forEach(row => {
    const id = row[0];
    const species = row[4];
    const sex = row[5];
    const pigmentation = row[6];
    const notes = row[22];
    const hasCephalicFinInjury = row[23];
    const hasBentPectoralOrTruncationInjury = row[24];
    const hasFishingLineInjury = row[25];
    const ibDots = row[28];
    const pattern = row[29];
    const injury = row[30];
    const data = JSON.stringify(row);
    db.run(
      `INSERT INTO mantas (
        id, species, sex, pigmentation, notes,
        hasCephalicFinInjury, hasBentPectoralOrTruncationInjury,
        hasFishingLineInjury, ibDots, pattern,
        injury, fullRow, source
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        species = excluded.species,
        sex = excluded.sex,
        pigmentation = excluded.pigmentation,
        notes = excluded.notes,
        hasCephalicFinInjury = excluded.hasCephalicFinInjury,
        hasBentPectoralOrTruncationInjury = excluded.hasBentPectoralOrTruncationInjury,
        hasFishingLineInjury = excluded.hasFishingLineInjury,
        ibDots = excluded.ibDots,
        pattern = excluded.pattern,
        injury = excluded.injury,
        fullRow = excluded.fullRow,
        source = excluded.source;`,
      [
        id,
        species,
        sex,
        pigmentation,
        notes,
        hasCephalicFinInjury,
        hasBentPectoralOrTruncationInjury,
        hasFishingLineInjury,
        ibDots,
        pattern,
        injury,
        data,
        'remote',
      ],
      error => {
        if (error) console.log('Error upserting', error);
      },
    );
  });

  win.webContents.send('sync-status', 'Pulled ' + rows.length + ' rows');
}

type dbRow = { id: string; data: string; source: string };

export async function pushToSheets(win: BrowserWindow, db: Database) {
  const sheets = getSheetsClient();

  return new Promise<void>((resolve, reject) => {
    db.all<dbRow>("SELECT * FROM rows WHERE source = 'local'", async (err, rows) => {
      if (err) return reject(err);
      if (rows.length === 0) return resolve();

      const values = rows.map(r => JSON.parse(r.data));
      try {
        await sheets.spreadsheets.values.append({
          spreadsheetId: SHEET_ID,
          range: RANGE,
          valueInputOption: 'RAW',
          requestBody: { values },
        });

        // mark rows as synced
        const stmt = db.prepare("UPDATE rows SET source = 'remote' WHERE id = ?");
        rows.forEach(r => stmt.run(r.id));
        stmt.finalize();

        win.webContents.send('sync-status', 'Pushed ' + rows.length + ' rows');
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  });
}
