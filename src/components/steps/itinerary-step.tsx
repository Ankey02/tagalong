"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

import { Field } from "@/components/field";
import { CheckIcon, CopyIcon, PencilIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { buildItinerary, planAsText } from "@/lib/trip";
import { useTrip, useTripStore } from "@/store/trip-store";

export function ItineraryStep() {
  const trip = useTrip();
  const setField = useTripStore((s) => s.setField);
  const confirm = useTripStore((s) => s.confirm);
  const reopen = useTripStore((s) => s.reopen);
  const toast = useTripStore((s) => s.toast);
  const { days, extras } = useMemo(() => buildItinerary(trip), [trip]);

  const copyPlan = async () => {
    try {
      await navigator.clipboard.writeText(planAsText(trip));
      toast("Plan copied. Paste it in your group chat.");
    } catch {
      toast("Could not copy. Select the plan and copy it yourself.");
    }
  };

  return (
    <div className="flex flex-col gap-7">
      <ol className="relative flex flex-col gap-5 before:absolute before:bottom-3 before:left-[19px] before:top-3 before:border-l-2 before:border-dashed before:border-line">
        {days.map((day, i) => (
          <motion.li
            key={day.day}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 + i * 0.07, duration: 0.4 }}
            className="relative flex gap-4"
          >
            <span className="z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink font-display text-sm font-bold text-white">
              {day.day}
            </span>
            <div className="min-w-0 flex-1 pt-1.5">
              <div className="flex flex-wrap items-baseline gap-x-3">
                <h3 className="font-display text-lg font-bold">{day.title}</h3>
                {day.date && (
                  <span className="text-sm text-muted">
                    {day.date.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}
                  </span>
                )}
              </div>
              <ul className="mt-1.5 flex flex-col gap-1">
                {day.items.map((item) => (
                  <li key={item} className="flex gap-2 text-[15px]">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-flare" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </motion.li>
        ))}
      </ol>

      {extras.length > 0 && (
        <p className="rounded-xl bg-mist px-4 py-3 text-sm text-muted">
          <span className="font-semibold text-ink">If there is time:</span> {extras.join(", ")}
        </p>
      )}

      <Field name="notes" label="Notes for the group" htmlFor="notes">
        <Textarea
          id="notes"
          value={trip.notes}
          onChange={(e) => setField("notes", e.target.value)}
          placeholder="Who is booking tickets? Anyone need a window seat?"
          maxLength={400}
        />
      </Field>

      <div className="flex flex-wrap items-center gap-3 border-t border-line pt-6">
        {trip.confirmed ? (
          <>
            <p className="mr-auto flex items-center gap-2 font-semibold text-sea">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-sea text-white">
                <CheckIcon size={15} />
              </span>
              Confirmed by {trip.confirmed.by}. Have a great trip.
            </p>
            <Button variant="outline" onClick={reopen}>
              <PencilIcon size={16} />
              Reopen plan
            </Button>
          </>
        ) : (
          <Button variant="accent" size="lg" className="mr-auto" onClick={confirm}>
            <CheckIcon />
            Confirm trip
          </Button>
        )}
        <Button variant="outline" onClick={copyPlan}>
          <CopyIcon size={16} />
          Copy plan
        </Button>
      </div>
    </div>
  );
}
