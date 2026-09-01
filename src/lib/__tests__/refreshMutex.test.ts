import { describe, expect, it, vi } from "vitest";
import { withRefreshMutex } from "@/lib/refreshMutex";

describe("withRefreshMutex", () => {
  it("runs the inner function and resolves once it settles", async () => {
    const inner = vi.fn().mockResolvedValue(undefined);
    await withRefreshMutex(inner);
    expect(inner).toHaveBeenCalledTimes(1);
  });

  it("deduplicates concurrent calls so the inner fn runs once", async () => {
    let resolveFirst!: () => void;
    const inner = vi.fn(
      () => new Promise<void>((resolve) => (resolveFirst = resolve)),
    );

    const p1 = withRefreshMutex(inner);
    const p2 = withRefreshMutex(inner);
    const p3 = withRefreshMutex(inner);

    // Give the microtasks a chance to run.
    await Promise.resolve();

    // While the first refresh is in flight, the other callers share the SAME
    // in-flight promise and must NOT invoke fn again.
    expect(inner).toHaveBeenCalledTimes(1);

    resolveFirst();
    await Promise.all([p1, p2, p3]);

    expect(inner).toHaveBeenCalledTimes(1);
  });

  it("allows a new refresh after the previous one completes", async () => {
    const inner = vi.fn().mockResolvedValue(undefined);
    await withRefreshMutex(inner);
    await withRefreshMutex(inner);
    expect(inner).toHaveBeenCalledTimes(2);
  });

  it("clears the mutex even when the inner fn rejects", async () => {
    const inner = vi
      .fn()
      .mockRejectedValueOnce(new Error("refresh failed"))
      .mockResolvedValueOnce(undefined);

    await expect(withRefreshMutex(inner)).rejects.toThrow("refresh failed");
    await withRefreshMutex(inner); // mutex was cleared, so this runs again
    expect(inner).toHaveBeenCalledTimes(2);
  });
});
