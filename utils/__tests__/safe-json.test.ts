import { expect, test, describe } from "bun:test";
import { safeJsonLd } from "../safe-json";

describe("safeJsonLd", () => {
  test("should stringify a simple object", () => {
    const data = { name: "Ambia", version: "0.1.0" };
    expect(safeJsonLd(data)).toBe('{"name":"Ambia","version":"0.1.0"}');
  });

  test("should escape < characters", () => {
    const data = { script: "</script><script>alert(1)</script>" };
    const result = safeJsonLd(data);
    expect(result).not.toContain("<");
    expect(result).toContain("\\u003c");
    expect(result).toBe(
      '{"script":"\\u003c/script\\u003e\\u003cscript\\u003ealert(1)\\u003c/script\\u003e"}',
    );
  });

  test("should escape > characters", () => {
    const data = { tag: ">>" };
    const result = safeJsonLd(data);
    expect(result).not.toContain(">");
    expect(result).toContain("\\u003e");
    expect(result).toBe('{"tag":"\\u003e\\u003e"}');
  });

  test("should escape & characters", () => {
    const data = { text: "Me & You" };
    const result = safeJsonLd(data);
    expect(result).not.toContain("&");
    expect(result).toContain("\\u0026");
    expect(result).toBe('{"text":"Me \\u0026 You"}');
  });

  test("should handle nested objects", () => {
    const data = { outer: { inner: "<script>" } };
    expect(safeJsonLd(data)).toBe('{"outer":{"inner":"\\u003cscript\\u003e"}}');
  });
});
