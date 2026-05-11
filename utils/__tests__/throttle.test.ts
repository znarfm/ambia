import { expect, test, describe, mock } from "bun:test";
import { throttle } from "../throttle";

describe("throttle", () => {
  test("should call the function immediately", () => {
    const func = mock(() => {});
    const throttled = throttle(func, 100);

    throttled();
    expect(func).toHaveBeenCalledTimes(1);
  });

  test("should not call the function again within the limit", () => {
    const func = mock(() => {});
    const throttled = throttle(func, 100);

    throttled();
    throttled();
    throttled();

    expect(func).toHaveBeenCalledTimes(1);
  });

  test("should call the function again after the limit", async () => {
    const func = mock(() => {});
    const throttled = throttle(func, 100);

    throttled();
    expect(func).toHaveBeenCalledTimes(1);

    await new Promise((resolve) => setTimeout(resolve, 150));

    throttled();
    expect(func).toHaveBeenCalledTimes(2);
  });

  test("should pass arguments correctly", () => {
    const func = mock((a: number, b: string) => {});
    const throttled = throttle(func, 100);

    throttled(1, "test");
    expect(func).toHaveBeenCalledWith(1, "test");
  });

  test("should maintain the correct 'this' context", () => {
    let capturedThis: any;
    const func = function (this: any) {
      capturedThis = this;
    };
    const throttled = throttle(func, 100);
    const context = { name: "test-context" };

    throttled.call(context);
    expect(capturedThis).toBe(context);
  });
});
