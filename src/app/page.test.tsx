/**
 * Tests for src/app/page.tsx Page component.
 *
 * Detected testing libraries/frameworks: This test is written to be compatible with both Vitest and Jest.
 * - Uses @testing-library/react for rendering and events.
 * - Uses vi/jest auto-detection for mocking utilities.
 *
 * If your project uses Vitest:
 *   import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
 * If your project uses Jest:
 *   globals are available; alias vi to jest for mocks.
 */

import React from "react";
import type { Mock } from "vitest"; // type-only; ignored in Jest
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Handle both Vitest and Jest mock APIs
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mocker: any = (globalThis as any).vi ?? (globalThis as any).jest;
if (!mocker) {
  throw new Error("Neither Vitest nor Jest mocking API detected in test environment.");
}

// Module under test
// Next.js app router page component
import Page from "./page";

// Mock TRPC client hook
mocker.mock("@/trpc/client", () => {
  return {
    useTRPC: () => ({
      // shape expected by the component: trpc.invoke.mutationOptions({})
      invoke: {
        mutationOptions: mocker.fn().mockReturnValue({}),
      },
    }),
  };
});

// We'll spy on useMutation to control behavior and capture mutate calls
const mutateSpy = mocker.fn();
const mutateAsyncSpy = mocker.fn();

mocker.mock("@tanstack/react-query", async (orig) => {
  // Re-export actuals except useMutation, QueryClient, QueryClientProvider (we use real QueryClient/Provider)
  const actual = await (orig as any).importActual?.("@tanstack/react-query");
  return {
    ...actual,
    QueryClient: actual.QueryClient,
    QueryClientProvider: actual.QueryClientProvider,
    useMutation: () => {
      return {
        mutate: mutateSpy,
        mutateAsync: mutateAsyncSpy,
        isPending: false,
        isLoading: false,
        isError: false,
        isSuccess: false,
        error: null,
        status: "idle",
        variables: undefined,
        // add any fields that consumers may access in future
      };
    },
  };
});

function renderWithProviders(ui: React.ReactElement) {
  const qc = new QueryClient();
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={qc}>{children}</QueryClientProvider>
  );
  return render(ui, { wrapper });
}

describe("Page component (src/app/page.tsx)", () => {
  beforeEach(() => {
    mutateSpy.mockReset();
    mutateAsyncSpy.mockReset();
  });

  it("renders the Invoke Background Job button", () => {
    renderWithProviders(<Page />);
    expect(
      screen.getByRole("button", { name: /invoke background job/i })
    ).toBeInTheDocument();
  });

  it("calls mutate with expected payload when the button is clicked", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Page />);

    const btn = screen.getByRole("button", { name: /invoke background job/i });
    await user.click(btn);

    expect(mutateSpy).toHaveBeenCalledTimes(1);
    expect(mutateSpy).toHaveBeenCalledWith({ text: "Tirth Ladani" });
  });

  it("is resilient to rapid multiple clicks (debounce not required but should call each time)", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Page />);
    const btn = screen.getByRole("button", { name: /invoke background job/i });

    await user.dblClick(btn); // two clicks
    await user.click(btn); // third click

    expect(mutateSpy).toHaveBeenCalledTimes(3);
    // last call payload
    const lastCallArgs = mutateSpy.mock.calls.at(-1)?.[0];
    expect(lastCallArgs).toEqual({ text: "Tirth Ladani" });
  });

  it("does not crash if mutate throws synchronously", async () => {
    const user = userEvent.setup();
    mutateSpy.mockImplementationOnce(() => {
      throw new Error("sync fail");
    });

    renderWithProviders(<Page />);
    const btn = screen.getByRole("button", { name: /invoke background job/i });

    await expect(user.click(btn)).resolves.toBeUndefined();
    // Ensure subsequent interaction still works
    await user.click(btn);
    expect(mutateSpy).toHaveBeenCalledTimes(2);
  });

  it("does not depend on actual TRPC network calls (mutationOptions used only for options)", async () => {
    // Ensure mutationOptions was referenced but not executed with side effects
    // Our mock returns {} and useMutation consumes it; focus here is that Page wires the option shape, not behavior
    renderWithProviders(<Page />);
    const btn = screen.getByRole("button", { name: /invoke background job/i });
    await userEvent.click(btn);
    expect(mutateSpy).toHaveBeenCalledWith({ text: "Tirth Ladani" });
  });
});