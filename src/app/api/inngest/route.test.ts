/**
 * Tests for src/app/api/inngest/route.ts
 *
 * Detected testing library/framework: Jest/Vitest-compatible (module mocking + expect assertions).
 * - We mock `inngest/next`'s `serve` to capture invocation and return stub handlers.
 * - We mock `@/inngest/client` and `@/inngest/functions` and assert they are passed through.
 *
 * Focus areas (from PR diff scope):
 * - Exports GET, POST, PUT from serve() result.
 * - `serve` is called with the expected client and functions list containing `helloWorld`.
 * - Handlers are exactly those returned by our mocked `serve`.
 * - Defensive checks: functions array shape and immutability of exported handlers.
 */

 // Vitest compatibility shim: use vi if available, else fallback to jest
 // eslint-disable-next-line @typescript-eslint/no-explicit-any
 const _testApi: any = (global as any);
 const mockFn = _testApi.vi?.fn ?? _testApi.jest?.fn;
 const resetModules = _testApi.vi?.resetModules ?? _testApi.jest?.resetModules;
 const clearAllMocks = _testApi.vi?.clearAllMocks ?? _testApi.jest?.clearAllMocks;
 const mocker = _testApi.vi ?? _testApi.jest;

 if (!mockFn || !mocker || !resetModules || !clearAllMocks) {
   throw new Error("Test framework (Jest/Vitest) not detected or missing globals.");
 }

 // Placeholders for module mocks we want to assert against
 const fakeInngestClient = { __type: "fake-inngest-client" };
 const fakeHelloWorld = { id: "hello.world.fn", __type: "inngest-function" };

 // Keep references to stub handlers we want the route to export
 const stubHandlers = {
   GET: mockFn(async () => new Response("GET OK", { status: 200 })),
   POST: mockFn(async () => new Response("POST OK", { status: 200 })),
   PUT: mockFn(async () => new Response("PUT OK", { status: 200 })),
 };

 // We need to mock before importing the module under test
 mocker.mock("inngest/next", () => {
   return {
     serve: mockFn(({ client, functions }: { client: unknown; functions: unknown[] }) => {
       // Expose captured args for assertions
       (global as any).__serveArgs = { client, functions };
       return { ...stubHandlers };
     }),
   };
 });

 mocker.mock("@/inngest/client", () => {
   return { inngest: fakeInngestClient };
 });

 mocker.mock("@/inngest/functions", () => {
   return { helloWorld: fakeHelloWorld };
 });

 describe("Inngest route exports", () => {
   beforeEach(async () => {
     clearAllMocks();
     // Re-import fresh module state so mock captured args are reset
     delete (global as any).__serveArgs;
     await resetModules();
   });

   test("should export GET, POST, and PUT handlers returned by serve()", async () => {
     const route = await import("./route");
     expect(route).toBeDefined();
     expect(typeof route.GET).toBe("function");
     expect(typeof route.POST).toBe("function");
     expect(typeof route.PUT).toBe("function");

     // Ensure the exported handlers are exactly our stub instances
     expect(route.GET).toBe(stubHandlers.GET);
     expect(route.POST).toBe(stubHandlers.POST);
     expect(route.PUT).toBe(stubHandlers.PUT);
   });

   test("should call serve with the configured client and functions [helloWorld]", async () => {
     await import("./route");
     const captured = (global as any).__serveArgs;
     expect(captured).toBeDefined();
     expect(captured.client).toBe(fakeInngestClient);
     expect(Array.isArray(captured.functions)).toBe(true);
     expect(captured.functions).toHaveLength(1);
     expect(captured.functions[0]).toBe(fakeHelloWorld);
   });

   test("exported handlers should be callable and return Response-like objects", async () => {
     const { GET, POST, PUT } = await import("./route");

     const resGet = await GET(new Request("http://localhost/api/inngest", { method: "GET" }));
     expect(resGet).toBeInstanceOf(Response);
     expect(resGet.status).toBe(200);
     expect(await resGet.text()).toBe("GET OK");

     const resPost = await POST(new Request("http://localhost/api/inngest", { method: "POST" }));
     expect(resPost.status).toBe(200);
     expect(await resPost.text()).toBe("POST OK");

     const resPut = await PUT(new Request("http://localhost/api/inngest", { method: "PUT" }));
     expect(resPut.status).toBe(200);
     expect(await resPut.text()).toBe("PUT OK");
   });

   test("functions array integrity: ensure it contains only helloWorld and is not mutated by tests", async () => {
     await import("./route");
     const first = (global as any).__serveArgs?.functions;
     expect(first).toEqual([fakeHelloWorld]);

     // Simulate accidental mutation and verify not impacting future fresh imports
     first.push({ id: "other-fn" });

     // Fresh import resets module scope and re-calls serve
     await resetModules();
     delete (global as any).__serveArgs;
     await import("./route");
     const second = (global as any).__serveArgs?.functions;
     expect(second).toEqual([fakeHelloWorld]);
   });

   test("defensive: route only exports GET/POST/PUT (no extraneous handlers)", async () => {
     const route = await import("./route");
     const exportedKeys = Object.keys(route).sort();
     expect(exportedKeys).toEqual(["GET", "POST", "PUT"].sort());
   });
 });