"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * One row of choices that slides sideways. It works three ways: swipe on a
 * trackpad or phone, drag with the mouse, or click the arrows at the ends.
 */
export function SlideRow({ label, children }: { label: string; children: ReactNode }) {
  const row = useRef<HTMLDivElement>(null);
  const drag = useRef({ down: false, startX: 0, startScroll: 0, moved: false });
  const [edges, setEdges] = useState({ left: false, right: false });

  // Show an arrow only on a side that still has something hidden.
  const measure = () => {
    const el = row.current;
    if (!el) return;
    setEdges({ left: el.scrollLeft > 4, right: el.scrollLeft + el.clientWidth < el.scrollWidth - 4 });
  };
  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const slide = (direction: 1 | -1) => {
    const el = row.current;
    if (el) el.scrollBy({ left: direction * el.clientWidth * 0.7, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div
        ref={row}
        role="group"
        aria-label={label}
        onScroll={measure}
        onPointerDown={(e) => {
          if (e.pointerType !== "mouse") return;
          drag.current = { down: true, startX: e.clientX, startScroll: row.current?.scrollLeft ?? 0, moved: false };
        }}
        onPointerMove={(e) => {
          const state = drag.current;
          if (!state.down || !row.current) return;
          const distance = e.clientX - state.startX;
          if (Math.abs(distance) > 5) state.moved = true;
          if (state.moved) row.current.scrollLeft = state.startScroll - distance;
        }}
        onPointerUp={() => (drag.current.down = false)}
        onPointerLeave={() => (drag.current.down = false)}
        // A drag should not also count as a click on the circle under the pointer.
        onClickCapture={(e) => {
          if (drag.current.moved) {
            e.preventDefault();
            e.stopPropagation();
            drag.current.moved = false;
          }
        }}
        className="slide-row flex cursor-grab gap-2 overflow-x-auto px-1 py-1.5 active:cursor-grabbing"
      >
        {children}
      </div>

      {(["left", "right"] as const).map((side) => (
        <button
          key={side}
          type="button"
          tabIndex={-1}
          aria-hidden="true"
          onClick={() => slide(side === "left" ? -1 : 1)}
          className={cn(
            "absolute top-1/2 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white text-ink shadow-md ring-1 ring-line transition-opacity",
            side === "left" ? "-left-3" : "-right-3",
            edges[side] ? "opacity-100" : "pointer-events-none opacity-0",
          )}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d={side === "left" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"} />
          </svg>
        </button>
      ))}
    </div>
  );
}
