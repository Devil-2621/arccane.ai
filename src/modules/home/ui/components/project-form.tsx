"use client";

import { z } from "zod";
import { toast } from "sonner";
import { useState } from "react";
import { useClerk } from "@clerk/nextjs";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import TextareaAutosize from "react-textarea-autosize";
import { motion } from "motion/react";
import { ArrowUpIcon, Loader2Icon, Sparkles, Wand2, Zap } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Form, FormField } from "@/components/ui/form";
import { PROJECT_TEMPLATES } from "../../constants";

const formSchema = z.object({
  value: z
    .string()
    .min(1, "Value is required")
    .max(10000, "Value must be at most 10000 characters"),
});

export const ProjectForm = () => {
  const router = useRouter();
  const trpc = useTRPC();
  const clerk = useClerk();
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      value: "",
    },
  });

  const createProject = useMutation(
    trpc.projects.create.mutationOptions({
      onSuccess: (data) => {
        queryClient.invalidateQueries(trpc.projects.getMany.queryOptions());
        queryClient.invalidateQueries(trpc.usage.status.queryOptions());
        router.push(`/projects/${data.id}`);
      },
      onError: (error) => {
        toast.error(error.message);

        if (error.data?.code === "UNAUTHORIZED") {
          clerk.openSignIn();
          return;
        }

        if (error.data?.code === "TOO_MANY_REQUESTS") {
          router.push("/pricing");
          return;
        }
      },
    })
  );

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await createProject.mutateAsync({
      value: values.value,
    });
  };

  const onSelect = (value: string) => {
    form.setValue("value", value, {
      shouldDirty: true,
      shouldValidate: true,
      shouldTouch: true,
    });
  };

  const [isFocused, setIsFocused] = useState(false);
  const isPending = createProject.isPending;
  const isButtonDisabled = isPending || !form.formState.isValid;

  return (
    <Form {...form}>
      <div className="relative overflow-hidden rounded-[28px] border border-border/60 bg-card/85 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.45)] backdrop-blur">
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -left-16 top-[-20%] h-56 w-56 rounded-full bg-primary/20 blur-3xl dark:bg-primary/15"
        />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -bottom-20 right-[-10%] h-44 w-44 rounded-full bg-secondary/40 blur-3xl dark:bg-secondary/25"
        />

        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="relative z-10 space-y-4 px-4 py-6 sm:px-8 sm:py-8"
        >
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="">
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.3em] shadow-sm">
                <Sparkles className="size-3 text-primary" aria-hidden />
                Describe your next build
              </span>
            </div>
          </div>

          <motion.form
            onSubmit={form.handleSubmit(onSubmit)}
            className={cn(
              "relative rounded-2xl border border-border/60 bg-sidebar/90 px-5 py-4 transition-all duration-300",
              isFocused &&
                "shadow-[0_18px_45px_-30px_rgba(99,102,241,0.65)] ring-1 ring-primary/40"
            )}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.38, ease: "easeOut" }}
          >
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <>
                  <TextareaAutosize
                    {...field}
                    disabled={isPending}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    minRows={4}
                    maxRows={10}
                    className="w-full resize-none border-none bg-transparent pt-3 text-base leading-relaxed text-foreground outline-none placeholder:text-muted-foreground/70"
                    placeholder="Explain the product vision, key screens, or data the app should surface."
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                        form.handleSubmit(onSubmit)(e);
                      }
                    }}
                  />
                  <Separator className="my-4" />
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground/70">
                      <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-border/50 bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                        <span>&#8984;</span> Ctrl + Enter
                      </kbd>
                      to launch
                    </div>
                    <Button
                      disabled={isButtonDisabled}
                      className={cn(
                        "inline-flex items-center gap-1 rounded-full px-6 text-sm font-semibold transition-all",
                        isButtonDisabled
                          ? "bg-primary/60"
                          : "bg-gradient-to-r from-primary to-primary/70 text-white shadow-[0_8px_30px_-18px_rgba(99,102,241,0.95)]"
                      )}
                    >
                      {isPending ? (
                        <Loader2Icon className="size-4 animate-spin" />
                      ) : (
                        <>
                          <ArrowUpIcon className="size-4" />
                          Generate
                        </>
                      )}
                    </Button>
                  </div>
                </>
              )}
            />
          </motion.form>
          <div className="flex justify-center items-center tracking-wider">
            <span className="text-xs font-normal leading-snug text-muted-foreground/80 transition-colors group-hover:text-muted-foreground/60">
              Prefill this prompt
            </span>
          </div>

          <motion.div
            className="flex-wrap justify-center gap-2 hidden md:flex max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.45, ease: "easeOut" }}
          >
            {PROJECT_TEMPLATES.map((template) => (
              <Button
                key={template.title}
                variant="outline"
                size="default"
                className="group justify-start gap-3 rounded-2xl border-border/50 bg-gradient-to-br from-background/80 via-card/70 to-muted/60 px-3 py-3 text-left text-xs font-medium transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:from-primary/8 hover:via-card/70 hover:to-muted/40 hover:shadow-[0_14px_32px_-24px_rgba(99,102,241,0.65)]"
                onClick={() => onSelect(template.prompt)}
              >
                <span className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-base text-primary">
                  {template.emoji}
                </span>
                <span className="flex grow flex-col gap-0.5">
                  <span className="text-xs font-semibold tracking-wide text-foreground">
                    {template.title}
                  </span>
                </span>
                <Wand2
                  className="size-3 text-muted-foreground/60 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-primary"
                  aria-hidden
                />
              </Button>
            ))}
          </motion.div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground/80">
            <Zap className="size-3 text-primary" aria-hidden />
            Prompts power the agent workflow—describe the end experience and any
            must-have integrations for sharper results.
          </div>
        </motion.section>
      </div>
    </Form>
  );
};
