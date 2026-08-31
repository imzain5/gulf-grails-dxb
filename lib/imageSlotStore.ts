// Per-slot storage backing <ImageSlot>, exposed via useSyncExternalStore so a
// slot renders in sync with localStorage on both the server-snapshot pass
// (always empty) and the client, with no setState-in-effect needed.
const PREFIX = "gg-image-slot:";
const listeners = new Map<string, Set<() => void>>();

function notify(id: string) {
  listeners.get(id)?.forEach((l) => l());
}

export function subscribeSlot(id: string, listener: () => void): () => void {
  let set = listeners.get(id);
  if (!set) {
    set = new Set();
    listeners.set(id, set);
  }
  set.add(listener);
  return () => set!.delete(listener);
}

export function getSlotSnapshot(id: string): string | null {
  try {
    return window.localStorage.getItem(PREFIX + id);
  } catch {
    return null;
  }
}

export function getSlotServerSnapshot(): null {
  return null;
}

export function writeSlot(id: string, dataUrl: string | null) {
  try {
    if (dataUrl) window.localStorage.setItem(PREFIX + id, dataUrl);
    else window.localStorage.removeItem(PREFIX + id);
  } catch {
    // storage full or unavailable — the slot just won't persist this session
  }
  notify(id);
}
