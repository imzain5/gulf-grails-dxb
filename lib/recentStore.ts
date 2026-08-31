import { createPersistedStore } from "./persistedStore";

/**
 * The last pairs this visitor opened, most recent first.
 *
 * Kept in its own store rather than in StoreContext because it is written on
 * every product view and read by two components; folding it into the cart
 * state would re-render the header and the bag on every page visit for no
 * reason.
 */
const MAX = 8;

/** A stable empty array — useSyncExternalStore compares snapshots by identity. */
const EMPTY: string[] = [];

const store = createPersistedStore<{ ids: string[] }>("gulf-grails:recent:v1", { ids: EMPTY });

export const subscribeRecent = store.subscribe;
export const getRecentSnapshot = (): string[] => store.getSnapshot().ids;
export const getRecentServerSnapshot = (): string[] => EMPTY;

export function recordView(id: string) {
  store.set((s) => {
    if (s.ids[0] === id) return s;
    return { ids: [id, ...s.ids.filter((x) => x !== id)].slice(0, MAX) };
  });
}
