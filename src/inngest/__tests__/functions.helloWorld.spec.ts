import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// We will mock the "@/inngest/client" module so we can intercept createFunction calls
// and extract the handler for direct unit testing.
const createFunctionSpy = vi.fn();
// Minimal "inngest" mock that mirrors the shape used by the module under test
vi.mock("@/inngest/client", () => {
  return {
    inngest: {
      createFunction: createFunctionSpy,
    },
  };
});

// Import after mocks so the module under test uses our mock
import "../functions.test"; // This file defines and exports the function via side effect

describe("helloWorld Inngest function definition", () => {
  beforeEach(() => {
    createFunctionSpy.mockClear();
  });

  it("registers the function with the expected id and event", () => {
    // The module import triggers the call; assert call count and args
    expect(createFunctionSpy).toHaveBeenCalledTimes(1);
    const [config, trigger, handler] = createFunctionSpy.mock.calls[0];

    expect(config).toEqual({ id: "hello-world" });
    expect(trigger).toEqual({ event: "test/hello.world" });
    expect(typeof handler).toBe("function");
  });

  it("handler sleeps for 1s and returns the expected greeting", async () => {
    // Extract handler from the call to createFunction
    const [, , handler] = createFunctionSpy.mock.calls[0];

    // Build fakes for step and event
    const step = {
      sleep: vi.fn().mockResolvedValue(undefined),
    };
    const event = { data: { email: "user@example.com" } };

    const result = await handler({ event, step });

    // Validate the step.sleep call semantics
    expect(step.sleep).toHaveBeenCalledTimes(1);
    expect(step.sleep).toHaveBeenCalledWith("wait-a-moment", "1s");

    // Validate returned payload
    expect(result).toEqual({ message: "Hello user@example.com!" });
  });

  it("handler handles missing email gracefully (edge case)", async () => {
    const [, , handler] = createFunctionSpy.mock.calls[0];

    const step = { sleep: vi.fn().mockResolvedValue(undefined) };

    // Provide an event missing email to ensure template behavior
    const event: any = { data: {} };

    const result = await handler({ event, step });

    // Should still call sleep
    expect(step.sleep).toHaveBeenCalledWith("wait-a-moment", "1s");

    // The original code interpolates undefined if email is missing.
    // This test asserts current behavior; if you want safer output, adjust the implementation.
    expect(result).toEqual({ message: "Hello undefined!" });
  });

  it("propagates step.sleep errors (failure path)", async () => {
    const [, , handler] = createFunctionSpy.mock.calls[0];

    const err = new Error("sleep failed");
    const step = { sleep: vi.fn().mockRejectedValue(err) };
    const event = { data: { email: "boom@example.com" } };

    await expect(handler({ event, step })).rejects.toThrow("sleep failed");
    expect(step.sleep).toHaveBeenCalledWith("wait-a-moment", "1s");
  });
});

/**
 * Notes:
 * - Testing library/framework: Vitest (preferred if detected). The test imports from vitest and uses vi mocks.
 * - If this repository uses Jest instead, replace vitest imports with Jest globals,
 *   and change vi.fn/mockResolvedValue to jest.fn/mockResolvedValue, etc.
 * - We intentionally import "../functions.test" (the source file provided) even though its name ends with .test.ts
 *   because it contains source code (not tests) that registers the Inngest function. The mock intercepts createFunction.
 */