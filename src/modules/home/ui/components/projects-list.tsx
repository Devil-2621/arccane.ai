"use client";

import Link from "next/link";

import { useUser } from "@clerk/nextjs";

import { formatDistanceToNow } from "date-fns";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Trash2, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { useTRPC } from "@/trpc/client";

import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const ProjectsList = () => {
  const trpc = useTRPC();
  const { user } = useUser();
  const queryClient = useQueryClient();

  const { data: projects } = useQuery(trpc.projects.getMany.queryOptions());
  

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const deleteProject = useMutation(
    trpc.projects.delete.mutationOptions({
      onMutate: async (variables) => {
        setDeletingId(variables.id);
        await queryClient.cancelQueries(trpc.projects.getMany.queryOptions());
        const previous = queryClient.getQueryData(
          trpc.projects.getMany.queryOptions().queryKey
        ) as typeof projects | undefined;
        if (previous) {
          queryClient.setQueryData(
            trpc.projects.getMany.queryOptions().queryKey,
            previous.filter((p) => p.id !== variables.id)
          );
        }
        return { previous };
      },
      onError: (error, _vars, context) => {
        toast.error(error.message || "Failed to delete project");
        if (context?.previous) {
          queryClient.setQueryData(
            trpc.projects.getMany.queryOptions().queryKey,
            context.previous
          );
        }
      },
      onSuccess: (data) => {
        toast.success("Project deleted successfully");
      },
      onSettled: () => {
        setDeletingId(null);
        queryClient.invalidateQueries(trpc.projects.getMany.queryOptions());
      },
    })
  );

  const deleteAllProjects = useMutation(
    trpc.projects.deleteAll.mutationOptions({
      onMutate: async () => {
        await queryClient.cancelQueries(trpc.projects.getMany.queryOptions());
        const previous = queryClient.getQueryData(
          trpc.projects.getMany.queryOptions().queryKey
        ) as typeof projects | undefined;

        // optimistic clear
        queryClient.setQueryData(
          trpc.projects.getMany.queryOptions().queryKey,
          []
        );

        return { previous };
      },
      onError: (error, _vars, context) => {
        toast.error(error.message || "Failed to delete all projects");
        if (context?.previous) {
          queryClient.setQueryData(
            trpc.projects.getMany.queryOptions().queryKey,
            context.previous
          );
        }
      },
      onSuccess: (data) => {
        toast.success(
          data?.count ? `Deleted ${data.count} project(s)` : "No projects to delete"
        );
      },
      onSettled: () => {
        queryClient.invalidateQueries(trpc.projects.getMany.queryOptions());
      },
    })
  );

  const handleDelete = (
    projectId: string,
    e?: React.MouseEvent
  ) => {
    // Preserve existing prevention if event is passed (icon button, dialog action)
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    // Execute deletion
    deleteProject.mutate({ id: projectId });
  };

  const handleDeleteAll = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    deleteAllProjects.mutate();
  };

  if (!projects) return null;
  if (!user) return null;

  return (
    <div className="w-full bg-sidebar rounded-xl p-8 border flex flex-col gap-y-6 sm:gap-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">{user?.firstName}&apos;s Arcs</h2>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              size="sm"
              disabled={(projects?.length ?? 0) === 0 || deleteAllProjects.isPending}
              className="gap-2"
            >
              {deleteAllProjects.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              Delete all projects
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete all projects</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete all your projects and their messages. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteAll}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                disabled={deleteAllProjects.isPending}
              >
                {deleteAllProjects.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : null}
                Delete all
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {projects.length === 0 && (
          <div className="col-span-full text-center">
            <p className=" text-sm text-muted-foreground">No projects found.</p>
          </div>
        )}
        {projects?.map((project) => (
          <div key={project.id} className="relative group">
            <Button
              variant="outline"
              className="font-normal h-auto justify-start w-full text-start p-4"
              asChild
            >
              <Link
                href={`/projects/${project.id}`}
                className="flex flex-col items-start gap-2 w-full"
              >
                <div className="flex items-center gap-x-4">
                  <Logo
                    width={32}
                    height={32}
                    className="object-contain rounded-full"
                  />
                  <div className="flex flex-col">
                    <h3 className="truncate font-medium text-wrap">
                      {project.name || "Untitled Project"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {formatDistanceToNow(project.updatedAt, {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </div>
              </Link>
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Project</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete &quot;{project.name || "Untitled Project"}&quot;? 
                    This action cannot be undone and will permanently delete the project 
                    and all its messages.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    disabled={deleteProject.isPending && deletingId === project.id}
                    onClick={(e) => handleDelete(project.id, e)}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90 flex items-center gap-2"
                  >
                    {deleteProject.isPending && deletingId === project.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : null}
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        ))}
      </div>
    </div>
  );
};
