type SyncEventListener = (message: string) => void;

const listeners: SyncEventListener[] = [];

export const syncEvents = {
  addListener: (listener: SyncEventListener) => {
    listeners.push(listener);
    return () => {
      const index = listeners.indexOf(listener);
      if (index !== -1) listeners.splice(index, 1);
    };
  },
  emit: (message: string) => {
    listeners.forEach((listener) => listener(message));
  },
};
