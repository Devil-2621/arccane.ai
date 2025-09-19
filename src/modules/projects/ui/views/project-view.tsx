"use client";

import { Suspense } from "react";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import MessagesContainer from "../components/messages-container";

interface Props {
  projectId: string;
}

export const ProjectView = ({ projectId }: Props) => {
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
          <Suspense fallback={<p>Loading messages...</p>}>
            <MessagesContainer projectId={projectId} />
          </Suspense>
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel
          defaultSize={75}
          minSize={50}
          className="flex flex-col min-h-0"
        >
          TODO: Preview
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};
