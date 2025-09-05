"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Page = () => {
  const [value, setValue] = useState("");

  const trpc = useTRPC();
  const invoke = useMutation(
    trpc.invoke.mutationOptions({
      onSuccess: () => {
        toast.success("Background job invoked");
      },
    })
  );

  return (
    <div>
      <Input value={value} onChange={(e) => setValue(e.target.value)} />
      <Button
        onClick={() => invoke.mutate({ value: value })}
        disabled={invoke.isPending}
      >
        Invoke Background Job
      </Button>
    </div>
  );
};

export default Page;
