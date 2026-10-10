import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Join class names, letting later Tailwind classes win over earlier ones. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function rupees(amount: number) {
  return "₹" + Math.round(amount).toLocaleString("en-IN");
}

export function randomId(length = 8) {
  const letters = "abcdefghjkmnpqrstuvwxyz23456789";
  let id = "";
  for (let i = 0; i < length; i++) id += letters[Math.floor(Math.random() * letters.length)];
  return id;
}

/** "2026-11-14" -> "14 Nov" */
export function shortDate(iso: string) {
  if (!iso) return "";
  const date = new Date(iso + "T00:00:00");
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export function addDays(iso: string, days: number) {
  const date = new Date(iso + "T00:00:00");
  date.setDate(date.getDate() + days);
  return date;
}

export function nightsBetween(start: string, end: string) {
  if (!start || !end) return 0;
  const a = new Date(start + "T00:00:00").getTime();
  const b = new Date(end + "T00:00:00").getTime();
  if (Number.isNaN(a) || Number.isNaN(b)) return 0;
  return Math.round((b - a) / 86_400_000);
}

export function todayIso() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

export function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  return (parts[0][0] + (parts[1]?.[0] ?? "")).toUpperCase();
}
