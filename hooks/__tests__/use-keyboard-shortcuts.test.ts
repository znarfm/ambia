import { expect, test, describe, mock, beforeEach, afterEach } from "bun:test";

// Mock react before importing the hook
mock.module("react", () => ({
  useEffect: (effect: () => void | (() => void)) => {
    const cleanup = effect();
    if (typeof cleanup === "function") {
      (globalThis as any).lastCleanup = cleanup;
    }
  },
}));

// Mock global DOM classes that are used with instanceof
(globalThis as any).HTMLInputElement = class {};
(globalThis as any).HTMLTextAreaElement = class {};

import { useKeyboardShortcuts } from "../use-keyboard-shortcuts";

describe("useKeyboardShortcuts", () => {
  let options: any;
  let capturedHandler: (e: any) => void;

  beforeEach(() => {
    options = {
      onPlayPause: mock(() => {}),
      onPrevSection: mock(() => {}),
      onNextSection: mock(() => {}),
      onVolUp: mock(() => {}),
      onVolDown: mock(() => {}),
      onToggleTheme: mock(() => {}),
      onOpenTimer: mock(() => {}),
      onOpenAbout: mock(() => {}),
      onToggleEmotion: mock(() => {}),
    };

    (globalThis as any).window = {
      addEventListener: mock((event: string, handler: any) => {
        if (event === "keydown") {
          capturedHandler = handler;
        }
      }),
      removeEventListener: mock(() => {}),
    };
  });

  afterEach(() => {
    delete (globalThis as any).window;
    delete (globalThis as any).lastCleanup;
    mock.restore();
  });

  test("registers event listener on mount", () => {
    useKeyboardShortcuts(options);
    expect(window.addEventListener).toHaveBeenCalledWith("keydown", expect.any(Function));
    expect(capturedHandler).toBeDefined();
  });

  test("unregisters event listener on unmount", () => {
    useKeyboardShortcuts(options);
    if ((globalThis as any).lastCleanup) {
      (globalThis as any).lastCleanup();
    }
    expect(window.removeEventListener).toHaveBeenCalledWith("keydown", expect.any(Function));
  });

  describe("shortcut keys", () => {
    beforeEach(() => {
      useKeyboardShortcuts(options);
    });

    const testShortcut = (key: string, callbackName: string, shouldPreventDefault: boolean = false) => {
      test(`triggers ${callbackName} when "${key}" is pressed`, () => {
        const preventDefault = mock(() => {});
        capturedHandler({
          key,
          toLowerCase: () => key.toLowerCase(),
          preventDefault,
          target: {},
        });
        expect(options[callbackName]).toHaveBeenCalled();
        if (shouldPreventDefault) {
          expect(preventDefault).toHaveBeenCalled();
        } else {
          expect(preventDefault).not.toHaveBeenCalled();
        }
      });
    };

    testShortcut(" ", "onPlayPause", true);
    testShortcut("arrowup", "onPrevSection", true);
    testShortcut("arrowdown", "onNextSection", true);
    testShortcut("arrowleft", "onVolDown", true);
    testShortcut("arrowright", "onVolUp", true);
    testShortcut("m", "onToggleTheme");
    testShortcut("t", "onOpenTimer");
    testShortcut("a", "onOpenAbout");
    testShortcut("e", "onToggleEmotion");

    test("handles case-insensitive keys", () => {
      capturedHandler({
        key: "M",
        toLowerCase: () => "m",
        preventDefault: mock(() => {}),
        target: {},
      });
      expect(options.onToggleTheme).toHaveBeenCalled();
    });
  });

  test("ignores shortcuts when focus is on input", () => {
    useKeyboardShortcuts(options);

    capturedHandler({
      key: " ",
      toLowerCase: () => " ",
      preventDefault: mock(() => {}),
      target: new (globalThis as any).HTMLInputElement(),
    });

    expect(options.onPlayPause).not.toHaveBeenCalled();
  });

  test("ignores shortcuts when focus is on textarea", () => {
    useKeyboardShortcuts(options);

    capturedHandler({
      key: " ",
      toLowerCase: () => " ",
      preventDefault: mock(() => {}),
      target: new (globalThis as any).HTMLTextAreaElement(),
    });

    expect(options.onPlayPause).not.toHaveBeenCalled();
  });

  test("handles optional onToggleEmotion correctly", () => {
    const limitedOptions = {
      onPlayPause: mock(() => {}),
      onPrevSection: mock(() => {}),
      onNextSection: mock(() => {}),
      onVolUp: mock(() => {}),
      onVolDown: mock(() => {}),
      onToggleTheme: mock(() => {}),
      onOpenTimer: mock(() => {}),
      onOpenAbout: mock(() => {}),
      // onToggleEmotion omitted
    };
    useKeyboardShortcuts(limitedOptions as any);

    capturedHandler({
      key: "e",
      toLowerCase: () => "e",
      preventDefault: mock(() => {}),
      target: {},
    });

    // Should not throw
    expect(true).toBe(true);
  });
});
