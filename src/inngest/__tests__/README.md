These tests target `src/inngest/functions.test.ts`, which defines an Inngest function.
Detected framework: prefer Vitest if available; a Jest variant is provided as `functions.helloWorld.jest.spec.ts`.

- Vitest spec file is `functions.helloWorld.spec.ts`
- Jest spec file: `functions.helloWorld.jest.spec.ts`

Both suites mock `@/inngest/client` to intercept `inngest.createFunction` and validate:
- Correct id and event registration
- Handler behavior: sleep call, greeting output
- Edge case: missing email
- Failure path: step.sleep rejection