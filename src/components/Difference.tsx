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
  // standard h2 size instead of one line at 92px. The last word sits
  // in italic serif (two-voice headline).
  const [headFirst, headRest] = DIFFERENCE.h2.split("ANOTHER ");
  const restWords = headRest.trim().split(" ");
  const restLast = restWords[restWords.length - 1];
  const restHead = restWords.slice(0, -1).join(" ");
  return (
    <Section
      id="difference"
      h={1}
      attrs={{ "data-statement": "", "data-dim-orb": "" }}
    >
      <div className="grid flex-1 content-between pb-3">
        <div className="scrim">
          <p className="eyebrow mb-4" data-reveal>
            {DIFFERENCE.index} / {DIFFERENCE.eyebrow}
          </p>
          <h2 className="display" data-reveal-words>
            {headFirst}ANOTHER
            <br />
            {restHead}{" "}
            <em className="serif-accent">{restLast}</em>
          </h2>
          <p className="lead muted mt-5" data-reveal>
            {DIFFERENCE.body}
          </p>
        </div>
        <div
          className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3"
          data-reveal-stagger
        >
          {REMOVALS.map((phrase, i) => (
            <div
              key={phrase}
              data-reveal-item
              className="flex min-h-[108px] flex-col justify-between"
            >
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
