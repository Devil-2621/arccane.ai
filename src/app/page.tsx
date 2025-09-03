"use client";

import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";

const Page = () => {
  const trpc = useTRPC();
  const invoke = useMutation(trpc.invoke.mutationOptions({}));

  return (
    <div>
      <Button onClick={() => invoke.mutate({ text: "Tirth Ladani" })}>
        Invoke Background Job
      </Button>
    </div>
  );
};

export default Page;
