# Sem 7 growth kit — ready to paste

Everything here is copy-paste. Site: **https://sem6-prep-for-me.vercel.app**

Integrity rules that apply to everything below:
- Every analysis page and PDF says it is **student-made, not an official SRMIST document**.
- No live exam content is ever published. Only already-public material and our own analysis.
- A takedown contact goes on the site before the first external share.

---

## 1. The share mechanic

One image + one link. The card carries the single number a student cares about — how few topics
clear how many marks. The link is the site. Do not send a wall of text; send the card, add one
line, move on.

Cards live at `public/share/<CODE>.png` — five of them, one per subject:

| Card | Subject | Code |
| --- | --- | --- |
| `21CSE435T.png` | Smart Contracts and Application Development | 21CSE435T |
| `21CSE432T.png` | Blockchain Technology with Hyperledger | 21CSE432T |
| `21CSE433T.png` | Blockchain Business Models | 21CSE433T |
| `21CSE436T.png` | Bitcoin Essentials and Use Cases | 21CSE436T |
| `21MEO104T.png` | TQM and Reliability Engineering | 21MEO104T |

The headline on each card is the **first safe-combo claim** for that subject — the exact wording
lives in the subject's `safeCombo[0].claim` field. Read it off the page before posting; do not
paraphrase the number.

---

## 2. WhatsApp Channel post — one per subject

Replace `{CLAIM}` with the subject's safe-combo claim and `{DATE}` with the exam date.

```
{CLAIM}

The full 75-mark breakdown for {SUBJECT} — unit-wise syllabus, what to skip, 20 MCQs with
answers, and the model Part B and Part C questions.

{URL}

Student-made analysis. Not an official SRMIST document.
```

Channel post timings: **T-21 days, T-14 days, T-7 days, T-1 day** for each subject. Same card,
same shape, so subscribers build the habit.

## 3. Class WhatsApp group post — one per subject

Send this to the class rep, not the whole group. The rep posts it. Then follow up with one
direct message to each student who asked for it.

```
Hi — we put together a free analysis for {SUBJECT} ({CODE}), exam {DATE}.

{CLAIM}

Everything in one PDF: unit-wise syllabus, what to skip, the 20 MCQs with answers, and the
model Part B and Part C questions.

{URL}

Made it because reading the syllabus and guessing what comes from it is a waste of a night.
Sharing is fine, just leave the "not official" line on.

{REPLY_TO_THIS_WITH_ANY_MISTAKES — the analysis is written from the official syllabus and the
published 75-mark pattern, so if something looks off, tell me and I'll fix it.}
```

## 4. Five 45-second reel scripts

Each opens with the number, shows one unit of reasoning, closes with the link. Filename and
caption go in the caption; the card image is the thumbnail.

### Reel 1 — "the 75-mark paper is not 5 equal units"

```
HOOK (0-3s, on screen): "75 marks. 5 units. You don't have time for all 5."
BEAT (3-20s): show the unit donut. "Part A is 20 MCQs, one mark each, and they come from
  everywhere. Part B is 5 questions of 8, answer any 4. Part C is 2 of 15, answer any 1 —
  so you only write ONE 15-marker, not two."
BEAT (20-38s): "{CLAIM}. That's the whole plan."
CLOSE (38-45s): the PDF open on screen. "One PDF, everything. Link in bio."
```
Caption: `{CLAIM} — full breakdown for {SUBJECT}: {URL} · not an official SRMIST document`

### Reel 2 — "the honest part"

```
HOOK (0-3s): "There's no previous year paper for this elective. Everyone selling you one
  is making it up. So how do you study?"
BEAT (3-25s): "From the syllabus. Here's the official unit list — 5 units, and here's what
  each one is worth in the paper."
BEAT (25-40s): "{CLAIM}. Same thing, but honest about where the number comes from."
CLOSE (40-45s): "Free, and it says what it is. Link in bio."
```
Caption: `No PYQ exists for this elective. We built the analysis from the official syllabus instead. {URL}`

### Reel 3 — "what to skip"

```
HOOK (0-3s): "You will read every unit. You will fail."
BEAT (3-30s): "Mark the syllabus into three piles: must, should, skip. Then only do the musts.
  That's the safe combo — {CLAIM}."
BEAT (30-40s): "The skip list is the most valuable page on the site."
CLOSE: the page scrolled to the skip items.
```

### Reel 4 — "the question they actually asked"

```
HOOK (0-3s): a real MCQ from the bank, on screen.
BEAT (3-25s): answer it. Then show the explanation — the formula, the rule, why the other
  three options fail.
BEAT (25-40s): "20 of these per subject, with the working shown."
CLOSE: "Free PDF. Link in bio."
```
Caption: `One of the 20 MCQs from {SUBJECT}. Full bank + working: {URL}`

### Reel 5 — "how we know"

```
HOOK (0-3s): "Every question on this site was checked against the official SRMIST syllabus
  and the published exam pattern."
BEAT (3-30s): show the blueprint page, then the unit map with source links.
BEAT (30-40s): "And when your paper comes, tell us what was asked — one form, and next
  semester's analysis gets sharper."
CLOSE: the crowdsource form on screen.
```
Caption: `Built from the official syllabus. Tell us what was asked: {FORM_URL}`

**Form URL:** `https://docs.google.com/forms/d/e/1FAIpQLSf3j8ie04bEhqdU-iluDsBiXAE5VPMG5BNLXbFsTp5HTauETw/viewform`

---

## 5. Six-week calendar

Week 1 starts 24 November 2026, alongside the November end-semester window — the highest-intent
period in the academic year.

| Week | Dates | Ship | Distribute |
| --- | --- | --- | --- |
| 1 | 24–30 Nov | Sem 7 pages for 21CSE435T (paper 25 Nov), 21CSE433T (26 Nov), 21CSE436T (27 Nov) live. Their master PDFs live. | WhatsApp Channel announcement. Card posted to the three subject groups. |
| 2 | 1–7 Dec | 21CSE432T page + PDF (paper 1 Dec). 21MEO104T page + PDF (paper 9 Dec). Semester switcher live on the home page. | Channel drop for each. Repost into the remaining subject groups. |
| 3 | 8–14 Dec | Referral gate: share the card to unlock the predicted paper. 8–12 ambassadors recruited. | QR posters at the Xerox shop, canteen, hostel block. Each poster has its own short link so scans are attributable. |
| 4 | 15–21 Dec | Sem 6 subject pages migrated onto the same template, one subject at a time. Free 75-mark timed model exam with answer key, gated on a phone number. | SEO: per-subject pages with `Course code` + `question paper` in the title, plus schema.org. GitHub mirror live. |
| 5 | 22–28 Dec | 15–20 reels published, 5 per subject. | Club follower swaps (Coding Club, DSA, placement teams). r/SRMUNIVERSITY AMA. |
| 6 | Dec–Jan | CT-I packs (CT-I ≈ February). Impact numbers. Operator notes for whoever runs this next semester. | Channel re-engagement, "CT-I is in 3 weeks" countdown posts. |

## 6. Metrics

Capture the week-1 baseline before anything ships, then report weekly.

| Metric | Baseline | Week-6 target |
| --- | --- | --- |
| Live subject pages with a full analysis | 0 | 14–18 |
| Master PDFs published (site + GitHub release) | 0 | 18–22 |
| WhatsApp Channel subscribers | 0 | 1,200–1,800 |
| Telegram subscribers | 0 | 600–900 |
| Class groups seeded (sem 6 + sem 7 CSE) | 0 | 25–35 of an estimated 40–60 |
| Master PDF downloads | 0 | 6,000–10,000 |
| Unique site sessions | 0 | 8,000–15,000 |
| Model exam registrations | 0 | 400–600 |
| "What was asked" form submissions | 0 | 300+ |
| Drive/hosting incidents | — | track and report; target zero broken links |

**Where the numbers come from:** Vercel Analytics for sessions and downloads, WhatsApp Channel
read counts, and a count of the class groups you posted into. Record the week-1 baseline in
`docs/growth/baseline.md`.

## 7. Budget

| Item | Cost |
| --- | --- |
| Hosting (Vercel) | ₹0 |
| PDFs (site + GitHub Releases) | ₹0 |
| WhatsApp Channel, Telegram, Instagram, YouTube | ₹0 |
| Printing ~30 A3 posters + 100 A4 handouts | ₹300–500 |
| Ambassador stipends (~₹50 × 10) | ₹500 |
| Rides, print of handouts, backup SIM | ₹500 |
| **Total for six weeks** | **≈ ₹1,500–2,500** |

Zero paid ads.

## 8. Integrity rules

1. Every page and PDF carries the line: *Student-made analysis. Not an official SRMIST document.*
2. Predicted papers are labelled **unofficial** everywhere they appear.
3. No live exam content is ever published. Only already-public material and our own analysis.
4. A takedown contact is visible on the site before the first external share.
5. "What was asked" form submissions are used to sharpen the analysis for the next semester —
   never to claim a paper is "confirmed" before it is actually in the public domain.
6. Ask a sympathetic faculty member before putting posters up on campus. One supportive teacher is
   worth more than a hundred posters.
