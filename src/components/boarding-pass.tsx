"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";

import { PlaneIcon } from "@/components/icons";
import { Avatar } from "@/components/ui/avatar";
import { STAYS, TRANSPORTS } from "@/lib/data";
import type { Person, Trip } from "@/lib/types";
import { cn, rupees, shortDate } from "@/lib/utils";

/** A value that slides in whenever it changes, so live edits are easy to spot. */
function Live({ value, className }: { value: string; className?: string }) {
  return (
    <span className={cn("relative inline-flex overflow-hidden", className)}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          initial={{ y: "70%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-70%", opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {value || "···"}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function Cell({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="min-w-0">
      <div className="font-mono text-[11px] uppercase tracking-wider text-muted">{label}</div>
      <div className="truncate font-semibold">{children}</div>
    </div>
  );
}

type BoardingPassProps = {
  trip: Trip;
  crew: Person[];
  /** "side" is the narrow live preview. "full" is the wide pass on the last step. */
  layout?: "side" | "full";
};

export function BoardingPass({ trip, crew, layout = "side" }: BoardingPassProps) {
  const full = layout === "full";
  const stay = STAYS.find((s) => s.id === trip.leadingStay)?.name ?? "";
  const transport = TRANSPORTS.find((t) => t.id === trip.transport)?.name ?? "";

  return (
    <div className={cn("relative flex text-ink drop-shadow-[0_24px_40px_rgba(20,33,61,0.35)]", full ? "flex-col md:flex-row" : "flex-col")}>
      {/* Main part. The two parts have their own rounded corners, which makes the ticket notches. */}
      <div className={cn("min-w-0 flex-1 rounded-3xl bg-white p-5 sm:p-6", full && "md:p-7")}>
        <div className="flex items-center justify-between gap-3">
          <span className="shrink-0 whitespace-nowrap font-mono text-xs font-bold uppercase tracking-[0.2em] text-flare-deep">
            Boarding pass
          </span>
          <span className="min-w-0 truncate text-sm font-semibold text-muted">{trip.name}</span>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <div>
            <div className={cn("font-display font-extrabold leading-none tracking-tight", full ? "text-4xl sm:text-6xl" : "text-3xl")}>
              HOME
            </div>
            <div className="mt-1 text-sm text-muted">Where you start</div>
          </div>
          <div className="relative flex flex-1 items-center">
            <span className="w-full border-t-2 border-dashed border-line" />
            <motion.span
              className="absolute left-1/2 flex h-9 w-9 -translate-x-1/2 items-center justify-center rounded-full bg-ink text-white"
              animate={{ rotate: [40, 50, 40] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <PlaneIcon size={17} />
            </motion.span>
          </div>
          <div className="text-right">
            <div className={cn("font-display font-extrabold leading-none tracking-tight", full ? "text-4xl sm:text-6xl" : "text-3xl")}>
              <Live value={trip.destinationCode} />
            </div>
            <div className="mt-1 text-sm text-muted">
              <Live value={trip.destinationName} />
            </div>
          </div>
        </div>

        <div className={cn("mt-5 grid gap-x-4 gap-y-3", full ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-2")}>
          <Cell label="Leave">
            <Live value={shortDate(trip.start)} />
          </Cell>
          <Cell label="Return">
            <Live value={shortDate(trip.end)} />
          </Cell>
          <Cell label="Nights">
            <Live value={trip.nights ? String(trip.nights) : ""} />
          </Cell>
          <Cell label="Travellers">
            <Live value={String(trip.travellers)} />
          </Cell>
        </div>
      </div>

      {/* Stub */}
      <div
        className={cn(
          "relative rounded-3xl bg-white p-5 sm:p-6",
          full ? "border-t-2 border-dashed border-line md:w-64 md:border-l-2 md:border-t-0 md:p-7" : "border-t-2 border-dashed border-line",
        )}
      >
        <div className={cn("grid gap-x-4 gap-y-3", full ? "grid-cols-3 md:grid-cols-1" : "grid-cols-3")}>
          <Cell label="Each">
            <Live value={rupees(trip.budget)} />
          </Cell>
          <Cell label="Stay">
            <Live value={stay} />
          </Cell>
          <Cell label="Travel">
            <Live value={transport} />
          </Cell>
        </div>
        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="flex -space-x-2">
            <AnimatePresence>
              {crew.map((person) => (
                <motion.span
                  key={person.id}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                >
                  <Avatar name={person.name} color={person.color} face={person.face} size="sm" />
                </motion.span>
              ))}
            </AnimatePresence>
          </div>
          {/* Decorative barcode */}
          <div
            aria-hidden="true"
            className="h-8 w-24 opacity-80"
            style={{
              background:
                "repeating-linear-gradient(90deg, var(--color-ink) 0 2px, transparent 2px 5px, var(--color-ink) 5px 6px, transparent 6px 10px, var(--color-ink) 10px 13px, transparent 13px 15px)",
            }}
          />
        </div>
        {/* The stamp lands on the stub when anyone confirms the trip. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-end pr-4">
          <AnimatePresence>
            {trip.confirmed && (
              <motion.div
                initial={{ scale: 2.6, opacity: 0, rotate: -24 }}
                animate={{ scale: 1, opacity: 1, rotate: -10 }}
                exit={{ scale: 0.6, opacity: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 16 }}
                className="rounded-xl border-4 border-sea px-3 py-1 font-mono text-lg font-bold uppercase tracking-[0.18em] text-sea"
                style={{ backgroundColor: "rgba(255,255,255,0.9)" }}
              >
                Confirmed
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

    </div>
  );
}
