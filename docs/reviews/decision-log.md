# Decision log — sem 7 prep site

Reverse-chronological. Each entry: the decision, who made it, and the prompt or finding that drove it.

---

## 2026-11-24 — Subject content is syllabus-driven, not PYQ-driven

**Decision.** All five sem-7 subject pages state plainly that no previous-year end-semester paper
exists for the course, and present pattern-derived analysis instead of a PYQ table.

**Who.** Claude (Claude Code), with the owner approving the "first-time-offered electives, honest
labelling" framing.

**Driver.** The five courses (21CSE432T, 21CSE433T, 21CSE435T, 21CSE436T, 21MEO104T) are
professional and open electives first offered under the SRMIST 2021 regulation. A read-only scan of
the five subject WhatsApp groups found CT/FT papers, unit boundaries and case-study assignments,
but no end-sem paper. The owner's instruction during planning: search the web and read the groups,
but do not message anyone and do not use e-Curricula.

**Consequence.** The "safe combo" claim (the smallest topic set that clears 65 of 75) replaces the
PYQ frequency table as the headline of each page. Every archetype question carries
`source: 'archetype'` and renders the label "Reference archetype — not from an SRM paper".

---

## 2026-11-24 — Master PDFs hosted on Drive with a GitHub Release mirror

**Decision.** Drive is canonical (public, anyone-with-link, one folder per semester). Every PDF is
also uploaded as an asset on a GitHub Release named `sem7-master-pdfs`, and each subject page shows
both links with Drive primary.

**Who.** Owner chose Drive + GitHub Release mirror over Drive-only and over a Cloudflare R2 mirror.

**Driver.** Google Drive throttles heavily shared files ("Too many users have viewed or downloaded
this file recently", typically resetting within ~24 hours), and Google's own help page advises
dedicated hosting for viral files. The free tier also shares 15 GB across Drive/Gmail/Photos and
caps a single file at 600 sharing addresses. A Drive-only strategy fails exactly when it succeeds.

---

## 2026-11-24 — One shared data layer, not one component per subject

**Decision.** Each subject is a typed `SubjectSpec` data file rendered by generic components
(`SubjectAnalysis`, `SubjectMasterSheet`). The sem-6 pages keep their existing components.

**Who.** Claude, with the owner selecting "shared data layer, generic renderer" over "copy the sem 6
shape per subject".

**Driver.** The sem-6 site hardcodes each subject in large components — `ADCAnalysisPage.tsx` is
1288 lines, `SEPMAnalysisPage.tsx` 1032, `PYQMasterSheet.tsx` 909. Copying that shape for five more
subjects is roughly 5,000 lines of near-duplicate JSX, and every future subject costs another
thousand. The owner asked for a rework and a bigger reach; the shared layer is the only option where
subject 6 costs less than subject 1.

---

## 2026-11-24 — Sem-6 pages untouched; only the home grid becomes semester-aware

**Decision.** Existing sem-6 routes, data files and page components are not modified. Only
`src/App.tsx` (route additions) and `src/components/SubjectGrid.tsx` (semester switcher, sem-7
cards, countdown chips) change.

**Who.** Claude, as a scope call stated in the design doc.

**Driver.** The sem-6 pages are live and bookmarked by students. Migrating them onto `SubjectSpec`
is a separate visual-parity job. The sem-7 build must not put a live site at risk.

---

## 2026-11-24 — Master PDFs generated from the same data as the page

**Decision.** One `SubjectSpec` per subject feeds both the web page and the PDF. The PDF is
rendered by printing HTML built from that spec with Playwright's Chromium.

**Who.** Claude.

**Driver.** The design doc's requirement that "page and PDF cannot disagree" is only true if both
read one source. Hand-authored PDFs drift from their page on the first edit.

**Mechanism.** Vite SSR build compiles the TypeScript registry to `dist-pdf/registry.mjs`
(`publicDir: false` is required, otherwise Vite copies `public/` into the output), then a plain
Node script imports it. This recipe was verified working in this repo before the plan was written.

---

## 2026-11-24 — Site type system and card accents left as they are

**Decision.** Inter + JetBrains Mono stay. New sem-7 components must not use a thick one-side accent
border on cards; they use a full border plus a coloured dot or label.

**Who.** Claude, from the impeccable design-hook findings.

**Driver.** Two findings fired: `overused-font inter` and `side-tab` (thick coloured left border),
the latter appearing 8 times across 5 pre-existing sem-6 components. The font is the shipped site
identity — changing it would make the new pages look foreign — so it is persisted as a detector
ignore with a reason. The side-tab pattern is the same generic-AI tell across 8 shipped cards, and
rewriting 5 sem-6 components is a redesign job outside the sem-7 scope. Instead the constraint is
written into the plan's Global Constraints so the pattern stops growing.

---

## 2026-11-23 — Official SRMIST syllabus used as the only content source

**Decision.** Unit names and topic lists are copied verbatim from the SRMIST control copy
`CSE-CS-2021.pdf` (Volume-11-CSE Higher Semester Syllabi for the blockchain electives,
Volume-20 Common Courses for TQM). No topic is paraphrased or invented.

**Who.** Claude.

**Driver.** Extracted from
`https://srmrmp.edu.in/wp-content/uploads/2023/10/CSE-CS-2021.pdf` — pages 388–398 for the
blockchain electives, page 257 for 21MEO104T. Saved to
`C:/Users/ADMIN/Projects/sem7-prep/research/syllabus-units.md`. The official 2021 regulation PDF
(SRMM curriculum PDF, 10 MB) could not be extracted with the local tooling, but the syllabus control
copy contains the same per-course assessment blocks (CLA 50% + CLA-2 10% + end-sem 40%).

---

## 2026-11-23 — e-Curricula portal and WhatsApp messaging excluded from this build

**Decision.** The e-Curricula portal is not used. WhatsApp is read-only: the five subject groups are
read for context, and no message is sent to any group or person.

**Who.** Owner, explicitly: "don't send any message in whatsapp... also nothing will be there in
ecurricula leave ecurricula".

**Driver.** The owner judged e-Curricula irrelevant to this project. WhatsApp is a source, not a
channel we operate.

---

## 2026-11-23 — Growth plan: class WhatsApp groups and a WhatsApp Channel first

**Decision.** Distribution priority is (1) class WhatsApp groups, (2) WhatsApp Channel, (3) Telegram
channel, (4) campus ambassadors, (5) QR posters, (6) reels/Shorts, (7) a free model exam, (8) Reddit
AMA, (9) SEO. Wholesale mass-DM is excluded. The forwarded artifact is a single image card carrying
one number ("N topics = 65 of 75 marks") plus a link.

**Who.** Owner approved the channel set and the Drive hosting model.

**Driver.** Research (mcode agent, 6-week plan, `srmist-cse-exam-site-6week-growth-plan.md`) found
that student study material spreads through peer-to-peer WhatsApp forwarding, not search. SRMIST
already publishes papers officially through DSpace, but as bare handle URLs with no per-subject page,
no unit mapping and no analysis — that gap is the product. Campus ceiling is roughly 3,000–4,000 CSE
students across sem 6 and sem 7, so seeding group by group beats marketing.

---

## 2026-11-23 — Exam pattern confirmed from the regulation and the subject groups

**Decision.** End-semester theory = Part A 20 MCQ × 1 = 20; Part B 5 × 8 = 40, answer any; Part C
2 × 15, answer any 1 = 15; total 75. CT/FT = 10 × 1 + 5 × 4 + 2 × 10 = 50. CLA 60% / end-sem 40%.

**Who.** Claude.

**Driver.** Two independent sources agree: the SRMIST 2021 regulation assessment blocks, and the
Hyperledger subject group's own FT3 notice ("Part A MCQ 10X1=10 Marks | Part B Short answers 5x4=20
Marks | Part C Descriptive 2x10=20 Marks", FT3 on 13.10.2026). The sem-6 site's existing
`adcMasterSheet.ts` header comment states the same end-sem split from three real papers
(Jan 26 FN, Jul 25 FN, May 25 AN).

**Open question.** The Nov-2026 regulations PDF lists 21CSE435T as an open-book exam in one search
result; this could not be verified against a real paper. If that paper is open-book, that subject's
page needs a study-guide shape instead of an exam-archetype shape. Raised with the owner on
2026-11-24 and not yet answered.

---

## 2026-11-24 — Drive folder and GitHub release pre-created before the upload step

**Decision.** The Drive folder `Sem 7 Master PDFs` (id `1smxYHA0tuyz_juQe8gM0EKEeYBrOPhEp`) and the
GitHub release `sem7-master-pdfs` were created up front rather than inside the publish script.

**Who.** Claude.

**Driver.** Both are one-shot API calls that can fail for reasons unrelated to the build — a
Drive permission quirk, a release already existing, a token scope problem. Creating them first
turns "the publish step failed" into "the publish step uploaded into an existing container", and
lets the upload agent focus on the actual upload. The Drive folder was created with the `gws`
CLI using the already-authenticated account.

---

## 2026-11-24 — PDFs are hosted on the site itself, not on public Drive links

**Decision.** The canonical student download is the site's own URL (`/master-pdfs/<FILE>.pdf`,
served from `public/` by Vercel). The GitHub Release `sem7-master-pdfs` is the mirror. The Drive
folder `Sem 7 Master PDFs` (id `1smxYHA0tuyz_juQe8gM0EKEeYBrOPhEp`) is kept as the working copy
the owner uploads from and can share to a domain, but it is NOT the link students get.

**Who.** Claude, after testing the Drive permission API.

**Driver.** The original plan made Drive canonical with an "anyone with the link" permission. That
is impossible on this account. The authenticated Google account is
`aswath@aichargelabs.com`, a Workspace account whose admin policy blocks publishing files outside
the organisation: `gws drive permissions create` with `{"role":"reader","type":"anyone"}` returns
`publishOutNotPermitted`, and domain-scoped sharing is accepted only for `aichargelabs.com`, which
SRM students do not belong to. The earlier e-Curricula project's public links were created under a
different account — the current token can no longer even list their permissions.

Hosting on the site is better on every axis that mattered:
- No Drive quota, no "too many users have viewed this file recently" throttle, no 600-address cap.
- One less hop for the student — no Google sign-in redirect, no Drive preview page.
- The site already serves PDFs from `public/` with the right headers (`vercel.json` sets
  `Content-Type: application/pdf` and `Content-Disposition: inline` for `/(.*)\.pdf`), so the
  mechanism exists and is proven by the sem 6 papers.
- Vercel CDN handles the traffic; GitHub Releases stays as the independent mirror.

**Still true from the original plan:** Drive throttling under viral load was the reason for having
a mirror at all. That reasoning holds — it is just GitHub Releases, not Drive, that carries the
load, and the site carries the primary.

---

## D18 — The master PDF teaches; it does not test

**Decision.** The master PDF for each sem-7 subject contains no questions of any kind — no MCQs, no
model answers, no practice set. It contains teaching material: every topic explained from first
principles, a plain-language analogy, a diagram, and a worked example where the topic is numeric.

**Driver.** The user asked for "something like a master PDF — if they study this they get max marks",
then rejected a question bank explicitly: "i dont want pyqs or questions you have answered". A
question bank cannot deliver that. It tells a student what to memorise; a teaching document tells
them why, so they can answer a question they have never seen. Since no end-sem paper exists for any
of these five subjects (all first-time-offered), the syllabus is the ground truth and the paper
will be written from it — so the notes have to stand on their own.

**What was removed.** The MCQ bank, the answer key, the Part B and Part C question lists, the model
answers, and the on-site "Practice" section. The `mcqs` / `partB` / `partC` data stays in the type
layer and the subject files — it is the CT-bank source and removing it would break the validator and
throw away work — but nothing renders it to a student.

**What replaced it.** A `Topic` grew four fields: `principles` (first principles), `analogy`,
`example` (worked, with real numbers) and `diagram` (a structured spec, not an image). The PDF
template renders them per topic. The site renders the same data through the same renderer, so the
page and the PDF cannot disagree.

## D19 — Diagrams are data, not images

**Decision.** A topic's diagram is a structured spec — `kind` (flow / stack / cycle / compare /
tree / matrix), a node list and edges — rendered to inline SVG by one renderer shared by the site
and the PDF.

**Driver.** The user asked for "good diagrams mostly" in the PDF. Hand-drawn or generated images
would be per-topic image assets: hundreds of files, no way to keep them consistent with the text, no
way to re-style them, and no way to guarantee they render at A4 print resolution. A spec is
versionable, diffable, restyleable and searchable, and the same spec draws on screen and on paper.

## D20 — The site page is an analysis, not a PYQ page

**Decision.** The subject page leads with the verdict (hours, must/should/skip counts, the marks
claim), then the paper blueprint, the marks-per-minute study order, the safe combo, the
answer-writing playbook, and the taught notes per topic. The `pyqNote` copy was reworded from "no
previous paper exists, so this analysis is built from…" to "there is no previous paper to copy, so
this is built from… every topic is ranked must / should / skip".

**Driver.** The user said: "think like a real analyst and let's create analysis page not this pyq
page", and "we need an analysis of which to study that's all". A student opening the page should
leave knowing what to study and in what order, not that a question bank exists. The blueprint
(which is the published SRMIST pattern, not a PYQ) stays — it is the only legitimate reason the
paper shape is known.

## D21 — The Drive button comes off the student page

**Decision.** The Drive link is kept in the data layer and on the Drive folder, but the "Drive copy"
button is removed from the subject page. The two student-facing links are the site's own PDF and the
GitHub Release mirror.

**Driver.** Verified with `curl`: all five Drive file IDs return HTTP 401 with "Sign in" for an
anonymous request. The Workspace admin policy blocks "anyone with the link". A student clicking
"Drive copy" lands on a Google sign-in wall and concludes the site is broken. A button that cannot
work for its audience is worse than no button.
