/**
 * One-shot first-load signals from the preloader, so entrance motion starts
 * when it can actually be seen:
 *  - "ready":    the preloader starts lifting (the iris begins to open)
 *  - "revealed": the iris has fully opened onto the page
 * Both resolve immediately on client-side navigations (the preloader only
 * runs on the first document load, and fires both by then).
 */
function createSignal() {
  let fired = false;
  const listeners = new Set<() => void>();

  return {
    mark() {
      if (fired) return;
      fired = true;
      listeners.forEach((fn) => fn());
      listeners.clear();
    },
    on(fn: () => void): () => void {
      if (fired) {
        fn();
        return () => {};
      }
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
  };
}

const ready = createSignal();
const revealed = createSignal();

export const markPageReady = ready.mark;
export const onPageReady = ready.on;

export const markPageRevealed = revealed.mark;
export const onPageRevealed = revealed.on;
