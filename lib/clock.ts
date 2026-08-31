// A single shared ticking clock, exposed via useSyncExternalStore so components
// that render the current time (countdowns, etc.) don't each run their own
// setInterval + setState-in-effect — and so server and client render the same
// thing on the first pass (the server snapshot is a sentinel, not "now").
const listeners = new Set<() => void>();
let timer: ReturnType<typeof setInterval> | null = null;

function ensureTimer() {
  if (timer || typeof window === "undefined") return;
  timer = setInterval(() => listeners.forEach((l) => l()), 1000);
}

export function subscribeClock(listener: () => void) {
  listeners.add(listener);
  ensureTimer();
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && timer) {
      clearInterval(timer);
      timer = null;
    }
  };
}

/** Seconds since epoch, or 0 before the clock has ticked on the client. */
export function getClockSnapshot(): number {
  return Math.floor(Date.now() / 1000);
}

export function getClockServerSnapshot(): number {
  return 0;
}
