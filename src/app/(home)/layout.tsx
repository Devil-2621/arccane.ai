import { cn } from "@/lib/utils";
import { Navbar } from "@/modules/home/ui/components/navbar";

interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  return (
    <main className="flex flex-col max-h-screen bg-background dark:bg-background">
      <Navbar />
      <div
        className={cn(
          "absolute inset-0",
          "[background-size:20px_20px]",
          "[background-image:radial-gradient(#d4d4d4_2px,transparent_2px)]",
          "dark:[background-image:radial-gradient(#404040_1px,transparent_2px)]"
        )}
      />
      {/* Radial gradient for the container to give a faded look */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-background bg-gradient-to-br from-primary/12 via-white/80 to-white/65 px-6 py-10 shadow-[0_32px_70px_-42px_rgba(15,23,42,0.55)] backdrop-blur-lg dark:border-border/40 dark:from-primary/12 dark:via-card/85 dark:to-background/80 dark:shadow-[0_40px_90px_-48px_rgba(15,23,42,0.75)]"></div>
      <div className="flex-1 flex flex-col px-4 pb-4">{children}</div>
    </main>
  );
};

export default Layout;
