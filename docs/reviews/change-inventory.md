# Change inventory — sem 7 prep site

One row per changed file: what changed, why, how verified.
Status values: `done` = verified by the stated check. `pending` = agent still running.

## Documentation

| File | What | Why | Verified by |
| --- | --- | --- | --- |
| `docs/superpowers/specs/2026-11-23-sem7-prep-design.md` | Full design doc: intent, goals/non-goals/anti-goals, verified constraints, three approaches with the trade-off, the seven-block subject page, the data layer, PDF hosting, growth plan, builder's open items | The brainstorming skill requires a written design before any build | Reviewed with the owner; approved direction recorded in the decision log |
| `docs/superpowers/plans/2026-11-23-sem7-prep-site.md` | 14-task implementation plan with TDD steps, exact file paths, exact test assertions, interfaces per task, Review Focus | The writing-plans skill requires bite-sized tasks with checkable steps | Self-reviewed for spec coverage, step granularity, type consistency, review focus and proportion |
| `docs/reviews/decision-log.md` | Every decision with its driver, who made it, and the consequence | Commit-discipline requirement | n/a — the log is the record |
| `docs/reviews/change-inventory.md` | This file | Commit-discipline requirement | n/a |

## Build repair (Task 0)

| File | What | Why | Verified by |
| --- | --- | --- | --- |
| `src/components/CryptoLearnMode.tsx` | Closed the truncated `AvalancheDiagram` SVG (unclosed `<svg>`, no `return`); repaired two corrupted topic-object boundaries; fixed the resulting type errors | `main` did not compile: 116 TS errors, because this file was committed with a truncated JSX block | `npm run build` exits 0; committed as `c472b70` |
| `src/components/CDAnalysisPage.tsx`, `CDAnalysisMobile.tsx`, `CDMasterSheet.tsx`, `CryptoAnalysisPage.tsx`, `CryptoFlashCards.tsx`, `src/data/cryptoExhaustiveAnswers.ts` | Minimal stubs for sem-6 modules that `src/App.tsx` imported but were never committed | Without them the app cannot compile; the real pages are a separate migration job | `npm run build` exits 0 |

## Data layer (Task 1)

| File | What | Why | Verified by |
| --- | --- | --- | --- |
| `src/data/subjects/types.ts` | `SubjectSpec` and its component types: `Topic`, `Unit`, `MCQ`, `LongQuestion`, `SafeCombo`, `Blueprint`, `Resource`, `PdfLinks` | One typed shape drives both the page and the PDF so they cannot disagree | `tests/subjects.spec.ts` |
| `src/data/subjects/validate.ts` | `validateSubject(spec)` — 15 rules: unit count and numbering, hours, topic presence, blueprint total and part sum, 4 options, answer index range, non-empty explanations, bank lengths vs blueprint, safe-combo marks and claim, `pyqNote` present, course-code pattern, ISO exam date | Catches a bad subject file at test time instead of shipping a broken quiz | `tests/subjects.spec.ts` — 7 validator tests |
| `src/data/subjects/index.ts` | `SUBJECTS` registry plus `getSubject`, `semesters`, `subjectsBySemester` | Single lookup point for routes, the home grid and the PDF builder | `tests/subjects.spec.ts` |
| `src/data/subjects/helpers.ts` | Small constructors `t()`, `m()`, `q()` for topic/question objects | Keeps five large subject files readable | Type-checked by `tsc --noEmit` |
| `playwright.config.ts` | Playwright config with a `vite dev` web server on port 5173 | Test harness — no new dependency, `@playwright/test` was already a devDependency | `npx playwright test` |

## Subject content (Tasks 2–6)

One file per subject. Topics copied verbatim from the official SRMIST syllabus; every file carries
5 units × 9 hours, the 75-mark blueprint, 20 MCQs, 5 Part B, 2 Part C, a CT set, a safe combo whose
first claim contains "of 75", and the prescribed textbook list.

| File | Subject | Exam | Verified by |
| --- | --- | --- | --- |
| `src/data/subjects/21cse435t.ts` | Smart Contracts and Application Development | 2026-11-25 FN | `validateSubject` + unit-name test |
| `src/data/subjects/21cse432t.ts` | Blockchain Technology with Hyperledger | 2026-12-01 FN | `validateSubject` + unit-name test |
| `src/data/subjects/21cse433t.ts` | Blockchain Business Models | 2026-11-26 FN | `validateSubject` + unit-name test |
| `src/data/subjects/21cse436t.ts` | Bitcoin Essentials and Use Cases | 2026-11-27 FN | `validateSubject` + unit-name test — agent reported 1223 lines, 52 topics, 20 MCQs, 5×Part B, 2×Part C, CT set, safe combo 65/45/40/30/25 |
| `src/data/subjects/21meo104t.ts` | TQM and Reliability Engineering | 2026-12-09 AN | `validateSubject` + unit-name test |

## Page components (Tasks 7–9)

| File | What | Why | Verified by |
| --- | --- | --- | --- |
| `src/components/subject/SubjectAnalysis.tsx` | Generic zero-to-hero page: header, honesty line, blueprint, safe combo, unit breakdown, practice, resources, PDF download, crowdsource link | One component renders any subject | `tests/subject-page.spec.ts` |
| `src/components/subject/SubjectMasterSheet.tsx` | Generic paper-shaped view with an answer key | The in-browser master PDF | `tests/subject-page.spec.ts` |
| `src/components/subject/BlueprintPanel.tsx` | The 20/5×8/2×15 breakdown | Part of the page | `tests/subject-page.spec.ts` |
| `src/components/subject/SafeComboPanel.tsx` | The "N topics = 65 of 75" panel | The forwarded headline | `tests/subject-page.spec.ts` |
| `src/components/subject/UnitBreakdown.tsx` | Five units, topics, priority badges, minutes, `why` | Zero-to-hero study order | `tests/subject-page.spec.ts` |
| `src/components/subject/QuestionBank.tsx` | MCQ + Part B + Part C with reveal, explanations and source labels | Practice | `tests/subject-page.spec.ts` |
| `src/components/subject/PdfDownload.tsx` | Drive primary, GitHub mirror secondary, "coming" state when links are empty | Never a dead 404 anchor | `tests/subject-page.spec.ts` |
| `src/components/subject/CountdownChip.tsx` | Days-to-exam chip; "Exam over" for a past date | Urgency | `tests/subject-page.spec.ts` |
| `src/components/subject/UnitDonutGeneric.tsx` | Unit-weight donut taking units as props | The existing `UnitDonut` hardcodes three units | `tests/subject-page.spec.ts` |
| `src/components/subject/SemesterSwitcher.tsx` | Segmented control, sem 7 active by default | Semester navigation | `tests/home.spec.ts` |
| `src/components/SubjectGrid.tsx` | Reworked: semester switcher, sem-7 cards, countdown chips, sem-6 routes preserved | Owner asked for sem-wise categorisation with the latest semester as default | `tests/home.spec.ts` |
| `src/components/Hero.tsx` | Tagline count 6 → 11, sem-7 dropdown entries, CTAs to a sem-7 subject and its master sheet | Home page must point at sem 7 | `tests/home.spec.ts` |
| `src/App.tsx` | Routes `/subject/:code` and `/subject/:code/master`; `onOpenSubject` wiring | Serve the new pages | `tests/subject-page.spec.ts` |
| `vite.config.ts` | PWA manifest name/description updated off "Sem 6 Prep" | The installed app should not say sem 6 | build |

## PDFs, hosting, distribution (Tasks 10–12)

| File | What | Why | Verified by |
| --- | --- | --- | --- |
| `scripts/vite.data.config.ts` | Vite SSR build of the registry to `dist-pdf/registry.mjs`, `publicDir: false` | Lets a plain Node script read the TypeScript data | `npm run pdf:build` |
| `scripts/registry-entry.ts` | One-line re-export of `SUBJECTS` | Build entry point | same |
| `scripts/master-pdf-template.mjs` | `renderMasterHtml(spec)` — title page, blueprint, safe combo, unit map, condensed notes, MCQs, solutions, quick-reference sheet | The PDF content | `tests/pdf.spec.ts` |
| `scripts/build-master-pdfs.mjs` | Builds the registry, prints each PDF with Playwright Chromium, counts pages, writes `dist-pdf/manifest.json` | One PDF per subject, ≤50 pages | page count checked in the bytes and in a viewer |
| `scripts/publish-pdfs.mjs` | Uploads to the Drive folder "Sem 7 Master PDFs", sets anyone-with-link permission, creates the `sem7-master-pdfs` GitHub release, writes `dist-pdf/published.json` | Drive throttles under viral load; the mirror is the fallback | `tests/pdf.spec.ts` + one public link opened |
| `scripts/build-share-cards.mjs` | 1080×1350 PNG per subject at `public/share/<CODE>.png` | The forwarded artifact | `tests/share.spec.ts` |
| `docs/growth/kit.md` | Channel posts, class-group copy, five reel scripts, six-week calendar, metrics, integrity rules | Distribution is ops, not code | `tests/share.spec.ts` |
| `.gitignore` | `dist-pdf/` | Generated output is not source | n/a |
| `package.json` | `pdf:build` script | Entry point for the PDF pipeline | `npm run pdf:build` |
| `public/share/*.png` | Five share cards | Forwardable images | `tests/share.spec.ts` |

## Tests

| File | Covers | Verified by |
| --- | --- | --- |
| `tests/subjects.spec.ts` | 7 validator rules + one validity and one unit-name test per subject | `npx playwright test tests/subjects.spec.ts` |
| `tests/subject-page.spec.ts` | Page renders code, title, blueprint, safe-combo claim, PYQ honesty line, real MCQ count, not-found state, countdown | `npx playwright test tests/subject-page.spec.ts` |
| `tests/home.spec.ts` | Sem 7 default, sem 6 switch, countdown chip on a card | `npx playwright test tests/home.spec.ts` |
| `tests/pdf.spec.ts` | Manifest exists, every PDF ≤50 pages, every subject has a Drive URL and a release mirror | `npx playwright test tests/pdf.spec.ts` |
| `tests/share.spec.ts` | A share card per subject, growth kit exists | `npx playwright test tests/share.spec.ts` |

## Hosting and routes (revision after Task 11 testing)

| File | What | Why | Verified by |
| --- | --- | --- | --- |
| `src/data/subjects/index.ts` | Registry now holds the five sem-7 subjects, not an empty array | The PDF builder loads the registry through this file and refused to write an empty manifest | `npm run pdf:build` → 5 subjects loaded |
| `src/components/subject/registry.ts` | Re-exports the data registry instead of keeping a second copy of the five imports | Two registries could drift; the data layer is the single source | `tests/home.spec.ts`, `tests/subject-page.spec.ts` |
| `src/App.tsx` | Routes `/subject/:code` and `/subject/:code/master`, plus `SubjectAnalysisWrapper` and `SubjectMasterWrapper` with a not-found state | Serve the new pages; an unknown code must not render a blank page | `tests/subject-page.spec.ts` — unknown code shows `subject-not-found` |
| `src/App.tsx` | Hero CTA now points at `/subject/21CSE435T`; `onOpenSubject` prop added | The home page must point at the current semester | `tests/home.spec.ts` |
| `src/components/Hero.tsx` | Tagline "across 6 subjects" → "across 11 subjects"; five sem-7 entries in the Analysis dropdown | Sem 7 must be reachable from the nav pill | manual check, `npm run build` |
| `src/components/SubjectGrid.tsx` | Semester switcher (sem 7 default), sem-7 cards built from the registry, countdown chip per card, `data-testid="subject-card-<code>"` | Semester-aware navigation, sem 7 default | `tests/home.spec.ts` — 3 tests |
| `src/components/SubjectGrid.tsx` | React key changed from `subject.code` to `${code}-${index}` | The three sem-6 "coming" subjects all use the placeholder code `TBC`, which produced duplicate-key warnings | console warning gone in the test run |
| `src/components/subject/CountdownChip.tsx` | Clock read once at mount via `useState(() => Date.now())` | `Date.now()` during render is an impure read (`react-hooks/purity`) | `npx eslint src/components/subject/` clean |
| `src/components/subject/UnitDonutGeneric.tsx` | Cumulative segment offsets computed with `reduce` instead of a reassigned `let` | `offset += dash` after render is a reassignment (`react-hooks/immutability`) | `npx eslint src/components/subject/` clean |
| `vite.config.ts` | PWA manifest name "Analyst — Sem 6 Prep" → "Analyst — Exam Prep", description updated | The installed app should not say sem 6 | `npm run build` |
| `public/master-pdfs/*.pdf` | 5 generated master PDFs, committed so Vercel serves them | Canonical student download: no Drive quota, no throttle, no sign-in redirect | `tests/pdf.spec.ts` — committed-PDF test; anonymous GitHub Release download verified |
| `public/share/*.png` | 5 share cards at 1080×1350 | The forwarded artifact | `tests/share.spec.ts`; card read back and confirmed readable |
| `vercel.json` | SPA fallback rewrite: every path except `assets/`, `master-pdfs/`, `share/` serves `index.html` | Deep links (`/subject/21CSE435T`) are the whole distribution plan; without the rewrite every client route 404s on a hard navigation, and sem-6 routes (`/ds-analysis`) were already broken | `curl` on the live domain → 200 for `/`, `/subject/21CSE435T`, `/subject/21CSE435T/master`; Playwright against production renders the title, code, blueprint and countdown |
| `.gitignore` | `test-results/` and `playwright-report/` ignored; `test-results/.last-run.json` untracked | The Playwright run artifact was committed and re-dirtied the tree on every test run | `git status --short` clean after a test run |
