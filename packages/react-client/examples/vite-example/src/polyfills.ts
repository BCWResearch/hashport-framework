// https://github.com/rainbow-me/rainbowkit/blob/main/examples/with-vite/src/polyfills.ts
import { Buffer } from 'buffer';

window.global = window.global ?? window;
window.Buffer = window.Buffer ?? Buffer;
window.process = window.process ?? { env: {} }; // Minimal process polyfill

export {};
