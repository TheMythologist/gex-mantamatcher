import type { BrowserWindow } from 'electron';
import { google } from 'googleapis';
import type { Database } from 'sqlite3';

const SHEET_ID = '1yUPPdRQj_c0ugSIqowFX90mZnQN32gX7Z6y6nYIUrlY';
const RANGE = 'Mantas (NLP)!A5:AT';
const SERVICE_ACCOUNT_KEY_FILE = 'service-account.json';

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
    valueRenderOption: 'FORMULA',
  });

  const rows = res.data.values || [];
  if (rows.length === 0) return;

  rows.forEach((row, i) => {
    const id = String(i + 1); // use row number as ID
    const data = JSON.stringify(row);
    db.run('INSERT OR IGNORE INTO rows (id, data, source) VALUES (?, ?, ?)', [id, data, 'remote']);
  });

  win.webContents.send('sync-status', 'Pulled ' + rows.length + ' rows');
}

export async function pushToSheets(win: BrowserWindow, db: Database) {
  const sheets = getSheetsClient();

  return new Promise<void>((resolve, reject) => {
    db.all("SELECT * FROM rows WHERE source = 'local'", async (err, rows) => {
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
