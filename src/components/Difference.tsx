import { DIFFERENCE } from "@/lib/content";
import { Section } from "./ui";

/**
 * 01 / The Difference — spare and monumental. Giant h2, one line under it,
 * lots of air. The orb passes behind this section (handled elsewhere);
 * this section's background stays transparent. The three removals sit at
 * the foot of the box, so the section fills instead of floating.
 */
const REMOVALS = ["vague prices", "slow delivery", "unclear ownership"];

export function Difference() {
  // "NOT ANOTHER" / "PRETTY PAGE." — the h2 is set on two lines at the
  // standard h2 size instead of one line at 92px.
  const [headFirst, headRest] = DIFFERENCE.h2.split("ANOTHER ");
  return (
    <Section id="difference" h={1} attrs={{ "data-statement": "" }}>
      <div className="grid flex-1 content-between pb-3">
        <div>
          <p className="eyebrow mb-4">
            {DIFFERENCE.index} / {DIFFERENCE.eyebrow}
          </p>
          <h2 className="display">
            {headFirst}ANOTHER
            <br />
            {headRest}
          </h2>
          <p className="lead muted mt-5">{DIFFERENCE.body}</p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {REMOVALS.map((phrase, i) => (
            <div key={phrase} className="flex min-h-[108px] flex-col justify-between">
              <p className="label muted" style={{ fontSize: "clamp(28px, 3vw, 34px)", lineHeight: 1 }}>
                {String(i + 1).padStart(2, "0")}
              </p>
              <p className="display--sentence">{phrase}</p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
