/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

interface Window {
  localStorage: Storage;
  AudioContext: typeof AudioContext;
  webkitAudioContext: typeof AudioContext;
}

declare const window: Window & typeof globalThis;
declare const localStorage: Storage;
