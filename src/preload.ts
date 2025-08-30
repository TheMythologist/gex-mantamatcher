import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

const electronHandler = {
  ipcRenderer: {
    send: (channel: string, ...args: unknown[]) => ipcRenderer.send(channel, args),
    on: (channel: string, listener: (event: IpcRendererEvent, ...args: unknown[]) => void) =>
      ipcRenderer.on(channel, listener),
    off: (channel: string, listener: (event: IpcRendererEvent, ...args: unknown[]) => void) =>
      ipcRenderer.off(channel, listener),
    invoke: (channel: string, ...args: unknown[]) => ipcRenderer.invoke(channel, ...args),
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
