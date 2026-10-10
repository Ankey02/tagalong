"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { usePeers, useTripStore } from "@/store/trip-store";

type FieldProps = {
  /** The shared key this field edits. Used to show who else is editing it. */
  name: string;
  label: string;
  htmlFor?: string;
  hint?: string;
  children: ReactNode;
  className?: string;
};

/**
 * Wraps an input with its label, its error message, and a small tag that
 * appears when a friend has the same field focused in their window.
 */
export function Field({ name, label, htmlFor, hint, children, className }: FieldProps) {
  const error = useTripStore((s) => s.errors[name]);
  const setFocus = useTripStore((s) => s.setFocus);
  const editing = usePeers().filter((p) => p.focus === name);
  const editor = editing[0];

  return (
    <div
      className={cn("relative flex flex-col gap-2", className)}
      onFocusCapture={() => setFocus(name)}
      onBlurCapture={() => setFocus(null)}
    >
      <div className="flex min-h-6 items-center justify-between gap-3">
        <Label htmlFor={htmlFor}>{label}</Label>
        <AnimatePresence>
          {editor && (
            <motion.span
              key={editor.id}
              initial={{ opacity: 0, y: 6, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="rounded-full px-2.5 py-0.5 text-xs font-bold text-white"
              style={{ backgroundColor: editor.color }}
            >
              {editor.name} is editing
            </motion.span>
          )}
        </AnimatePresence>
      </div>
      <div
        className="rounded-xl transition-shadow"
        style={editor ? { boxShadow: `0 0 0 3px ${editor.color}` } : undefined}
      >
        {children}
      </div>
      {hint && !error && <p className="text-sm text-muted">{hint}</p>}
      <AnimatePresence>
        {error && (
          <motion.p
            role="alert"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="text-sm font-semibold text-flare"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

/** An error line for groups that are not a single input, like the vote lists. */
export function GroupError({ name }: { name: string }) {
  const error = useTripStore((s) => s.errors[name]);
  return (
    <AnimatePresence>
      {error && (
        <motion.p
          role="alert"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="rounded-xl bg-flare-soft px-4 py-3 text-sm font-semibold text-flare-deep"
        >
          {error}
        </motion.p>
      )}
    </AnimatePresence>
  );
}
