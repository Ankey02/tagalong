"use client";

import { AnimatePresence, motion } from "framer-motion";

import { useTripStore } from "@/store/trip-store";

/** Short messages in the corner, mostly "your friend just did something". */
export function Toasts() {
  const toasts = useTripStore((s) => s.toasts);
  return (
    <div className="pointer-events-none fixed bottom-5 left-1/2 z-40 flex w-[min(24rem,calc(100vw-2.5rem))] -translate-x-1/2 flex-col gap-2 sm:left-6 sm:translate-x-0" role="status" aria-live="polite">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, y: 24, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ type: "spring", stiffness: 360, damping: 26 }}
            className="flex items-center gap-3 rounded-2xl bg-ink px-4 py-3 text-sm font-semibold text-white shadow-paper"
          >
            <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: toast.color ?? "var(--color-sun)" }} />
            {toast.text}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
