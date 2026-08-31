// A tiny useSyncExternalStore-compatible store backed by localStorage. Reads
// are lazy and cached so the server snapshot (always the default) matches the
// client's first render, then updates flow in after mount with no
// setState-in-effect anywhere in the consuming component.
export interface PersistedStore<T> {
  subscribe: (listener: () => void) => () => void;
  getSnapshot: () => T;
  getServerSnapshot: () => T;
  set: (updater: (prev: T) => T) => T;
}

export function createPersistedStore<T>(
  key: string,
  defaultValue: T,
  merge: (base: T, saved: Partial<T>) => T = (base, saved) => ({ ...base, ...saved }),
): PersistedStore<T> {
  let cache: T = defaultValue;
  let hydrated = false;
  const listeners = new Set<() => void>();

  function hydrate() {
    if (hydrated || typeof window === "undefined") return;
    hydrated = true;
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) cache = merge(defaultValue, JSON.parse(raw) as Partial<T>);
    } catch {
      // localStorage unavailable (private mode, etc.) — carry on with defaults
    }
  }

  function persist() {
    try {
      window.localStorage.setItem(key, JSON.stringify(cache));
    } catch {
      // storage full or unavailable — state just won't survive a reload
    }
  }

  return {
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    getSnapshot() {
      hydrate();
      return cache;
    },
    getServerSnapshot() {
      return defaultValue;
    },
    set(updater) {
      hydrate();
      cache = updater(cache);
      persist();
      listeners.forEach((l) => l());
      return cache;
    },
  };
}
