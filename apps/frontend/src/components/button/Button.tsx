import { MouseEventHandler } from "react";

export default function Button({
  value,
  onClick,
  className,
}: {
  value: string;
  onClick: MouseEventHandler;
  className?: string;
}) {
  return (
    <button
      className={`flex-shrink-0 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-sky-500 hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 ${className}`}
      onClick={onClick}
    >
      {value}
    </button>
  );
}
