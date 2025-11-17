import { Template, waitForURL } from "e2b";

// This is the Build System 2.0 replacement for your old Dockerfile + compile_page.sh
export const template = Template()
    // FROM node:21-slim
    .fromNodeImage("21-slim")

    // Install curl + dos2unix (curl is required for waitForURL helper)
    .aptInstall(["curl", "dos2unix"])

    // Same WORKDIR as your Dockerfile
    .setWorkdir("/home/user/nextjs-app")

    // Create Next.js app (mirrors: npx --yes create-next-app@latest . --yes)
    .runCmd("npx --yes create-next-app@latest . --yes")

    // Init shadcn (same as your Dockerfile)
    .runCmd("npx --yes shadcn@latest init --yes -b neutral --force")
    .runCmd("npx --yes shadcn@latest add --all --yes")

    // Move Next.js app to /home/user and cleanup
    .runCmd(
        "mv /home/user/nextjs-app/* /home/user/ && rm -rf /home/user/nextjs-app"
    )

    // This replaces your compile_page.sh:
    // cd /home/user && npx next dev --turbopack
    // plus the curl loop checking localhost:3000
    .setWorkdir("/home/user")
    .setStartCmd(
        "npx next dev --turbopack",
        // Wait until http://localhost:3000 returns 200
        waitForURL("http://localhost:3000", 200)
    );
