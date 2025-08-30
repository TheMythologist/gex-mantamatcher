import { useCallback, useEffect, useState } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';

import useIpcRendererCallback from './hooks/useIpcRenderer';
import type { Manta } from './manta';
import MantaRows from './manta';

function Homepage() {
  const [mantaRows, setMantaRows] = useState<Manta[]>([]);

  const syncStatusCallback = useCallback(
    () => window.electron.ipcRenderer.invoke('db-getMantas').then(setMantaRows),
    [],
  );
  useIpcRendererCallback('sync-complete', syncStatusCallback);

  useEffect(() => {
    window.electron.ipcRenderer.invoke('db-getMantas').then(setMantaRows);

    function updateOnlineStatus() {
      window.electron.ipcRenderer.send(
        'online-status-changed',
        navigator.onLine ? 'Online' : 'Offline',
      );
    }

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    updateOnlineStatus();

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  const omitColumns = ['fullRow', 'source'];
  const headers = mantaRows[0]
    ? Object.keys(mantaRows[0]).filter(key => !omitColumns.includes(key))
    : [];

  return (
    <div>
      <p>
        Status: <span id="status">{navigator.onLine ? 'Online' : 'Offline'}</span>
      </p>
      <h1 className="font-bold text-2xl underline text-red-700">Mantas!</h1>
      <MantaRows mantas={mantaRows} />
      <button
        onClick={() => {
          const row = ['LocalRow', new Date().toISOString()];
          window.electron.ipcRenderer.send('add-local-row', row);
        }}
      >
        Add Local Row
      </button>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
      </Routes>
    </Router>
  );
}
