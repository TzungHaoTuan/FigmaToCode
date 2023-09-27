import { useEffect, useRef } from "react";

import hljs from "highlight.js/lib/core";
import html from "highlight.js/lib/languages/xml";
hljs.registerLanguage("html", html);
import "highlight.js/styles/tokyo-night-dark.css";

interface HighLightProps {
  frameChildren: string | null;
}
export default function HighLight({ frameChildren }: HighLightProps) {
  const codeRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    console.log("frameChildren changed");
    if (codeRef.current && frameChildren) {
      // Remove the highlighted code elements added by highlight.js
      codeRef.current.textContent = "";

      // Re-add the original code as a text node
      codeRef.current.appendChild(document.createTextNode(frameChildren));

      // Re-apply syntax highlighting
      hljs.highlightElement(codeRef.current);
    }
  }, [frameChildren]);
  return (
    <pre ref={codeRef}>
      <code className="language-html">{frameChildren}</code>
    </pre>
  );
}
