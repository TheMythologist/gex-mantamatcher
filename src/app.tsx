import { useEffect, useState } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';

const { ipcRenderer } = window.require('electron');

function Homepage() {
  const [status, setStatus] = useState<'online' | 'offline' | 'Checking...'>('Checking...');
  const [log, setLog] = useState('');

  ipcRenderer.on('sync-status', (event, msg) => {
    setLog(log => `${log}\n${msg}`);
  });

  useEffect(() => {
    function updateOnlineStatus() {
      const status = navigator.onLine ? 'online' : 'offline';
      setStatus(status);
      ipcRenderer.send('online-status-changed', status);
    }

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  return (
    <div>
      <p>
        Status: <span id="status">{status}</span>
      </p>
      <h1 className="font-bold text-2xl underline text-red-700">Hello react in electron</h1>
      <h1>Homepage</h1>
      <button
        onClick={() => {
          const row = ['LocalRow', new Date().toISOString()];
          ipcRenderer.send('add-local-row', row);
        }}
      >
        Add Local Row
      </button>
      {log}
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
