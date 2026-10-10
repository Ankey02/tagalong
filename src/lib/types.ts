export type Person = { id: string; name: string; color: string };

/** A person who has the trip open right now, and what they are doing. */
export type Presence = Person & { step: number; focus: string | null; seen: number };

/**
 * One shared value. `t` is the time it was written and `u` is who wrote it.
 * When two people change the same thing, the newer `t` wins.
 */
export type Entry = { v: unknown; t: number; u: string };
export type Entries = Record<string, Entry>;

export type TransportId = "flight" | "train" | "road";
export type StayId = "hostel" | "homestay" | "hotel" | "resort";
export type Scene = "beach" | "mountain" | "fort" | "boat" | "river" | "pass";

export type Destination = {
  id: string;
  name: string;
  code: string;
  region: string;
  tagline: string;
  scene: Scene;
  activities: string[];
};

export type Voter = { id: string; name: string; color: string };

export type Activity = { id: string; label: string; by: string; voters: Voter[] };

/** The trip as the screens read it, built from the shared entries. */
export type Trip = {
  name: string;
  destinationId: string | null;
  customDestination: string;
  destinationName: string;
  destinationCode: string;
  start: string;
  end: string;
  nights: number;
  travellers: number;
  budget: number;
  transport: TransportId | null;
  stayVotes: Record<StayId, Voter[]>;
  leadingStay: StayId | null;
  activities: Activity[];
  notes: string;
  confirmed: { by: string; at: number } | null;
};

export type Toast = { id: string; text: string; color?: string };
