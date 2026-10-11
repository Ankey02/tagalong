"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import { LinkIcon, Logo, UsersIcon, WindowIcon } from "@/components/icons";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePeers, useTripStore } from "@/store/trip-store";

/** Brand, the people who are here right now, and the invite menu. */
export function Header({ onDark }: { onDark: boolean }) {
  const me = useTripStore((s) => s.me);
  const inviteLink = useTripStore((s) => s.inviteLink);
  const toast = useTripStore((s) => s.toast);
  const peers = usePeers();
  const [open, setOpen] = useState(false);
  const menu = useRef<HTMLDivElement>(null);
  // Show up to three friends, then "+2" for the rest, so the header never overflows.
  const shown = peers.slice(0, 3);
  const hidden = peers.length - shown.length;

  // Close the menu on Escape or a click outside it.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onClick = (e: MouseEvent) => {
      if (menu.current && !menu.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink());
      toast("Link copied");
    } catch {
      toast("Could not copy. Copy the address from the browser bar.");
    }
    setOpen(false);
  };

  const openSecondWindow = () => {
    window.open(inviteLink(true), "_blank", "popup,width=520,height=860");
    setOpen(false);
  };

  return (
    <header className={cn("mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-8", onDark ? "text-white" : "text-ink")}>
      <a href="./" className="flex items-center gap-2.5 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-flare">
        <Logo />
        <span className="font-display text-xl font-extrabold tracking-tight sm:text-2xl">Tagalong</span>
      </a>

      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
        <div className="flex -space-x-2" aria-label={`${peers.length + (me ? 1 : 0)} people planning`}>
          <AnimatePresence>
            {me && (
              <motion.span key={me.id} initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                <Avatar name={me.name} label={`${me.name} (you)`} color={me.color} face={me.face} />
              </motion.span>
            )}
            {shown.map((peer) => (
              <motion.span
                key={peer.id}
                initial={{ scale: 0, x: -12 }}
                animate={{ scale: 1, x: 0 }}
                exit={{ scale: 0 }}
                transition={{ type: "spring", stiffness: 380, damping: 20 }}
              >
                <Avatar name={peer.name} color={peer.color} face={peer.face} />
              </motion.span>
            ))}
          </AnimatePresence>
          {hidden > 0 && (
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-sm font-bold text-ink ring-2 ring-white">
              +{hidden}
            </span>
          )}
        </div>

        <div className="relative" ref={menu}>
          <Button variant="glass" size="sm" aria-expanded={open} aria-haspopup="menu" onClick={() => setOpen((v) => !v)}>
            <UsersIcon size={16} />
            <span className="max-[420px]:sr-only">Invite</span>
          </Button>
          <AnimatePresence>
            {open && (
              <motion.div
                role="menu"
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.16 }}
                className="absolute right-0 top-12 z-30 w-[min(20rem,calc(100vw-2.5rem))] origin-top-right rounded-2xl bg-white p-2 text-ink shadow-paper"
              >
                <button
                  type="button"
                  role="menuitem"
                  onClick={openSecondWindow}
                  className="flex w-full cursor-pointer items-start gap-3 rounded-xl p-3 text-left hover:bg-mist focus-visible:outline-2 focus-visible:outline-flare"
                >
                  <WindowIcon className="mt-0.5 shrink-0" />
                  <span>
                    <span className="block font-semibold">Open a second window</span>
                    <span className="block text-sm text-muted">Join as another friend and watch the two stay in sync.</span>
                  </span>
                </button>
                <button
                  type="button"
                  role="menuitem"
                  onClick={copyLink}
                  className="flex w-full cursor-pointer items-start gap-3 rounded-xl p-3 text-left hover:bg-mist focus-visible:outline-2 focus-visible:outline-flare"
                >
                  <LinkIcon className="mt-0.5 shrink-0" />
                  <span>
                    <span className="block font-semibold">Copy trip link</span>
                    <span className="block text-sm text-muted">Open it in another tab of this browser to join.</span>
                  </span>
                </button>
                <p className="border-t border-line px-3 pb-2 pt-3 text-xs leading-relaxed text-muted">
                  Live sync works between tabs and windows of the same browser. Syncing across devices needs a server.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
