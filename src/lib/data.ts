import type { Destination, StayId, TransportId } from "./types";

export const STEPS = [
  { id: "where", short: "Where", title: "Where are we going?", hint: "Pick the place and the dates. Everyone can change these." },
  { id: "budget", short: "Budget", title: "What can we spend?", hint: "Set a budget each person is comfortable with, and how you will get there." },
  { id: "stay", short: "Stay", title: "Where do we sleep?", hint: "One vote each. The option with the most votes goes on the plan." },
  { id: "plans", short: "Plans", title: "What do we do there?", hint: "Vote for what you want to do. Add anything that is missing." },
  { id: "itinerary", short: "Itinerary", title: "Here is the plan", hint: "Check it together, then confirm the trip." },
] as const;

export const DESTINATIONS: Destination[] = [
  {
    id: "goa", name: "Goa", code: "GOA", region: "West coast", tagline: "Beaches, scooters and seafood", scene: "beach",
    activities: ["Beach day at Palolem", "Sunset at Chapora Fort", "Old Goa churches walk", "Scooter ride down the coast", "Dudhsagar Falls day trip", "Seafood dinner by the beach", "Kayaking in the backwaters", "Saturday night market"],
  },
  {
    id: "manali", name: "Manali", code: "MNL", region: "Himachal Pradesh", tagline: "Pine forests and snow peaks", scene: "mountain",
    activities: ["Day out in Solang Valley", "Old Manali cafe hop", "Hadimba Temple walk", "Jogini Falls hike", "Atal Tunnel and Sissu drive", "River rafting on the Beas", "Bonfire night", "Hot springs at Vashisht"],
  },
  {
    id: "jaipur", name: "Jaipur", code: "JAI", region: "Rajasthan", tagline: "Forts, bazaars and pink streets", scene: "fort",
    activities: ["Amber Fort in the morning", "City Palace and Jantar Mantar", "Hawa Mahal at sunrise", "Nahargarh Fort sunset", "Shopping in Johari Bazaar", "Rajasthani thali dinner", "Block printing workshop", "Jal Mahal photo stop"],
  },
  {
    id: "alleppey", name: "Alleppey", code: "ALP", region: "Kerala", tagline: "Slow days on the backwaters", scene: "boat",
    activities: ["Houseboat on the backwaters", "Canoe through village canals", "Afternoon at Marari Beach", "Kerala sadya lunch", "Sunset at Alappuzha Beach", "Kathakali show", "Ayurvedic massage", "Toddy shop food trail"],
  },
  {
    id: "ladakh", name: "Ladakh", code: "LEH", region: "High Himalaya", tagline: "High passes and blue lakes", scene: "pass",
    activities: ["Overnight at Pangong Lake", "Nubra Valley sand dunes", "Drive over Khardung La", "Thiksey Monastery at dawn", "Leh market and palace", "Magnetic Hill stop", "Rafting on the Zanskar", "Stargazing night"],
  },
  {
    id: "rishikesh", name: "Rishikesh", code: "RSK", region: "Uttarakhand", tagline: "River rapids and quiet ghats", scene: "river",
    activities: ["White water rafting", "Ganga aarti at Triveni Ghat", "Sunrise yoga session", "Beatles Ashram visit", "Neer Garh waterfall hike", "Cafe hopping in Tapovan", "Bungee jumping", "Camping by the river"],
  },
];

export const GENERIC_ACTIVITIES = [
  "Walking tour of the old town", "Local food trail", "Sunrise viewpoint", "Day hike",
  "Museum or heritage site", "Market shopping", "Free day to wander", "Group dinner",
];

/** Rough per person, per night prices. They are a guide, not live prices. */
export const STAYS: { id: StayId; name: string; blurb: string; perNight: number }[] = [
  { id: "hostel", name: "Hostel", blurb: "Bunk beds, common room, new friends", perNight: 800 },
  { id: "homestay", name: "Homestay", blurb: "A local home and home-cooked food", perNight: 1500 },
  { id: "hotel", name: "Hotel", blurb: "Private rooms and room service", perNight: 2800 },
  { id: "resort", name: "Resort", blurb: "Pool, views and nothing to plan", perNight: 5500 },
];

export const TRANSPORTS: { id: TransportId; name: string; blurb: string }[] = [
  { id: "flight", name: "Flight", blurb: "Fast, costs more" },
  { id: "train", name: "Train", blurb: "Cheap and slow" },
  { id: "road", name: "Road trip", blurb: "Your own pace" },
];

/** How the budget is usually split. Used for the coloured bar on the budget step. */
export const BUDGET_SPLIT = [
  { id: "stay", label: "Stay", share: 0.4, color: "var(--color-sea)" },
  { id: "travel", label: "Travel", share: 0.25, color: "var(--color-ink)" },
  { id: "food", label: "Food", share: 0.2, color: "var(--color-flare)" },
  { id: "fun", label: "Activities", share: 0.15, color: "var(--color-sun)" },
] as const;

export const BUDGET_MIN = 3000;
export const BUDGET_MAX = 60000;

export const PERSON_COLORS = ["#d8431b", "#0b7a75", "#6d4bd1", "#c2186b", "#1f6fd6", "#8a6100"];

export const NAME_IDEAS = ["Aarav", "Diya", "Kabir", "Meera", "Rohan", "Sana", "Vikram", "Zoya"];
