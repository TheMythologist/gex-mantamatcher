import { useEffect } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';

function Homepage() {
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

  return (
    <div>
      <p>
        Status: <span id="status">{navigator.onLine ? 'Online' : 'Offline'}</span>
      </p>
      <h1 className="font-bold text-2xl underline text-red-700">Hello react in electron</h1>
      <h1>Homepage</h1>
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
