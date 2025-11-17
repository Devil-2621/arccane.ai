import { Template, defaultBuildLogger } from "e2b";
import { template as nextJSTemplate } from "./template";

import dotenv from "dotenv";
dotenv.config({ path: "../../.env" });

async function main() {
    await Template.build(nextJSTemplate, {
        alias: "arccane-ai-nextjs-sandbox", // you can name this whatever you want
        cpuCount: 2,
        memoryMB: 2048,
        onBuildLogs: defaultBuildLogger(),
    });

    console.log("✅ Built template: arccane-ai-nextjs-sandbox");
}

main().catch((err) => {
    console.error("❌ Failed to build template", err);
    process.exit(1);
});
