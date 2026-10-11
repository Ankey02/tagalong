"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

import { Field, GroupError } from "@/components/field";
import { CheckIcon, MinusIcon, PlusIcon } from "@/components/icons";
import { SceneArt } from "@/components/scenes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DESTINATIONS, GROUPS } from "@/lib/data";
import type { GroupId } from "@/lib/types";
import { cn, todayIso } from "@/lib/utils";
import { useTrip, useTripStore } from "@/store/trip-store";

export function WhereStep() {
  const trip = useTrip();
  const setField = useTripStore((s) => s.setField);
  const errors = useTripStore((s) => s.errors);

  const pickDestination = (id: string) => setField("dest", trip.destinationId === id ? null : id);

  // Which tab of destinations is showing. It follows the chosen destination,
  // so if a friend picks Paris you are taken to the Europe tab.
  const [tab, setTab] = useState<GroupId>(trip.group);
  useEffect(() => {
    if (trip.destinationId) setTab(trip.group);
  }, [trip.destinationId, trip.group]);
  const places = DESTINATIONS.filter((place) => place.group === tab);

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
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <span id="destination-label" className="text-sm font-semibold text-ink">
            Destination
          </span>
          <div role="tablist" aria-label="Region" className="flex rounded-full bg-mist p-1">
            {GROUPS.map((group) => (
              <button
                key={group.id}
                type="button"
                role="tab"
                aria-selected={tab === group.id}
                onClick={() => setTab(group.id)}
                className={cn(
                  "relative min-h-9 cursor-pointer rounded-full px-4 text-sm font-semibold",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-flare",
                  tab === group.id ? "text-white" : "text-muted hover:text-ink",
                )}
              >
                {tab === group.id && (
                  <motion.span
                    layoutId="region-pill"
                    className="absolute inset-0 rounded-full bg-ink"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative">{group.name}</span>
              </button>
            ))}
          </div>
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
            className="ml-auto h-10 max-w-52 text-sm"
          />
        </div>
        <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={tab}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.18 }}
          className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6"
        >
          {places.map((place, i) => {
            const selected = trip.destinationId === place.id;
            return (
              <motion.button
                key={place.id}
                type="button"
                onClick={() => pickDestination(place.id)}
                aria-pressed={selected}
                title={place.tagline}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.03 * i, duration: 0.25 }}
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
                <div className="px-3 pb-2.5 pt-2 xl:px-2.5">
                  <div
                    className={cn(
                      "font-display text-lg font-bold leading-tight xl:whitespace-nowrap xl:text-[15px]",
                      // Long names such as Switzerland get slightly smaller type so they fit the card.
                      place.name.length > 9 && "xl:text-[12.5px] xl:leading-[1.5] xl:tracking-tight",
                    )}
                  >
                    {place.name}
                  </div>
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
        </motion.div>
        </AnimatePresence>
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
