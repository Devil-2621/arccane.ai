"use client";

import Link from "next/link";
import { useAuth } from "@clerk/nextjs";

import { Suspense, useState } from "react";

import { Fragment } from "@/generated/prisma";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { UserControl } from "@/components/user-control";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import { ProjectHeader } from "../components/project-header";
import MessagesContainer from "../components/messages-container";
import { FragmentPlaceholder, FragmentWeb } from "../components/fragment-web";
import { EyeIcon, CodeIcon, CrownIcon } from "lucide-react";
import { FileExplorer } from "@/components/file-explorer";
import LoadingPanel from "../components/loading-panel";
import { ErrorBoundary } from "react-error-boundary";
import ErrorProject from "../components/error-project";
import ErrorMessages from "../components/error-messages";

interface Props {
  projectId: string;
}

export const ProjectView = ({ projectId }: Props) => {
  const [activeFragment, setActiveFragment] = useState<Fragment | null>(null);
  const [tabState, setTabState] = useState<"preview" | "code">("preview");

  const { has } = useAuth();
  const hasProAccess = has?.({ plan: "pro" });

  return (
    <div className="h-screen">
      <ResizablePanelGroup
        direction="horizontal"
        className="h-full border rounded"
      >
        <ResizablePanel
          defaultSize={30}
          minSize={20}
          maxSize={40}
          className="flex flex-col min-h-0"
        >
          <ErrorBoundary fallback={<ErrorProject projectId={projectId} />}>
            <Suspense
              fallback={
                <LoadingPanel
                  contextLabel="Project details loading"
                  title="Fetching project details"
                  subtitle="Collecting the latest metadata, fragments, and collaborators."
                  hints={[
                    "Syncing project state from the workspace cache.",
                    "Checking your access level and plan features.",
                    "Preparing the dashboard controls and shortcuts.",
                  ]}
                />
              }
            >
              <ProjectHeader projectId={projectId} />
            </Suspense>
          </ErrorBoundary>
          <ErrorBoundary fallback={<ErrorMessages projectId={projectId} />}>
            <Suspense
              fallback={
                <LoadingPanel
                  contextLabel="Messages loading"
                  title="Rebuilding the conversation"
                  subtitle="Pulling in the latest assistant responses and your prompts."
                  hints={[
                    "Fetching recent agent runs and summaries.",
                    "Rehydrating code edits associated with this thread.",
                    "Linking progress markers so you can resume instantly.",
                  ]}
                />
              }
            >
              <MessagesContainer
                projectId={projectId}
                activeFragment={activeFragment}
                setActiveFragment={setActiveFragment}
              />
            </Suspense>
          </ErrorBoundary>
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel
          defaultSize={75}
          minSize={50}
          className="flex flex-col min-h-0"
        >
          <Tabs
            className="h-full gap-y-0"
            defaultValue="preview"
            value={tabState}
            onValueChange={(value) => setTabState(value as "preview" | "code")}
          >
            <div className="w-full flex items-center p-2 border-b gap-x-2">
              <TabsList className="h-8 p-0 border rounded-md">
                <TabsTrigger value="preview" className="rounded-md">
                  <EyeIcon />
                  <span>Demo</span>
                </TabsTrigger>
                <TabsTrigger value="code" className="rounded-md">
                  <CodeIcon />
                  <span>Code</span>
                </TabsTrigger>
              </TabsList>
              <div className="ml-auto flex items-center gap-x-2">
                {!hasProAccess && (
                  <Button
                    asChild
                    size="sm"
                    variant="tertiary"
                    className="ml-auto"
                  >
                    <Link href="/pricing">
                      <CrownIcon />
                      Upgrade
                    </Link>
                  </Button>
                )}
                <UserControl showName />
              </div>
            </div>
            <TabsContent value="preview" className="h-full">
              {activeFragment ? (
                <FragmentWeb data={activeFragment} />
              ) : (
                <FragmentPlaceholder variant="preview" />
              )}
            </TabsContent>
            <TabsContent value="code" className="min-h-0 h-full">
              {activeFragment?.files ? (
                <FileExplorer
                  files={activeFragment.files as { [path: string]: string }}
                />
              ) : (
                <FragmentPlaceholder variant="code" />
              )}
            </TabsContent>
          </Tabs>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};
