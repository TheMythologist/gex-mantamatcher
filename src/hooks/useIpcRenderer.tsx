import type { IpcRendererEvent } from 'electron';
import { useEffect } from 'react';

export default function useIpcRendererCallback(
  channel: string,
  listener: (event: IpcRendererEvent, ...args: unknown[]) => void,
) {
  useEffect(() => {
    window.electron.ipcRenderer.on(channel, listener);

    return () => {
      window.electron.ipcRenderer.off(channel, listener);
    };
  }, [listener]);
}
