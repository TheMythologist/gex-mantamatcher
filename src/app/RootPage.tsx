import { useCallback, useEffect, useState } from 'react';

import useIpcRendererCallback from '../hooks/useIpcRenderer';
import type { Manta } from '../manta';
import MantaRows from '../manta';
import MantaFilter, { type MantaFilterType } from './MantaFilter';

export default function RootPage() {
  const [mantaRows, setMantaRows] = useState<Manta[]>([]);
  const [filters, setFilters] = useState<Partial<MantaFilterType>>({});

  const syncStatusCallback = useCallback(
    () => window.electron.ipcRenderer.invoke('db-getMantas', filters).then(setMantaRows),
    [filters],
  );
  useIpcRendererCallback('sync-complete', syncStatusCallback);

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const selectedMantaImage = imageSrc !== null;

  useEffect(() => {
    window.electron.ipcRenderer.invoke('db-getMantas', filters).then(setMantaRows);
  }, [filters]);

  useEffect(() => {
    function updateOnlineStatus() {
      window.electron.ipcRenderer.send(
        'online-status-changed',
        navigator.onLine ? 'Online' : 'Offline',
      );
    }

    updateOnlineStatus();

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  return (
    <div className="flex flex-col gap-2 px-2">
      <p>
        Status: <span id="status">{navigator.onLine ? 'Online' : 'Offline'}</span>
      </p>
      <h1 className="font-bold text-2xl underline text-red-700">Mantas!</h1>

      <button
        className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 max-w-md"
        onClick={() => {
          window.electron.ipcRenderer
            .invoke('chooseFile')
            .then(res => setImageSrc(`data:image;base64,${res}`));
        }}
      >
        NEW MANTA SIGHTING - Select your image!
      </button>

      {selectedMantaImage && (
        <img
          src={imageSrc}
          alt="Selected manta image"
          className="h-60 max-w-md w-auto rounded-lg shadow object-contain"
        />
      )}

      <MantaFilter filters={filters} setFilters={setFilters} />
      <MantaRows mantas={mantaRows} />
    </div>
  );
}
