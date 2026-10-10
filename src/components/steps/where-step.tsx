"use client";

import { motion } from "framer-motion";

import { Field, GroupError } from "@/components/field";
import { CheckIcon, MinusIcon, PlusIcon } from "@/components/icons";
import { SceneArt } from "@/components/scenes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DESTINATIONS } from "@/lib/data";
import { cn, todayIso } from "@/lib/utils";
import { useTrip, useTripStore } from "@/store/trip-store";

export function WhereStep() {
  const trip = useTrip();
  const setField = useTripStore((s) => s.setField);
  const errors = useTripStore((s) => s.errors);

  const pickDestination = (id: string) => setField("dest", trip.destinationId === id ? null : id);

  return (
    <div className="flex flex-col gap-5">
      <Field name="name" label="Trip name" htmlFor="trip-name">
        <Input
          id="trip-name"
          value={trip.name}
          onChange={(e) => setField("name", e.target.value)}
          placeholder="Goa with the college gang"
          maxLength={50}
          aria-invalid={Boolean(errors.name)}
        />
      </Field>

      <div role="group" aria-labelledby="destination-label" className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-4">
          <span id="destination-label" className="text-sm font-semibold text-ink">
            Destination
          </span>
          <Input
            id="custom-dest"
            aria-label="Or type another place"
            value={trip.customDestination}
            onChange={(e) => {
              setField("customDest", e.target.value);
              if (e.target.value && trip.destinationId) setField("dest", null);
            }}
            placeholder="Or type another place"
            maxLength={40}
            className="h-10 max-w-56 text-sm"
          />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
          {DESTINATIONS.map((place, i) => {
            const selected = trip.destinationId === place.id;
            return (
              <motion.button
                key={place.id}
                type="button"
                onClick={() => pickDestination(place.id)}
                aria-pressed={selected}
                title={place.tagline}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.04 * i, duration: 0.35 }}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.97 }}
                className={cn(
                  "group relative cursor-pointer overflow-hidden rounded-2xl border-2 bg-white text-left",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-flare",
                  selected ? "border-ink shadow-lg" : "border-line hover:border-ink/50",
                )}
              >
                <div className="h-20 xl:h-16">
                  <SceneArt scene={place.scene} />
                </div>
                <div className="px-3 pb-2.5 pt-2">
                  <div className="font-display text-lg font-bold leading-tight xl:text-base">{place.name}</div>
                  <div className="text-xs text-muted sm:text-[13px] xl:hidden">{place.tagline}</div>
                </div>
                {selected && (
                  <motion.span
                    layoutId="destination-check"
                    className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-ink text-white"
                  >
                    <CheckIcon size={15} />
                  </motion.span>
                )}
              </motion.button>
            );
          })}
        </div>
        <GroupError name="dest" />
      </div>

      {/* Dates and group size share the last row so the step fits on one screen. */}
      <div className="grid gap-5 sm:grid-cols-[1fr_1fr_auto]">
        <Field name="start" label="Leaving on" htmlFor="start-date">
          <Input
            id="start-date"
            type="date"
            min={todayIso()}
            value={trip.start}
            onChange={(e) => setField("start", e.target.value)}
            aria-invalid={Boolean(errors.start)}
          />
        </Field>
        <Field name="end" label="Back on" htmlFor="end-date">
          <Input
            id="end-date"
            type="date"
            min={trip.start || todayIso()}
            value={trip.end}
            onChange={(e) => setField("end", e.target.value)}
            aria-invalid={Boolean(errors.end)}
          />
        </Field>
        <Field name="travellers" label="How many people?">
          <div className="flex h-12 items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              aria-label="One fewer traveller"
              disabled={trip.travellers <= 1}
              onClick={() => setField("travellers", Math.max(1, trip.travellers - 1))}
            >
              <MinusIcon />
            </Button>
            <motion.span
              key={trip.travellers}
              initial={{ y: -8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="w-10 text-center font-display text-3xl font-bold tabular-nums"
              aria-live="polite"
            >
              {trip.travellers}
            </motion.span>
            <Button
              variant="outline"
              size="icon"
              aria-label="One more traveller"
              disabled={trip.travellers >= 20}
              onClick={() => setField("travellers", Math.min(20, trip.travellers + 1))}
            >
              <PlusIcon />
            </Button>
          </div>
        </Field>
      </div>
    </div>
  );
}
