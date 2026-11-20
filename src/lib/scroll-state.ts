/**
 * Shared scroll state between the ScrollRig (writer) and the 3D orb
 * (reader). A plain mutable object — no React re-renders on scroll.
 * `progress` is 0 at the top of the page and 1 at the bottom.
 */
export const scrollState = {
  progress: 0,
  velocity: 0,
  reducedMotion: false,
};

export function setScrollProgress(progress: number, velocity: number): void {
  scrollState.progress = Math.min(1, Math.max(0, progress));
  scrollState.velocity = velocity;
}
