import { describe, expect, it } from "vitest";
import { cn } from "@/lib/utils";

describe("cn", () => {
  it("joins plain class names", () => {
    expect(cn("a", "b")).toBe("a b");
  });

  it("drops falsy values", () => {
    expect(cn("a", false, undefined, null, "b")).toBe("a b");
  });

  it("resolves conflicting Tailwind utilities, keeping the last one", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
  });

  it("applies conditional classes from an object", () => {
    expect(cn("base", { active: true, hidden: false })).toBe("base active");
  });
});
