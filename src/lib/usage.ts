import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

import { RateLimiterPrisma } from "rate-limiter-flexible";

const FREE_POINTS = 5;
const PRO_POINTS = 100;
const GENERATION_COST = 1;
const DURATION = 30 * 24 * 60 * 60; // seconds
const DURATION_MS = DURATION * 1000;
const FREE_KEY_PREFIX = "free_user";
const PRO_KEY_PREFIX = "pro";

type UsageContext = {
    userId: string;
    hasProAccess: boolean;
};

const resolveUsageContext = async (): Promise<UsageContext> => {
    const { userId, has } = await auth();

    if (!userId) {
        throw new Error("User not authenticated");
    }

    const hasProAccess = has({ plan: "pro" });

    return { userId, hasProAccess };
};

const createUsageLimiter = (points: number) =>
    new RateLimiterPrisma({
        storeClient: prisma,
        tableName: "Usage",
        points,
        duration: DURATION,
    });

const buildKey = (prefix: string, userId: string) => `${prefix}:${userId}`;

const planLimit = (hasProAccess: boolean) =>
    hasProAccess ? PRO_POINTS : FREE_POINTS;

export async function consumeCredits() {
        const { userId, hasProAccess } = await resolveUsageContext();
        const limiter = createUsageLimiter(planLimit(hasProAccess));
        const key = buildKey(hasProAccess ? PRO_KEY_PREFIX : FREE_KEY_PREFIX, userId);

        return limiter.consume(key, GENERATION_COST);
}

export async function getUsageStatus() {
        const { userId, hasProAccess } = await resolveUsageContext();
        const freeLimiter = createUsageLimiter(FREE_POINTS);
        const proLimiter = createUsageLimiter(PRO_POINTS);

        const [freeResult, proResult] = await Promise.all([
            freeLimiter.get(buildKey(FREE_KEY_PREFIX, userId)),
            proLimiter.get(buildKey(PRO_KEY_PREFIX, userId)),
        ]);

            if (!hasProAccess && proResult && typeof proLimiter.delete === "function") {
                await proLimiter.delete(buildKey(PRO_KEY_PREFIX, userId));
        }

        const freeConsumed = freeResult?.consumedPoints ?? 0;
        const proConsumed = proResult?.consumedPoints ?? 0;

        const limit = planLimit(hasProAccess);
        const consumedPoints = hasProAccess ? proConsumed : freeConsumed;
            const msBeforeNext = hasProAccess
                ? proResult?.msBeforeNext ?? DURATION_MS
                : freeResult?.msBeforeNext ?? DURATION_MS;

        return {
            remainingPoints: Math.max(0, limit - consumedPoints),
            consumedPoints,
            limit,
            msBeforeNext,
            hasProAccess,
        };
}