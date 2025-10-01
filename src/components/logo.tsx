"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

interface Props {
  width?: number;
  height?: number;
  className?: string;
}
export const Logo = ({ width, height, className }: Props) => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const logoSrc = !mounted
    ? "/Arccane_logo.svg"
    : resolvedTheme === "light"
    ? "/Arccane_logo_dark.svg"
    : "/Arccane_logo.svg";

  return (
    <Image
      src={logoSrc}
      alt="Arccane Logo"
      width={width || 24}
      height={height || 24}
      className={className}
    />
  );
};
