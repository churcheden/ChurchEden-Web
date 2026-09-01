import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// globals are disabled, so RTL's automatic cleanup (which hooks into the global
// afterEach) does not run on its own. Unmount between every test to keep DOM
// and test state isolated.
afterEach(() => {
  cleanup();
});
