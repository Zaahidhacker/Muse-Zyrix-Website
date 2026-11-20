/**
 * Shared gate state between the intro Gate (writer) and the RevealRig
 * (reader). A plain mutable object — no React re-renders. `done` flips
 * true the moment the gate starts lifting, so hero reveals can begin
 * under the curtain. RevealRig checks the flag on mount because the
 * gate's effect can run (and dispatch) before RevealRig subscribes.
 */
export const gateState = {
  done: false,
};

export function markGateDone(): void {
  if (gateState.done) return;
  gateState.done = true;
  window.dispatchEvent(new Event("zyrix:gate-done"));
}
