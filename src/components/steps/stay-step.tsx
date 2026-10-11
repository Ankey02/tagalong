"use client";

import { AnimatePresence, motion } from "framer-motion";

import { GroupError } from "@/components/field";
import { CheckIcon } from "@/components/icons";
import { Avatar } from "@/components/ui/avatar";
import { STAYS } from "@/lib/data";
import { cn, rupees } from "@/lib/utils";
import { useTrip, useTripStore } from "@/store/trip-store";

export function StayStep() {
  const trip = useTrip();
  const me = useTripStore((s) => s.me);
  const voteStay = useTripStore((s) => s.voteStay);

  const perNight = (trip.budget * 0.4) / Math.max(1, trip.nights);
  const totalVotes = STAYS.reduce((sum, stay) => sum + trip.stayVotes[stay.id].length, 0);

  return (
    <div className="flex flex-col gap-4">
      <p className="rounded-xl bg-mist px-4 py-3 text-sm text-muted">
        Your budget leaves about <span className="font-semibold text-ink">{rupees(perNight)}</span> a night each.
        Prices below are a rough guide.
      </p>

      <ul className="grid gap-3 xl:grid-cols-2">
        {STAYS.map((stay) => {
          const voters = trip.stayVotes[stay.id];
          const mine = voters.some((v) => v.id === me?.id);
          const leading = trip.leadingStay === stay.id;
          const share = totalVotes ? (voters.length / totalVotes) * 100 : 0;
          const price = stay.perNight * trip.priceFactor;
          const over = price - perNight;
          return (
            <motion.li key={stay.id}>
              <motion.button
                type="button"
                aria-pressed={mine}
                onClick={() => voteStay(stay.id)}
                whileTap={{ scale: 0.985 }}
                className={cn(
                  "relative block h-full w-full cursor-pointer overflow-hidden rounded-2xl border-2 bg-white p-4 text-left",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-flare",
                  mine ? "border-ink" : "border-line hover:border-ink/50",
                )}
              >
                {/* The bar behind the row grows with the share of votes. */}
                <motion.span
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 bg-sea-soft"
                  initial={false}
                  animate={{ width: `${share}%` }}
                  transition={{ type: "spring", stiffness: 120, damping: 22 }}
                />
                <span className="relative flex items-center gap-4">
                  <span
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2",
                      mine ? "border-ink bg-ink text-white" : "border-line bg-white text-transparent",
                    )}
                  >
                    <CheckIcon size={16} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="font-display text-xl font-bold">{stay.name}</span>
                      <AnimatePresence>
                        {leading && (
                          <motion.span
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            className="rounded-full bg-sun px-2.5 py-0.5 text-xs font-bold text-ink"
                          >
                            Leading
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </span>
                    <span className="block text-sm text-muted">{stay.blurb}</span>
                    <span className="mt-1 block text-sm">
                      <span className="font-semibold tabular-nums">{rupees(price)}</span>
                      <span className="text-muted"> a night each. </span>
                      <span className={cn("font-semibold", over > 0 ? "text-flare-deep" : "text-sea")}>
                        {over > 0 ? `${rupees(over)} over budget` : "Fits the budget"}
                      </span>
                    </span>
                  </span>
                  <span className="flex shrink-0 flex-col items-end gap-1.5">
                    <span className="font-display text-2xl font-bold tabular-nums">{voters.length}</span>
                    <span className="flex -space-x-1.5">
                      <AnimatePresence>
                        {voters.map((voter) => (
                          <motion.span
                            key={voter.id}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            transition={{ type: "spring", stiffness: 400, damping: 18 }}
                          >
                            <Avatar name={voter.name} color={voter.color} size="sm" />
                          </motion.span>
                        ))}
                      </AnimatePresence>
                    </span>
                  </span>
                </span>
              </motion.button>
            </motion.li>
          );
        })}
      </ul>
      <GroupError name="stay" />
    </div>
  );
}
