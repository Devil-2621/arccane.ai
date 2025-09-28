"use client";

import Prism from "prismjs";
import { useEffect } from "react";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-python";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-typescript";
import "prismjs/plugins/line-numbers/prism-line-numbers"; // Add this
import "prismjs/plugins/line-numbers/prism-line-numbers.css"; // Add this
import "./code-theme.css";

interface Props {
  code: string;
  lang: string;
  showLineNumbers?: boolean;
}

export const CodeView = ({ code, lang, showLineNumbers = true }: Props) => {
  useEffect(() => {
    Prism.highlightAll();
  }, [code]);

  return (
    <pre
      className={`p-2 pb-35 bg-transparent border-none rounded-none text-sm ${
        showLineNumbers ? "line-numbers" : ""
      }`}
    >
      <code className={`language-${lang}`}>{code}</code>
    </pre>
  );
};
