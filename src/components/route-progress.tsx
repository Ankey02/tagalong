"use client";

import { motion } from "framer-motion";

import { CheckIcon, PlaneIcon } from "@/components/icons";
import { STEPS } from "@/lib/data";
import { cn } from "@/lib/utils";
import { usePeers, useTripStore } from "@/store/trip-store";

/**
 * The step bar, drawn as a flight route. The plane sits on the current stop
 * and the coloured dots show which stop each friend is on.
 */
export function RouteProgress({ onDark }: { onDark: boolean }) {
  const step = useTripStore((s) => s.step);
  const maxStep = useTripStore((s) => s.maxStep);
  const goTo = useTripStore((s) => s.goTo);
  const peers = usePeers();
  const progress = (step / (STEPS.length - 1)) * 100;

  return (
    <nav aria-label="Steps" className="relative mx-auto w-full max-w-3xl px-5 sm:px-6 xl:absolute xl:left-1/2 xl:top-3 xl:max-w-xl xl:-translate-x-1/2">
      {/* The dashed route and the solid part already travelled. */}
      <div className="absolute left-[calc(1.25rem+22px)] right-[calc(1.25rem+22px)] top-[21px] sm:left-[calc(1.5rem+22px)] sm:right-[calc(1.5rem+22px)]">
        <div className={cn("border-t-2 border-dashed", onDark ? "border-white/40" : "border-ink/30")} />
        <motion.div
          className={cn("absolute left-0 top-0 h-0.5", onDark ? "bg-white" : "bg-ink")}
          initial={false}
          animate={{ width: `${progress}%` }}
          transition={{ type: "spring", stiffness: 90, damping: 20 }}
        />
      </div>

      <ol className="relative flex justify-between">
        {STEPS.map((item, i) => {
          const current = i === step;
          const done = i < step;
          const reachable = i <= maxStep;
          const here = peers.filter((p) => p.step === i);
          return (
            <li key={item.id} className="flex w-11 flex-col items-center gap-1.5">
              <button
                type="button"
                onClick={() => goTo(i)}
                disabled={!reachable}
                aria-current={current ? "step" : undefined}
                aria-label={`Step ${i + 1}: ${item.short}`}
                className={cn(
                  "relative flex h-11 w-11 items-center justify-center rounded-full border-2 text-sm font-bold transition-colors",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-flare",
                  done && (onDark ? "border-white bg-white text-ink" : "border-ink bg-ink text-white"),
                  !done && (onDark ? "border-white/60 bg-[#2a2a5c] text-white" : "border-ink/40 bg-white text-ink"),
                  reachable ? "cursor-pointer" : "cursor-default",
                )}
              >
                {done ? <CheckIcon size={18} /> : i + 1}
                {current && (
                  <motion.span
                    layoutId="plane"
                    className="absolute inset-[-2px] flex items-center justify-center rounded-full bg-flare text-white shadow-lg"
                    transition={{ type: "spring", stiffness: 260, damping: 24 }}
                  >
                    <PlaneIcon size={20} />
                  </motion.span>
                )}
              </button>
              <span
                className={cn(
                  "text-xs font-semibold sm:text-sm",
                  onDark ? "text-white" : "text-ink",
                  !current && "opacity-70",
                )}
              >
                {item.short}
              </span>
              <span className="flex h-3 gap-0.5" aria-hidden="true">
                {here.map((p) => (
                  <motion.span
                    key={p.id}
                    layoutId={`dot-${p.id}`}
                    title={`${p.name} is here`}
                    className="h-2.5 w-2.5 rounded-full ring-2 ring-white"
                    style={{ backgroundColor: p.color }}
                  />
                ))}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
