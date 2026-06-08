// packages/hooks/jest.globals.ts
const { TextDecoder, TextEncoder } = require("util");
globalThis.TextDecoder = TextDecoder;
globalThis.TextEncoder = TextEncoder;
export {};
