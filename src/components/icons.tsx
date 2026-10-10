import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Icon({ size = 18, children, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export const PlaneIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.500 1.500L13 8 4.800 6.200c-.5-.1-.9.1-1.100.5l-.3.5c-.2.5-.1 1 .3 1.300L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.500 5.300c.3.4.8.5 1.300.3l.5-.2c.4-.3.6-.7.5-1.200z" />
  </Icon>
);
export const TrainIcon = (p: IconProps) => (
  <Icon {...p}>
    <rect x="5" y="3" width="14" height="14" rx="3" />
    <path d="M5 11h14M9 21l2-4M15 21l-2-4M9 14h.01M15 14h.01" />
  </Icon>
);
export const CarIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M5 17H3v-5l2-5h14l2 5v5h-2M5 17a2 2 0 1 0 4 0M5 17a2 2 0 1 1 4 0m0 0h6m0 0a2 2 0 1 0 4 0m-4 0a2 2 0 1 1 4 0M3 12h18" />
  </Icon>
);
export const ArrowRightIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Icon>
);
export const ArrowLeftIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M19 12H5M11 6l-6 6 6 6" />
  </Icon>
);
export const PlusIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 5v14M5 12h14" />
  </Icon>
);
export const MinusIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M5 12h14" />
  </Icon>
);
export const CheckIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M5 12.500l4.500 4.500L19 7" />
  </Icon>
);
export const CloseIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Icon>
);
export const LinkIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M10 14a4 4 0 0 0 5.700 0l3-3a4 4 0 0 0-5.700-5.700l-1 1M14 10a4 4 0 0 0-5.700 0l-3 3a4 4 0 0 0 5.700 5.700l1-1" />
  </Icon>
);
export const CopyIcon = (p: IconProps) => (
  <Icon {...p}>
    <rect x="9" y="9" width="11" height="11" rx="2" />
    <path d="M5 15V6a2 2 0 0 1 2-2h9" />
  </Icon>
);
export const WindowIcon = (p: IconProps) => (
  <Icon {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M3 9h18M13 13h4v3" />
  </Icon>
);
export const UsersIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="9" cy="8" r="3.500" />
    <path d="M2.500 20c.5-3.500 3-5.500 6.500-5.500s6 2 6.500 5.500M16 4.800a3.500 3.500 0 0 1 0 6.400M18.500 14.800c1.700.8 2.700 2.500 3 5.200" />
  </Icon>
);
export const HeartIcon = ({ filled, ...p }: IconProps & { filled?: boolean }) => (
  <Icon {...p} fill={filled ? "currentColor" : "none"}>
    <path d="M12 20s-7-4.400-9-9a4.600 4.600 0 0 1 9-2.500A4.600 4.600 0 0 1 21 11c-2 4.600-9 9-9 9z" />
  </Icon>
);
export const TrashIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4 7h16M10 7V4h4v3M6 7l1 13h10l1-13" />
  </Icon>
);
export const PencilIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4 20h4L19 9l-4-4L4 16zM13.500 6.500l4 4" />
  </Icon>
);

/** The Tagalong mark: a paper plane with a second, smaller one following it. */
export function Logo({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <path d="M29 4 3 13.500l9.500 3.500L29 4z" fill="var(--color-flare)" />
      <path d="M29 4 12.500 17l3 9.500L29 4z" fill="currentColor" />
      <path d="M12.500 17v8l3.200-3.800z" fill="var(--color-sun)" />
      <path d="M11 22.500 3.500 25l3 1.200 1 3.300z" fill="var(--color-sea)" />
    </svg>
  );
}
