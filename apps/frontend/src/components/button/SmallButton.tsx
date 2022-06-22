import { ReactNode } from "react";

const SmallButton = ({
  children,
  onClick,
  tooltip,
  className,
}: {
  children: ReactNode;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
  tooltip?: string;
}) => {
  return (
    <button
      className={`inline-flex items-center px-2 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 ${className}`}
      onClick={onClick}
      title={tooltip}
    >
      {children}
    </button>
  );
};

export default SmallButton;
