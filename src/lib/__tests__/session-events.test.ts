import { afterEach, describe, expect, it, vi } from "vitest";
import { emitSessionExpired, onSessionExpired } from "@/lib/session-events";

const unsubscribers: Array<() => void> = [];

afterEach(() => {
  // Clean up any listeners left behind between tests.
  while (unsubscribers.length) {
    unsubscribers.pop()!();
  }
  vi.restoreAllMocks();
});

describe("onSessionExpired / emitSessionExpired", () => {
  it("calls every subscribed listener on emit", () => {
    const a = vi.fn();
    const b = vi.fn();
    unsubscribers.push(onSessionExpired(a), onSessionExpired(b));

    emitSessionExpired();

    expect(a).toHaveBeenCalledTimes(1);
    expect(b).toHaveBeenCalledTimes(1);
  });

  it("returns an unsubscribe fn that stops the listener being called", () => {
    const a = vi.fn();
    const off = onSessionExpired(a);
    unsubscribers.push(off);

    emitSessionExpired();
    off();
    emitSessionExpired();

    expect(a).toHaveBeenCalledTimes(1);
  });

  it("does not call a listener removed by another test cleanup", () => {
    const a = vi.fn();
    unsubscribers.push(onSessionExpired(a));
    while (unsubscribers.length) unsubscribers.pop()!();

    emitSessionExpired();
    expect(a).not.toHaveBeenCalled();
  });

  it("keeps calling remaining listeners even if one throws", () => {
    const throwing = () => {
      throw new Error("bad listener");
    };
    const ok = vi.fn();
    unsubscribers.push(onSessionExpired(throwing), onSessionExpired(ok));

    expect(() => emitSessionExpired()).not.toThrow();
    expect(ok).toHaveBeenCalledTimes(1);
  });

  it("is a no-op (no throw) when there are no listeners", () => {
    expect(() => emitSessionExpired()).not.toThrow();
  });
});
