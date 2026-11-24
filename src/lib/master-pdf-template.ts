import { renderDiagram } from './diagram';
import type { SubjectSpec } from '../data/subjects/types';

const ESCAPES: Record<string, string> = {
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
};

const esc = (value: unknown): string =>
  String(value ?? '').replace(/[&<>"']/g, (c) => ESCAPES[c] ?? c);

const PRIORITY_LABEL: Record<string, string> = { must: 'Must learn', should: 'Learn if time', skip: 'Skim only' };

const badge = (priority: 'must' | 'should' | 'skip'): string => {
  const tone =
    priority === 'must' ? { bg: '#e0edff', fg: '#0b3b6f' } : priority === 'should' ? { bg: '#f3f4f6', fg: '#374151' } : { bg: '#fef2f2', fg: '#991b1b' };
  return `<span class="badge" style="background:${tone.bg};color:${tone.fg}">${PRIORITY_LABEL[priority]}</span>`;
};

const CATEGORY_LABEL: Record<string, string> = {
  core: 'Core',
  'professional-elective': 'Professional elective',
  'open-elective': 'Open elective',
};

/** One topic, taught: first principles, analogy, diagram, worked example, exam angle. */
function renderTopic(topic: SubjectSpec['units'][number]['topics'][number], accent: string): string {
  const principleList = (topic.principles || [])
    .map((p) => `<li>${esc(p)}</li>`)
    .join('');
  const analogy = topic.analogy
    ? `<div class="analogy"><span class="analogy-tag">Remember it this way</span>${esc(topic.analogy)}</div>`
    : '';
  const example = topic.example
    ? `<div class="example"><span class="example-tag">Worked example</span>${esc(topic.example)}</div>`
    : '';
  const diagram = topic.diagram ? renderDiagram(topic.diagram, accent) : '';
  const why = topic.why ? `<p class="why"><b>How it shows up:</b> ${esc(topic.why)}</p>` : '';

  return `<div class="topic">
    <div class="topic-head">
      <h4>${esc(topic.name)}</h4>
      <div class="topic-meta">${badge(topic.priority)}<span class="muted">${topic.minutes} min</span></div>
    </div>
    ${principleList ? `<ul class="principles">${principleList}</ul>` : ''}
    ${analogy}
    ${diagram}
    ${example}
    ${why}
  </div>`;
}

export function renderMasterHtml(spec: SubjectSpec): string {
  const bp = spec.blueprint;
  const partATotal = bp.partA.count * bp.partA.marksEach;
  const partBTotal = bp.partB.answerAny * bp.partB.marksEach;
  const partCTotal = bp.partC.answerAny * bp.partC.marksEach;

  const unitSections = spec.units
    .map((unit) => {
      const rows = unit.topics
        .map(
          (topic) => `<tr>
            <td class="tp">${esc(topic.name)}</td>
            <td class="pr">${badge(topic.priority)}</td>
            <td class="c">${topic.minutes}</td>
          </tr>`,
        )
        .join('');
      const totalMinutes = unit.topics.reduce((sum, t) => sum + (t.minutes || 0), 0);
      const mustCount = unit.topics.filter((t) => t.priority === 'must').length;
      return `<div class="unit-block">
        <h3><span class="dot" style="background:${esc(spec.accent)}"></span>Unit ${unit.unit} — ${esc(unit.name)}
          <span class="muted">${unit.hours} hours · ${unit.topics.length} topics · ${mustCount} must-know · ~${Math.round(totalMinutes / 60)} h</span></h3>
        <table class="grid plan">
          <thead><tr><th>Topic</th><th>Priority</th><th class="c">Minutes</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
        <h4 class="teach">Unit ${unit.unit} taught</h4>
        ${unit.topics.map((topic) => renderTopic(topic, spec.accent)).join('')}
      </div>`;
    })
    .join('');

  const safeCombos = spec.safeCombo
    .map(
      (c) => `<tr>
        <td class="c">${c.unit}</td>
        <td>${c.topics.map((t) => esc(t)).join(', ')}</td>
        <td class="c">${c.marks}</td>
        <td class="why">${esc(c.claim)}</td>
      </tr>`,
    )
    .join('');

  const mustTopics = spec.units
    .flatMap((u) => u.topics.filter((t) => t.priority === 'must').map((t) => `<li><b>U${u.unit}</b> ${esc(t.name)}</li>`))
    .join('');

  const shouldTopics = spec.units
    .flatMap((u) => u.topics.filter((t) => t.priority === 'should').map((t) => `<li><b>U${u.unit}</b> ${esc(t.name)}</li>`))
    .join('');

  const skipTopics = spec.units
    .flatMap((u) => u.topics.filter((t) => t.priority === 'skip').map((t) => `<li><b>U${u.unit}</b> ${esc(t.name)}</li>`))
    .join('');

  const resources = spec.resources
    .map(
      (r) => `<li>${esc(r.label)}${r.note ? ` — <span class="muted">${esc(r.note)}</span>` : ''}${r.url ? ` <span class="muted">${esc(r.url)}</span>` : ''}</li>`,
    )
    .join('');

  const totalMinutes = spec.units.reduce((sum, u) => sum + u.topics.reduce((s, t) => s + (t.minutes || 0), 0), 0);
  const mustMinutes = spec.units.reduce(
    (sum, u) => sum + u.topics.filter((t) => t.priority === 'must').reduce((s, t) => s + (t.minutes || 0), 0),
    0,
  );
  const mustCount = spec.units.reduce((sum, u) => sum + u.topics.filter((t) => t.priority === 'must').length, 0);
  const topicCount = spec.units.reduce((sum, u) => sum + u.topics.length, 0);

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8" />
<title>${esc(spec.code)} — ${esc(spec.title)} — Master Notes</title>
<style>
  @page { size: A4; }
  * { box-sizing: border-box; }
  body { font-family: -apple-system, "Segoe UI", Arial, sans-serif; font-size: 9.3pt; line-height: 1.34; color: #111; margin: 0; }
  h1, h2, h3, h4 { margin: 0 0 6px; line-height: 1.2; }
  h2 { font-size: 14pt; border-bottom: 2px solid ${esc(spec.accent)}; padding-bottom: 3px; margin-top: 4px; }
  h3 { font-size: 10.5pt; margin-top: 10px; }
  h4 { font-size: 9.6pt; margin: 0; }
  p { margin: 0 0 6px; }
  ul, ol { margin: 3px 0 6px 18px; padding: 0; }
  li { margin: 1px 0; }
  .muted { color: #6b7280; font-weight: 400; }
  .c { text-align: center; white-space: nowrap; }
  .page { page-break-before: always; }
  .title-page { padding-top: 22mm; }
  .code { font-family: "JetBrains Mono", "Cascadia Mono", Consolas, monospace; font-size: 30pt; font-weight: 700; color: ${esc(spec.accent)}; letter-spacing: 1px; }
  .title { font-size: 24pt; font-weight: 800; margin: 6px 0 10px; }
  .one-liner { font-size: 12pt; color: #374151; max-width: 150mm; margin-bottom: 14px; }
  .meta { display: flex; flex-wrap: wrap; gap: 8px 22px; font-size: 10pt; margin: 10px 0 16px; }
  .meta b { display: block; font-size: 8pt; text-transform: uppercase; letter-spacing: .5px; color: #6b7280; }
  .disclaimer { border: 1.5px solid #b91c1c; background: #fef2f2; color: #7f1d1d; padding: 9px 12px; border-radius: 6px; font-size: 9.5pt; margin-top: 14px; }
  table.grid { width: 100%; border-collapse: collapse; margin: 4px 0 6px; }
  table.grid th, table.grid td { border: 1px solid #d1d5db; padding: 2.5px 5px; vertical-align: top; text-align: left; }
  table.grid th { background: #f3f4f6; font-size: 8pt; text-transform: uppercase; letter-spacing: .3px; }
  table.grid td.why { font-size: 8.4pt; color: #374151; }
  table.plan td.tp { font-size: 8.6pt; }
  table.plan td.pr { white-space: nowrap; }
  .badge { display: inline-block; padding: 0 5px; border-radius: 999px; font-size: 7.4pt; font-weight: 700; text-transform: uppercase; }
  .dot { display: inline-block; width: 9px; height: 9px; border-radius: 50%; margin-right: 6px; }
  .unit-block { page-break-inside: auto; }
  .teach { margin: 10px 0 7px; padding-bottom: 2px; border-bottom: 1px solid #e5e7eb; color: ${esc(spec.accent)}; text-transform: uppercase; letter-spacing: .6px; font-size: 8.6pt; }
  .topic { page-break-inside: auto; margin-bottom: 9px; border-left: 2px solid ${esc(spec.accent)}; padding-left: 9px; }
  .topic-head { display: flex; justify-content: space-between; align-items: baseline; gap: 10px; margin-bottom: 3px; page-break-after: avoid; break-after: avoid; }
  .topic-meta { white-space: nowrap; font-size: 8pt; }
  .principles { margin: 2px 0 4px 15px; font-size: 9.1pt; page-break-after: avoid; break-after: avoid; }
  .principles li { margin: 2px 0; }
  .why { font-size: 8.5pt; color: #374151; margin: 3px 0 0; }
  .analogy { background: #fffbeb; border-left: 2px solid #f59e0b; padding: 4px 7px; margin: 3px 0 4px; page-break-inside: avoid; font-size: 9pt; color: #78350f; border-radius: 0 4px 4px 0; }
  .analogy-tag { display: block; font-size: 7.2pt; font-weight: 700; text-transform: uppercase; letter-spacing: .5px; color: #b45309; margin-bottom: 1px; }
  .example { background: #f0fdf4; border-left: 2px solid #16a34a; padding: 4px 7px; margin: 3px 0 4px; page-break-inside: avoid; font-size: 8.9pt; color: #14532d; border-radius: 0 4px 4px 0; }
  .example-tag { display: block; font-size: 7.2pt; font-weight: 700; text-transform: uppercase; letter-spacing: .5px; color: #15803d; margin-bottom: 1px; }
  .dg { margin: 4px 0 5px; page-break-inside: avoid; }
  .dg svg { max-width: 100%; height: auto; }
  .dg-cap { font-size: 8.2pt; color: #374151; margin-bottom: 3px; }
  .footer-note { margin-top: 14px; font-size: 8pt; color: #6b7280; border-top: 1px solid #e5e7eb; padding-top: 6px; }
  .kpi { display: flex; gap: 10px; flex-wrap: wrap; margin: 8px 0 12px; }
  .kpi div { border: 1px solid #e5e7eb; border-radius: 8px; padding: 8px 12px; min-width: 34mm; }
  .kpi b { display: block; font-size: 17pt; color: ${esc(spec.accent)}; }
  .kpi span { font-size: 8pt; text-transform: uppercase; letter-spacing: .4px; color: #6b7280; }
  .two-col { display: flex; gap: 18px; }
  .two-col > div { flex: 1; }
  .steps { counter-reset: step; list-style: none; margin-left: 0; padding-left: 0; }
  .steps li { counter-increment: step; margin: 5px 0; padding-left: 20px; position: relative; }
  .steps li::before { content: counter(step); position: absolute; left: 0; top: 1px; width: 14px; height: 14px; border-radius: 50%; background: ${esc(spec.accent)}; color: #fff; font-size: 7.6pt; font-weight: 700; text-align: center; line-height: 14px; }
  .rubric td { font-size: 8.6pt; }
  .rubric td.c { width: 18mm; }
</style></head>
<body>

<section class="title-page">
  <div class="code">${esc(spec.code)}</div>
  <div class="title">${esc(spec.title)}</div>
  <div class="one-liner">${esc(spec.oneLiner)}</div>
  <div class="meta">
    <div><b>Semester</b>${esc(spec.semester)}</div>
    <div><b>Category</b>${esc(CATEGORY_LABEL[spec.category] ?? spec.category)}</div>
    <div><b>Credits</b>${esc(spec.credits)}</div>
    <div><b>Contact hours</b>${esc(spec.hours)}</div>
    <div><b>Exam</b>${esc(spec.examDate)} · ${esc(spec.examSession)}</div>
    <div><b>Paper total</b>${esc(bp.total)} marks</div>
  </div>
  <div class="kpi">
    <div><b>${topicCount}</b><span>Topics taught</span></div>
    <div><b>${mustCount}</b><span>Must-know</span></div>
    <div><b>${Math.round(mustMinutes / 60)}h</b><span>Must-know study</span></div>
    <div><b>${Math.round(totalMinutes / 60)}h</b><span>Full coverage</span></div>
  </div>
  <div class="disclaimer"><b>Student-made analysis. Not an official SRMIST document.</b><br />
  ${esc(spec.pyqNote)}</div>
  <p class="footer-note">This is a <b>teaching document</b>. Every topic is explained from first principles, given a plain-language analogy, drawn as a diagram and — where the maths allows — shown as a worked example. There are no questions in it: it teaches the subject so you can answer whatever the paper asks.</p>
</section>

<section class="page">
  <h2>How to use this in five days</h2>
  <ol class="steps">
    <li><b>Day 1 — the map.</b> Read the paper blueprint and the priority table on this page. You now know which units carry the marks and which topics you can skip.</li>
    <li><b>Days 2–4 — the units.</b> Work one unit a day. For each topic: read the first-principles lines, say the analogy out loud, redraw the diagram from memory, then redo the worked example with the book closed.</li>
    <li><b>Day 5 — the sheet.</b> Memorise the one-page fact sheet at the back. Then write out the answer to one unseen topic from memory and check it against this document.</li>
    <li><b>Every night — 20 minutes.</b> Re-read that unit's must-know topics only. Spaced repetition on the first-principles lines and the diagrams is what turns reading into marks.</li>
  </ol>
  <p class="muted">Estimated study time: <b>${Math.round(mustMinutes / 60)} hours</b> for the must-know ${mustCount} of ${topicCount} topics, <b>${Math.round(totalMinutes / 60)} hours</b> for everything. Split it across the days you have left.</p>

  <h2 style="margin-top:14px">The paper, exactly</h2>
  <table class="grid">
    <thead><tr><th>Part</th><th class="c">Questions</th><th class="c">Marks each</th><th class="c">Attempted</th><th class="c">Marks</th></tr></thead>
    <tbody>
      <tr><td>Part A — MCQ</td><td class="c">${bp.partA.count}</td><td class="c">${bp.partA.marksEach}</td><td class="c">${bp.partA.count}</td><td class="c">${partATotal}</td></tr>
      <tr><td>Part B — long answers</td><td class="c">${bp.partB.count}</td><td class="c">${bp.partB.marksEach}</td><td class="c">${bp.partB.answerAny}</td><td class="c">${partBTotal}</td></tr>
      <tr><td>Part C — long answers</td><td class="c">${bp.partC.count}</td><td class="c">${bp.partC.marksEach}</td><td class="c">${bp.partC.answerAny}</td><td class="c">${partCTotal}</td></tr>
      <tr><td><b>Total</b></td><td class="c">—</td><td class="c">—</td><td class="c">—</td><td class="c"><b>${esc(bp.total)}</b></td></tr>
    </tbody>
  </table>
  <p class="muted">SRMIST 2021 regulation structure. Part A is breadth: any topic can appear, so every unit's must-know list matters. Part B is one topic per unit. Part C is depth: one topic, marked on a full explanation, not a list.</p>

  <h2 style="margin-top:14px">Where the marks actually live</h2>
  <table class="grid">
    <thead><tr><th class="c">Unit</th><th>Topics</th><th class="c">Marks</th><th>Claim</th></tr></thead>
    <tbody>${safeCombos}</tbody>
  </table>
</section>

<section class="page">
  <h2>Priority table — what to learn first</h2>
  <p class="muted">Priority is this analysis, not the syllabus. Every topic name is copied verbatim from the official SRMIST unit-wise syllabus. Times are estimates for a student reading this document for the first time.</p>
  ${unitSections}
</section>

<section class="page">
  <h2>How a 15-mark answer is scored</h2>
  <p class="muted">Part C is worth ${bp.partC.marksEach} marks and there is only ${bp.partC.answerAny} to answer. Most students lose marks here by writing a list. Here is what the examiner is actually looking for.</p>
  <table class="grid rubric">
    <thead><tr><th class="c">Marks</th><th>What the answer must contain</th></tr></thead>
    <tbody>
      <tr><td class="c">1–2</td><td><b>Define the term precisely.</b> Use the exact word from the syllabus and one clause that makes it unambiguous. A restatement that adds no precision scores nothing here.</td></tr>
      <tr><td class="c">3–5</td><td><b>Explain the mechanism.</b> Name the parts and say what each one does, in order. A labelled diagram earns these marks faster than a paragraph does.</td></tr>
      <tr><td class="c">6–9</td><td><b>Show the working.</b> Formula, substitution, result. For numerical topics, state the formula before the numbers so the marker can follow even if your arithmetic slips.</td></tr>
      <tr><td class="c">10–12</td><td><b>Give a concrete instance.</b> A named example from the course, or a worked case. This is where most answers stop, and it is where the remaining marks are.</td></tr>
      <tr><td class="c">13–15</td><td><b>Close the loop.</b> State the trade-off, limitation or consequence, and link it back to the topic. One sentence that shows you understand why it matters.</td></tr>
    </tbody>
  </table>

  <h2 style="margin-top:14px">The four-part answer shape</h2>
  <ol class="steps">
    <li><b>Claim.</b> One line: what this topic is and the answer to the question asked.</li>
    <li><b>Structure.</b> The parts, in order, with a labelled diagram if the topic has one. Four to six points for a ${bp.partC.marksEach}-marker.</li>
    <li><b>Working.</b> The formula or the trace, with the numbers substituted.</li>
    <li><b>Consequence.</b> The limitation, trade-off or example that shows depth.</li>
  </ol>
  <p class="muted">For Part B (${bp.partB.marksEach} marks each, answer any ${bp.partB.answerAny}) the same shape works with the worked example as the last point instead of a consequence.</p>

  <h2 style="margin-top:14px">What the examiner expects you to know cold</h2>
  <p class="muted">Definitions, formulas with their symbols defined, and the order of steps in any process. Marks are not given for knowing that a topic exists; they are given for being able to reproduce it accurately on paper.</p>
</section>

<section class="page">
  <h2>One-page fact sheet</h2>
  <div class="two-col">
    <div>
      <h3>Must-know topics</h3>
      <ul>${mustTopics}</ul>
    </div>
    <div>
      <h3>Shape of the paper</h3>
      <ul>
        <li>Part A: ${bp.partA.count} × ${bp.partA.marksEach} = ${partATotal}</li>
        <li>Part B: any ${bp.partB.answerAny} of ${bp.partB.count} × ${bp.partB.marksEach} = ${partBTotal}</li>
        <li>Part C: any ${bp.partC.answerAny} of ${bp.partC.count} × ${bp.partC.marksEach} = ${partCTotal}</li>
        <li>Total ${esc(bp.total)} marks · ${esc(spec.examDate)} ${esc(spec.examSession)}</li>
      </ul>
      <h3>Learn if time</h3>
      <ul>${shouldTopics}</ul>
    </div>
  </div>
  <h3 style="margin-top:12px">Skim only</h3>
  <ul>${skipTopics}</ul>
  <h3 style="margin-top:12px">Further reading</h3>
  <ul>${resources}</ul>
  <p class="footer-note">This is an independent, student-made analysis. It is not affiliated with or endorsed by SRMIST. Do not use it during a live examination.</p>
</section>

</body></html>`;
}
