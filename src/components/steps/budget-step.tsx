"use client";

import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect, type CSSProperties } from "react";

import { Field, GroupError } from "@/components/field";
import { CarIcon, CheckIcon, PlaneIcon, TrainIcon } from "@/components/icons";
import { BUDGET_SPLIT, TRANSPORTS } from "@/lib/data";
import type { TransportId } from "@/lib/types";
import { cn, rupees } from "@/lib/utils";
import { useTrip, useTripStore } from "@/store/trip-store";

const TRANSPORT_ICONS: Record<TransportId, typeof PlaneIcon> = { flight: PlaneIcon, train: TrainIcon, road: CarIcon };

/** A number that counts up or down to its new value. */
function CountingRupees({ value }: { value: number }) {
  const amount = useMotionValue(value);
  const text = useTransform(amount, (n) => rupees(n));
  useEffect(() => {
    const controls = animate(amount, value, { duration: 0.35, ease: "easeOut" });
    return () => controls.stop();
  }, [amount, value]);
  return <motion.span>{text}</motion.span>;
}

export function BudgetStep() {
  const trip = useTrip();
  const setField = useTripStore((s) => s.setField);
  const fill = ((trip.budget - trip.budgetMin) / (trip.budgetMax - trip.budgetMin)) * 100;
  const nights = Math.max(1, trip.nights);

  return (
    <div className="flex flex-col gap-5">
      {/* On wide screens the slider and the split sit side by side to save height. */}
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
      <Field name="budget" label="Budget for each person" htmlFor="budget">
        <div className="rounded-2xl bg-mist p-5">
          <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-1">
            <div className="font-display text-5xl font-extrabold tracking-tight tabular-nums">
              <CountingRupees value={trip.budget} />
            </div>
            <div className="pb-1 text-sm text-muted">
              <span className="font-semibold text-ink">{rupees(trip.budget * trip.travellers)}</span> for all{" "}
              {trip.travellers}
            </div>
          </div>
          <input
            id="budget"
            type="range"
            className="range mt-3"
            min={trip.budgetMin}
            max={trip.budgetMax}
            step={trip.budgetStep}
            value={trip.budget}
            onChange={(e) => setField("budget", Number(e.target.value))}
            style={{ "--fill": `${fill}%` } as CSSProperties}
            aria-valuetext={rupees(trip.budget)}
          />
          <div className="flex justify-between text-xs font-medium text-muted">
            <span>{rupees(trip.budgetMin)}</span>
            <span>{rupees(trip.budgetMax)}</span>
          </div>
        </div>
      </Field>

      <section aria-label="How the budget usually splits" className="flex flex-col gap-3 xl:pt-8">
        <h3 className="text-sm font-semibold">A usual split</h3>
        <div className="flex h-4 overflow-hidden rounded-full">
          {BUDGET_SPLIT.map((part, i) => (
            <motion.div
              key={part.id}
              style={{ backgroundColor: part.color }}
              initial={{ width: 0 }}
              animate={{ width: `${part.share * 100}%` }}
              transition={{ delay: 0.1 + i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            />
          ))}
        </div>
        <ul className="grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-4 xl:grid-cols-2">
          {BUDGET_SPLIT.map((part) => (
            <li key={part.id} className="flex items-start gap-2 text-sm">
              <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: part.color }} />
              <span>
                <span className="block text-muted">{part.label}</span>
                <span className="font-semibold tabular-nums">{rupees(trip.budget * part.share)}</span>
              </span>
            </li>
          ))}
        </ul>
        <p className="text-sm text-muted">
          That leaves about{" "}
          <span className="font-semibold text-ink">{rupees((trip.budget * 0.4) / nights)}</span> a night each for a
          place to stay.
        </p>
      </section>
      </div>

      <fieldset className="flex flex-col gap-3">
        <legend className="mb-3 text-sm font-semibold">How are we getting there?</legend>
        <div className="grid gap-3 sm:grid-cols-3">
          {TRANSPORTS.map((option) => {
            const Icon = TRANSPORT_ICONS[option.id];
            const selected = trip.transport === option.id;
            return (
              <motion.button
                key={option.id}
                type="button"
                aria-pressed={selected}
                onClick={() => setField("transport", option.id)}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.97 }}
                className={cn(
                  "relative flex cursor-pointer items-center gap-3 rounded-2xl border-2 p-3.5 text-left",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-flare",
                  selected ? "border-ink bg-ink text-white" : "border-line bg-white hover:border-ink/50",
                )}
              >
                <span
                  className={cn(
                    "flex h-11 w-11 shrink-0 items-center justify-center rounded-full",
                    selected ? "bg-white/15" : "bg-mist",
                  )}
                >
                  <Icon size={22} />
                </span>
                <span>
                  <span className="block font-display text-lg font-bold leading-tight">{option.name}</span>
                  <span className={cn("block text-sm", selected ? "text-white/80" : "text-muted")}>{option.blurb}</span>
                </span>
                {selected && (
                  <motion.span
                    layoutId="transport-check"
                    className="absolute right-2.5 top-2.5 flex h-6 w-6 items-center justify-center rounded-full bg-sun text-ink"
                  >
                    <CheckIcon size={14} />
                  </motion.span>
                )}
              </motion.button>
            );
          })}
        </div>
        <GroupError name="transport" />
      </fieldset>
    </div>
  );
}
