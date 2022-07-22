import { useId } from "react";
import clsx from "clsx";

import { InstallationIcon } from "@/components/icons/InstallationIcon";
import { LightbulbIcon } from "@/components/icons/LightbulbIcon";
import { PluginsIcon } from "@/components/icons/PluginsIcon";
import { PresetsIcon } from "@/components/icons/PresetsIcon";
import { ThemingIcon } from "@/components/icons/ThemingIcon";
import { WarningIcon } from "@/components/icons/WarningIcon";

const icons: any = {
  installation: InstallationIcon,
  presets: PresetsIcon,
  plugins: PluginsIcon,
  theming: ThemingIcon,
  lightbulb: LightbulbIcon,
  warning: WarningIcon,
};

const iconStyles: any = {
  blue: "[--icon-foreground:theme(colors.slate.900)] [--icon-background:theme(colors.white)]",
  amber:
    "[--icon-foreground:theme(colors.amber.900)] [--icon-background:theme(colors.amber.100)]",
};

export function Icon({
  color = "blue",
  icon,
  className,
  ...props
}: {
  color?: any;
  icon: any;
  className: string;
}) {
  let id = useId();
  let IconComponent = icons[icon];

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 32 32"
      fill="none"
      className={clsx(className, iconStyles[color])}
      {...props}
    >
      <IconComponent id={id} color={color} />
    </svg>
  );
}

const gradients: any = {
  blue: [
    { stopColor: "#0EA5E9" },
    { stopColor: "#22D3EE", offset: ".527" },
    { stopColor: "#818CF8", offset: 1 },
  ],
  amber: [
    { stopColor: "#FDE68A", offset: ".08" },
    { stopColor: "#F59E0B", offset: ".837" },
  ],
};

export function Gradient({ color = "blue", ...props }) {
  return (
    <radialGradient
      cx={0}
      cy={0}
      r={1}
      gradientUnits="userSpaceOnUse"
      {...props}
    >
      {gradients[color].map((stop: any, stopIndex: number) => (
        <stop key={stopIndex} {...stop} />
      ))}
    </radialGradient>
  );
}

export function DarkMode({
  className,
  children,
  ...props
}: {
  className?: string;
  children: React.ReactNode;
  [key: string]: any;
}) {
  return (
    <g className={className} {...props}>
      {children}
    </g>
  );
}
