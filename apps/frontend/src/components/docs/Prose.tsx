import clsx from "clsx";

export function Prose({
  as: Component = "div",
  className,
  children,
}: {
  as?: React.ElementType;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Component
      className={clsx(
        className,
        "prose prose-invert prose-slate max-w-none text-slate-400",
        // headings
        "prose-headings:scroll-mt-28 prose-headings:font-display prose-headings:font-normal prose-headings:text-slate-100 lg:prose-headings:scroll-mt-[8.5rem]",
        // lead
        "prose-lead:text-slate-400",
        // links
        "prose-a:font-semibold prose-a:text-sky-400",
        // link underline
        "[--tw-prose-background:theme(colors.slate.900)] prose-a:no-underline prose-a:shadow-[inset_0_calc(-1*var(--tw-prose-underline-size,2px))_0_0_var(--tw-prose-underline,theme(colors.sky.800))] hover:prose-a:[--tw-prose-underline-size:6px]",
        // pre
        "prose-pre:rounded-xl prose-pre:bg-slate-800/60 prose-pre:shadow-none prose-pre:ring-1 prose-pre:ring-slate-300/10",
        // hr
        "prose-hr:border-slate-800"
      )}
    >
      {children}
    </Component>
  );
}
