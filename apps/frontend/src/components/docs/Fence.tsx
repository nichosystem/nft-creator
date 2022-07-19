import { Fragment } from "react";
import Code from "../Code";

export function Fence({
  children,
  language,
}: {
  children: string;
  language: string;
}) {
  return <Code content={children.trimEnd()} language={language} />;
}
