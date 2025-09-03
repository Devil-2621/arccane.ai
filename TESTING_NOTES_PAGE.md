Testing notes for src/app/page.tsx:
- Frameworks/Libraries: React Testing Library + (Vitest or Jest) + @tanstack/react-query QueryClientProvider.
- We mock "@/trpc/client" (useTRPC) and "@tanstack/react-query" useMutation hook to isolate the UI from the network.
- Tests cover the following: rendering, single-click payload, rapid clicks, resilience to synchronous mutation errors, and isolation from real TRPC.
- If your project exclusively uses Jest (no Vitest), the vi-compatible API is bridged by detecting globalThis.jest.