"use client";

import { Logo } from "@/components/logo";

import { PricingTable } from "@clerk/nextjs";

const Page = () => {
  return (
    <div className="flex flex-col max-w-3xl mx-auto w-full z-10 pt-0 mt-0">
      <section className="space-y-6 pt-[16vh] 2xl:pt-48">
        <div className="flex flex-col items-center">
          <Logo
            width={50}
            height={50}
            className="hidden md:block rounded-full"
          />
        </div>
        <h1 className="text-xl md:text-3xl font-bold text-center">Pricing</h1>
        <p className="text-muted-foreground text-center text-sm md:text-base">
          Choose a plan that fits your needs
        </p>
        <PricingTable
          appearance={{
            elements: {
              PricingTableCard: "border! shadow-none! rounded-lg!",
            },
          }}
        />
      </section>
    </div>
  );
};

export default Page;
