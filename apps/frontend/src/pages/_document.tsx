import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html
      className="dark antialiased [font-feature-settings:'ss01']"
      lang="en"
      data-theme="dark"
    >
      <Head />
      <body className="bg-slate-900">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
