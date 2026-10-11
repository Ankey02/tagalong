import { DESTINATIONS, GROUPS, STAYS } from "./data";
import type { Activity, Entries, StayId, Trip, TransportId, Voter } from "./types";
import { addDays, nightsBetween } from "./utils";

function read<T>(entries: Entries, key: string, fallback: T): T {
  const entry = entries[key];
  return entry === undefined || entry.v === null || entry.v === undefined ? fallback : (entry.v as T);
}

/** Turn the flat shared entries into the trip object the screens use. */
export function buildTrip(entries: Entries): Trip {
  const destinationId = read<string | null>(entries, "dest", null);
  const customDestination = read(entries, "customDest", "");
  const destination = DESTINATIONS.find((d) => d.id === destinationId);
  const destinationName = destination?.name ?? customDestination.trim();
  const destinationCode = destination?.code ?? destinationName.replace(/[^a-zA-Z]/g, "").slice(0, 3).toUpperCase();

  const stayVotes: Record<StayId, Voter[]> = { hostel: [], homestay: [], hotel: [], resort: [] };
  const activities: Record<string, Activity> = {};
  const votes: { activityId: string; voter: Voter }[] = [];

  for (const [key, entry] of Object.entries(entries)) {
    if (entry.v === null || entry.v === undefined) continue;
    if (key.startsWith("stay:")) {
      const vote = entry.v as { stay: StayId; name: string; color: string; face?: string };
      if (stayVotes[vote.stay]) stayVotes[vote.stay].push({ id: key.slice(5), name: vote.name, color: vote.color, face: vote.face });
    } else if (key.startsWith("act:")) {
      const value = entry.v as { label: string; by: string };
      activities[key.slice(4)] = { id: key.slice(4), label: value.label, by: value.by, voters: [] };
    } else if (key.startsWith("vote:")) {
      const [, activityId, userId] = key.split(":");
      const value = entry.v as { name: string; color: string; face?: string };
      votes.push({ activityId, voter: { id: userId, name: value.name, color: value.color, face: value.face } });
    }
  }
  for (const { activityId, voter } of votes) activities[activityId]?.voters.push(voter);

  let leadingStay: StayId | null = null;
  for (const stay of STAYS) {
    const count = stayVotes[stay.id].length;
    if (count > 0 && (leadingStay === null || count > stayVotes[leadingStay].length)) leadingStay = stay.id;
  }

  const start = read(entries, "start", "");
  const end = read(entries, "end", "");

  // The budget range follows the destination. A saved budget from a cheaper
  // (or dearer) destination is pulled into the new range.
  const group = GROUPS.find((g) => g.id === destination?.group) ?? GROUPS[0];
  const savedBudget = read<number | null>(entries, "budget", null);
  const budget = Math.min(group.budget.max, Math.max(group.budget.min, savedBudget ?? group.budget.start));

  return {
    name: read(entries, "name", ""),
    destinationId,
    group: group.id,
    customDestination,
    destinationName,
    destinationCode,
    start,
    end,
    nights: Math.max(0, nightsBetween(start, end)),
    travellers: read(entries, "travellers", 4),
    budget,
    budgetMin: group.budget.min,
    budgetMax: group.budget.max,
    budgetStep: group.budget.step,
    priceFactor: group.priceFactor,
    transport: read<TransportId | null>(entries, "transport", null),
    stayVotes,
    leadingStay,
    activities: Object.values(activities).sort(
      (a, b) => b.voters.length - a.voters.length || a.label.localeCompare(b.label),
    ),
    notes: read(entries, "notes", ""),
    confirmed: read<{ by: string; at: number } | null>(entries, "confirmed", null),
  };
}

/** Check one step. Returns a message for each field that still needs fixing. */
export function validateStep(step: number, trip: Trip): Record<string, string> {
  const errors: Record<string, string> = {};
  if (step === 0) {
    if (trip.name.trim().length < 2) errors.name = "Give the trip a name.";
    if (!trip.destinationName) errors.dest = "Pick a place or type your own.";
    if (!trip.start) errors.start = "Choose the day you leave.";
    if (!trip.end) errors.end = "Choose the day you come back.";
    if (trip.start && trip.end) {
      const nights = nightsBetween(trip.start, trip.end);
      if (nights < 1) errors.end = "The return date must be after the start date.";
      else if (nights > 30) errors.end = "Trips can be up to 30 nights long.";
    }
  }
  if (step === 1 && !trip.transport) errors.transport = "Choose how you will travel.";
  if (step === 2 && !trip.leadingStay) errors.stay = "Vote for a place to stay.";
  if (step === 3 && !trip.activities.some((a) => a.voters.length > 0)) {
    errors.activities = "Vote for at least one thing to do.";
  }
  return errors;
}

export type DayPlan = { day: number; date: Date | null; title: string; items: string[] };

/** Spread the voted activities across the days, most popular first. */
export function buildItinerary(trip: Trip): { days: DayPlan[]; extras: string[] } {
  const total = Math.max(2, trip.nights + 1);
  const picks = trip.activities.filter((a) => a.voters.length > 0).map((a) => a.label);
  const days: DayPlan[] = [];
  let next = 0;

  for (let i = 0; i < total; i++) {
    const first = i === 0;
    const last = i === total - 1;
    const slots = last ? 0 : first ? 1 : 2;
    const items: string[] = [];
    if (first) items.push(`Travel to ${trip.destinationName || "the destination"} and check in`);
    for (let s = 0; s < slots && next < picks.length; s++) items.push(picks[next++]);
    if (last) items.push("Pack up and head home");
    else if (!first && items.length === 0) items.push("Free day. Sleep in, wander, eat.");
    days.push({
      day: i + 1,
      date: trip.start ? addDays(trip.start, i) : null,
      title: first ? "Arrival" : last ? "Departure" : `Day ${i + 1}`,
      items,
    });
  }
  return { days, extras: picks.slice(next) };
}

/** Plain text version of the plan, for the Copy button. */
export function planAsText(trip: Trip): string {
  const { days, extras } = buildItinerary(trip);
  const stay = STAYS.find((s) => s.id === trip.leadingStay)?.name ?? "Not decided";
  const lines = [
    trip.name || "Our trip",
    `${trip.destinationName}, ${trip.start} to ${trip.end} (${trip.nights} nights)`,
    `${trip.travellers} travellers, ₹${trip.budget.toLocaleString("en-IN")} each`,
    `Stay: ${stay}. Travel: ${trip.transport ?? "not decided"}.`,
    "",
  ];
  for (const day of days) {
    lines.push(`${day.title}${day.date ? " (" + day.date.toDateString().slice(0, 10) + ")" : ""}`);
    for (const item of day.items) lines.push(`  - ${item}`);
  }
  if (extras.length) lines.push("", "If there is time: " + extras.join(", "));
  if (trip.notes.trim()) lines.push("", "Notes: " + trip.notes.trim());
  return lines.join("\n");
}
