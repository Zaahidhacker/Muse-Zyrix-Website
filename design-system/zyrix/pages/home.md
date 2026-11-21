# Zyrix homepage

This override documents the homepage visual system. Product copy and package details come from `CONTENT.md` and `src/lib/content.ts`.

## Direction

A dark, editorial portfolio for a web studio. The hero pairs a clear offer and a single sculptural blue titanium render. A sequence of comparison, capabilities, journey, portfolio and pricing layouts gives each topic its own rhythm. The pale blue pricing section makes the four packages easy to scan side by side.

## Color and typography

| Role | Value |
| --- | --- |
| Primary blue, headings and links | `#82B0DB` |
| Secondary navy, site ground | `#101D49` |
| Accent yellow, primary actions and the featured price | `#F7EB4F` |
| Raised navy surface | `#182751` |
| Main text | `#EAF2F7` |
| Secondary text on navy | `#A6B7D0` |
| Pricing ground | `#DCEAF7` |

Manrope at 400–700 is the single typeface. Use solid blue, a stronger weight, or a larger size for emphasis. Use tabular figures for prices. Rounded image and form surfaces use 12px corners. Text areas are set off with space and rules.

## Motion and layout

The hero image opens with a directional crop and settles into place. Section headings and selected blocks rise slightly at entry. The studio pitch emphasizes words in sequence with scroll. Reduced motion presents the final composition and uses native anchor jumps. Sections expand with their content, including demos and FAQ answers.

Use the sticky header’s native anchors and the native mobile menu dialog. Preserve the price comparison as an HTML table, the FAQ as inline disclosures, and the existing enquiry validation, email delivery and WhatsApp fallback. Portfolio renders illustrate the demos, and the demos remain interactive.

## Design tools

Elaya informed heading and CTA hierarchy. Taste informed composition and application of the supplied colors. UI/UX Pro Max informed the scroll sequence, focus visibility, image loading and mobile behavior. Impeccable’s project hook is configured in `.codex/hooks.json` and `.impeccable/config.json`.

Run `npx impeccable install` in a fresh checkout to make the hook launcher available locally. `skills-lock.json` records the Elaya and Taste sources.
