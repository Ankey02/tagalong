"use client";

import { motion } from "framer-motion";
import { useState, type FormEvent } from "react";

import { ArrowRightIcon, CheckIcon, Logo } from "@/components/icons";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SlideRow } from "@/components/ui/slide-row";
import { PERSON_COLORS, PERSON_FACES } from "@/lib/data";
import { cn } from "@/lib/utils";
import { usePeers, useTripStore } from "@/store/trip-store";

/** Shown once per window: pick the name, colour and face your friends will see. */
export function JoinDialog() {
  const join = useTripStore((s) => s.join);
  const suggested = useTripStore((s) => s.suggestedName);
  const taken = usePeers().map((p) => p.color);
  const firstFree = PERSON_COLORS.find((c) => !taken.includes(c)) ?? PERSON_COLORS[0];
  const [name, setName] = useState("");
  const [pickedColor, setPickedColor] = useState<string | null>(null);
  const [face, setFace] = useState("");
  const color = pickedColor ?? firstFree;

  const submit = (event: FormEvent) => {
    event.preventDefault();
    join(name || suggested, color, face || undefined);
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
        <div className="flex items-start justify-between gap-4">
          <Logo size={40} />
          {/* A live preview of the avatar your friends will see. */}
          <motion.div key={color + face} initial={{ scale: 0.7 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500, damping: 18 }}>
            <Avatar name={name || suggested} color={color} face={face || undefined} className={cn("h-14 w-14", face ? "text-3xl" : "text-lg")} />
          </motion.div>
        </div>
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

        <div className="mt-5">
          <div className="text-sm font-semibold">Your colour</div>
          <div className="mt-1">
            <SlideRow label="Your colour">
              {PERSON_COLORS.map((option) => {
                const selected = color === option;
                return (
                  <button
                    key={option}
                    type="button"
                    aria-label={`Colour ${option}`}
                    aria-pressed={selected}
                    onClick={() => setPickedColor(option)}
                    className={cn(
                      "flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full text-white transition-transform hover:scale-110",
                      "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink",
                      selected && "ring-2 ring-ink ring-offset-2",
                    )}
                    style={{ backgroundColor: option }}
                  >
                    {selected && <CheckIcon size={18} />}
                  </button>
                );
              })}
            </SlideRow>
          </div>
        </div>

        <div className="mt-4">
          <div className="text-sm font-semibold">Your face</div>
          <div className="mt-1">
            <SlideRow label="Your face">
              <button
                type="button"
                aria-label="Use my initials"
                aria-pressed={face === ""}
                onClick={() => setFace("")}
                className={cn(
                  "flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full bg-mist text-sm font-bold text-ink transition-transform hover:scale-110",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink",
                  face === "" && "ring-2 ring-ink ring-offset-2",
                )}
              >
                Aa
              </button>
              {PERSON_FACES.map((option) => (
                <button
                  key={option}
                  type="button"
                  aria-label={`Face ${option}`}
                  aria-pressed={face === option}
                  onClick={() => setFace(option)}
                  className={cn(
                    "flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full bg-mist text-2xl leading-none transition-transform hover:scale-110",
                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink",
                    face === option && "ring-2 ring-ink ring-offset-2",
                  )}
                >
                  {option}
                </button>
              ))}
            </SlideRow>
          </div>
        </div>

        <Button type="submit" size="lg" className="mt-7 w-full">
          Start planning
          <ArrowRightIcon />
        </Button>
      </motion.form>
    </motion.div>
  );
}
