import type {} from "highlight.js";
import hljs from "highlight.js";
// @ts-ignore
import hljsDefineSolidity from "highlightjs-solidity";
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
    <pre>
      <code
        className="hljs rounded-lg max-h-screen"
        dangerouslySetInnerHTML={{
          __html: highlighted.value,
        }}
      />
    </pre>
  );
};

export default Code;
