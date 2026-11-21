import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { PROMISE, formatLkr } from "@/lib/content";
import { Section } from "./ui";

export function Promise() {
  const [opening, closing] = PROMISE.h2.split(". ");

  return (
    <Section id="promise">
      <div className="promise-layout">
        <div>
          <h2 className="display" data-reveal-words>
            {opening}.<br /><span>{closing}</span>
          </h2>
          <p className="lead mt-6" data-reveal>{PROMISE.note}</p>
          <dl className="promise-price" data-reveal>
            <div>
              <dt>{PROMISE.marketLabel}</dt>
              <dd><s>{formatLkr(PROMISE.marketPrice)} LKR</s></dd>
            </div>
            <div>
              <dt>Zyrix Business</dt>
              <dd className="promise-price__offer">
                {formatLkr(PROMISE.zyrixPrice)} <span>LKR</span>
              </dd>
            </div>
          </dl>
          <p className="muted">{PROMISE.zyrixIncludes}</p>
        </div>
        <div className="promise-compare" data-reveal>
          <table>
            <caption className="visually-hidden">Zyrix and market price comparison in LKR</caption>
            <thead>
              <tr><th scope="col">Plan</th><th scope="col">Zyrix</th><th scope="col">Market</th></tr>
            </thead>
            <tbody>
              {PROMISE.rows.map((row) => (
                <tr key={row.name}>
                  <th scope="row">{row.name}</th>
                  <td>{row.zyrix}</td>
                  <td>{row.market.replace("Market ", "")}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="label mt-6">{PROMISE.split}</p>
          <a href={PROMISE.seePlansHref} className="link tap44 mt-3 gap-2">
            {PROMISE.seePlans.replace(" ↗", "")}
            <ArrowUpRight size={17} aria-hidden="true" />
          </a>
        </div>
      </div>
    </Section>
  );
}
