import { useCallback, useEffect, useState } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import useIpcRendererCallback from './hooks/useIpcRenderer';
import type { Manta } from './manta';

function Homepage() {
  const [mantaRows, setMantaRows] = useState<Manta[]>([]);

  const syncStatusCallback = useCallback(
    () => window.electron.ipcRenderer.invoke('db-getMantas').then(setMantaRows),
    [],
  );
  useIpcRendererCallback('sync-complete', syncStatusCallback);

  useEffect(() => {
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
      <h1 className="font-bold text-2xl underline text-red-700">Hello react in electron</h1>
      <h1>Homepage</h1>
      <div className="overflow-auto">
        <table className="border-collapse border border-gray-300 w-full">
          <thead>
            <tr>
              {headers.map(key => (
                <th key={key} className="border border-gray-300 px-2 py-1 text-left">
                  {key}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {mantaRows.map(manta => (
              <tr key={manta.id}>
                {headers.map((key, index) => (
                  <td key={key} className="border border-gray-300 px-2 py-1">
                    {manta[key]}
                    {index === 0 && <img src={`static://images/${manta.id}.jpg`} />}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
