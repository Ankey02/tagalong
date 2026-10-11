"use client";

import { motion } from "framer-motion";
import { useState, type FormEvent } from "react";

import { ArrowRightIcon, CheckIcon, Logo } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PERSON_COLORS } from "@/lib/data";
import { usePeers, useTripStore } from "@/store/trip-store";

/** Shown once per window: pick the name and colour your friends will see. */
export function JoinDialog() {
  const join = useTripStore((s) => s.join);
  const suggested = useTripStore((s) => s.suggestedName);
  const taken = usePeers().map((p) => p.color);
  const firstFree = PERSON_COLORS.find((c) => !taken.includes(c)) ?? PERSON_COLORS[0];
  const [name, setName] = useState("");
  const [color, setColor] = useState<string | null>(null);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    join(name || suggested, color ?? firstFree);
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/55 p-5 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.form
        role="dialog"
        aria-modal="true"
        aria-labelledby="join-title"
        onSubmit={submit}
        initial={{ y: 40, opacity: 0, rotate: -2 }}
        animate={{ y: 0, opacity: 1, rotate: 0 }}
        exit={{ y: 30, opacity: 0 }}
        transition={{ type: "spring", stiffness: 240, damping: 22 }}
        className="w-full max-w-md rounded-3xl bg-white p-7 text-ink shadow-paper sm:p-8"
      >
        <Logo size={40} />
        <h2 id="join-title" className="mt-4 font-display text-3xl font-extrabold leading-tight tracking-tight">
          Plan a trip together
        </h2>
        <p className="mt-2 text-muted">
          Everyone on this link edits the same plan and sees changes as they happen. What should we call you?
        </p>

        <div className="mt-6 flex flex-col gap-2">
          <Label htmlFor="join-name">Your name</Label>
          <Input
            id="join-name"
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={suggested}
            maxLength={20}
            autoComplete="given-name"
          />
        </div>

        <fieldset className="mt-5">
          <legend className="text-sm font-semibold">Your colour</legend>
          <div className="mt-2 grid w-fit grid-cols-6 gap-2">
            {PERSON_COLORS.map((option) => {
              const selected = (color ?? firstFree) === option;
              return (
                <button
                  key={option}
                  type="button"
                  aria-label={`Colour ${option}`}
                  aria-pressed={selected}
                  onClick={() => setColor(option)}
                  className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-white transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
                  style={{ backgroundColor: option }}
                >
                  {selected && <CheckIcon size={18} />}
                </button>
              );
            })}
          </div>
        </fieldset>

        <Button type="submit" size="lg" className="mt-7 w-full">
          Start planning
          <ArrowRightIcon />
        </Button>
      </motion.form>
    </motion.div>
  );
}
