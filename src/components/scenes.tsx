import type { Scene } from "@/lib/types";

/** Small flat illustrations for the destination cards. One per kind of place. */
export function SceneArt({ scene }: { scene: Scene }) {
  const common = { viewBox: "0 0 200 110", preserveAspectRatio: "xMidYMid slice", className: "h-full w-full", "aria-hidden": true } as const;

  if (scene === "beach") {
    return (
      <svg {...common}>
        <rect width="200" height="110" fill="#ffd9a0" />
        <circle cx="150" cy="36" r="20" fill="#ff8a4c" />
        <rect y="58" width="200" height="30" fill="#2aa7b8" />
        <path d="M0 66 q25 -8 50 0 t50 0 t50 0 t50 0 v10 H0z" fill="#7fd3dc" opacity="0.7" />
        <path d="M0 84 q50 -14 100 0 t100 0 V110 H0z" fill="#f6c27a" />
        <path d="M46 88 C50 62 52 50 56 38" stroke="#6b4a2b" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M56 38 q-22 -8 -32 6 q16 -4 32 -6 q8 -18 28 -12 q-16 2 -28 12 q20 -6 30 8 q-14 -6 -30 -8 q-6 12 -20 16 q8 -8 20 -16" fill="#2f8f5b" />
      </svg>
    );
  }
  if (scene === "mountain" || scene === "pass") {
    const pass = scene === "pass";
    return (
      <svg {...common}>
        <rect width="200" height="110" fill={pass ? "#bfe0ff" : "#cdeaf5"} />
        <circle cx="42" cy="28" r="14" fill="#fff3c4" />
        <path d="M-10 110 L60 30 L110 110z" fill={pass ? "#a98a6d" : "#5d8a78"} />
        <path d="M60 110 L135 18 L210 110z" fill={pass ? "#8a6b52" : "#3f6f5f"} />
        <path d="M135 18 L118 39 l10 -4 l8 8 l8 -8 l9 5z" fill="#ffffff" />
        <path d="M60 30 L48 44 l8 -3 l6 6 l7 -6 l6 3z" fill="#ffffff" />
        {pass ? (
          <path d="M0 96 q60 -18 110 -4 t90 -6 V110 H0z" fill="#3d7fc4" />
        ) : (
          <>
            <path d="M20 110 l8 -22 l8 22z M36 110 l7 -18 l7 18z M160 110 l8 -24 l8 24z" fill="#234f43" />
          </>
        )}
      </svg>
    );
  }
  if (scene === "fort") {
    return (
      <svg {...common}>
        <rect width="200" height="110" fill="#ffd3b0" />
        <circle cx="160" cy="30" r="16" fill="#ff9d5c" />
        <rect y="88" width="200" height="22" fill="#c98a5a" />
        <path d="M24 88 V46 h10 v-8 h10 v8 h10 v-8 h10 v8 h10 V88z" fill="#e2725b" />
        <path d="M84 88 V34 h8 v-8 h8 v8 h8 v-8 h8 v8 h8 V88z" fill="#d95f4a" />
        <path d="M134 88 V52 h8 v-8 h8 v8 h8 v-8 h8 v8 h8 V88z" fill="#e2725b" />
        <path d="M96 88 V66 a8 8 0 0 1 16 0 V88z M40 88 V70 a6 6 0 0 1 12 0 V88z M148 88 V72 a6 6 0 0 1 12 0 V88z" fill="#7a2e22" />
      </svg>
    );
  }
  if (scene === "boat") {
    return (
      <svg {...common}>
        <rect width="200" height="110" fill="#d6f2e4" />
        <path d="M0 52 q30 -20 60 -6 t60 -4 t80 -8 V70 H0z" fill="#3f9b6c" />
        <rect y="64" width="200" height="46" fill="#3aa6a0" />
        <path d="M0 78 q25 -6 50 0 t50 0 t50 0 t50 0" stroke="#bfeee8" strokeWidth="2" fill="none" opacity="0.8" />
        <path d="M52 78 h96 l-12 14 H64z" fill="#6b4a2b" />
        <path d="M66 78 q34 -34 68 0z" fill="#e9c98a" />
        <path d="M78 78 q22 -20 44 0" stroke="#b8935a" strokeWidth="2" fill="none" />
        <path d="M166 64 V34 M166 36 q-12 -6 -18 4 M166 36 q12 -6 18 4 M166 40 q-10 0 -14 10 M166 40 q10 0 14 10" stroke="#256b48" strokeWidth="3" fill="none" strokeLinecap="round" />
      </svg>
    );
  }
  if (scene === "temple") {
    // A Balinese split gate in front of rice terraces.
    return (
      <svg {...common}>
        <rect width="200" height="110" fill="#ffe2b8" />
        <circle cx="158" cy="30" r="15" fill="#ff9d5c" />
        <path d="M0 74 q50 -16 100 -4 t100 -6 V110 H0z" fill="#7dbb6a" />
        <path d="M0 88 q60 -12 110 -2 t90 -4 V110 H0z" fill="#4f9d58" />
        <path d="M92 96 V22 h-6 v10 h-6 v12 h-6 v14 h-6 V96z" fill="#b5532e" />
        <path d="M108 96 V22 h6 v10 h6 v12 h6 v14 h6 V96z" fill="#b5532e" />
        <path d="M86 22 h6 v-6z M114 22 h-6 v-6z" fill="#7a2e22" />
        <rect x="62" y="94" width="76" height="6" rx="2" fill="#8a3d22" />
        <path d="M30 96 C33 76 35 66 38 56" stroke="#6b4a2b" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M38 56 q-16 -6 -22 6 q12 -4 22 -6 q6 -14 20 -8 q-12 2 -20 8 q14 -2 20 10 q-10 -8 -20 -10" fill="#2f8f5b" />
      </svg>
    );
  }
  if (scene === "city") {
    // A skyline with one very tall tower, at dusk.
    return (
      <svg {...common}>
        <rect width="200" height="110" fill="#ffc98f" />
        <circle cx="46" cy="52" r="18" fill="#ff8a4c" />
        <path d="M118 90 L122 10 L126 90z" fill="#27335f" />
        <path d="M12 90 V58 h14 V90z M30 90 V44 h12 V90z M46 90 V62 h16 V90z M66 90 V36 h14 V90z M84 90 V54 h12 V90z M100 90 V46 h12 V90z M132 90 V50 h14 V90z M150 90 V34 h12 V90z M166 90 V60 h20 V90z" fill="#3a4a85" />
        <path d="M34 50 h4 v4 h-4z M70 44 h6 v4 h-6z M70 54 h6 v4 h-6z M154 42 h4 v4 h-4z M154 52 h4 v4 h-4z M104 54 h4 v4 h-4z M136 58 h6 v4 h-6z" fill="#ffe17a" />
        <rect y="90" width="200" height="20" fill="#2a6fc9" />
        <path d="M0 98 q25 -4 50 0 t50 0 t50 0 t50 0" stroke="#9cc7f5" strokeWidth="2" fill="none" opacity="0.7" />
      </svg>
    );
  }
  if (scene === "huts") {
    // Overwater villas on a lagoon.
    return (
      <svg {...common}>
        <rect width="200" height="110" fill="#c9eefa" />
        <circle cx="160" cy="26" r="13" fill="#fff3c4" />
        <rect y="52" width="200" height="58" fill="#1fb5bd" />
        <path d="M0 62 q25 -6 50 0 t50 0 t50 0 t50 0 V110 H0z" fill="#5fd6d2" opacity="0.7" />
        <path d="M0 80 H200" stroke="#8a5a2b" strokeWidth="3" />
        {[36, 92, 148].map((x) => (
          <g key={x}>
            <path d={`M${x - 2} 80 v14 M${x + 22} 80 v14`} stroke="#6b4a2b" strokeWidth="2.5" />
            <rect x={x - 6} y="64" width="32" height="16" fill="#f3e2c0" />
            <path d={`M${x - 12} 66 L${x + 10} 44 L${x + 32} 66z`} fill="#a8743a" />
            <rect x={x + 6} y="70" width="8" height="10" fill="#6b4a2b" />
          </g>
        ))}
      </svg>
    );
  }
  if (scene === "pagoda") {
    // A red pagoda with a snow-capped volcano behind it.
    return (
      <svg {...common}>
        <rect width="200" height="110" fill="#ffe4e1" />
        <circle cx="40" cy="30" r="14" fill="#e5484d" />
        <path d="M70 110 L140 30 L210 110z" fill="#7f93c7" />
        <path d="M140 30 L122 51 l9 -4 l9 7 l9 -7 l9 4z" fill="#ffffff" />
        <rect y="92" width="200" height="18" fill="#7dbb6a" />
        <rect x="62" y="80" width="26" height="14" fill="#7a2e22" />
        <rect x="66" y="60" width="18" height="12" fill="#7a2e22" />
        <rect x="69" y="43" width="12" height="10" fill="#7a2e22" />
        <path d="M50 82 q25 -12 50 0 l-6 -9 h-38z M56 62 q19 -10 38 0 l-5 -8 h-28z M61 45 q14 -8 28 0 l-6 -9 h-16z" fill="#d8431b" />
        <path d="M75 36 v-10" stroke="#7a2e22" strokeWidth="2" strokeLinecap="round" />
        <circle cx="22" cy="78" r="9" fill="#f9a8c0" />
        <circle cx="33" cy="72" r="8" fill="#f7bdd0" />
        <path d="M26 92 V78" stroke="#6b4a2b" strokeWidth="3" strokeLinecap="round" />
      </svg>
    );
  }
  if (scene === "tower") {
    // An iron lattice tower over a river.
    return (
      <svg {...common}>
        <rect width="200" height="110" fill="#e3dcfa" />
        <circle cx="156" cy="30" r="14" fill="#ffd9a0" />
        <path d="M100 8 L94 46 L84 72 L70 96 H82 L92 80 Q100 70 108 80 L118 96 H130 L116 72 L106 46z" fill="#4a4a6a" />
        <path d="M92 46 h16 M86 70 h28" stroke="#e3dcfa" strokeWidth="3" />
        <rect y="94" width="200" height="16" fill="#6fa8dc" />
        <path d="M0 94 H200" stroke="#3f6f9f" strokeWidth="2" />
        <circle cx="30" cy="84" r="10" fill="#5fa870" />
        <circle cx="44" cy="86" r="8" fill="#4f9d58" />
        <circle cx="168" cy="85" r="9" fill="#5fa870" />
      </svg>
    );
  }
  if (scene === "arches") {
    // A Roman amphitheatre.
    return (
      <svg {...common}>
        <rect width="200" height="110" fill="#ffe0b5" />
        <circle cx="164" cy="26" r="14" fill="#ff9d5c" />
        <path d="M26 94 V50 q74 -26 148 0 V94z" fill="#d9a066" />
        <path d="M26 50 q74 -26 148 0 v6 q-74 -26 -148 0z" fill="#b97d43" />
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <g key={i} fill="#7a4a21">
            <rect x={38 + i * 19} y="56" width="10" height="13" rx="5" />
            <rect x={38 + i * 19} y="76" width="10" height="18" rx="5" />
          </g>
        ))}
        <rect y="94" width="200" height="16" fill="#c98a5a" />
      </svg>
    );
  }
  if (scene === "domes") {
    // White houses and blue domes above the sea.
    return (
      <svg {...common}>
        <rect width="200" height="110" fill="#bfe3ff" />
        <circle cx="34" cy="32" r="14" fill="#ffd35c" />
        <rect y="70" width="200" height="40" fill="#2a6fc9" />
        <path d="M0 80 q25 -5 50 0 t50 0 t50 0 t50 0" stroke="#8fc0ff" strokeWidth="2" fill="none" opacity="0.7" />
        <path d="M70 110 V70 h24 V58 h26 V44 h30 V60 h24 V76 h26 V110z" fill="#ffffff" />
        <path d="M120 44 a15 15 0 0 1 30 0z M94 58 a13 13 0 0 1 26 0z" fill="#1f5fbf" />
        <path d="M135 29 v-8 M131 24 h8" stroke="#1f5fbf" strokeWidth="2" />
        <rect x="158" y="46" width="10" height="14" fill="#ffffff" />
        <path d="M156 46 h14 l-7 -8z" fill="#1f5fbf" />
        <path d="M80 82 h8 v12 h-8z M104 70 h8 v10 h-8z M150 72 h8 v12 h-8z M176 86 h8 v10 h-8z" fill="#1f5fbf" />
      </svg>
    );
  }
  if (scene === "clock") {
    // A clock tower by a river, with a red bus on the bridge.
    return (
      <svg {...common}>
        <rect width="200" height="110" fill="#d5dde8" />
        <ellipse cx="50" cy="26" rx="26" ry="9" fill="#ffffff" />
        <ellipse cx="150" cy="18" rx="22" ry="8" fill="#ffffff" />
        <rect x="18" y="62" width="70" height="26" fill="#b99a66" />
        <path d="M24 62 v-8 h6 v8z M40 62 v-8 h6 v8z M56 62 v-8 h6 v8z M72 62 v-8 h6 v8z" fill="#a3834f" />
        <rect x="92" y="26" width="18" height="62" fill="#a3834f" />
        <path d="M90 26 h22 l-11 -18z" fill="#6b5a3a" />
        <circle cx="101" cy="38" r="7" fill="#ffffff" stroke="#6b5a3a" strokeWidth="1.5" />
        <path d="M101 38 v-4 M101 38 h3" stroke="#14213d" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M0 88 H200 V94 H0z" fill="#7d8ca3" />
        <path d="M20 94 a14 14 0 0 1 28 0z M76 94 a14 14 0 0 1 28 0z M132 94 a14 14 0 0 1 28 0z" fill="#5f7fa3" />
        <rect x="134" y="74" width="34" height="14" rx="2" fill="#d32f2f" />
        <path d="M138 78 h26" stroke="#ffe5e5" strokeWidth="2.500" />
        <circle cx="142" cy="88" r="3" fill="#14213d" />
        <circle cx="160" cy="88" r="3" fill="#14213d" />
        <rect y="94" width="200" height="16" fill="#5f7fa3" />
      </svg>
    );
  }
  if (scene === "aurora") {
    // Northern lights over snowy peaks.
    return (
      <svg {...common}>
        <rect width="200" height="110" fill="#0f1b3d" />
        <path d="M-10 46 C40 6, 90 60, 210 16" stroke="#3ddc97" strokeWidth="12" fill="none" opacity="0.55" strokeLinecap="round" />
        <path d="M-10 62 C50 26, 110 72, 210 34" stroke="#59c9e8" strokeWidth="8" fill="none" opacity="0.5" strokeLinecap="round" />
        <path d="M-10 34 C30 10, 100 40, 210 4" stroke="#9b7bf0" strokeWidth="5" fill="none" opacity="0.5" strokeLinecap="round" />
        <path d="M20 12 h2 v2 h-2z M60 20 h2 v2 h-2z M132 10 h2 v2 h-2z M176 28 h2 v2 h-2z M96 8 h2 v2 h-2z" fill="#ffffff" />
        <path d="M-10 110 L48 52 L96 110z" fill="#c9d6ea" />
        <path d="M60 110 L128 44 L210 110z" fill="#e8eef7" />
        <path d="M128 44 L110 62 l10 -3 l8 7 l8 -7 l12 5z" fill="#ffffff" />
        <rect y="100" width="200" height="10" fill="#f4f7fb" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <rect width="200" height="110" fill="#d9ecff" />
      <path d="M-10 80 L40 30 L90 80z" fill="#7da08f" />
      <path d="M110 80 L160 24 L215 80z" fill="#5f8877" />
      <path d="M70 110 C 90 80, 96 70, 104 40 C 112 70, 124 84, 150 110z" fill="#3d9bd1" />
      <path d="M0 80 h76 q14 14 -6 30 H0z M200 80 h-66 q-14 14 16 30 h50z" fill="#8bb37a" />
      <path d="M92 92 h22 l-4 6 h-14z" fill="#d8431b" />
      <path d="M96 92 l14 -8" stroke="#14213d" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
