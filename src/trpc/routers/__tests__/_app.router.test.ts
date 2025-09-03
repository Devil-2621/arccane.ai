/**
 * Note on framework:
 * - This test suite uses standard describe/it/expect, compatible with both Vitest and Jest.
 * - If using Vitest, ensure `vitest` globals are available or import from 'vitest'.
 * - If using Jest, ensure ts-jest or Babel is configured for TS.
 *
 * Focus:
 * - Validate appRouter.hello query returns expected greeting and enforces zod input.
 * - Validate appRouter.invoke mutation calls Inngest with correct payload.
 * - Cover edge cases: empty string, whitespace, non-string inputs rejected, large strings.
 */

import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';

let appRouter: any;

// We mock '@/inngest/client' before importing the router under test.
// The router imports { inngest } from '@/inngest/client', so we provide a mock with a spy-able send method.
const sendMock = vi?.fn?.() || (jest.fn as any)();

const mockModuleFactory = () => ({
  __esModule: true,
  inngest: {
    send: sendMock,
  },
});

// Support both Vitest and Jest mocking APIs
let mocker: any;
try {
  // Vitest
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { vi } = require('vitest');
  mocker = vi;
} catch {
  try {
    // Jest
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const jestMod = require('@jest/globals');
    mocker = jestMod.jest;
  } catch {
    // Fallback to global jest if available
    // @ts-ignore
    mocker = typeof jest !== 'undefined' ? jest : undefined;
  }
}

if (!mocker) {
  throw new Error('No mocking framework (Vitest/Jest) detected in test runtime.');
}

// Register the module mock
mocker.mock('@/inngest/client', mockModuleFactory);

// Now import the router module under test.
// The file provided is src/trpc/routers/_app.test.ts exporting appRouter. Import it with a relative path.
import('../_app.test').then((mod) => {
  appRouter = mod.appRouter;
});

type AppRouter = typeof appRouter;
type Inputs = inferRouterInputs<AppRouter>;
type Outputs = inferRouterOutputs<AppRouter>;

function getCaller() {
  // If createCaller exists (typical tRPC pattern), use it for invoking procedures ergonomically.
  if (typeof appRouter?.createCaller === 'function') {
    return appRouter.createCaller({});
  }
  return null;
}

describe('appRouter', () => {
  beforeEach(() => {
    sendMock.mockClear?.();
  });

  describe('hello query', () => {
    it('returns greeting for a normal string (happy path)', async () => {
      const caller = getCaller();
      if (caller?.hello) {
        const res = await caller.hello({ text: 'world' } as Inputs['hello']);
        expect(res).toEqual({ greeting: 'hello world' } as Outputs['hello']);
      } else {
        // Fallback: call via router directly if needed
        const result = await appRouter._def.procedures.hello({ input: { text: 'world' } });
        expect(result).toEqual({ greeting: 'hello world' });
      }
    });

    it('handles empty string input (edge case)', async () => {
      const caller = getCaller();
      const input = { text: '' } as Inputs['hello'];
      const expected = { greeting: 'hello ' } as Outputs['hello'];
      if (caller?.hello) {
        const res = await caller.hello(input);
        expect(res).toEqual(expected);
      } else {
        const result = await appRouter._def.procedures.hello({ input });
        expect(result).toEqual(expected);
      }
    });

    it('trims whitespace only string correctly (no internal trim, just template concat)', async () => {
      const caller = getCaller();
      const input = { text: '   ' } as Inputs['hello'];
      const expected = { greeting: 'hello    ' } as Outputs['hello'];
      if (caller?.hello) {
        const res = await caller.hello(input);
        expect(res).toEqual(expected);
      } else {
        const result = await appRouter._def.procedures.hello({ input });
        expect(result).toEqual(expected);
      }
    });

    it('rejects non-string inputs via zod schema (failure case)', async () => {
      const caller = getCaller();
      // @ts-expect-error intentional type violation for runtime validation
      const badInput = { text: 123 };
      const call = async () => {
        if (caller?.hello) {
          // @ts-ignore
          return await caller.hello(badInput);
        }
        // @ts-ignore
        return await appRouter._def.procedures.hello({ input: badInput });
      };
      await expect(call()).rejects.toBeTruthy();
    });

    it('handles a very large string input', async () => {
      const big = 'a'.repeat(10_000);
      const caller = getCaller();
      const input = { text: big } as Inputs['hello'];
      const expected = { greeting: `hello ${big}` } as Outputs['hello'];
      if (caller?.hello) {
        const res = await caller.hello(input);
        expect(res).toEqual(expected);
      } else {
        const result = await appRouter._def.procedures.hello({ input });
        expect(result).toEqual(expected);
      }
    });
  });

  describe('invoke mutation', () => {
    it('calls Inngest with correct event name and payload (happy path)', async () => {
      const caller = getCaller();
      const input = { text: 'user@example.com' } as Inputs['invoke'];
      if (caller?.invoke) {
        await caller.invoke(input);
      } else {
        await appRouter._def.procedures.invoke({ input });
      }
      expect(sendMock).toHaveBeenCalledTimes(1);
      expect(sendMock).toHaveBeenCalledWith({
        name: 'test/hello.world',
        data: { email: 'user@example.com' },
      });
    });

    it('supports empty string email (edge case)', async () => {
      const caller = getCaller();
      const input = { text: '' } as Inputs['invoke'];
      if (caller?.invoke) {
        await caller.invoke(input);
      } else {
        await appRouter._def.procedures.invoke({ input });
      }
      expect(sendMock).toHaveBeenCalledWith({
        name: 'test/hello.world',
        data: { email: '' },
      });
    });

    it('rejects non-string inputs via zod schema (failure case)', async () => {
      const caller = getCaller();
      // @ts-expect-error runtime validation path
      const badInput = { text: { not: 'a string' } };
      const call = async () => {
        if (caller?.invoke) {
          // @ts-ignore
          return await caller.invoke(badInput);
        }
        // @ts-ignore
        return await appRouter._def.procedures.invoke({ input: badInput });
      };
      await expect(call()).rejects.toBeTruthy();
      expect(sendMock).not.toHaveBeenCalled();
    });

    it('propagates errors from Inngest.send (failure path)', async () => {
      sendMock.mockImplementationOnce(() => {
        throw new Error('network failure');
      });
      const caller = getCaller();
      const input = { text: 'a@b.com' } as Inputs['invoke'];
      const call = async () => {
        if (caller?.invoke) {
          return await caller.invoke(input);
        }
        return await appRouter._def.procedures.invoke({ input });
      };
      await expect(call()).rejects.toBeTruthy();
    });
  });
});