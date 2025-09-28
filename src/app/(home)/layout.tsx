import { SparklesCore } from "@/components/ui/sparkles";
import { cn } from "@/lib/utils";

interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  return (
    <main className="flex flex-col min-h-screen max-h-screen bg-background dark:bg-background">
      {/* <div className="absolute inset-0 -z-10 h-full w-full bg-background dark:bg-[radial-gradient(#393e4a_1px,transparent_2px)] bg-[radial-gradient(#dadde1_1px,transparent_2px)] [background-size:61px_61px]" /> */}
      <div className="flex-1 flex flex-col px-4 pb-4">{children}</div>
    </main>
  );
};

export default Layout;
