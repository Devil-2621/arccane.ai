/**
 * Test framework: Vitest.
 * Rationale: No existing tests or configs were detected in the repository scan,
 * so we default to Vitest, which fits a Next.js + TypeScript stack.
 * If your project uses Jest, replace:
 *   import { describe, it, expect, beforeAll } from 'vitest';
 * with:
 *   import { describe, it, expect, beforeAll } from '@jest/globals';
 * and adjust runner config accordingly.
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

describe('WARP.md Documentation Tests (structure and content)', () => {
  let markdownContent = '';
  const rootDir = process.cwd();
  const warpMdPath = join(rootDir, 'WARP.md');

  beforeAll(() => {
    if (existsSync(warpMdPath)) {
      markdownContent = readFileSync(warpMdPath, 'utf-8');
    }
  });

  it('should have WARP.md file present at repository root', () => {
    expect(existsSync(warpMdPath)).toBe(true);
  });

  it('should start with the correct H1 title', () => {
    expect(markdownContent.startsWith('# WARP.md')).toBe(true);
  });

  it('should contain the required main sections', () => {
    const requiredSections = [
      '## Development Commands',
      '## Architecture Overview',
      '## Development Workflow',
      '## Environment Setup',
    ];
    for (const section of requiredSections) {
      expect(markdownContent).toContain(section);
    }
  });

  it('should include all subsections under Development Commands', () => {
    const subsections = [
      '### Core Development',
      '### Database Operations',
      '### Dependencies',
    ];
    for (const s of subsections) {
      expect(markdownContent).toContain(s);
    }
  });

  it('should enumerate the Tech Stack accurately', () => {
    const items = [
      'Next.js 15',
      'TypeScript',
      'Tailwind CSS v4',
      'PostgreSQL',
      'Prisma ORM',
      'tRPC',
      'TanStack Query',
      'Radix UI',
      'React Hook Form',
      'Zod validation',
    ];
    for (const item of items) {
      expect(markdownContent).toContain(item);
    }
  });

  it('should document core npm scripts and prisma commands inside bash code fences', () => {
    // Ensure there are bash code blocks and they contain expected commands
    const bashBlocks = markdownContent.match(/```bash[\s\S]*?```/g) || [];
    expect(bashBlocks.length).toBeGreaterThan(0);

    const bashConcat = bashBlocks.join('\n');
    const expectedCommands = [
      'npm run dev',
      'npm run build',
      'npm run start',
      'npm run lint',
      'npm install',
      'npm install <package-name>',
      'npm install -D <package-name>',
      'npx prisma generate',
      'npx prisma db push',
      'npx prisma studio',
      'npx prisma db reset',
    ];
    for (const cmd of expectedCommands) {
      expect(bashConcat).toContain(cmd);
    }

    // Check that destructive command is called out as destructive in nearby text
    if (bashConcat.includes('npx prisma db reset')) {
      expect(markdownContent.toLowerCase()).toContain('(destructive)');
    }
  });

  it('should document UI component add command for shadcn', () => {
    expect(markdownContent).toContain('npx shadcn@latest add <component-name>');
  });

  it('should document the project structure tree and key paths', () => {
    // Locate the structure block and perform light validation
    const structureMatch = markdownContent.match(/```[\s\S]*?src\/[\s\S]*?```/);
    expect(structureMatch).toBeTruthy();
    if (structureMatch) {
      const block = structureMatch[0];
      // Must include key directories/files shown in the diff
      const expectedSnippets = [
        'src/app/',
        'src/components/ui/',
        'src/hooks/',
        'src/lib/',
        'src/lib/db.ts',
        'src/lib/utils.ts',
        'src/trpc/',
        'src/trpc/routers/',
        'src/trpc/client.tsx',
        'src/trpc/server.tsx',
        'src/trpc/init.ts',
        'src/generated/prisma/',
        'prisma/schema.prisma',
      ];
      for (const s of expectedSnippets) {
        expect(block).toContain(s);
      }

      // Validate tree drawing characters look consistent
      const treeLines = block.split('\n').filter(l => /[├└]──/.test(l));
      expect(treeLines.length).toBeGreaterThan(0);
      for (const line of treeLines) {
        expect(line).toMatch(/^[\s│├└─]+[^/]+/);
      }
    }
  });

  it('should document environment variables and their meaning', () => {
    expect(markdownContent).toMatch(/`?DATABASE_URL`?/);
    expect(markdownContent).toContain('PostgreSQL connection string');
  });

  it('should describe the Development Workflow steps 1..4 in order', () => {
    const workflow = markdownContent.match(/## Development Workflow[\s\S]*?(?=##|$)/);
    expect(workflow).toBeTruthy();
    if (workflow) {
      const text = workflow[0];
      // Steps 1-4 should be present
      for (const n of [1, 2, 3, 4]) {
        expect(text).toContain(`${n}. `);
      }
      // Check a couple of concrete items from steps
      expect(text).toContain('prisma/schema.prisma');
      expect(text).toContain('npx prisma db push');
      expect(text).toContain('npx prisma generate');
      expect(text).toContain('src/trpc/routers/_app.ts');
      expect(text).toContain('npx shadcn@latest add');
      expect(text).toContain('tsconfig.json');
      expect(text).toContain('@/'); // path alias reference
    }
  });

  it('should maintain consistent heading nesting and basic markdown hygiene', () => {
    const headings = markdownContent.match(/^#{1,6}\s+.+$/gm) || [];
    expect(headings.length).toBeGreaterThan(0);

    // First heading should be H1
    expect(/^#\s+/.test(headings[0])).toBe(true);

    // Nesting should not jump by more than one level at a time
    let prev = (headings[0].match(/^(#+)/)?.[1].length) || 1;
    for (const h of headings.slice(1)) {
      const lvl = (h.match(/^(#+)/)?.[1].length) || prev;
      expect(Math.abs(lvl - prev)).toBeLessThanOrEqual(1);
      prev = lvl;
    }

    // Code blocks open/close count must be even
    const ticks = (markdownContent.match(/```/g) || []).length;
    expect(ticks % 2).toBe(0);

    // Bold and inline code markers should be balanced
    const boldMarkers = (markdownContent.match(/\*\*/g) || []).length;
    expect(boldMarkers % 2).toBe(0);
    const inlineCodeMarkers = (markdownContent.match(/`/g) || []).length;
    expect(inlineCodeMarkers % 2).toBe(0);

    // No trailing whitespace unless intentional hard line break (two spaces)
    const lines = markdownContent.split('\n');
    for (const line of lines) {
      if (!line.endsWith('  ')) {
        expect(/\s+$/.test(line)).toBe(false);
      }
    }
  });

  it('should reference technologies with correct casing', () => {
    expect(markdownContent).toMatch(/Next\.js/);
    expect(markdownContent).toMatch(/TypeScript/);
    expect(markdownContent).toMatch(/PostgreSQL/);
    expect(markdownContent).toMatch(/tRPC/);
  });

  it('should accurately describe Next.js, Tailwind, and Turbopack details from the diff', () => {
    expect(markdownContent).toContain('Next.js 15');
    expect(markdownContent).toContain('App Router');
    expect(markdownContent).toContain('Tailwind CSS v4');
    expect(markdownContent).toContain('Turbopack');
  });

  it('should mention Prisma client generation path', () => {
    expect(markdownContent).toContain('src/generated/prisma/');
  });
});

describe('WARP.md Cross-file references (non-strict existence checks)', () => {
  // These tests validate alignment with typical project files if present,
  // but do not fail the suite if files are absent (to keep docs tests portable).
  it('mentions package.json scripts that commonly exist', () => {
    const pkgPath = join(process.cwd(), 'package.json');
    if (!existsSync(pkgPath)) return;
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
    const scripts = pkg.scripts || {};
    for (const s of ['dev', 'build', 'start', 'lint']) {
      if (scripts[s]) {
        // If script exists, docs should reference it
        const content = readFileSync(join(process.cwd(), 'WARP.md'), 'utf-8');
        expect(content).toContain(`npm run ${s}`);
      }
    }
  });

  it('references prisma/schema.prisma if the file exists', () => {
    const schemaPath = join(process.cwd(), 'prisma', 'schema.prisma');
    if (existsSync(schemaPath)) {
      const content = readFileSync(join(process.cwd(), 'WARP.md'), 'utf-8');
      expect(content).toContain('prisma/schema.prisma');
    }
  });

  it('references components.json if the file exists', () => {
    const componentsPath = join(process.cwd(), 'components.json');
    if (existsSync(componentsPath)) {
      const content = readFileSync(join(process.cwd(), 'WARP.md'), 'utf-8');
      expect(content).toContain('components.json');
      // also validate JSON parses
      const cfg = JSON.parse(readFileSync(componentsPath, 'utf-8'));
      expect(cfg).toBeDefined();
    }
  });
});