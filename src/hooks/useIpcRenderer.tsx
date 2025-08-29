import type { IpcRendererEvent } from 'electron';
import { useEffect } from 'react';

export default function useIpcRenderer(
  channel: string,
  listener: (event: IpcRendererEvent, ...args: unknown[]) => void,
) {
  useEffect(() => {
    window.electron.ipcRenderer.once(channel, listener);

    return () => {
      window.electron.ipcRenderer.off(channel, listener);
    };
  }, [listener]);
}
