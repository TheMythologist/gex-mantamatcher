import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

const electronHandler = {
  ipcRenderer: {
    send(channel: string, ...args: unknown[]) {
      ipcRenderer.send(channel, args);
    },
    once(channel: string, listener: (event: IpcRendererEvent, ...args: unknown[]) => void) {
      ipcRenderer.once(channel, listener);
    },
    off(channel: string, listener: (event: IpcRendererEvent, ...args: unknown[]) => void) {
      ipcRenderer.off(channel, listener);
    },
  },

  db: {
    getManta: (id: string) => ipcRenderer.invoke('db-getManta', id),
    getMantas: () => ipcRenderer.invoke('db-getMantas'),
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
