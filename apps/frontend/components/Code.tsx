import { useEffect } from "react";
import type {} from "highlight.js";
import hljs from "highlight.js/lib/core";
// @ts-ignore
import hljsDefineSolidity from "highlightjs-solidity";
hljsDefineSolidity(hljs);

const Code = ({ content }: { content: string }) => {
  return (
    <pre>
      <code
        className="hljs"
        dangerouslySetInnerHTML={{
          __html: hljs.highlight(content, { language: "solidity" }).value,
        }}
      />
    </pre>
  );
};

export default Code;
