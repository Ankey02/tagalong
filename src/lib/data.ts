import type { Destination, GroupId, StayId, TransportId } from "./types";

export const STEPS = [
  { id: "where", short: "Where", title: "Where are we going?", hint: "Pick the place and the dates. Everyone can change these." },
  { id: "budget", short: "Budget", title: "What can we spend?", hint: "Set a budget each person is comfortable with, and how you will get there." },
  { id: "stay", short: "Stay", title: "Where do we sleep?", hint: "One vote each. The option with the most votes goes on the plan." },
  { id: "plans", short: "Plans", title: "What do we do there?", hint: "Vote for what you want to do. Add anything that is missing." },
  { id: "itinerary", short: "Itinerary", title: "Here is the plan", hint: "Check it together, then confirm the trip." },
] as const;

export const DESTINATIONS: Destination[] = [
  {
    id: "goa", group: "india", name: "Goa", code: "GOA", region: "West coast", tagline: "Beaches, scooters and seafood", scene: "beach",
    activities: ["Beach day at Palolem", "Sunset at Chapora Fort", "Old Goa churches walk", "Scooter ride down the coast", "Dudhsagar Falls day trip", "Seafood dinner by the beach", "Kayaking in the backwaters", "Saturday night market"],
  },
  {
    id: "manali", group: "india", name: "Manali", code: "MNL", region: "Himachal Pradesh", tagline: "Pine forests and snow peaks", scene: "mountain",
    activities: ["Day out in Solang Valley", "Old Manali cafe hop", "Hadimba Temple walk", "Jogini Falls hike", "Atal Tunnel and Sissu drive", "River rafting on the Beas", "Bonfire night", "Hot springs at Vashisht"],
  },
  {
    id: "jaipur", group: "india", name: "Jaipur", code: "JAI", region: "Rajasthan", tagline: "Forts, bazaars and pink streets", scene: "fort",
    activities: ["Amber Fort in the morning", "City Palace and Jantar Mantar", "Hawa Mahal at sunrise", "Nahargarh Fort sunset", "Shopping in Johari Bazaar", "Rajasthani thali dinner", "Block printing workshop", "Jal Mahal photo stop"],
  },
  {
    id: "alleppey", group: "india", name: "Alleppey", code: "ALP", region: "Kerala", tagline: "Slow days on the backwaters", scene: "boat",
    activities: ["Houseboat on the backwaters", "Canoe through village canals", "Afternoon at Marari Beach", "Kerala sadya lunch", "Sunset at Alappuzha Beach", "Kathakali show", "Ayurvedic massage", "Toddy shop food trail"],
  },
  {
    id: "ladakh", group: "india", name: "Ladakh", code: "LEH", region: "High Himalaya", tagline: "High passes and blue lakes", scene: "pass",
    activities: ["Overnight at Pangong Lake", "Nubra Valley sand dunes", "Drive over Khardung La", "Thiksey Monastery at dawn", "Leh market and palace", "Magnetic Hill stop", "Rafting on the Zanskar", "Stargazing night"],
  },
  {
    id: "rishikesh", group: "india", name: "Rishikesh", code: "RSK", region: "Uttarakhand", tagline: "River rapids and quiet ghats", scene: "river",
    activities: ["White water rafting", "Ganga aarti at Triveni Ghat", "Sunrise yoga session", "Beatles Ashram visit", "Neer Garh waterfall hike", "Cafe hopping in Tapovan", "Bungee jumping", "Camping by the river"],
  },

  // Asia
  {
    id: "bali", group: "asia", name: "Bali", code: "DPS", region: "Indonesia", tagline: "Temples, rice terraces and surf", scene: "temple",
    activities: ["Sunrise trek up Mount Batur", "Tegalalang rice terraces", "Uluwatu Temple at sunset", "Monkey Forest in Ubud", "Beach day in Seminyak", "Snorkelling at Nusa Penida", "Tanah Lot temple visit", "Balinese cooking class"],
  },
  {
    id: "thailand", group: "asia", name: "Thailand", code: "BKK", region: "Bangkok and the islands", tagline: "Street food and island hopping", scene: "beach",
    activities: ["Grand Palace in Bangkok", "Island hopping from Phuket", "Phi Phi Islands day trip", "Street food tour in Bangkok", "Floating market visit", "Elephant sanctuary in Chiang Mai", "Thai massage", "Night market shopping"],
  },
  {
    id: "dubai", group: "asia", name: "Dubai", code: "DXB", region: "United Arab Emirates", tagline: "Skyscrapers, souks and desert", scene: "city",
    activities: ["Burj Khalifa observation deck", "Desert safari and dune bashing", "Dubai Mall and the fountain show", "Old Dubai souks and abra ride", "Dubai Marina dhow cruise", "Day at Jumeirah Beach", "Palm Jumeirah and Atlantis", "Global Village evening"],
  },
  {
    id: "maldives", group: "asia", name: "Maldives", code: "MLE", region: "Indian Ocean", tagline: "Lagoons and overwater villas", scene: "huts",
    activities: ["Snorkelling on the house reef", "Sunset dolphin cruise", "Sandbank picnic", "Scuba dive with manta rays", "Day trip to a local island", "Overwater dinner", "Kayaking in the lagoon", "Night fishing trip"],
  },
  {
    id: "japan", group: "asia", name: "Japan", code: "TYO", region: "Tokyo and Kyoto", tagline: "Shrines, sushi and bullet trains", scene: "pagoda",
    activities: ["Senso-ji Temple in Asakusa", "Shibuya Crossing and Harajuku", "Day trip to Mount Fuji", "Fushimi Inari shrine in Kyoto", "Sushi breakfast at a fish market", "Bullet train ride", "Nara deer park", "Evening in an onsen"],
  },
  {
    id: "nepal", group: "asia", name: "Nepal", code: "KTM", region: "Kathmandu and Pokhara", tagline: "Himalayan views and old squares", scene: "pass",
    activities: ["Sunrise at Sarangkot in Pokhara", "Boating on Phewa Lake", "Kathmandu Durbar Square", "Boudhanath Stupa", "Mountain flight past Everest", "Short trek to Poon Hill", "Paragliding in Pokhara", "Swayambhunath temple climb"],
  },

  // Europe
  {
    id: "switzerland", group: "europe", name: "Switzerland", code: "ZRH", region: "The Alps", tagline: "Alpine trains and lake towns", scene: "mountain",
    activities: ["Train up to Jungfraujoch", "Day in Interlaken", "Lake Lucerne boat cruise", "Cable car to Mount Titlis", "Zermatt and the Matterhorn", "Chapel Bridge walk in Lucerne", "Rhine Falls visit", "Swiss chocolate and cheese tasting"],
  },
  {
    id: "paris", group: "europe", name: "Paris", code: "PAR", region: "France", tagline: "Museums, cafes and the tower", scene: "tower",
    activities: ["Eiffel Tower at sunset", "Louvre Museum morning", "Seine river cruise", "Montmartre and Sacre-Coeur", "Day trip to Versailles", "Notre-Dame and the Latin Quarter", "Cafe hopping in Le Marais", "Day at Disneyland Paris"],
  },
  {
    id: "rome", group: "europe", name: "Rome", code: "ROM", region: "Italy", tagline: "Ruins, piazzas and pasta", scene: "arches",
    activities: ["Colosseum and Roman Forum", "Vatican Museums and St Peter's", "Trevi Fountain coin toss", "Pantheon and Piazza Navona", "Pasta making class", "Evening in Trastevere", "Day trip to Florence", "Gelato crawl"],
  },
  {
    id: "santorini", group: "europe", name: "Santorini", code: "JTR", region: "Greece", tagline: "White villages and sea sunsets", scene: "domes",
    activities: ["Sunset in Oia", "Caldera boat cruise", "Hike from Fira to Oia", "Red Beach visit", "Wine tasting at a vineyard", "Ancient Akrotiri ruins", "Black sand beach at Perissa", "Greek taverna dinner"],
  },
  {
    id: "london", group: "europe", name: "London", code: "LON", region: "United Kingdom", tagline: "Markets, museums and theatre", scene: "clock",
    activities: ["Tower of London and Tower Bridge", "British Museum morning", "Westminster and Big Ben walk", "Ride on the London Eye", "Borough Market food stop", "West End show", "Day trip to Stonehenge", "Camden Market stroll"],
  },
  {
    id: "iceland", group: "europe", name: "Iceland", code: "KEF", region: "North Atlantic", tagline: "Waterfalls and northern lights", scene: "aurora",
    activities: ["Golden Circle day tour", "Blue Lagoon soak", "Chasing the northern lights", "South coast waterfalls", "Black sand beach at Reynisfjara", "Glacier hike", "Whale watching from Reykjavik", "Jokulsarlon glacier lagoon"],
  },
];

/**
 * The tabs above the destination cards. Trips further from home cost more, so
 * each group has its own budget slider range and a multiplier for stay prices.
 * These are rough planning numbers, not live prices.
 */
export const GROUPS: { id: GroupId; name: string; budget: { min: number; max: number; step: number; start: number }; priceFactor: number }[] = [
  { id: "india", name: "India", budget: { min: 3000, max: 60000, step: 500, start: 15000 }, priceFactor: 1 },
  { id: "asia", name: "Asia", budget: { min: 30000, max: 250000, step: 2500, start: 80000 }, priceFactor: 2.5 },
  { id: "europe", name: "Europe", budget: { min: 80000, max: 500000, step: 5000, start: 180000 }, priceFactor: 5 },
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

/** Twelve avatar colours. All are dark enough for white initials to stay readable. */
export const PERSON_COLORS = [
  "#d8431b", "#0b7a75", "#6d4bd1", "#c2186b", "#1f6fd6", "#8a6100",
  "#2e7d32", "#b45309", "#b71c1c", "#8e24aa", "#0e7490", "#475569",
];

/** Faces for the avatar. Picking none shows the person's initials. */
export const PERSON_FACES = [
  "😀", "😄", "😎", "🤩", "🥳", "😇", "🤠", "🤓", "😜", "🥰",
  "🤗", "😴", "🧐", "😌", "🤪", "😺", "🐼", "🦊", "🐯", "🐵",
];

export const NAME_IDEAS = ["Aarav", "Diya", "Kabir", "Meera", "Rohan", "Sana", "Vikram", "Zoya"];
