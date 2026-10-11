"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState, type FormEvent } from "react";

import { GroupError } from "@/components/field";
import { HeartIcon, PlusIcon, TrashIcon } from "@/components/icons";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DESTINATIONS, GENERIC_ACTIVITIES } from "@/lib/data";
import { cn } from "@/lib/utils";
import { useTrip, useTripStore } from "@/store/trip-store";

export function PlansStep() {
  const trip = useTrip();
  const me = useTripStore((s) => s.me);
  const setFocus = useTripStore((s) => s.setFocus);
  const addActivity = useTripStore((s) => s.addActivity);
  const removeActivity = useTripStore((s) => s.removeActivity);
  const toggleVote = useTripStore((s) => s.toggleActivityVote);
  const [draft, setDraft] = useState("");

  // Up to six ideas for this place that nobody has added to the list yet.
  const place = DESTINATIONS.find((d) => d.id === trip.destinationId);
  const taken = new Set(trip.activities.map((a) => a.label.toLowerCase()));
  const ideas = (place?.activities ?? GENERIC_ACTIVITIES).filter((label) => !taken.has(label.toLowerCase())).slice(0, 6);

  useEffect(() => () => setFocus(null), [setFocus]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!draft.trim()) return;
    addActivity(draft);
    setDraft("");
  };

  return (
    <div className="flex flex-col gap-5">
      {ideas.length > 0 && (
        <section aria-label="Ideas" className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold">
            Ideas for {trip.destinationName || "your trip"}. Tap to add one.
          </h3>
          <div className="flex flex-wrap gap-2 xl:flex-nowrap xl:overflow-x-auto xl:pb-1">
            <AnimatePresence mode="popLayout">
              {ideas.map((label) => (
                <motion.button
                  key={label}
                  type="button"
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => addActivity(label)}
                  className="inline-flex min-h-11 shrink-0 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full border border-line bg-white px-4 text-sm font-medium hover:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-flare"
                >
                  <PlusIcon size={15} />
                  {label}
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        </section>
      )}

      <form onSubmit={submit} className="flex gap-2" onFocusCapture={() => setFocus("activities")} onBlurCapture={() => setFocus(null)}>
        <label htmlFor="new-activity" className="sr-only">
          Add your own idea
        </label>
        <Input
          id="new-activity"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Add your own idea"
          maxLength={60}
        />
        <Button type="submit" disabled={!draft.trim()} className="shrink-0">
          Add
        </Button>
      </form>

      <section aria-label="The list" className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold">
          The list{trip.activities.length ? ` (${trip.activities.length})` : ""}
        </h3>
        {trip.activities.length === 0 && (
          <p className="rounded-2xl border-2 border-dashed border-line px-5 py-4 text-center text-muted">
            Nothing here yet. Add an idea from above to start the list.
          </p>
        )}
        <ul className="grid gap-2 xl:max-h-[9.75rem] xl:grid-cols-2 xl:overflow-y-auto xl:pr-1">
          <AnimatePresence initial={false}>
            {trip.activities.map((activity, index) => {
              const mine = activity.voters.some((v) => v.id === me?.id);
              return (
                <motion.li
                  key={activity.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ type: "spring", stiffness: 320, damping: 30 }}
                  className="flex min-w-0 items-center gap-2 rounded-2xl border border-line bg-white p-2 pl-4"
                >
                  <span className="w-6 shrink-0 font-display text-lg font-bold tabular-nums text-muted">
                    {index + 1}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold leading-snug" title={activity.label}>
                      {activity.label}
                    </span>
                    <span className="mt-1 flex items-center gap-2 text-xs text-muted">
                      <span className="flex -space-x-1">
                        {activity.voters.map((voter) => (
                          <Avatar key={voter.id} name={voter.name} color={voter.color} face={voter.face} size="xs" />
                        ))}
                      </span>
                      Added by {activity.by}
                    </span>
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Remove ${activity.label}`}
                    onClick={() => removeActivity(activity.id)}
                    className="text-muted hover:text-flare-deep"
                  >
                    <TrashIcon size={17} />
                  </Button>
                  <motion.button
                    type="button"
                    aria-pressed={mine}
                    aria-label={`${mine ? "Remove your vote for" : "Vote for"} ${activity.label}`}
                    onClick={() => toggleVote(activity.id)}
                    whileTap={{ scale: 0.85 }}
                    className={cn(
                      "flex h-11 min-w-16 shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-full border-2 px-3 font-bold tabular-nums",
                      "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-flare",
                      mine ? "border-flare bg-flare text-white" : "border-line bg-white text-ink hover:border-flare",
                    )}
                  >
                    <motion.span
                      key={String(mine)}
                      initial={{ scale: 0.4 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 12 }}
                      className="flex"
                    >
                      <HeartIcon size={16} filled={mine} />
                    </motion.span>
                    {activity.voters.length}
                  </motion.button>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ul>
        <GroupError name="activities" />
      </section>
    </div>
  );
}
