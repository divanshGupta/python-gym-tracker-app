// A tiny cross-platform event emitter
// Works in both browser (web) and React Native (mobile)
// No DOM dependency — uses a simple callback registry
const listeners = {};
export const apiEvents = {
    on: (event, cb) => {
        if (!listeners[event])
            listeners[event] = [];
        listeners[event].push(cb);
        // Return unsubscribe function
        return () => {
            listeners[event] = listeners[event].filter((l) => l !== cb);
        };
    },
    emit: (event) => {
        listeners[event]?.forEach((cb) => cb());
    },
};
// Typed event names — avoids string typos
export const API_EVENTS = {
    UNAUTHORIZED: "unauthorized",
};
