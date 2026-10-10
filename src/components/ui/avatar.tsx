import { cn, initials } from "@/lib/utils";

type AvatarProps = { name: string; color: string; size?: "xs" | "sm" | "md"; label?: string; className?: string };

const sizes = { xs: "h-5 w-5 text-[9px]", sm: "h-7 w-7 text-[11px]", md: "h-10 w-10 text-sm" };

export function Avatar({ name, color, size = "md", label, className }: AvatarProps) {
  return (
    <span
      title={label ?? name}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full font-bold text-white ring-2 ring-white",
        sizes[size],
        className,
      )}
      style={{ backgroundColor: color }}
    >
      {initials(name)}
    </span>
  );
}
