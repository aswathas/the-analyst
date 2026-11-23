# Sem 7 Prep Site — Design

Date: 2026-11-23
Repo: `aswathas/the-analyst` (the sem 6 site, `https://sem6-prep-for-me.vercel.app`)
Status: proposed, awaiting approval

## 1. Intent and the why

Every semester this project has been: build a website that tells a student exactly what to
study for the end-semester paper, built from the real papers and the real syllabus. Sem 6 did
it for six subjects. Sem 7 has five subjects, four of them professional electives and one open
elective, all first-time-offered — so there are no previous-year end-sem papers to decode.

That is the whole problem and the whole opportunity. The product for sem 7 is not "here is what
came up before"; it is **"here is the blueprint, here is the smallest set of topics that wins 65
of 75 marks, here are the questions that fit the pattern, and here is one PDF that contains
everything you need."** The syllabus is the ground truth and it is public, official, and
complete. The analysis is the value we add on top.

The audience grows this time: not one batch, but every CSE student in the blockchain
specialization stream across years, plus the open-elective TQM crowd, plus anyone who searches
a subject code on Google at 1am the week before the exam. The site is the product; WhatsApp is
the distribution.

## 2. Goals, non-goals, anti-goals

**Goals**
1. Five sem 7 subjects, each with a complete zero-to-hero analysis page and a master PDF.
2. A master PDF per subject: everything needed for that exam in one file, ≤50 pages, linked
   from the page, hosted on Drive with a GitHub Release mirror.
3. Semester-aware navigation over the whole catalogue (sem 6 + sem 7), defaulting to the most
   recent semester.
4. A distribution plan that reaches the college, executed on a 6-week calendar with numbers to
   hit.
5. A repeatable machine: adding a subject is data + one component, not a rewrite.

**Non-goals**
- Not a notes repository. We do not write lecture notes for 5 courses.
- Not a live-paper predictor sold as fact. Predicted papers are labelled unofficial.
- Not a paid product, and not monetised in this phase.

**Anti-goals**
- No invented PYQs. If a paper does not exist, the page says so and shows the pattern-derived
  analysis instead. A wrong question costs a student marks and the site's credibility.
- No wholesale rewrite of the sem 6 site. The sem 6 pages work and its traffic exists; the
  rework is additive plus a shared data layer.
- No Drive-only distribution (see §7).

## 3. Constraints (verified, not assumed)

| Constraint | Source | Consequence |
|---|---|---|
| End-sem theory = 75 marks. Part A 20 MCQ×1 = 20; Part B 5×8 = 40 (answer any); Part C 2×15, answer any 1 = 15 | SRMIST 2021 regulations + `CSE-CS-2021.pdf` assessment table (CLA 60% / end-sem 40%) | Every page's blueprint uses this exact split |
| CT/FT pattern: Part A 10×1 = 10; Part B 5×4 = 20; Part C 2×10 = 20 | Hyperledger group notice, FT3 13.10.2026 | CT packs use this, not the end-sem split |
| The five sem 7 courses are professional/open electives first offered in this regulation | `CSE-CS-2021.pdf` course headers | No end-sem PYQ exists for any of them. Analysis is syllabus-driven |
| Official unit-wise topic lists for all five courses | `CSE-CS-2021.pdf` (SRMIST control copy), pages 388–398 and 257 | Syllabus content is quoted, not invented |
| Each unit = 9 hours, 5 units, 3 credits, no prerequisite courses | same | 45 hours per course; unit 5 is usually a practical/case-study unit |
| WhatsApp groups for all 5 subjects exist and are active | read-only scan of 5 groups | CT paper patterns and unit boundaries are real data. No messages sent |
| `gws` has no OAuth token on this machine | `gws auth status` | Drive upload needs one interactive `gws auth login` from the user |
| Drive throttles shared files under viral load ("too many users have viewed or downloaded this file recently", typically resets in ~24h) | Google Drive Help, cited in the growth plan | Drive alone fails exactly when it succeeds. Mirror required |
| Existing site = React 19 + Vite 8 + TS + Tailwind v4 + framer-motion, deployed on Vercel | `package.json` | Same stack. No migration |
| Existing content is hardcoded per subject in ~10 large components (`ADCAnalysisPage.tsx` 1288 lines, `SEPMAnalysisPage.tsx` 1032, `PYQMasterSheet.tsx` 909) | `src/components/` | 5 new subjects at that shape = ~5k lines of copy-paste. Must be fixed by a shared data layer (§6) |
| Site has no backend | `src/` | All content is static TS data. Keep it that way |

## 4. Approaches considered

### A. Copy the sem 6 shape per subject
New `SCAnalysisPage.tsx`, `SCMasterSheet.tsx`, etc. for each of the 5 subjects, mirroring ADC.
**Trade-off:** fastest to start, matches what already works, zero risk to sem 6. Cost: ~5,000
lines of near-duplicate JSX, every future subject costs another thousand, and the 5 pages drift
apart in style. **Rejected:** the user asked for a rework and a bigger crowd; a site that
requires a thousand-line copy per subject cannot grow past a handful of subjects.

### B. Shared data layer, generic renderer (chosen)
Extract the repeated shape — subject meta, 5-unit syllabus map, marks blueprint, MCQ bank,
Part B/Part C model questions, safe combo, resources — into one typed data module per subject
(`src/data/subjects/<code>.ts`). Build one generic `SubjectAnalysis` component and one generic
`MasterSheet` component that render any subject from that shape. Sem 6's existing pages keep
working untouched; sem 6's data can be migrated to the new shape later, on demand, one subject
at a time, with no visual change.
**Trade-off:** one day of scaffolding before the first subject page exists, and sem 6 and sem 7
temporarily live in two shapes. **Chosen** because it is the only option where subject 6 is
cheaper than subject 1, which is what "reach bigger crowd" actually requires.

### C. Content-driven site (markdown/JSON fetched at runtime, pages generated)
Move all content out of code into markdown/JSON and render with a generic template.
**Trade-off:** content editing needs no rebuild — attractive for a 2-hour-a-week content
operation. Cost: a build/loader layer, a content pipeline, and a rendering abstraction, on top
of B. **Deferred:** B already gives non-coders the ability to edit a TS data file, which is
close enough for now. Revisit if a second operator starts editing content.

## 5. The subject page: zero-to-hero

One page per subject, seven blocks, in this order. The order is the pedagogy: what the paper
looks like → what to skip → what to learn → practice → what to read → the PDF → the countdown.

1. **Header** — course code, title, category (Professional Elective / Open Elective), exam date
   and a live countdown to it, one-line "what this course is".
2. **The 75-mark blueprint** — the exact end-sem split (20 MCQ × 1, 5 × 8 Part B, 1 × 15 Part C)
   rendered as the existing `UnitDonut` / `PartBreakdown` components, plus a per-unit marks
   weight table derived from the official unit list.
3. **The safe combo** — the headline claim, stated as a number: *study these 7 topics and you
   clear 65/75*. Which units, which topics, which marks they yield. This is the single most
   forwarded fact on the page and the hook for the reel.
4. **Unit-by-unit zero-to-hero** — for each of the 5 official units: the exact syllabus topics
   as published, each tagged with priority (must / should / skip) and an estimated study time,
   with the reasoning shown.
5. **Practice** — a 20-question MCQ bank (one per topic band, exam-real wording, answer + one-line
   why), 5 Part B model questions (8 marks) and 2 Part C model questions (15 marks) with model
   answer outlines and the marks split. Includes the CT pattern (10×1 / 5×4 / 2×10) as a
   labelled secondary set, because 60% of the grade is CLA.
6. **Resources** — official syllabus PDF (SRMIST), prescribed textbook per unit (from the
   official Learning Resources list), the CT/assignment material found in the subject's WhatsApp
   group where it exists, and external references.
7. **Master PDF + share** — the Drive link (canonical), a GitHub Release mirror link (fallback),
   a copy-link button, a share-to-WhatsApp button, and a "what was asked in the paper?" form
   link for crowdsourcing the next iteration.

**Honesty line, near the top of every sem 7 page:** these are first-time-offered electives, so
no previous end-sem paper exists; the analysis is built from the official unit-wise syllabus and
the published 75-mark pattern.

### The master PDF, one per subject
- ≤50 pages, generated so a student can revise from it in one sitting.
- Contents: official 5-unit syllabus map → marks blueprint → safe combo → condensed topic notes
  (definitions, formulas, key diagrams, textbook page references) → the 20 MCQs with answers →
  5 Part B + 2 Part C model questions with model answers → a formula/definition quick-reference
  sheet → source list.
- Built from the same data module as the page, so page and PDF cannot disagree.
- Filename: `21CSE435T-Smart-Contracts-Master-PDF.pdf`.

## 6. The rework: shared data layer

New shape (one file per subject, one generic renderer):

```ts
// src/data/subjects/types.ts
export interface SubjectSpec {
  code: string;
  title: string;
  category: 'core' | 'professional-elective' | 'open-elective';
  semester: number;
  examDate: string;              // ISO
  accent: string;                // existing palette colour
  hours: number;
  unitTopicCounts: number[];     // for the donut
  syllabus: Unit[];              // official topics verbatim + priority + est. minutes
  blueprint: { partA: number; partB: {count:number;marks:number}; partC: {count:number;marks:number} };
  safeCombo: { unit: number; topics: string[]; marks: number; claim: string }[];
  mcqs: MCQ[];                   // 20
  partB: Question[];             // 5
  partC: Question[];             // 2
  ct: { mcqs: MCQ[]; partB: Question[]; partC: Question[] };
  resources: Resource[];
  pdf: { driveUrl: string; releaseUrl: string; pages: number };
  pyqStatus: 'none-first-offered' | 'papers-available';
}
```

New components: `src/components/subject/SubjectAnalysis.tsx` (renders any `SubjectSpec`),
`src/components/subject/SubjectMasterSheet.tsx`, `src/components/subject/SemesterSwitcher.tsx`.
The sem 6 pages are not touched in this phase; sem 6 data migrates to `SubjectSpec` later, one
subject per session, visually identical.

Navigation rework: the home page becomes semester-aware. A `SemesterSwitcher` groups subjects by
semester and defaults to the highest-numbered semester with content (sem 7 now). Every subject
card carries its exam date and a countdown chip, so the site self-sorts by urgency.

## 7. PDF hosting: Drive canonical, GitHub Release mirror

- One Drive folder per semester: `Sem 7 Master PDFs`. Public "anyone with the link" permission on
  each file. Drive is the link we post in WhatsApp groups and reels because it is what students
  already trust and can open on a phone without an account.
- Every PDF is also uploaded as a GitHub Release asset on `aswathas/the-analyst` (`sem7-master-pdfs`
  tag). The page shows: "Download from Drive" primary + "Mirror" secondary.
- Why: Drive's own help page advises dedicated hosting for heavily shared files, and the 15 GB
  shared quota plus the 600-address sharing cap are both real. The mirror is a five-minute
  fallback that converts a broken download into a working one.
- Requires: one interactive `gws auth login` from the user before the first upload. This is the
  only manual step in the whole pipeline.

## 8. Making it reach the college

Full plan: `C:\Users\ADMIN\srmist-cse-exam-site-6week-growth-plan.md` (with citations). The
load-bearing decisions:

**The share mechanic.** One card, one link. The forwarded artifact is a single image (image
forwards beat video forwards in study groups) that carries the one number people actually care
about — *"7 topics = 65/75 marks"* — plus the link. The site is the archive; the card is the
advertisement.

**Priority channels** (from the research, in order): class WhatsApp groups (sem 6 + sem 7 CSE) →
WhatsApp Channel (one-way broadcast, every subscriber gets every drop without forwarding) →
Telegram channel (archive + search + PDF delivery) → campus ambassadors (8–12, ₹50 each,
each seeds 3–4 groups in person) → QR posters at the Xerox shop/canteen/hostel → Instagram
Reels + YouTube Shorts → a free 75-mark timed model exam (the strongest reason to hand over a
phone number) → Reddit r/SRMUNIVERSITY AMA → SEO on subject pages → club cross-posts.
Wholesale mass-DM is deliberately excluded — it restricts the account and produces nothing.

**Five viral triggers, specific to SRM exam season:**
1. **Exam-window hijack** — a subject's analysis page goes live within 24–48h of its end-sem
   paper, and a "what was asked" form collects the memory from students who just sat it. This is
   the loop that makes next semester's analysis real.
2. **The countdown** — every subject card shows days-to-exam. Lowest-friction reason to come
   back daily.
3. **The safe combo** — the "7 topics = 65/75" claim, one card per subject, the most forwarded
   thing on the site.
4. **Master PDF drop day** — a scheduled release per subject (T−21, T−14, T−7 days), announced
   identically on every channel, so the group chat habit forms.
5. **The model exam** — a free timed 75-mark mock with an answer key, gated behind a phone
   number. Converts a reader into a reachable contact.

**SEO gap, verified.** SRMIST publishes official papers through its DSpace library, but as bare
handle URLs: no per-subject page, no unit mapping, no analysis. The #1 result for "SRMIST paper"
is a DSpace handle. That gap is the product.

**Six-week calendar** (23 Nov 2026 start, W1–W6): W1 infra + first analyses inside the Nov exam
window; W2 sem 7 master PDFs + sem 6 pages + reels; W3 referral gate ("share to your class group
to unlock the predicted paper") + 8–12 ambassadors + QR posters; W4 sem 6 depth + free model
exam + SEO/schema + GitHub mirror; W5 15–20 reels + club follower swaps + Reddit AMA; W6 CT-I
packs (CT-I ≈ February) + impact numbers + operator notes.

**Targets, not forecasts** (measured weekly against a week-1 baseline): 14–18 live subject pages,
18–22 master PDFs, 1,200–1,800 WhatsApp Channel subscribers, 600–900 Telegram subscribers, 25–35
of an estimated 40–60 class groups seeded, 6,000–10,000 PDF downloads, 8,000–15,000 unique
sessions, 400–600 model-exam registrations, 300+ "what was asked" submissions.

**Total cost ≈ ₹1,500–2,500** for six weeks, zero paid ads.

**Integrity boundaries.** Only already-public papers and our own original analysis. Predicted
papers labelled unofficial. A visible disclaimer and takedown contact. Ask a sympathetic
faculty member before printing posters on campus.

## 9. What the builder must decide

- Exact component decomposition inside `src/components/subject/` and how much of the existing
  sem 6 visual language (UnitDonut, PartBreakdown, Heatmap, YearTable, PYQCards, the cursor and
  shader hero) to reuse versus rebuild generically.
- Whether sem 6 subjects get migrated into `SubjectSpec` in this phase or deferred.
- The PDF build pipeline: script in `scripts/` that renders `SubjectSpec` → PDF via the local
  `pdf` skill / LaTeX / headless Chrome, versus hand-authored files per subject. Preference is
  generated, so page and PDF cannot disagree; if the generator proves too rigid for a
  chart-heavy PDF, fall back to per-subject authored PDFs and accept the drift risk.
- Whether the WhatsApp Channel, Telegram channel and Instagram accounts exist yet or need
  creating, and who runs them.

## 10. Open items for the human partner

1. **`gws auth login`** — one interactive browser step, needed before any Drive upload.
2. **Ambiguity in "75 marks" for the four blockchain electives.** The regulations state the
   75-mark split for theory; the Hyperledger CT notice states 10×1 / 5×4 / 2×10 for the CT.
   We will show both, labelled. If the college uses a different end-sem split for professional
   electives, that is a one-line data change per subject — but it needs to be right, so it is
   flagged here rather than guessed.
3. **Sem 6 scope in this phase.** The plan assumes sem 6 pages stay as they are and sem 7 is
   additive. If the sem 6 pages also need to be brought onto the new shape now, that is extra
   work and changes the calendar.
