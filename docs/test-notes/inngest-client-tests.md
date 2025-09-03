This test file assumes Jest (ts-jest). If your repository uses Vitest:

- Replace calls to `jest.mock` and `jest.fn` with calls to `vi.mock` and `vi.fn`.
- Replace `jest.resetModules` with `vi.resetModules`.

Focus: Validates that src/inngest/client (from the PR diff) instantiates Inngest with id "arccane.ai-development",
exports the instance, maintains singleton behavior across imports, and keeps constructor args intact.