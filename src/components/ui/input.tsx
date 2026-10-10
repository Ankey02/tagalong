import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

const base =
  "w-full rounded-xl border border-line bg-white px-4 text-base text-ink placeholder:text-muted/70 transition-shadow focus:border-ink focus:outline-none focus:ring-4 focus:ring-ink/10 aria-[invalid=true]:border-flare";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(base, "h-12", className)} {...props} />;
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(base, "min-h-24 py-3 leading-relaxed", className)} {...props} />;
}
