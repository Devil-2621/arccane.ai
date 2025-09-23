import { SparklesCore } from "@/components/ui/sparkles";
import { cn } from "@/lib/utils";

interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  return (
    <main className="flex flex-col min-h-screen max-h-screen">
      <div
        className={cn(
          "absolute inset-0 invert/20 -z-10",
          "[background-size:40px_40px]",
          "[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
          "dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]"
        )}
      />
      {/* Radial gradient for the container to give a faded look */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_10%,black)] dark:bg-[#0a0a0a] -z-10"></div>
      <div className="w-full absolute inset-0 h-screen -z-20">
        <SparklesCore
          id="tsparticlesfullpage"
          background="transparent"
          minSize={0.6}
          maxSize={1.2}
          particleDensity={60}
          className="w-full h-full dark:invert"
          particleColor="#000000"
        />
      </div>
      {/* <div className="absolute inset-0 -z-10 h-full w-full bg-background dark:bg-[radial-gradient(#393e4a_2px,transparent_2px)] bg-[radial-gradient(#dadde2_2px,transparent_2px)] [background-size:39px_39px] animate-pulse" /> */}
      <div className="flex-1 flex flex-col px-4 pb-4">{children}</div>
    </main>
  );
};

export default Layout;
