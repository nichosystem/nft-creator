import type {} from "highlight.js";
import hljs from "highlight.js";
// @ts-ignore
import hljsDefineSolidity from "highlightjs-solidity";
import CopyButton from "@/components/button/CopyButton";
hljsDefineSolidity(hljs);

const Code = ({
  content,
  children,
  language,
}: {
  content?: string;
  children?: string;
  language?: string;
}) => {
  const code = content || children || "";
  const highlighted = language
    ? hljs.highlight(code, { language })
    : hljs.highlightAuto(code);

  return (
    <pre className="relative">
      <div className="absolute right-0 mr-4 mt-1">
        <CopyButton content={code} />
      </div>
      <code
        className="hljs max-h-screen rounded-lg"
        dangerouslySetInnerHTML={{
          __html: highlighted.value,
        }}
      />
    </pre>
  );
};

export default Code;
