"use client";

import { motion } from "framer-motion";

/**
 * The background. The trip moves through a day as you move through the steps:
 * dawn, morning, noon, golden hour, then night on the itinerary page.
 */
const SKIES = [
  { top: "#ffd3bd", bottom: "#cfe6ff", sun: "#ffb37a", x: "7%", y: "60%", hill: "#8fb7a8", hillBack: "#b7d3cc" },
  { top: "#a9d8ff", bottom: "#e8f5ff", sun: "#ffd35c", x: "9%", y: "30%", hill: "#6fae8f", hillBack: "#a4d0bb" },
  { top: "#74c2ff", bottom: "#d5efff", sun: "#ffe17a", x: "93%", y: "20%", hill: "#57a37c", hillBack: "#93caa9" },
  { top: "#ffb873", bottom: "#ffe6c4", sun: "#ff8a4c", x: "92%", y: "48%", hill: "#a0744f", hillBack: "#d3a276" },
  { top: "#1b1f4b", bottom: "#5b3f7d", sun: "#f4f1ff", x: "84%", y: "16%", hill: "#231c45", hillBack: "#3a2c62" },
];

const STARS = [
  [6, 12], [14, 30], [22, 8], [31, 22], [38, 40], [46, 14], [55, 28], [63, 9],
  [70, 34], [78, 46], [91, 30], [96, 12], [10, 52], [50, 48], [28, 55], [87, 58],
];

const CLOUDS = [
  { top: "12%", width: 220, seconds: 95, delay: -20, opacity: 0.9 },
  { top: "30%", width: 150, seconds: 130, delay: -75, opacity: 0.7 },
  { top: "22%", width: 300, seconds: 160, delay: -120, opacity: 0.55 },
  { top: "44%", width: 180, seconds: 110, delay: -50, opacity: 0.6 },
];

function Cloud({ width }: { width: number }) {
  return (
    <svg width={width} viewBox="0 0 200 70" fill="#ffffff" aria-hidden="true">
      <ellipse cx="60" cy="46" rx="56" ry="20" />
      <ellipse cx="96" cy="30" rx="40" ry="26" />
      <ellipse cx="140" cy="44" rx="52" ry="22" />
    </svg>
  );
}

export function Sky({ step }: { step: number }) {
  const sky = SKIES[step] ?? SKIES[0];
  const night = step === SKIES.length - 1;
  const slow = { duration: 1.4, ease: [0.22, 1, 0.36, 1] as const };

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {/* One gradient per step, cross-faded. */}
      {SKIES.map((s, i) => (
        <motion.div
          key={i}
          className="absolute inset-0"
          style={{ background: `linear-gradient(180deg, ${s.top} 0%, ${s.bottom} 78%)` }}
          initial={false}
          animate={{ opacity: i === step ? 1 : 0 }}
          transition={slow}
        />
      ))}

      <motion.div className="absolute inset-0" initial={false} animate={{ opacity: night ? 1 : 0 }} transition={slow}>
        {STARS.map(([left, top], i) => (
          <span key={i} className="star" style={{ left: `${left}%`, top: `${top}%`, animationDelay: `${(i % 5) * 0.6}s` }} />
        ))}
      </motion.div>

      {/* The sun crosses the sky and turns into the moon at night. */}
      <motion.div
        className="absolute h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full sm:h-36 sm:w-36"
        initial={false}
        animate={{
          left: sky.x,
          top: sky.y,
          backgroundColor: sky.sun,
          boxShadow: night ? "0 0 60px 10px rgba(244,241,255,0.35)" : `0 0 90px 30px ${sky.sun}88`,
        }}
        transition={slow}
      >
        <motion.span
          className="absolute right-0 top-0 h-[78%] w-[78%] rounded-full"
          initial={false}
          animate={{ opacity: night ? 1 : 0, backgroundColor: "#1f2251" }}
          transition={slow}
        />
      </motion.div>

      <motion.div className="absolute inset-0" initial={false} animate={{ opacity: night ? 0.12 : 1 }} transition={slow}>
        {CLOUDS.map((c, i) => (
          <div
            key={i}
            className="cloud"
            style={{ top: c.top, opacity: c.opacity, animationDuration: `${c.seconds}s`, animationDelay: `${c.delay}s` }}
          >
            <Cloud width={c.width} />
          </div>
        ))}
      </motion.div>

      {/* Two layers of hills along the bottom. */}
      <svg className="absolute bottom-0 left-0 h-[26vh] w-full" viewBox="0 0 1440 260" preserveAspectRatio="none">
        <motion.path
          d="M0 150 C 180 70, 330 60, 520 130 S 860 210, 1060 120 S 1340 60, 1440 110 V260 H0 Z"
          initial={false}
          animate={{ fill: sky.hillBack }}
          transition={slow}
        />
        <motion.path
          d="M0 210 C 220 130, 420 150, 640 200 S 1020 140, 1200 180 S 1380 220, 1440 190 V260 H0 Z"
          initial={false}
          animate={{ fill: sky.hill }}
          transition={slow}
        />
      </svg>
    </div>
  );
}
