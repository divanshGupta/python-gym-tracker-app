// A tiny cross-platform event emitter
// Works in both browser (web) and React Native (mobile)
// No DOM dependency — uses a simple callback registry

type Listener = () => void;

const listeners: Record<string, Listener[]> = {};

export const apiEvents = {
  on: (event: string, cb: Listener) => {
    if (!listeners[event]) listeners[event] = [];
    listeners[event].push(cb);
    // Return unsubscribe function
    return () => {
      listeners[event] = listeners[event].filter((l) => l !== cb);
    };
  },

  emit: (event: string) => {
    listeners[event]?.forEach((cb) => cb());
  },
};

// Typed event names — avoids string typos
export const API_EVENTS = {
  UNAUTHORIZED: "unauthorized",
} as const;