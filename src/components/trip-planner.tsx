"use client";

import { AnimatePresence, MotionConfig, motion, useAnimationControls } from "framer-motion";
import { useEffect, useMemo } from "react";

import { BoardingPass } from "@/components/boarding-pass";
import { Header } from "@/components/header";
import { ArrowLeftIcon, ArrowRightIcon } from "@/components/icons";
import { JoinDialog } from "@/components/join-dialog";
import { RouteProgress } from "@/components/route-progress";
import { Sky } from "@/components/sky";
import { BudgetStep } from "@/components/steps/budget-step";
import { ItineraryStep } from "@/components/steps/itinerary-step";
import { PlansStep } from "@/components/steps/plans-step";
import { StayStep } from "@/components/steps/stay-step";
import { WhereStep } from "@/components/steps/where-step";
import { Toasts } from "@/components/toasts";
import { Button } from "@/components/ui/button";
import { STEPS } from "@/lib/data";
import { cn } from "@/lib/utils";
import { usePeers, useTrip, useTripStore } from "@/store/trip-store";

const STEP_VIEWS = [WhereStep, BudgetStep, StayStep, PlansStep, ItineraryStep];

// Steps slide in from the side you are travelling towards.
const slide = {
  enter: (direction: number) => ({ x: direction * 60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction * -60, opacity: 0 }),
};

export function TripPlanner() {
  const ready = useTripStore((s) => s.ready);
  const me = useTripStore((s) => s.me);
  const step = useTripStore((s) => s.step);
  const direction = useTripStore((s) => s.direction);
  const init = useTripStore((s) => s.init);
  const next = useTripStore((s) => s.next);
  const back = useTripStore((s) => s.back);
  const trip = useTrip();
  const peers = usePeers();
  const card = useAnimationControls();

  useEffect(() => init(), [init]);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  const crew = useMemo(() => (me ? [me, ...peers] : peers), [me, peers]);
  const last = step === STEPS.length - 1;
  const onDark = last;
  const info = STEPS[step];
  const StepView = STEP_VIEWS[step];

  const goNext = () => {
    // A quick shake tells you something on this step still needs fixing.
    if (!next()) card.start({ x: [0, -10, 10, -6, 6, 0], transition: { duration: 0.4 } });
  };

  return (
    <MotionConfig reducedMotion="user">
      <Sky step={step} />
      <div className="relative flex min-h-screen flex-col overflow-x-clip">
        <Header onDark={onDark} />
        {ready && <RouteProgress onDark={onDark} />}

        {ready && (
          <main
            className={cn(
              "mx-auto grid w-full gap-8 px-4 pb-6 pt-6 sm:px-8 xl:pt-9",
              last ? "max-w-4xl" : "max-w-6xl lg:grid-cols-[minmax(0,1fr)_21rem]",
            )}
          >
            {last && (
              <motion.div
                initial={{ opacity: 0, y: 30, rotate: -1.5 }}
                animate={{ opacity: 1, y: 0, rotate: 0 }}
                transition={{ type: "spring", stiffness: 140, damping: 18 }}
              >
                <BoardingPass trip={trip} crew={crew} layout="full" />
              </motion.div>
            )}

            <motion.section animate={card} className="min-w-0 rounded-[2rem] bg-white p-6 shadow-paper sm:px-9 sm:py-5">
              <AnimatePresence mode="wait" custom={direction} initial={false}>
                <motion.div
                  key={step}
                  custom={direction}
                  variants={slide}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                >
                  <p className="text-sm font-semibold text-flare-deep">
                    Step {step + 1} of {STEPS.length}
                  </p>
                  <h1 className="mt-1 font-display text-3xl font-extrabold leading-[1.05] tracking-tight sm:text-4xl">
                    {info.title}
                  </h1>
                  <p className="mt-2 max-w-xl text-base text-muted">{info.hint}</p>
                  <div className="mt-6">
                    <StepView />
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="mt-6 flex items-center justify-between gap-3 border-t border-line pt-4">
                <Button variant="ghost" onClick={back} className={cn(step === 0 && "invisible")}>
                  <ArrowLeftIcon />
                  Back
                </Button>
                {!last && (
                  <Button onClick={goNext}>
                    Next: {STEPS[step + 1].short}
                    <ArrowRightIcon />
                  </Button>
                )}
              </div>
            </motion.section>

            {!last && (
              <aside className="hidden lg:block">
                <div className="sticky top-8 flex flex-col gap-4">
                  <motion.div
                    initial={{ opacity: 0, y: 30, rotate: 4 }}
                    animate={{ opacity: 1, y: 0, rotate: 2 }}
                    whileHover={{ rotate: 0, scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 160, damping: 16 }}
                  >
                    <BoardingPass trip={trip} crew={crew} />
                  </motion.div>
                  <p className="px-2 text-center text-sm font-medium text-ink/80">
                    Your pass fills in as the group decides.
                  </p>
                </div>
              </aside>
            )}
          </main>
        )}
      </div>

      <Toasts />
      <AnimatePresence>{ready && !me && <JoinDialog key="join" />}</AnimatePresence>
    </MotionConfig>
  );
}
