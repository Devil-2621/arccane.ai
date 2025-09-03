/**
 * Jest alternative of the Vitest test above.
 * Framework: Jest
 */
import { jest } from "@jest/globals";

const createFunctionSpy = jest.fn();
jest.unstable_mockModule("@/inngest/client", () => ({
  default: undefined,
  inngest: { createFunction: createFunctionSpy },
}));

// Import the module under test after setting up the mock
await import("../functions.test");

describe("helloWorld Inngest function (Jest)", () => {
  beforeEach(() => {
    createFunctionSpy.mockClear();
  });

  test("registers the function with expected id and event", () => {
    expect(createFunctionSpy).toHaveBeenCalledTimes(1);
    const [config, trigger, handler] = createFunctionSpy.mock.calls[0];
    expect(config).toEqual({ id: "hello-world" });
    expect(trigger).toEqual({ event: "test/hello.world" });
    expect(typeof handler).toBe("function");
  });

  test("handler sleeps and returns greeting", async () => {
    const [, , handler] = createFunctionSpy.mock.calls[0];
    const step = { sleep: jest.fn().mockResolvedValue(undefined) };
    const event = { data: { email: "user@example.com" } };
    const result = await handler({ event, step });
    expect(step.sleep).toHaveBeenCalledWith("wait-a-moment", "1s");
    expect(result).toEqual({ message: "Hello user@example.com!" });
  });

  test("handler missing email edge case", async () => {
    const [, , handler] = createFunctionSpy.mock.calls[0];
    const step = { sleep: jest.fn().mockResolvedValue(undefined) };
    const event: any = { data: {} };
    const result = await handler({ event, step });
    expect(result).toEqual({ message: "Hello undefined!" });
  });

  test("handler propagates sleep errors", async () => {
    const [, , handler] = createFunctionSpy.mock.calls[0];
    const step = { sleep: jest.fn().mockRejectedValue(new Error("sleep failed")) };
    const event = { data: { email: "boom@example.com" } };
    await expect(handler({ event, step })).rejects.toThrow("sleep failed");
  });
});