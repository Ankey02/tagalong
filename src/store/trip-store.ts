"use client";

import { useMemo } from "react";
import { create } from "zustand";

import { DESTINATIONS, NAME_IDEAS, STAYS, STEPS } from "@/lib/data";
import { buildTrip, validateStep } from "@/lib/trip";
import type { Entries, Entry, Person, Presence, StayId, Toast } from "@/lib/types";
import { randomId } from "@/lib/utils";

/**
 * How the live collaboration works
 * --------------------------------
 * The whole trip is a flat map of entries: key -> { value, time, author }.
 * Every change is one entry. It is saved, then sent to the other open windows
 * over a BroadcastChannel. A window that receives an entry keeps it only if it
 * is newer than what it already has ("last write wins"). Votes and activities
 * each get their own key, so two people voting at the same moment never
 * overwrite each other.
 *
 * BroadcastChannel reaches tabs and windows of the same browser. To sync
 * between different devices, replace `post` and `channel.onmessage` with a
 * WebSocket. Nothing else in the app needs to change.
 */

type Message =
  | { kind: "ping" }
  | { kind: "hello"; from: Presence }
  | { kind: "state"; from: Presence; entries: Entries }
  | { kind: "patch"; from: Presence; entries: Entries }
  | { kind: "presence"; from: Presence }
  | { kind: "bye"; id: string };

type State = {
  ready: boolean;
  tripId: string;
  me: Person | null;
  suggestedName: string;
  entries: Entries;
  peers: Record<string, Presence>;
  step: number;
  maxStep: number;
  direction: 1 | -1;
  focus: string | null;
  errors: Record<string, string>;
  toasts: Toast[];

  init: () => void;
  join: (name: string, color: string, face?: string) => void;
  setField: (key: string, value: unknown) => void;
  setFocus: (key: string | null) => void;
  voteStay: (stay: StayId) => void;
  toggleActivityVote: (activityId: string) => void;
  addActivity: (label: string) => void;
  removeActivity: (activityId: string) => void;
  confirm: () => void;
  reopen: () => void;
  next: () => boolean;
  back: () => void;
  goTo: (step: number) => void;
  toast: (text: string, color?: string) => void;
  dismissToast: (id: string) => void;
  inviteLink: (asGuest?: boolean) => string;
};

let channel: BroadcastChannel | null = null;

function post(message: Message) {
  try {
    channel?.postMessage(message);
  } catch {
    /* the channel is closed while the page unloads */
  }
}

function storageGet(store: "local" | "session", key: string): string | null {
  try {
    return (store === "local" ? localStorage : sessionStorage).getItem(key);
  } catch {
    return null;
  }
}

function storageSet(store: "local" | "session", key: string, value: string) {
  try {
    (store === "local" ? localStorage : sessionStorage).setItem(key, value);
  } catch {
    /* private mode or storage is full: the app still works without saving */
  }
}

/** Keep whichever entry is newer. Returns the keys that changed. */
function merge(current: Entries, incoming: Entries): { entries: Entries; changed: string[] } {
  const entries = { ...current };
  const changed: string[] = [];
  for (const [key, theirs] of Object.entries(incoming)) {
    const mine = entries[key];
    if (!mine || theirs.t > mine.t || (theirs.t === mine.t && theirs.u > mine.u)) {
      entries[key] = theirs;
      changed.push(key);
    }
  }
  return { entries, changed };
}

/** A short sentence for the toast shown when someone else changes something. */
function describe(key: string, entry: Entry, who: string): string | null {
  if (key.startsWith("stay:") && entry.v) {
    const stay = STAYS.find((s) => s.id === (entry.v as { stay: string }).stay);
    return stay ? `${who} voted for ${stay.name}` : null;
  }
  if (key.startsWith("act:") && entry.v) return `${who} added "${(entry.v as { label: string }).label}"`;
  if (key === "dest" && entry.v) {
    const place = DESTINATIONS.find((d) => d.id === entry.v);
    return place ? `${who} picked ${place.name}` : null;
  }
  if (key === "confirmed") return entry.v ? `${who} confirmed the trip` : `${who} reopened the plan`;
  return null;
}

export const useTripStore = create<State>((set, get) => {
  const presence = (): Presence | null => {
    const { me, step, focus } = get();
    return me ? { ...me, step, focus, seen: Date.now() } : null;
  };

  const announce = () => {
    const from = presence();
    if (from) post({ kind: "presence", from });
  };

  /** Write entries locally, save them, and send them to the other windows. */
  const commit = (changes: Record<string, unknown>) => {
    const { me, entries, tripId } = get();
    if (!me) return;
    const patch: Entries = {};
    for (const [key, value] of Object.entries(changes)) {
      const previous = entries[key]?.t ?? 0;
      patch[key] = { v: value, t: Math.max(Date.now(), previous + 1), u: me.id };
    }
    const nextEntries = { ...entries, ...patch };
    set({ entries: nextEntries });
    storageSet("local", `tagalong:${tripId}`, JSON.stringify(nextEntries));
    const from = presence();
    if (from) post({ kind: "patch", from, entries: patch });
  };

  const seePeer = (peer: Presence) => {
    if (peer.id === get().me?.id) return;
    set((s) => ({ peers: { ...s.peers, [peer.id]: { ...peer, seen: Date.now() } } }));
  };

  const receive = (message: Message) => {
    if (message.kind === "ping") {
      // Someone opened the trip but has not picked a name yet. Show them who is here.
      const from = presence();
      if (from) post({ kind: "state", from, entries: get().entries });
      return;
    }
    if (message.kind === "bye") {
      set((s) => {
        const peers = { ...s.peers };
        delete peers[message.id];
        return { peers };
      });
      return;
    }
    const isNew = !get().peers[message.from.id];
    seePeer(message.from);

    if (message.kind === "hello") {
      const from = presence();
      if (from) post({ kind: "state", from, entries: get().entries });
      if (isNew) get().toast(`${message.from.name} joined`, message.from.color);
    }
    if (message.kind === "state" || message.kind === "patch") {
      const { entries, changed } = merge(get().entries, message.entries);
      if (!changed.length) return;
      set({ entries });
      storageSet("local", `tagalong:${get().tripId}`, JSON.stringify(entries));
      if (message.kind === "patch") {
        for (const key of changed) {
          const text = describe(key, entries[key], message.from.name);
          if (text) {
            get().toast(text, message.from.color);
            break;
          }
        }
      }
    }
  };

  return {
    ready: false,
    tripId: "",
    me: null,
    suggestedName: "",
    entries: {},
    peers: {},
    step: 0,
    maxStep: 0,
    direction: 1,
    focus: null,
    errors: {},
    toasts: [],

    init: () => {
      if (get().ready || typeof window === "undefined") return;

      // The trip id lives in the address, so sharing the link shares the trip.
      const url = new URL(window.location.href);
      let tripId = url.searchParams.get("trip") ?? "";
      const isGuest = url.searchParams.get("guest") === "1";
      if (!tripId) tripId = randomId(6);
      url.searchParams.set("trip", tripId);
      url.searchParams.delete("guest");
      window.history.replaceState(null, "", url.toString());

      let entries: Entries = {};
      try {
        entries = JSON.parse(storageGet("local", `tagalong:${tripId}`) ?? "{}") as Entries;
      } catch {
        entries = {};
      }

      // Each window is its own person, so two windows can act as two friends.
      let me: Person | null = null;
      if (!isGuest) {
        try {
          me = JSON.parse(storageGet("session", "tagalong:me") ?? "null") as Person | null;
        } catch {
          me = null;
        }
      }

      set({
        ready: true,
        tripId,
        entries,
        me,
        suggestedName: NAME_IDEAS[Math.floor(Math.random() * NAME_IDEAS.length)],
      });

      if ("BroadcastChannel" in window) {
        channel = new BroadcastChannel(`tagalong:${tripId}`);
        channel.onmessage = (event: MessageEvent<Message>) => receive(event.data);
      }
      const from = presence();
      post(from ? { kind: "hello", from } : { kind: "ping" });

      // Heartbeat: say "I am still here", and forget people who went quiet.
      window.setInterval(() => {
        announce();
        const cutoff = Date.now() - 7000;
        const peers = Object.fromEntries(Object.entries(get().peers).filter(([, p]) => p.seen > cutoff));
        if (Object.keys(peers).length !== Object.keys(get().peers).length) set({ peers });
      }, 2500);
      window.addEventListener("pagehide", () => {
        const id = get().me?.id;
        if (id) post({ kind: "bye", id });
      });
    },

    join: (name, color, face) => {
      const me: Person = { id: randomId(10), name: name.trim() || get().suggestedName, color, face };
      storageSet("session", "tagalong:me", JSON.stringify(me));
      set({ me });
      const from = presence();
      if (from) post({ kind: "hello", from });
    },

    setField: (key, value) => {
      commit({ [key]: value });
      // Typing your own destination also clears the "pick a place" error.
      const cleared = key === "customDest" ? [key, "dest"] : [key];
      if (cleared.some((k) => get().errors[k])) {
        set((s) => {
          const errors = { ...s.errors };
          for (const k of cleared) delete errors[k];
          return { errors };
        });
      }
    },

    setFocus: (key) => {
      if (get().focus === key) return;
      set({ focus: key });
      announce();
    },

    voteStay: (stay) => {
      const { me, entries } = get();
      if (!me) return;
      const key = `stay:${me.id}`;
      const current = entries[key]?.v as { stay: StayId } | null | undefined;
      commit({ [key]: current?.stay === stay ? null : { stay, name: me.name, color: me.color, face: me.face } });
      set((s) => ({ errors: { ...s.errors, stay: "" } }));
    },

    toggleActivityVote: (activityId) => {
      const { me, entries } = get();
      if (!me) return;
      const key = `vote:${activityId}:${me.id}`;
      commit({ [key]: entries[key]?.v ? null : { name: me.name, color: me.color, face: me.face } });
      set((s) => ({ errors: { ...s.errors, activities: "" } }));
    },

    addActivity: (label) => {
      const { me } = get();
      const text = label.trim().slice(0, 60);
      if (!me || !text) return;
      const id = randomId(6);
      // Whoever adds an idea also votes for it.
      commit({
        [`act:${id}`]: { label: text, by: me.name },
        [`vote:${id}:${me.id}`]: { name: me.name, color: me.color, face: me.face },
      });
      set((s) => ({ errors: { ...s.errors, activities: "" } }));
    },

    removeActivity: (activityId) => commit({ [`act:${activityId}`]: null }),

    confirm: () => {
      const { me } = get();
      if (me) commit({ confirmed: { by: me.name, at: Date.now() } });
    },

    reopen: () => commit({ confirmed: null }),

    next: () => {
      const { step, entries } = get();
      const found = validateStep(step, buildTrip(entries));
      if (Object.keys(found).length) {
        set({ errors: found });
        return false;
      }
      const target = Math.min(step + 1, STEPS.length - 1);
      set((s) => ({ step: target, maxStep: Math.max(s.maxStep, target), direction: 1, errors: {}, focus: null }));
      announce();
      return true;
    },

    back: () => {
      set((s) => ({ step: Math.max(0, s.step - 1), direction: -1, errors: {}, focus: null }));
      announce();
    },

    goTo: (target) => {
      const { step, maxStep } = get();
      if (target === step || target > maxStep) return;
      set({ step: target, direction: target > step ? 1 : -1, errors: {}, focus: null });
      announce();
    },

    toast: (text, color) => {
      const id = randomId(6);
      set((s) => ({ toasts: [...s.toasts.slice(-2), { id, text, color }] }));
      window.setTimeout(() => get().dismissToast(id), 3800);
    },

    dismissToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

    inviteLink: (asGuest = false) => {
      const url = new URL(window.location.href);
      url.searchParams.set("trip", get().tripId);
      if (asGuest) url.searchParams.set("guest", "1");
      return url.toString();
    },
  };
});

/** The trip, rebuilt only when the shared entries change. */
export function useTrip() {
  const entries = useTripStore((s) => s.entries);
  return useMemo(() => buildTrip(entries), [entries]);
}

/** Everyone else who has this trip open, oldest first. */
export function usePeers() {
  const peers = useTripStore((s) => s.peers);
  return useMemo(() => Object.values(peers).sort((a, b) => a.id.localeCompare(b.id)), [peers]);
}

