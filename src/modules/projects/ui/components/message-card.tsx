import Image from "next/image";
import { format } from "date-fns";
import { ChevronRightIcon, Code2Icon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Fragment, MessageRole, MessageType } from "@/generated/prisma";

interface FragmentCardProps {
  fragment: Fragment;
  isActiveFragment: boolean;
  onFragmentClick: (fragment: Fragment) => void;
}

const FragmentCard = ({
  fragment,
  isActiveFragment,
  onFragmentClick,
}: FragmentCardProps) => {
  return (
    <button
      className={cn(
        "flex items-start text-start gap-2 border rounded-lg bg-muted w-fit p-3 hover:bg-secondary transition-colors",
        isActiveFragment &&
          "bg-primary text-primary-foreground border-primary hover:bg-primary"
      )}
      onClick={() => onFragmentClick(fragment)}
    >
      <Code2Icon className="size-4 mt-1" />
      <div className="flex flex-col flex-1">
        <span className="text-sm font-medium line-clamp-1">
          {fragment.titles || "Untitled Fragment"}
        </span>
        <span className="text-sm">Preview</span>
      </div>
      <div className="flex items-center justify-center mt-1">
        <ChevronRightIcon className="size-4" />
      </div>
    </button>
  );
};

interface AssistantMessageProps {
  content: string;
  fragment: Fragment | null;
  createdAt: Date;
  isActiveFragment: boolean;
  onFragmentClick: (fragment: Fragment) => void;
  type: MessageType;
}

const AssistantMessage = ({
  content,
  fragment,
  createdAt,
  isActiveFragment,
  onFragmentClick,
  type,
}: AssistantMessageProps) => {
  return (
    <div
      className={cn(
        "flex flex-col group pb-4 px-2 p-2 bg-green-50 rounded-xl m-2",
        type === "ERROR" &&
          "text-red-700 dark:text-red-500 bg-red-100 rounded-xl",
        isActiveFragment && "bg-accent/50 rounded-lg"
      )}
    >
      <div className="flex items-center gap-2 mb-2 bg-gradient-to-r from-background/70 to-transparent rounded-full p-2">
        {/*TODO: add Logo*/}
        <Image
          src="/Arccane_logo_dark.svg"
          alt="Arccane AI Logo"
          width={20}
          height={20}
          className="rounded-full shrink-0"
        />
        <span className="text-sm font-medium">Arccane AI</span>
        <span className="text-xs text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
          {format(createdAt, "h:mm a 'on' MMM dd, yyyy")}
        </span>
      </div>
      <div className="pl-8 flex flex-col gap-y-4">
        <span>{content}</span>
        {fragment && type === "RESULT" && (
          <FragmentCard
            fragment={fragment}
            isActiveFragment={isActiveFragment}
            onFragmentClick={() => onFragmentClick(fragment)}
          />
        )}
      </div>
    </div>
  );
};

interface UserMessageProps {
  content: string;
}

const UserMessage = ({ content }: UserMessageProps) => {
  return (
    <div className="flex justify-end pb-4 pr-2 pl-10">
      <Card className="rounded-lg bg-muted p-3 shadow-none border-none max-w-[80%] break-words">
        {content}
      </Card>
    </div>
  );
};

interface MessageCardProps {
  content: string;
  role: MessageRole;
  fragment: Fragment | null;
  createdAt: Date;
  isActiveFragment: boolean;
  onFragmentClick: (fragment: Fragment) => void;
  type: MessageType;
}

export const MessageCard = ({
  content,
  role,
  fragment,
  createdAt,
  isActiveFragment,
  onFragmentClick,
  type,
}: MessageCardProps) => {
  if (role === "ASSISTANT") {
    return (
      <AssistantMessage
        content={content}
        fragment={fragment}
        createdAt={createdAt}
        isActiveFragment={isActiveFragment}
        onFragmentClick={onFragmentClick}
        type={type}
      />
    );
  }
  return (
    <div>
      <UserMessage content={content} />
    </div>
  );
};
