import z from "zod";

import { inngest } from "@/inngest/client";

import { prisma } from "@/lib/db";
import { consumeCredits } from "@/lib/usage";

import { protectedProcedure, createTRPCRouter } from "@/trpc/init";
import { TRPCError } from "@trpc/server";

const STOP_WORDS = new Set([
    "the",
    "and",
    "for",
    "with",
    "that",
    "from",
    "this",
    "your",
    "into",
    "about",
    "have",
    "using",
    "need",
    "project",
    "build",
    "create",
    "make",
    "generate",
    "an",
    "a",
    "to",
    "of",
    "on",
    "in",
    "my",
    "our",
    "new",
]);

const capitalize = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

const deriveProjectName = (prompt: string) => {
    const cleaned = prompt.replace(/[\r\n]+/g, " ").toLowerCase();
    const tokens = cleaned
        .split(/\s+/)
        .map((token) => token.replace(/[^a-z0-9-]/g, ""))
        .filter(Boolean);

    const keyword = tokens.find((token) => token.length > 2 && !STOP_WORDS.has(token));

    if (keyword) {
        return capitalize(keyword);
    }

    if (tokens.length > 0) {
        return capitalize(tokens[0]);
    }

    return "Untitled Project";
};

export const projectsRouter = createTRPCRouter({
    getOne: protectedProcedure
    .input(z.object({
        id: z.string().min(1, { message: "ID is required" }),
    }))
    .query(async ({ input, ctx }) => {
        const existingProject = await prisma.project.findUnique({
            where: { 
                id: input.id,
                userId: ctx.auth.userId,
            },
        });

        if (!existingProject) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Project not found",
            });
        }

        return existingProject;
    }),
    getMany: protectedProcedure
    .query(async ({ ctx }) => {
        const projects = await prisma.project.findMany({
            where: {
                userId: ctx.auth.userId,
            },
            orderBy: {
                updatedAt: "desc",
            },
        });

        return projects;
    }),

    create: protectedProcedure
    .input(
        z.object({
            value: z.string()
            .min(1, {message: "Value is required "})
            .max(10000, { message: "Value must be less than 10000 characters" }),
        }),
    )
    .mutation(async ({ input, ctx }) => {

        try {
            await consumeCredits();
        }catch (error) {
            if (error instanceof Error) {
                throw new TRPCError({ 
                    code: "BAD_REQUEST", 
                    message: "Something went wrong" 
                });
            } else {
                throw new TRPCError({
                    code: "TOO_MANY_REQUESTS",
                    message: "You have exceeded your free credits. Please upgrade to continue using the service.",
                })

            }
        }
        const createdProject = await prisma.project.create({
            data: {
                userId: ctx.auth.userId,
                name: deriveProjectName(input.value),
                messages: {
                    create: {
                        content: input.value,
                        role: "USER",
                        type: "RESULT",
                    }
                }
            },
        });

    
        await inngest.send({
          name: "coding-agent/run",
          data: {
            value: input.value,
            projectId: createdProject.id,
          }
        });

        return createdProject;
    }),
});