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
