import { ProjectView } from "@/modules/projects/ui/views/project-view";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";

import ErrorPage from "@/app/error";
import LoadingPanel from "@/modules/projects/ui/components/loading-panel";
import { getQueryClient, trpc } from "@/trpc/server";
import { ErrorBoundary } from "react-error-boundary";

type PageProps = {
  params: Promise<{
    projectId: string;
  }>;
};

export default async function Page({ params }: PageProps) {
  const { projectId } = await params; // ✅ await the params

  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(
    trpc.messages.getMany.queryOptions({
      projectId,
    })
  );
  void queryClient.prefetchQuery(
    trpc.projects.getOne.queryOptions({
      id: projectId,
    })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ErrorBoundary fallback={<ErrorPage />}>
        <Suspense
          fallback={
            <LoadingPanel
              contextLabel="Project page loading"
              title="Restoring your project workspace"
              subtitle="Booting the agent sandbox, hydrating queries, and syncing everything you need."
              hints={[
                "Connecting to the coding sandbox and verifying credentials.",
                "Fetching project metadata and recent activity logs.",
                "Hydrating cached messages so you pick up where you left off.",
              ]}
            />
          }
        >
          <ProjectView projectId={projectId} />
        </Suspense>
      </ErrorBoundary>
    </HydrationBoundary>
  );
}
