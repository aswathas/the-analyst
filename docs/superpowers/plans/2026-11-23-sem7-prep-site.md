# Sem 7 Prep Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add five sem-7 subjects to the sem-6 site as data-driven zero-to-hero analysis pages, each with a Drive-hosted master PDF, behind a semester-aware home page.

**Architecture:** One typed `SubjectSpec` per subject in `src/data/subjects/`, rendered by generic components in `src/components/subject/`. Master PDFs are generated from the same `SubjectSpec` data via Playwright's Chromium print-to-PDF, so the page and the PDF cannot disagree. The sem-6 pages are untouched; only the home grid becomes semester-aware.

**Tech Stack:** React 19, TypeScript 6, Vite 8, Tailwind v4, framer-motion, react-router-dom 7, vite-plugin-pwa, Playwright 1.59 (already a devDependency), Google Drive via the `gws` CLI, GitHub Releases via `gh`.

**Spec:** `docs/superpowers/specs/2026-11-23-sem7-prep-design.md`

**Source of truth for syllabus content:** `C:/Users/ADMIN/Projects/sem7-prep/research/syllabus-units.md` — official SRMIST unit-wise topic lists, extracted from the SRMIST control copy `CSE-CS-2021.pdf`. Copy topics verbatim from it; never paraphrase or invent a topic.

## Global Constraints

- End-sem theory structure (SRMIST 2021 regulation): Part A = 20 MCQ × 1 mark = 20. Part B = 5 questions × 8 marks = 40, answer any. Part C = 2 questions × 15 marks = 30, answer any 1 = 15. Total 75.
- CT / FT structure: Part A = 10 MCQ × 1 = 10. Part B = 5 × 4 = 20. Part C = 2 × 10 = 20. Total 50.
- Assessment weight: CLA 60%, end-semester 40%.
- Every subject: 5 units, 9 hours each, 45 hours total, LTPC 3-0-0-3, no pre-requisite courses.
- The five sem-7 courses are first-time-offered professional/open electives. **No end-sem PYQ exists for any of them.** Every page states this. Never label an archetype question as coming from an SRM paper.
- Master PDF: ≤50 pages, one file per subject, filename `<CODE>-<Short-Title>-Master-PDF.pdf`.
- PDF hosting: Drive is canonical (public "anyone with the link"), GitHub Release `sem7-master-pdfs` is the mirror. Every subject page shows both.
- Existing sem-6 pages, routes and data files are not modified except `src/App.tsx` (route additions) and `src/components/SubjectGrid.tsx` (semester-aware rework).
- No new runtime dependency. `@playwright/test` and `playwright` are already devDependencies; Chromium is already downloaded.
- Type system: the site's existing Inter + JetBrains Mono pairing stays. New components use the same pair.
- New sem-7 components must not use a thick one-side accent border (`borderLeft: 3px solid ...`) on cards — that is the site's most recognisable generic-AI tell and it appears on 8 pre-existing sem-6 cards that are not being reworked in this plan. Use a full border plus a small coloured dot or label to carry the unit colour instead.
- Subject exam dates (FN = forenoon, AN = afternoon):
  - 21CSE435T Smart Contracts and Application Development — 2026-11-25 FN
  - 21CSE433T Blockchain Business Models — 2026-11-26 FN
  - 21CSE436T Bitcoin Essentials and Use Cases — 2026-11-27 FN
  - 21CSE432T Blockchain Technology with Hyperledger — 2026-12-01 FN
  - 21MEO104T TQM and Reliability Engineering — 2026-12-09 AN

## Review Focus

- **A subject's question bank does not match the blueprint count.** The page must render the actual array lengths and state the counts, never hardcode "20 MCQs".
- **The exam date is in the past** (a subject's paper is already over). The countdown chip must show a finished state, not a negative number of days.
- **A Drive link is empty or a release URL is missing** (uploads not done yet). The PDF block must render a "coming" state, never a dead anchor that 404s.
- **A narrow phone viewport (375px).** The analysis page must not overflow horizontally; the sem-6 site already has a mobile/desktop split, so the new page must too.
- **A question with the wrong number of options or an out-of-range answer index.** The data validator must reject the build rather than render a broken quiz.

---

### Task 0: Restore a green build

The repository's `main` does not compile: `src/components/CryptoLearnMode.tsx` was committed with `AvalancheDiagram` truncated mid-JSX (an `<svg>` is never closed and the function has no `return`). 116 TypeScript errors. Every task below depends on a working build, so fix it first.

**Files:**
- Modify: `src/components/CryptoLearnMode.tsx`

**Interfaces:**
- Consumes: nothing
- Produces: `npm run build` exits 0. `AvalancheDiagram(): JSX.Element` renders the avalanche-effect SVG.

- [ ] **Step 1: Confirm the failure**

Run: `cd C:/Users/ADMIN/Projects/the-analyst && npm run build 2>&1 | grep "error TS" | head -3`
Expected: errors all in `src/components/CryptoLearnMode.tsx`, first one `TS17008: JSX element 'svg' has no corresponding closing tag` at line 405.

- [ ] **Step 2: Close the truncated SVG**

In `src/components/CryptoLearnMode.tsx`, the `AvalancheDiagram` function ends at the line
`      <rect x="350" y="40" width="28" height="16" fill="#f97316" rx="2" />`
followed by a blank line and `function FeistelDiagram() {`. Replace that blank-line boundary with:

```
      <rect x="350" y="40" width="28" height="16" fill="#f97316" rx="2" />
      <text x="200" y="130" fill="#fff" fontSize="9" textAnchor="middle" fontFamily="monospace">One input bit flips ~half the output bits</text>
      <text x="200" y="146" fill="#7D7D7D" fontSize="8" textAnchor="middle" fontFamily="monospace">SHA-256: any 1-bit change gives a completely different digest</text>
    </svg>
  );
}

function FeistelDiagram() {
```

(Do not change any other function in the file. Do not reformat.)

- [ ] **Step 3: Verify the build passes**

Run: `cd C:/Users/ADMIN/Projects/the-analyst && npm run build`
Expected: exit 0, `✓ built in Ns`, no `error TS` lines.

- [ ] **Step 4: Commit**

```bash
cd C:/Users/ADMIN/Projects/the-analyst
git add src/components/CryptoLearnMode.tsx
git commit -m "fix: close truncated avalanche SVG so the site compiles

Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

---

### Task 1: Subject data types, registry, and validator

The shared shape every subject page and every master PDF reads from. Everything downstream depends on this file.

**Files:**
- Create: `src/data/subjects/types.ts`
- Create: `src/data/subjects/index.ts`
- Create: `src/data/subjects/validate.ts`
- Test: `tests/subjects.spec.ts`
- Create: `playwright.config.ts`

**Interfaces:**
- Consumes: nothing
- Produces:
  - `types.ts` exports `Priority`, `Topic`, `Unit`, `MCQ`, `LongQuestion`, `SafeCombo`, `Blueprint`, `Resource`, `SubjectSpec`, `PdfLinks`.
  - `validate.ts` exports `validateSubject(spec: SubjectSpec): string[]` — returns a list of human-readable problems, empty array means valid.
  - `index.ts` exports `SUBJECTS: SubjectSpec[]`, `getSubject(code: string): SubjectSpec | undefined`, `semesters(): number[]`, `subjectsBySemester(sem: number): SubjectSpec[]`.
  - `playwright.config.ts` exports a Playwright config with `webServer` running `npm run dev` on port 5173 and `baseURL: 'http://localhost:5173'`.

- [ ] **Step 1: Write the failing validator test**

Create `tests/subjects.spec.ts`:

```ts
import { test, expect } from '@playwright/test';
import { validateSubject } from '../src/data/subjects/validate';
import type { SubjectSpec } from '../src/data/subjects/types';

const base: SubjectSpec = {
  code: 'TEST000T',
  title: 'Test Subject',
  shortTitle: 'Test',
  category: 'professional-elective',
  semester: 7,
  examDate: '2026-12-01',
  examSession: 'FN',
  accent: '#0066cc',
  hours: 45,
  credits: 3,
  oneLiner: 'A test subject',
  pyqStatus: 'none-first-offered',
  pyqNote: 'First-time-offered elective.',
  units: [
    { unit: 1, name: 'Unit One', hours: 9, topics: [{ name: 'Topic A', priority: 'must', minutes: 30 }] },
    { unit: 2, name: 'Unit Two', hours: 9, topics: [{ name: 'Topic B', priority: 'should', minutes: 20 }] },
    { unit: 3, name: 'Unit Three', hours: 9, topics: [{ name: 'Topic C', priority: 'skip', minutes: 10 }] },
    { unit: 4, name: 'Unit Four', hours: 9, topics: [{ name: 'Topic D', priority: 'must', minutes: 25 }] },
    { unit: 5, name: 'Unit Five', hours: 9, topics: [{ name: 'Topic E', priority: 'should', minutes: 15 }] },
  ],
  blueprint: { partA: { count: 2, marksEach: 1 }, partB: { count: 1, marksEach: 8, answerAny: 1 }, partC: { count: 1, marksEach: 15, answerAny: 1 }, total: 24 },
  safeCombo: [{ unit: 1, topics: ['Topic A'], marks: 30, claim: 'Topic A alone carries it' }],
  mcqs: [
    { id: 'm1', unit: 1, topic: 'Topic A', question: 'Q1?', options: ['a', 'b', 'c', 'd'], correct: 0, explanation: 'because a', source: 'archetype' },
    { id: 'm2', unit: 2, topic: 'Topic B', question: 'Q2?', options: ['a', 'b', 'c', 'd'], correct: 3, explanation: 'because d', source: 'archetype' },
  ],
  partB: [{ id: 'b1', unit: 1, marks: 8, question: 'B1?', modelAnswer: ['point one', 'point two'], keyPoints: ['point one'] }],
  partC: [{ id: 'c1', unit: 1, marks: 15, question: 'C1?', modelAnswer: ['step one'], keyPoints: ['step one'] }],
  ct: { mcqs: [], partB: [], partC: [] },
  resources: [{ label: 'Official syllabus PDF', url: 'https://example.com/s.pdf', note: 'SRMIST control copy' }],
};

test('a valid subject produces no problems', () => {
  expect(validateSubject(base)).toEqual([]);
});

test('a subject with the wrong unit count is rejected', () => {
  const bad = { ...base, units: base.units.slice(0, 4) };
  expect(validateSubject(bad).join(' ')).toContain('5 units');
});

test('a subject whose blueprint does not total 75 is rejected', () => {
  const bad = { ...base, blueprint: { ...base.blueprint, total: 70 } };
  expect(validateSubject(bad).join(' ')).toContain('75');
});

test('a question with three options is rejected', () => {
  const bad = { ...base, mcqs: [{ ...base.mcqs[0], options: ['a', 'b', 'c'] }] };
  expect(validateSubject(bad).join(' ')).toContain('4 options');
});

test('a question with an out-of-range answer index is rejected', () => {
  const bad = { ...base, mcqs: [{ ...base.mcqs[0], correct: 7 }] };
  expect(validateSubject(bad).join(' ')).toContain('answer index');
});

test('a safe combo that claims more marks than the paper is rejected', () => {
  const bad = { ...base, safeCombo: [{ ...base.safeCombo[0], marks: 90 }] };
  expect(validateSubject(bad).join(' ')).toContain('safe combo');
});

test('a first-time-offered subject must carry the pyq note', () => {
  const bad = { ...base, pyqNote: '' };
  expect(validateSubject(bad).join(' ')).toContain('pyqNote');
});
```

- [ ] **Step 2: Create the Playwright config and run the test to see it fail**

Create `playwright.config.ts`:

```ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  reporter: [['list']],
  use: { baseURL: 'http://localhost:5173', trace: 'on-first-retry' },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npm run dev -- --port 5173 --strictPort',
    url: 'http://localhost:5173',
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
```

Run: `cd C:/Users/ADMIN/Projects/the-analyst && npx playwright test tests/subjects.spec.ts`
Expected: FAIL — "Cannot find module '../src/data/subjects/validate'".

- [ ] **Step 3: Write `src/data/subjects/types.ts`**

```ts
export type Priority = 'must' | 'should' | 'skip';

export interface Topic {
  /** Topic name copied verbatim from the official SRMIST syllabus. */
  name: string;
  priority: Priority;
  /** Estimated minutes to study this topic. */
  minutes: number;
  /** Why this topic matters for the paper, and what an exam question on it looks like. */
  why?: string;
}

export interface Unit {
  unit: number;
  name: string;
  hours: number;
  topics: Topic[];
}

export interface MCQ {
  id: string;
  unit: number;
  topic: string;
  question: string;
  /** Exactly 4 options. */
  options: string[];
  /** Index into options, 0-3. */
  correct: number;
  explanation: string;
  /** 'archetype' = standard exam-style question, NOT from an SRM paper. 'paper' = from a real published paper. */
  source: 'archetype' | 'paper';
}

export interface LongQuestion {
  id: string;
  unit: number;
  marks: number;
  question: string;
  /** Model answer as ordered points. */
  modelAnswer: string[];
  keyPoints: string[];
}

export interface SafeCombo {
  unit: number;
  topics: string[];
  /** Marks this topic set is expected to yield. Must not exceed the paper total. */
  marks: number;
  /** The student-facing claim, e.g. "7 topics clear 65 of 75". */
  claim: string;
}

export interface Blueprint {
  partA: { count: number; marksEach: number };
  partB: { count: number; marksEach: number; answerAny: number };
  partC: { count: number; marksEach: number; answerAny: number };
  total: number;
}

export interface Resource {
  label: string;
  url?: string;
  note?: string;
}

export interface PdfLinks {
  /** Public Drive file id or link. Empty string means not uploaded yet. */
  driveUrl: string;
  /** GitHub release asset URL. Empty string means not uploaded yet. */
  releaseUrl: string;
  pages: number;
}

export interface SubjectSpec {
  code: string;
  title: string;
  shortTitle: string;
  category: 'core' | 'professional-elective' | 'open-elective';
  semester: number;
  /** ISO date, e.g. '2026-12-01'. */
  examDate: string;
  examSession: 'FN' | 'AN';
  accent: string;
  hours: number;
  credits: number;
  oneLiner: string;
  pyqStatus: 'none-first-offered' | 'papers-available';
  pyqNote: string;
  units: Unit[];
  blueprint: Blueprint;
  safeCombo: SafeCombo[];
  mcqs: MCQ[];
  partB: LongQuestion[];
  partC: LongQuestion[];
  ct: { mcqs: MCQ[]; partB: LongQuestion[]; partC: LongQuestion[] };
  resources: Resource[];
  pdf?: PdfLinks;
}
```

- [ ] **Step 4: Write `src/data/subjects/validate.ts`**

Signature: `export function validateSubject(spec: SubjectSpec): string[]` — returns one string per problem, an empty array when the subject is valid. Every problem string must contain the code, then the problem.

Rules to implement, one check each:
1. `spec.units.length` must be 5 → otherwise a message containing `5 units`.
2. `spec.units[i].unit` must equal `i + 1`.
3. `spec.units[i].hours` must be 9.
4. `spec.units[i].topics.length` must be greater than 0.
5. `spec.blueprint.total` must be 75 → otherwise a message containing `75`.
6. `partA.count * partA.marksEach + partB.count * partB.marksEach + partC.answerAny * partC.marksEach` must equal 75.
7. Every question in `[...spec.mcqs, ...spec.ct.mcqs]` must have exactly 4 `options` → otherwise a message containing `4 options`.
8. Every question's `correct` must be between 0 and 3 inclusive → otherwise a message containing `answer index`.
9. Every question must have a non-empty `explanation`.
10. `spec.mcqs.length` must equal `spec.blueprint.partA.count`; `spec.partB.length` must equal `spec.blueprint.partB.count`; `spec.partC.length` must equal `spec.blueprint.partC.count`.
11. Every `safeCombo` entry's `marks` must be at most 75 → otherwise a message containing `safe combo`.
12. Every `safeCombo` entry's `claim` must be non-empty.
13. When `spec.pyqStatus === 'none-first-offered'`, `spec.pyqNote` must be non-empty → otherwise a message containing `pyqNote`.
14. `spec.code` must match `/^21[A-Z]{3}\d{3}[A-Z]$/`.
15. `spec.examDate` must match `/^\d{4}-\d{2}-\d{2}$/`.

- [ ] **Step 5: Write `src/data/subjects/index.ts`**

Start with an empty registry; Task 2 through Task 6 add subjects.

```ts
import type { SubjectSpec } from './types';

export const SUBJECTS: SubjectSpec[] = [];

export function getSubject(code: string): SubjectSpec | undefined {
  return SUBJECTS.find((s) => s.code.toLowerCase() === code.toLowerCase());
}

export function semesters(): number[] {
  return [...new Set(SUBJECTS.map((s) => s.semester))].sort((a, b) => b - a);
}

export function subjectsBySemester(sem: number): SubjectSpec[] {
  return SUBJECTS.filter((s) => s.semester === sem);
}
```

- [ ] **Step 6: Run the test to verify it passes**

Run: `cd C:/Users/ADMIN/Projects/the-analyst && npx playwright test tests/subjects.spec.ts`
Expected: PASS, 7 tests.

- [ ] **Step 7: Commit**

```bash
cd C:/Users/ADMIN/Projects/the-analyst
git add src/data/subjects/types.ts src/data/subjects/index.ts src/data/subjects/validate.ts tests/subjects.spec.ts playwright.config.ts
git commit -m "feat: subject data model, registry and validator

Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

---

### Task 2: Smart Contracts and Application Development (21CSE435T)

First of five subject-content tasks. Each has the same shape: one data file, one validator test, one commit. Content is delegated (see the delegation note at the end of this task).

**Files:**
- Create: `src/data/subjects/21cse435t.ts`
- Modify: `src/data/subjects/index.ts`
- Test: `tests/subjects.spec.ts`

**Interfaces:**
- Consumes: `SubjectSpec` from `src/data/subjects/types.ts`; `validateSubject` from `src/data/subjects/validate.ts`.
- Produces: `SMART_CONTRACTS_21CSE435T: SubjectSpec`, exported and added to `SUBJECTS`.

- [ ] **Step 1: Write the failing content test**

Append to `tests/subjects.spec.ts`:

```ts
import { SMART_CONTRACTS_21CSE435T } from '../src/data/subjects/21cse435t';

test('21CSE435T subject data is valid', () => {
  expect(validateSubject(SMART_CONTRACTS_21CSE435T)).toEqual([]);
});

test('21CSE435T carries the official five unit names', () => {
  expect(SMART_CONTRACTS_21CSE435T.units.map((u) => u.name)).toEqual([
    'Blockchain Concepts',
    'Smart Contracts',
    'Blockchain Application Templates & Ethereum Development Tools',
    'Decentralized Applications, Mining & Swarm',
    'Advanced Topics on Blockchain',
  ]);
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `cd C:/Users/ADMIN/Projects/the-analyst && npx playwright test tests/subjects.spec.ts`
Expected: FAIL — "Cannot find module '../src/data/subjects/21cse435t'".

- [ ] **Step 3: Write `src/data/subjects/21cse435t.ts`**

Content requirements, all from `C:/Users/ADMIN/Projects/sem7-prep/research/syllabus-units.md`:

- `code: '21CSE435T'`, `title: 'Smart Contracts and Application Development'`, `shortTitle: 'Smart Contracts'`, `category: 'professional-elective'`, `semester: 7`, `examDate: '2026-11-25'`, `examSession: 'FN'`, `hours: 45`, `credits: 3`.
- `accent: '#7c3aed'`.
- `oneLiner: 'How smart contracts work on Ethereum — Solidity, gas, dApps, consensus and the vulnerabilities that cost real money.'`
- `pyqStatus: 'none-first-offered'`, `pyqNote: 'First-time-offered professional elective. No end-semester paper exists yet — this analysis is built from the official unit-wise syllabus and the published 75-mark pattern.'`
- `units`: exactly the five units above, each with `hours: 9`, and `topics` copied verbatim from the syllabus file's Unit 1–5 topic lists. Assign `priority` (`must` for topics that are core exam material, `should` for supporting ones, `skip` for niche ones), `minutes`, and a one-line `why` naming the question style that topic produces.
- `blueprint`: `{ partA: { count: 20, marksEach: 1 }, partB: { count: 5, marksEach: 8, answerAny: 5 }, partC: { count: 2, marksEach: 15, answerAny: 1 }, total: 75 }`.
- `safeCombo`: entries whose `marks` sum to at most 75, one entry per unit that carries real weight, each with a concrete `claim` such as `'Unit 2 + Unit 5 alone clear 55 of 75'`. The first entry's claim must be the headline the share card will use — target 65 of 75.
- `mcqs`: 20 questions, `source: 'archetype'`, spread across the five units, `options` exactly 4, `correct` a valid index, `explanation` one or two sentences that teach rather than restate.
- `partB`: 5 questions of 8 marks each with `modelAnswer` of 4–6 ordered points and `keyPoints`.
- `partC`: 2 questions of 15 marks each — one analytical ("compare and evaluate"), one applied ("design/scenario") — with `modelAnswer` of 6–8 points.
- `ct`: 10 MCQs, 5 Part B of 4 marks, 2 Part C of 10 marks, following the CT structure.
- `resources`: the official SRMIST syllabus PDF (`https://srmrmp.edu.in/wp-content/uploads/2023/10/CSE-CS-2021.pdf`, note "pages 394–395, SRMIST control copy"), the four Learning Resources books from the syllabus file, and the local course deck `C:/Users/ADMIN/OneDrive/SmartContract-21CSE435T/SmartContract-A-Promise-That-Keeps-Itself.pdf`.

- [ ] **Step 4: Register the subject**

In `src/data/subjects/index.ts`, add:

```ts
import { SMART_CONTRACTS_21CSE435T } from './21cse435t';

export const SUBJECTS: SubjectSpec[] = [SMART_CONTRACTS_21CSE435T];
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `cd C:/Users/ADMIN/Projects/the-analyst && npx playwright test tests/subjects.spec.ts`
Expected: PASS, all tests including the two new ones.

- [ ] **Step 6: Commit**

```bash
cd C:/Users/ADMIN/Projects/the-analyst
git add src/data/subjects/21cse435t.ts src/data/subjects/index.ts tests/subjects.spec.ts
git commit -m "feat: add 21CSE435T Smart Contracts subject data

Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

---

### Task 3: Blockchain Technology with Hyperledger (21CSE432T)

**Files:**
- Create: `src/data/subjects/21cse432t.ts`
- Modify: `src/data/subjects/index.ts`
- Test: `tests/subjects.spec.ts`

**Interfaces:**
- Consumes: `SubjectSpec`, `validateSubject`.
- Produces: `HYPERLEDGER_21CSE432T: SubjectSpec`.

- [ ] **Step 1: Write the failing content test**

Append to `tests/subjects.spec.ts`:

```ts
import { HYPERLEDGER_21CSE432T } from '../src/data/subjects/21cse432t';

test('21CSE432T subject data is valid', () => {
  expect(validateSubject(HYPERLEDGER_21CSE432T)).toEqual([]);
});

test('21CSE432T carries the official five unit names', () => {
  expect(HYPERLEDGER_21CSE432T.units.map((u) => u.name)).toEqual([
    'Blockchain: An Enterprise and Industry Perspective',
    'Transactions and Business Networks',
    'Setting the Stage with a Business Scenario',
    'Designing Smart Contract Transactions and Ledger Data Structures',
    'Developing Smart Contracts and Use Cases',
  ]);
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `cd C:/Users/ADMIN/Projects/the-analyst && npx playwright test tests/subjects.spec.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Write `src/data/subjects/21cse432t.ts`**

Same content rules as Task 2, with these fixed values: `code: '21CSE432T'`, `title: 'Blockchain Technology with Hyperledger'`, `shortTitle: 'Hyperledger'`, `category: 'professional-elective'`, `semester: 7`, `examDate: '2026-12-01'`, `examSession: 'FN'`, `accent: '#0891b2'`, `hours: 45`, `credits: 3`. Units exactly as in the test, topics verbatim from the syllabus file. The syllabus file also lists the course's Learning Rationale and Learning Resources — use the resources (Nitin Gaur's *Blockchain with Hyperledger Fabric* 2nd ed, Nakul Shah, the Hyperledger Cookbook, the Fabric docs tutorials URL) as `resources`. The unit-5 topic set includes the case-study topics on supply chain and government — mark those `skip` for the written paper and explain why in `why` (they are practical-component work), which is the kind of judgement that makes the safe combo credible.

- [ ] **Step 4: Register the subject**

In `src/data/subjects/index.ts` add the import and put `HYPERLEDGER_21CSE432T` after `SMART_CONTRACTS_21CSE435T` in the `SUBJECTS` array.

- [ ] **Step 5: Run the test to verify it passes**

Run: `cd C:/Users/ADMIN/Projects/the-analyst && npx playwright test tests/subjects.spec.ts`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
cd C:/Users/ADMIN/Projects/the-analyst
git add src/data/subjects/21cse432t.ts src/data/subjects/index.ts tests/subjects.spec.ts
git commit -m "feat: add 21CSE432T Hyperledger subject data

Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

---

### Task 4: Blockchain Business Models (21CSE433T)

**Files:**
- Create: `src/data/subjects/21cse433t.ts`
- Modify: `src/data/subjects/index.ts`
- Test: `tests/subjects.spec.ts`

**Interfaces:**
- Consumes: `SubjectSpec`, `validateSubject`.
- Produces: `BUSINESS_MODELS_21CSE433T: SubjectSpec`.

- [ ] **Step 1: Write the failing content test**

Append to `tests/subjects.spec.ts`:

```ts
import { BUSINESS_MODELS_21CSE433T } from '../src/data/subjects/21cse433t';

test('21CSE433T subject data is valid', () => {
  expect(validateSubject(BUSINESS_MODELS_21CSE433T)).toEqual([]);
});

test('21CSE433T carries the official five unit names', () => {
  expect(BUSINESS_MODELS_21CSE433T.units.map((u) => u.name)).toEqual([
    'Introduction to Blockchain Technologies',
    'Cryptography',
    'Consensus Mechanisms',
    'Data Structure of Blockchain',
    'Blockchain Business Models',
  ]);
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `cd C:/Users/ADMIN/Projects/the-analyst && npx playwright test tests/subjects.spec.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Write `src/data/subjects/21cse433t.ts`**

Same content rules as Task 2, with: `code: '21CSE433T'`, `title: 'Blockchain Business Models'`, `shortTitle: 'Business Models'`, `category: 'professional-elective'`, `semester: 7`, `examDate: '2026-11-26'`, `examSession: 'FN'`, `accent: '#dc2626'`, `hours: 45`, `credits: 3`. Every unit in this course carries a Case Study in the official syllabus — mark the case-study items `skip` for the written paper and explain in `why` that they are assignment work, not written-paper material. Units 2 (Cryptography, SHA-256) and 3 (Consensus, PoW/PoS/PoB/PoA/PoET/SBFT) carry the heaviest written-paper weight; the safe combo must reflect that.

- [ ] **Step 4: Register the subject**

Add the import and append `BUSINESS_MODELS_21CSE433T` to the `SUBJECTS` array.

- [ ] **Step 5: Run the test to verify it passes**

Run: `cd C:/Users/ADMIN/Projects/the-analyst && npx playwright test tests/subjects.spec.ts`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
cd C:/Users/ADMIN/Projects/the-analyst
git add src/data/subjects/21cse433t.ts src/data/subjects/index.ts tests/subjects.spec.ts
git commit -m "feat: add 21CSE433T Blockchain Business Models subject data

Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

---

### Task 5: Bitcoin Essentials and Use Cases (21CSE436T)

**Files:**
- Create: `src/data/subjects/21cse436t.ts`
- Modify: `src/data/subjects/index.ts`
- Test: `tests/subjects.spec.ts`

**Interfaces:**
- Consumes: `SubjectSpec`, `validateSubject`.
- Produces: `BITCOIN_21CSE436T: SubjectSpec`.

- [ ] **Step 1: Write the failing content test**

Append to `tests/subjects.spec.ts`:

```ts
import { BITCOIN_21CSE436T } from '../src/data/subjects/21cse436t';

test('21CSE436T subject data is valid', () => {
  expect(validateSubject(BITCOIN_21CSE436T)).toEqual([]);
});

test('21CSE436T carries the official five unit names', () => {
  expect(BITCOIN_21CSE436T.units.map((u) => u.name)).toEqual([
    'Bitcoin (BTC) Introduction',
    'Bitcoin Network',
    'Bitcoin Mining',
    'Mechanics of Bitcoin',
    'Bitcoin Use Case',
  ]);
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `cd C:/Users/ADMIN/Projects/the-analyst && npx playwright test tests/subjects.spec.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Write `src/data/subjects/21cse436t.ts`**

Same content rules as Task 2, with: `code: '21CSE436T'`, `title: 'Bitcoin Essentials and Use Cases'`, `shortTitle: 'Bitcoin'`, `category: 'professional-elective'`, `semester: 7`, `examDate: '2026-11-27'`, `examSession: 'FN'`, `accent: '#f59e0b'`, `hours: 45`, `credits: 3`.

- [ ] **Step 4: Register the subject**

Add the import and append `BITCOIN_21CSE436T` to the `SUBJECTS` array.

- [ ] **Step 5: Run the test to verify it passes**

Run: `cd C:/Users/ADMIN/Projects/the-analyst && npx playwright test tests/subjects.spec.ts`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
cd C:/Users/ADMIN/Projects/the-analyst
git add src/data/subjects/21cse436t.ts src/data/subjects/index.ts tests/subjects.spec.ts
git commit -m "feat: add 21CSE436T Bitcoin Essentials subject data

Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

---

### Task 6: TQM and Reliability Engineering (21MEO104T)

The only open elective, and the only one with a sibling course already on the site, so its syllabus file has the most content.

**Files:**
- Create: `src/data/subjects/21meo104t.ts`
- Modify: `src/data/subjects/index.ts`
- Test: `tests/subjects.spec.ts`

**Interfaces:**
- Consumes: `SubjectSpec`, `validateSubject`.
- Produces: `TQM_21MEO104T: SubjectSpec`.

- [ ] **Step 1: Write the failing content test**

Append to `tests/subjects.spec.ts`:

```ts
import { TQM_21MEO104T } from '../src/data/subjects/21meo104t';

test('21MEO104T subject data is valid', () => {
  expect(validateSubject(TQM_21MEO104T)).toEqual([]);
});

test('21MEO104T carries the official five unit names', () => {
  expect(TQM_21MEO104T.units.map((u) => u.name)).toEqual([
    'Evolution, Theories and Implementation',
    'Principles and 7 QC Tools',
    'Management Tools',
    'Reliability',
    'Maintainability',
  ]);
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `cd C:/Users/ADMIN/Projects/the-analyst && npx playwright test tests/subjects.spec.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Write `src/data/subjects/21meo104t.ts`**

Same content rules as Task 2, with: `code: '21MEO104T'`, `title: 'TQM and Reliability Engineering'`, `shortTitle: 'TQM & Reliability'`, `category: 'open-elective'`, `semester: 7`, `examDate: '2026-12-09'`, `examSession: 'AN'`, `accent: '#10b981'`, `hours: 45`, `credits: 3`.

This course is quantitative in units 4 and 5 (Weibull, hazard rate, series/parallel reliability, MTTR, OEE). The MCQ bank must contain calculation questions with worked numeric explanations, and the Part B set must include at least one reliability-configuration calculation and one 7-QC-tool application. The syllabus file's Learning Resources list (Poonia & Sharma, Besterfield, Oakland, Srinath, Balagurusamy, Ebeling) becomes the `resources` entries.

- [ ] **Step 4: Register the subject**

Add the import and append `TQM_21MEO104T` to the `SUBJECTS` array.

- [ ] **Step 5: Run the test to verify it passes**

Run: `cd C:/Users/ADMIN/Projects/the-analyst && npx playwright test tests/subjects.spec.ts`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
cd C:/Users/ADMIN/Projects/the-analyst
git add src/data/subjects/21meo104t.ts src/data/subjects/index.ts tests/subjects.spec.ts
git commit -m "feat: add 21MEO104T TQM and Reliability subject data

Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

---

### Task 7: Generic subject analysis page and route

One component that renders any `SubjectSpec`. This is the page a student lands on.

**Files:**
- Create: `src/components/subject/SubjectAnalysis.tsx`
- Create: `src/components/subject/SafeComboPanel.tsx`
- Create: `src/components/subject/BlueprintPanel.tsx`
- Create: `src/components/subject/UnitBreakdown.tsx`
- Create: `src/components/subject/QuestionBank.tsx`
- Create: `src/components/subject/PdfDownload.tsx`
- Create: `src/components/subject/CountdownChip.tsx`
- Create: `src/components/subject/UnitDonutGeneric.tsx`
- Modify: `src/App.tsx`
- Test: `tests/subject-page.spec.ts`

**Interfaces:**
- Consumes: `SubjectSpec` from `src/data/subjects/types.ts`.
- Produces:
  - `SubjectAnalysis({ spec, onBack }: { spec: SubjectSpec; onBack: () => void })`
  - `CountdownChip({ examDate, examSession }: { examDate: string; examSession: 'FN' | 'AN' })`
  - `PdfDownload({ pdf, code, shortTitle }: { pdf?: PdfLinks; code: string; shortTitle: string })`
  - Route `/subject/:code` renders `SubjectAnalysis` for the matching subject, and `/subject/:code/master` renders the master sheet (Task 8).

- [ ] **Step 1: Write the failing page test**

Create `tests/subject-page.spec.ts`:

```ts
import { test, expect } from '@playwright/test';

test('a sem 7 subject page renders the code, title and blueprint', async ({ page }) => {
  await page.goto('/subject/21CSE435T');
  await expect(page.getByTestId('subject-code')).toHaveText('21CSE435T');
  await expect(page.getByTestId('subject-title')).toContainText('Smart Contracts and Application Development');
  await expect(page.getByTestId('blueprint-partA')).toContainText('20');
  await expect(page.getByTestId('blueprint-partB')).toContainText('8');
  await expect(page.getByTestId('blueprint-partC')).toContainText('15');
});

test('the safe combo claim is shown', async ({ page }) => {
  await page.goto('/subject/21CSE436T');
  await expect(page.getByTestId('safe-combo-claim').first()).toContainText('of 75');
});

test('the page states that no previous-year paper exists', async ({ page }) => {
  await page.goto('/subject/21MEO104T');
  await expect(page.getByTestId('pyq-note')).toContainText('First-time-offered');
});

test('the question bank shows the real count of MCQs', async ({ page }) => {
  await page.goto('/subject/21CSE432T');
  await expect(page.getByTestId('mcq-count')).toHaveText('20');
});

test('an unknown subject code shows a not-found message, not a blank page', async ({ page }) => {
  await page.goto('/subject/21ZZZ999T');
  await expect(page.getByTestId('subject-not-found')).toBeVisible();
});

test('the countdown chip renders', async ({ page }) => {
  await page.goto('/subject/21CSE435T');
  await expect(page.getByTestId('countdown')).toBeVisible();
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `cd C:/Users/ADMIN/Projects/the-analyst && npx playwright test tests/subject-page.spec.ts`
Expected: FAIL — route `/subject/21CSE435T` returns the 404-less blank shell, so `subject-code` is not found.

- [ ] **Step 3: Write `src/components/subject/CountdownChip.tsx`**

```tsx
export function CountdownChip({ examDate, examSession }: { examDate: string; examSession: 'FN' | 'AN' }) {
  const target = new Date(`${examDate}T09:00:00`).getTime();
  const now = Date.now();
  const days = Math.ceil((target - now) / 86_400_000);

  let label: string;
  let tone: string;
  if (days < 0) {
    label = 'Exam over';
    tone = '#6e6e73';
  } else if (days === 0) {
    label = `Exam today · ${examSession}`;
    tone = '#dc2626';
  } else {
    label = `${days} day${days === 1 ? '' : 's'} to exam`;
    tone = days <= 3 ? '#dc2626' : '#0066cc';
  }

  return (
    <span data-testid="countdown" style={{ background: `${tone}14`, color: tone, border: `1px solid ${tone}33`, borderRadius: 999, padding: '4px 12px', fontSize: 13, fontWeight: 600 }}>
      {label}
    </span>
  );
}
```

- [ ] **Step 4: Write `src/components/subject/BlueprintPanel.tsx`**

Renders the exam structure as three rows plus the total. The Part A row shows `partA.count` MCQs at `partA.marksEach` marks; Part B shows `partB.count` questions at `partB.marksEach` marks with "answer any" and its total; Part C shows `partC.count` questions at `partC.marksEach` marks with "answer any {answerAny}". Put `data-testid="blueprint-partA"`, `blueprint-partB`, `blueprint-partC` on the three rows and `blueprint-total` on the total row. The Part A count cell must read exactly the number of MCQs (e.g. `20`) so the test `toContainText('20')` is meaningful, and the same cell must not contain unrelated digits.

- [ ] **Step 5: Write `src/components/subject/SafeComboPanel.tsx`**

Renders `spec.safeCombo` as a list of cards. The first card shows `claim` inside `data-testid="safe-combo-claim"`, then the unit, the topic names, and the marks. Every `claim` string must contain the phrase `of 75` so the share card and the page agree; the validator in Task 1 does not enforce this, so the page renders the claim verbatim.

- [ ] **Step 6: Write `src/components/subject/UnitBreakdown.tsx`**

Renders the five units in order. For each unit: the unit number and name in a header row that carries the unit colour as a small coloured dot (not a side border), and a table of its topics with a priority badge (`must` = red, `should` = amber, `skip` = grey), the estimated minutes, and the `why` line. Add a per-unit total minutes line.

- [ ] **Step 7: Write `src/components/subject/QuestionBank.tsx`**

Three sections: Part A MCQs, Part B, Part C. The MCQ section header shows the real count in `data-testid="mcq-count"` — the text must be exactly the number, e.g. `20`. Each MCQ renders the question, four options, a reveal-the-answer toggle, the correct option highlighted, and the explanation. Show a small `source` label: `Reference archetype — not from an SRM paper` for `source: 'archetype'`, and the paper name for `source: 'paper'`. Part B and Part C questions show the marks, the model answer points and the key points behind a toggle.

- [ ] **Step 8: Write `src/components/subject/PdfDownload.tsx`**

```tsx
export function PdfDownload({ pdf, code, shortTitle }: { pdf?: PdfLinks; code: string; shortTitle: string }) {
  if (!pdf || (!pdf.driveUrl && !pdf.releaseUrl)) {
    return (
      <div data-testid="pdf-coming" style={{ padding: 16, borderRadius: 12, border: '1px dashed rgba(0,0,0,0.15)', color: '#6e6e73' }}>
        Master PDF for {code} is being generated. Check back before the exam.
      </div>
    );
  }
  ...
}
```

When links exist, render the Drive link as the primary button (`data-testid="pdf-drive"`, `href={pdf.driveUrl}`, `target="_blank"`, `rel="noreferrer"`), the release URL as `data-testid="pdf-mirror"` labelled "Mirror (if Drive is busy)", and the page count from `pdf.pages`.

- [ ] **Step 9: Write `src/components/subject/SubjectAnalysis.tsx`**

Assemble the seven blocks in the order: header (code, title, category badge, one-liner, countdown), the honesty line (`pyqNote` inside `data-testid="pyq-note"`), blueprint, safe combo, unit breakdown, practice (question bank), resources, PDF download, and a "what was asked in the paper?" link to `https://docs.google.com/forms/d/e/1FAIpQLSf3j8ie04bEhqdU-iluDsBiXAE5VPMG5BNLXbFsTp5HTauETw/viewform` labelled as the crowdsource form. That form already exists (created 2026-11-24 via the Google Forms API, formId `1aKvUI-WAwFsIaFWdrRtakzsBE5QOpJdEgtIUP1TGHFw`) and asks for subject, unit, the question as printed, marks and anything else worth remembering.

Use `data-testid="subject-code"` and `data-testid="subject-title"` on the header. Match the site's existing visual language: white cards, `borderRadius: 18`, `border: 1px solid rgba(0,0,0,0.08)`, Inter/system font, dark-mode via the `THEME_VARS` CSS variables already defined in `src/App.tsx`. Reuse the existing `UnitDonut` component's look for a unit-weight donut by passing the subject's units — `UnitDonut` currently hardcodes three units, so in this task create `src/components/subject/UnitDonutGeneric.tsx` that takes `{ unit, label, pct, color }[]` instead, and do not modify the existing `UnitDonut`.

- [ ] **Step 10: Add the route**

In `src/App.tsx`, add a wrapper component and the routes. Insert after the existing `CryptoLearnModeWrapper`:

```tsx
function SubjectAnalysisWrapper() {
  const { code } = useParams();
  const navigate = useNavigate();
  const spec = code ? getSubject(code) : undefined;
  if (!spec) {
    return (
      <div data-testid="subject-not-found" style={{ padding: 48, textAlign: 'center' }}>
        <h2>Subject not found</h2>
        <p style={{ color: '#6e6e73' }}>No subject with code {code} is published yet.</p>
        <button onClick={() => navigate('/')}>Back to subjects</button>
      </div>
    );
  }
  return (
    <motion.div
      key={`subject-${spec.code}`}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
      style={{ position: 'relative', zIndex: 2 }}
    >
      <SubjectAnalysis spec={spec} onBack={() => navigate('/')} />
    </motion.div>
  );
}
```

Add to the `<Routes>` block:

```tsx
<Route path="/subject/:code" element={<SubjectAnalysisWrapper />} />
```

Import `useParams` from `react-router` and `getSubject` from `./data/subjects`.

- [ ] **Step 11: Run the page test to verify it passes**

Run: `cd C:/Users/ADMIN/Projects/the-analyst && npx playwright test tests/subject-page.spec.ts`
Expected: PASS, 6 tests.

- [ ] **Step 12: Commit**

```bash
cd C:/Users/ADMIN/Projects/the-analyst
git add src/components/subject/ src/App.tsx tests/subject-page.spec.ts
git commit -m "feat: generic subject analysis page driven by SubjectSpec

Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

---

### Task 8: Generic master sheet page

The in-browser version of the master PDF: the paper-shaped view a student reads on a phone.

**Files:**
- Create: `src/components/subject/SubjectMasterSheet.tsx`
- Modify: `src/App.tsx`
- Test: `tests/subject-page.spec.ts`

**Interfaces:**
- Consumes: `SubjectSpec`.
- Produces: route `/subject/:code/master` renders `SubjectMasterSheet`.

- [ ] **Step 1: Write the failing test**

Append to `tests/subject-page.spec.ts`:

```ts
test('the master sheet renders the paper header and the MCQ bank', async ({ page }) => {
  await page.goto('/subject/21CSE435T/master');
  await expect(page.getByTestId('master-title')).toContainText('Smart Contracts');
  await expect(page.getByTestId('master-mcq-count')).toHaveText('20');
});

test('the master sheet links to the Drive PDF when one is published', async ({ page }) => {
  await page.goto('/subject/21CSE435T/master');
  await expect(page.getByTestId('master-pdf-link')).toBeVisible();
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `cd C:/Users/ADMIN/Projects/the-analyst && npx playwright test tests/subject-page.spec.ts`
Expected: FAIL — route not defined.

- [ ] **Step 3: Write `src/components/subject/SubjectMasterSheet.tsx`**

Renders, in order: the paper header (subject code, title, `master-title` testid, exam date, "not official — student-made analysis" disclaimer), the 75-mark blueprint as a question-paper front page, then Part A as a numbered question sheet with an answer key section at the end, then Part B and Part C with their model answers in a separate "Solutions" section after the questions (so it reads like a real paper), then the quick-reference sheet, then `PdfDownload` for the downloadable PDF. `master-mcq-count` shows the exact number of MCQs as text.

- [ ] **Step 4: Add the route**

In `src/App.tsx` add a `SubjectMasterWrapper` mirroring `SubjectAnalysisWrapper` but rendering `<SubjectMasterSheet spec={spec} onBack={() => navigate('/')} />`, and add `<Route path="/subject/:code/master" element={<SubjectMasterWrapper />} />`.

- [ ] **Step 5: Run the test to verify it passes**

Run: `cd C:/Users/ADMIN/Projects/the-analyst && npx playwright test tests/subject-page.spec.ts`
Expected: PASS, 8 tests.

- [ ] **Step 6: Commit**

```bash
cd C:/Users/ADMIN/Projects/the-analyst
git add src/components/subject/SubjectMasterSheet.tsx src/App.tsx tests/subject-page.spec.ts
git commit -m "feat: generic master sheet page

Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

---

### Task 9: Semester-aware home page

The home page must show sem 7 by default, let a student switch to sem 6, and show a countdown chip on each subject card.

**Files:**
- Modify: `src/components/SubjectGrid.tsx`
- Create: `src/components/subject/SemesterSwitcher.tsx`
- Modify: `src/components/Hero.tsx`
- Modify: `src/App.tsx`
- Test: `tests/home.spec.ts`

**Interfaces:**
- Consumes: `SUBJECTS`, `subjectsBySemester`, `semesters` from `src/data/subjects/index.ts`; the existing sem-6 subject list already inside `SubjectGrid.tsx`.
- Produces: `SemesterSwitcher({ semesters, active, onChange }: { semesters: number[]; active: number; onChange: (sem: number) => void })`.

- [ ] **Step 1: Write the failing test**

Create `tests/home.spec.ts`:

```ts
import { test, expect } from '@playwright/test';

test('the home page shows the sem 7 subjects by default', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('semester-tab-7')).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByTestId('subject-card-21CSE435T')).toBeVisible();
  await expect(page.getByTestId('subject-card-21MEO104T')).toBeVisible();
});

test('switching to sem 6 shows the sem 6 subjects', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('semester-tab-6').click();
  await expect(page.getByTestId('subject-card-21CSS303T')).toBeVisible();
});

test('a subject card shows its countdown chip', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('subject-card-21CSE435T').getByTestId('countdown')).toBeVisible();
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `cd C:/Users/ADMIN/Projects/the-analyst && npx playwright test tests/home.spec.ts`
Expected: FAIL — `semester-tab-7` not found.

- [ ] **Step 3: Write `src/components/subject/SemesterSwitcher.tsx`**

Renders one button per semester, each with `data-testid={`semester-tab-${sem}`}` and `aria-selected={active === sem}`. Style as a segmented control matching the site's existing pill buttons.

- [ ] **Step 4: Rework `SubjectGrid.tsx`**

Keep the existing sem-6 `SUBJECTS` array in the file, renamed `SEM6_SUBJECTS`, and add the sem-7 subjects from the registry. The grid becomes semester-aware: `const [sem, setSem] = useState(() => semesters()[0] ?? 7)`. Render the `SemesterSwitcher` above the grid. Each card gets `data-testid={`subject-card-${code}`}`, its countdown chip, and its route.

Routing: sem-7 cards navigate to `/subject/${code}`; sem-6 cards keep their existing routes (`/ds-analysis`, `/adc-analysis`, `/ccbf-analysis`, `/sepm-analysis`, `/cd-analysis`, `/crypto-analysis`) via the existing `routeMap`. The three `status: 'coming'` sem-6 subjects keep their current placeholder treatment.

- [ ] **Step 5: Update the Hero**

`src/components/Hero.tsx` has three things to change:
1. The tagline paragraph reads `I got bored studying. / So I decoded every exam pattern / across 6 subjects. You're welcome.` Replace the third line with `across 11 subjects. You're welcome.` (6 sem-6 + 5 sem-7).
2. The "Analysis" dropdown contains exactly one button, "Data Science", calling `onViewAnalysis()`. Add four more buttons for the other sem-7 subjects, each calling a new optional prop `onOpenSubject?: (code: string) => void` — add `onOpenSubject` to `HeroProps` as optional, defaulting to undefined. Label them "Smart Contracts", "Hyperledger", "Business Models", "Bitcoin", "TQM & Reliability" with the matching course codes.
3. The primary CTA calls `onViewAnalysis()`, which in `src/App.tsx` is `() => window.location.href = '/ds-analysis'`. Change it to point at `/subject/21CSE435T` (the first sem-7 exam, 25 Nov) and add a second CTA button "Master PDFs" pointing at `/subject/21CSE435T/master`.

Do not touch the shader, cursor, scroll transforms or the nav pill styling.

In `src/App.tsx`, the `Home` component renders `<Hero onViewAnalysis={...} />`. Add `onOpenSubject={(code) => { window.location.href = `/subject/${code}`; }}` there so the new dropdown buttons navigate.

- [ ] **Step 6: Update the PWA manifest**

In `vite.config.ts`, the `VitePWA` manifest has `name: 'Analyst — Sem 6 Prep'` and a description mentioning "4 PYQs analyzed per subject". Change the name to `Analyst — Exam Prep` and the description to `SRM Institute semester exam intelligence. Unit-wise paper analysis, safe combos and master PDFs.`

- [ ] **Step 7: Run the test to verify it passes**

Run: `cd C:/Users/ADMIN/Projects/the-analyst && npx playwright test tests/home.spec.ts`
Expected: PASS, 3 tests.

- [ ] **Step 8: Run the whole suite and build**

Run: `cd C:/Users/ADMIN/Projects/the-analyst && npx playwright test && npm run build`
Expected: all tests PASS, build exits 0.

- [ ] **Step 9: Commit**

```bash
cd C:/Users/ADMIN/Projects/the-analyst
git add src/components/SubjectGrid.tsx src/components/subject/SemesterSwitcher.tsx src/components/Hero.tsx src/App.tsx vite.config.ts tests/home.spec.ts
git commit -m "feat: semester-aware home page defaulting to sem 7

Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

---

### Task 10: Generate master PDFs from the subject data

One PDF per subject, ≤50 pages, generated from the same `SubjectSpec` the page renders, so they cannot disagree.

**Files:**
- Create: `scripts/vite.data.config.ts`
- Create: `scripts/build-master-pdfs.mjs`
- Create: `scripts/master-pdf-template.mjs`
- Create: `tests/pdf.spec.ts`
- Modify: `package.json` (add a `pdf:build` script)

**Interfaces:**
- Consumes: `SUBJECTS` from `src/data/subjects/index.ts`, compiled to `dist-pdf/registry.mjs` by the Vite SSR build.
- Produces: `dist-pdf/<CODE>-<Short-Title>-Master-PDF.pdf` for each subject, and a `dist-pdf/manifest.json` mapping code → { file, pages }.

- [ ] **Step 1: Write the failing PDF test**

Create `tests/pdf.spec.ts`:

```ts
import { test, expect } from '@playwright/test';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const manifestPath = join(process.cwd(), 'dist-pdf', 'manifest.json');

test('the PDF manifest exists after a build', () => {
  expect(existsSync(manifestPath)).toBe(true);
});

test('every subject has a PDF of at most 50 pages', () => {
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  expect(Object.keys(manifest).length).toBeGreaterThanOrEqual(5);
  for (const [code, entry] of Object.entries(manifest) as Record<string, { file: string; pages: number }>) {
    expect(entry.pages, `${code} page count`).toBeGreaterThan(0);
    expect(entry.pages, `${code} page count`).toBeLessThanOrEqual(50);
  }
});
```

- [ ] **Step 2: Write the PDF builder**

`scripts/build-master-pdf-template.mjs` exports `renderMasterHtml(spec): string` — a single self-contained HTML document (inline CSS, no external requests) containing: title page with subject code, title, exam date and the disclaimer "Student-made analysis. Not an official SRMIST document."; the 75-mark blueprint table; the safe combo; the five-unit syllabus map with priority badges; condensed topic notes (from each topic's `why`); the 20 MCQs with an answer key; Part B and Part C questions; the solutions; and a one-page quick-reference sheet of definitions and formulas.

`scripts/vite.data.config.ts` — a Vite SSR build that compiles the TypeScript registry to plain ESM JavaScript so a plain Node script can import it. This exact shape is verified to work in this repo:

```ts
import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  publicDir: false,
  build: {
    ssr: fileURLToPath(new URL('./registry-entry.ts', import.meta.url)),
    outDir: 'dist-pdf',
    emptyOutDir: true,
    minify: false,
    rollupOptions: { output: { entryFileNames: 'registry.mjs', format: 'esm' } },
  },
});
```

`publicDir: false` is required — without it Vite copies the whole `public/` folder into `dist-pdf/` on every build.

`scripts/registry-entry.ts` — one line: `export { SUBJECTS } from '../src/data/subjects/index';`

`scripts/build-master-pdfs.mjs`:
1. Runs the Vite SSR build: `npx vite build --config scripts/vite.data.config.ts`. This writes `dist-pdf/registry.mjs`.
2. Imports it: `const { SUBJECTS } = await import('../dist-pdf/registry.mjs');`
3. For each subject, renders the HTML from `renderMasterHtml(spec)` and prints it with Playwright Chromium:

```js
import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage();
await page.setContent(html, { waitUntil: 'load' });
await page.pdf({ path: outFile, format: 'A4', margin: { top: '14mm', bottom: '14mm', left: '12mm', right: '12mm' }, displayHeaderFooter: true, headerTemplate: '<div style="font-size:8px;color:#888;width:100%;padding:0 12mm"><span>SRM exam prep — not official</span></div>', footerTemplate: '<div style="font-size:8px;color:#888;width:100%;padding:0 12mm;text-align:right"><span class="pageNumber"></span> / <span class="totalPages"></span></div>' });
```

4. Counts pages by counting `/Type /Page` occurrences in the generated PDF bytes — the PDF is uncompressed enough at the page-object level for this to be reliable, and the file is generated locally so the count can be checked by eye against the viewer.
5. Writes `dist-pdf/manifest.json` with `{ code, file, pages }` per subject.

- [ ] **Step 3: Add the npm script**

In `package.json` add: `"pdf:build": "node scripts/build-master-pdfs.mjs"`. The script itself invokes the Vite SSR build as its first step, so `npm run pdf:build` needs no other command.

- [ ] **Step 4: Run the builder**

Run: `cd C:/Users/ADMIN/Projects/the-analyst && npm run pdf:build`
Expected: 5 PDFs written to `dist-pdf/`, `dist-pdf/manifest.json` written, no errors.

- [ ] **Step 5: Run the test to verify it passes**

Run: `cd C:/Users/ADMIN/Projects/the-analyst && npx playwright test tests/pdf.spec.ts`
Expected: PASS, 2 tests. If any PDF exceeds 50 pages, trim the template (shorten the condensed notes section) until every PDF is ≤50 pages — do not raise the limit.

- [ ] **Step 6: Look at one PDF**

Open `dist-pdf/21CSE435T-Smart-Contracts-Master-PDF.pdf` in a viewer and confirm the tables are not broken, the answer key is present, and the page count is sensible.

- [ ] **Step 7: Ignore the build output**

Add `dist-pdf/` to `.gitignore`. The generated PDFs are build output — the published copies live on Drive and GitHub Releases, not in the repository.

- [ ] **Step 8: Commit**

```bash
cd C:/Users/ADMIN/Projects/the-analyst
git add scripts/ package.json tests/pdf.spec.ts .gitignore
git commit -m "feat: generate master PDFs from the subject registry

Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

---

### Task 11: Publish the PDFs to Drive and mirror them on GitHub Releases

**Files:**
- Create: `scripts/publish-pdfs.mjs`
- Modify: `src/data/subjects/index.ts` (fill `pdf` on each subject)
- Test: `tests/pdf.spec.ts`

**Interfaces:**
- Consumes: `dist-pdf/manifest.json`; `gws` CLI for Drive; `gh` CLI for Releases.
- Produces: a public Drive folder `Sem 7 Master PDFs` with one public file per PDF; a GitHub release `sem7-master-pdfs` on `aswathas/the-analyst` with the same files as assets; each subject's `pdf` field set to `{ driveUrl, releaseUrl, pages }`.

- [ ] **Step 1: Write the failing test**

Append to `tests/pdf.spec.ts`:

```ts
import { SUBJECTS } from '../src/data/subjects/index';

test('every subject has a Drive link and a release mirror', () => {
  for (const spec of SUBJECTS) {
    expect(spec.pdf, `${spec.code} pdf links`).toBeDefined();
    expect(spec.pdf!.driveUrl, `${spec.code} drive url`).toMatch(/^https:\/\//);
    expect(spec.pdf!.releaseUrl, `${spec.code} release url`).toMatch(/^https:\/\//);
    expect(spec.pdf!.pages).toBeGreaterThan(0);
    expect(spec.pdf!.pages).toBeLessThanOrEqual(50);
  }
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `cd C:/Users/ADMIN/Projects/the-analyst && npx playwright test tests/pdf.spec.ts`
Expected: FAIL — `pdf` is undefined on the subjects.

- [ ] **Step 3: Get Drive credentials**

Run: `gws auth status`
Expected: `"storage"` is not `"none"` and `token_cache_exists` is `true`.

If it is not, the human partner must run `gws auth login -s drive` in a terminal and complete the browser consent. Do not attempt to script around the consent screen.

- [ ] **Step 4: Write `scripts/publish-pdfs.mjs`**

The script:
1. Reads `dist-pdf/manifest.json`.
2. Creates the Drive folder if missing: `gws drive files create --json '{"name":"Sem 7 Master PDFs","mimeType":"application/vnd.google-apps.folder"}'`, parsing the returned id.
3. Uploads each PDF: `gws drive +upload <file> --parent <folderId>`.
4. Makes each file public: `gws drive permissions create --params '{"fileId":"<id>","role":"reader","type":"anyone"}'`.
5. Builds the public link as `https://drive.google.com/file/d/<id>/view`.
6. Creates the GitHub release: `gh release create sem7-master-pdfs <files...> --repo aswathas/the-analyst --title "Sem 7 Master PDFs" --notes "..."` (if the release already exists, `gh release upload sem7-master-pdfs <files...> --clobber`).
7. Writes `dist-pdf/published.json` mapping code → `{ driveUrl, releaseUrl, pages }`.

Every `gws` and `gh` invocation goes through `child_process.execFileSync` with the args as an array (never a shell string), and the script prints each command and its exit status so a failure is visible rather than silent.

- [ ] **Step 5: Run the publisher**

Run: `cd C:/Users/ADMIN/Projects/the-analyst && node scripts/publish-pdfs.mjs`
Expected: 5 uploads, 5 permission grants, one release, `dist-pdf/published.json` written.

- [ ] **Step 6: Write the links into the subject data**

In each of the five subject files, set the `pdf` field from `dist-pdf/published.json`:

```ts
pdf: { driveUrl: 'https://drive.google.com/file/d/<id>/view', releaseUrl: 'https://github.com/aswathas/the-analyst/releases/download/sem7-master-pdfs/<file>.pdf', pages: 42 },
```

- [ ] **Step 7: Run the test to verify it passes**

Run: `cd C:/Users/ADMIN/Projects/the-analyst && npx playwright test tests/pdf.spec.ts`
Expected: PASS, 3 tests.

- [ ] **Step 8: Verify one Drive link is public**

Open the Drive URL for one subject in a browser with no Google session and confirm it downloads. If Google asks for sign-in, the permission was not granted — fix the permission and repeat.

- [ ] **Step 9: Commit**

```bash
cd C:/Users/ADMIN/Projects/the-analyst
git add scripts/publish-pdfs.mjs src/data/subjects/ tests/pdf.spec.ts
git commit -m "feat: publish master PDFs to Drive and mirror on GitHub Releases

Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

---

### Task 12: Share card and growth kit

The distribution artifacts. Without these the site exists but nobody finds it.

**Files:**
- Create: `scripts/build-share-cards.mjs`
- Create: `docs/growth/kit.md`
- Create: `public/share/<CODE>.png`
- Test: `tests/share.spec.ts`

**Interfaces:**
- Consumes: `SUBJECTS` registry.
- Produces: one 1080×1350 PNG share card per subject at `public/share/<CODE>.png`, and `docs/growth/kit.md` holding the captions, reel scripts and the WhatsApp/Telegram post copy.

- [ ] **Step 1: Write the failing test**

Create `tests/share.spec.ts`:

```ts
import { test, expect } from '@playwright/test';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

test('a share card exists for every sem 7 subject', () => {
  for (const code of ['21CSE435T', '21CSE432T', '21CSE433T', '21CSE436T', '21MEO104T']) {
    expect(existsSync(join(process.cwd(), 'public', 'share', `${code}.png`)), code).toBe(true);
  }
});

test('the growth kit exists', () => {
  expect(existsSync(join(process.cwd(), 'docs', 'growth', 'kit.md'))).toBe(true);
});
```

- [ ] **Step 2: Write the card generator**

`scripts/build-share-cards.mjs` renders each card with Playwright Chromium: a 1080×1350 page, the subject accent colour as the background, the subject code in monospace, the safe-combo claim as the headline in large type, the exam date and the site URL at the bottom, and a "not official" footnote. Screenshot it to `public/share/<CODE>.png`.

It reads the same `dist-pdf/registry.mjs` that Task 10 produced (`const { SUBJECTS } = await import('../dist-pdf/registry.mjs');`), so it must run after `npm run pdf:build`. If `dist-pdf/registry.mjs` is missing, run the Vite SSR build first rather than adding a second copy of the subject data.

- [ ] **Step 3: Write `docs/growth/kit.md`**

Include, ready to paste:
- The WhatsApp Channel post for each subject (one line of copy plus the card image and the link).
- The class-group post for each subject, addressed to a class rep.
- Five 45-second reel scripts, each opening with the safe-combo number and closing with the link.
- The six-week calendar with what ships each week, drawn from `C:/Users/ADMIN/srmist-cse-exam-site-6week-growth-plan.md`.
- The metric list and the week-1 baseline capture instructions.
- The integrity rules: unofficial labels on predicted papers, the takedown contact, and no live exam content.

- [ ] **Step 4: Run the test to verify it passes**

Run: `cd C:/Users/ADMIN/Projects/the-analyst && node scripts/build-share-cards.mjs && npx playwright test tests/share.spec.ts`
Expected: PASS, 2 tests.

- [ ] **Step 5: Commit**

```bash
cd C:/Users/ADMIN/Projects/the-analyst
git add scripts/build-share-cards.mjs docs/growth/kit.md public/share/ tests/share.spec.ts
git commit -m "feat: share cards and growth kit

Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

---

### Task 13: Deploy and verify

**Files:**
- No new files. Modify only if verification finds a defect.

**Interfaces:**
- Consumes: everything above.
- Produces: a live deployment with the sem-7 subjects, their PDFs and the share kit in the repo.

- [ ] **Step 1: Run the full gate**

Run: `cd C:/Users/ADMIN/Projects/the-analyst && npm run lint && npx playwright test && npm run build`
Expected: lint clean, all tests PASS, build exits 0.

- [ ] **Step 2: Push**

```bash
cd C:/Users/ADMIN/Projects/the-analyst
git push origin main
```

Vercel deploys from `main`. If the repository is not connected to the Vercel project for this domain, deploy with the Vercel CLI using the existing project link.

- [ ] **Step 3: Verify the live site**

Check on the deployed URL:
- `/` shows the sem 7 tab selected and 5 sem-7 cards.
- `/subject/21CSE435T` renders the full analysis.
- `/subject/21CSE435T/master` renders the master sheet.
- The Drive download button opens a public PDF.

- [ ] **Step 4: Capture the week-1 baseline**

Record the Vercel Analytics session count for the first 48 hours, the WhatsApp Channel subscriber count and the number of class groups seeded. These are the baseline the six-week plan measures against.

- [ ] **Step 5: Tag the release**

```bash
cd C:/Users/ADMIN/Projects/the-analyst
git tag sem7-launch
git push origin sem7-launch
```

---

## Delegation note for Tasks 2–6

The five subject-content tasks are content production, not engineering: each requires reading the official syllabus extract for one course and writing 20 MCQs, 7 long questions, a CT set, topic priorities and a safe combo. Delegate each to a subagent with the exact unit names and the syllabus extract path, then review the output against the validator before committing. A subagent that cannot read `C:/Users/ADMIN/Projects/sem7-prep/research/syllabus-units.md` must be given the relevant section inline — it is not allowed to invent topics.

## Scope note

Task 12's `docs/growth/kit.md` and the six-week calendar are the growth work. Tasks 0–13 are the build. They are separable: the site ships without the kit, and the kit ships without new code. If time is short, ship Tasks 0–11 and 13 first, then the kit.

## Out of scope for this plan

- Sem-6 subjects migrating onto the `SubjectSpec` shape (the sem-6 pages keep their current components; only the home grid changes).
- The model exam, the WhatsApp Channel, the Telegram channel and the ambassador programme — these are operations, tracked in `docs/growth/kit.md`, not code.
- Crowdsourced "what was asked" submission handling — the form link is placed in Task 7; collecting and applying the answers is a later change.
