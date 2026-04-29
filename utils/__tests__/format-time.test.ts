import { expect, test, describe } from "bun:test";
import { formatTime } from "../format-time";

describe("formatTime", () => {
  test("formats seconds correctly", () => {
    expect(formatTime(0)).toBe("0:00");
    expect(formatTime(5)).toBe("0:05");
    expect(formatTime(59)).toBe("0:59");
  });

  test("formats minutes correctly", () => {
    expect(formatTime(60)).toBe("1:00");
    expect(formatTime(61)).toBe("1:01");
    expect(formatTime(119)).toBe("1:59");
    expect(formatTime(600)).toBe("10:00");
    expect(formatTime(3599)).toBe("59:59");
  });

  test("formats hours correctly", () => {
    expect(formatTime(3600)).toBe("1:00:00");
    expect(formatTime(3601)).toBe("1:00:01");
    expect(formatTime(3661)).toBe("1:01:01");
    expect(formatTime(7200)).toBe("2:00:00");
    expect(formatTime(36000)).toBe("10:00:00");
  });

  test("handles large values", () => {
    expect(formatTime(359999)).toBe("99:59:59");
  });
});
