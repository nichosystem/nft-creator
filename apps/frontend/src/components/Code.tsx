import type {} from "highlight.js";
import hljs from "highlight.js";
// @ts-ignore
import hljsDefineSolidity from "highlightjs-solidity";
import CopyButton from "@/components/button/CopyButton";
hljsDefineSolidity(hljs);

const Code = ({
  content,
  language,
}: {
  content: string;
  language?: string;
}) => {
  const highlighted = language
    ? hljs.highlight(content, { language })
    : hljs.highlightAuto(content);

  return (
    <pre className="relative">
      <div className="absolute right-0 mr-4 mt-1">
        <CopyButton content={content} />
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
