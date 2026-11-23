const esc = (value) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const badge = (priority) => {
  const tone =
    priority === 'must' ? '#b91c1c' : priority === 'should' ? '#b45309' : '#4b5563';
  const bg =
    priority === 'must' ? '#fee2e2' : priority === 'should' ? '#fef3c7' : '#e5e7eb';
  return `<span class="badge" style="color:${tone};background:${bg}">${esc(priority)}</span>`;
};

const CATEGORY_LABEL = {
  core: 'Core',
  'professional-elective': 'Professional Elective',
  'open-elective': 'Open Elective',
};

export function renderMasterHtml(spec) {
  const bp = spec.blueprint;
  const partATotal = bp.partA.count * bp.partA.marksEach;
  const partBTotal = bp.partB.answerAny * bp.partB.marksEach;
  const partCTotal = bp.partC.answerAny * bp.partC.marksEach;

  const unitSections = spec.units
    .map((unit) => {
      const rows = unit.topics
        .map(
          (t) => `<tr>
            <td>${esc(t.name)}</td>
            <td class="c">${badge(t.priority)}</td>
            <td class="c">${t.minutes}</td>
            <td class="why">${esc(t.why ?? '')}</td>
          </tr>`,
        )
        .join('');
      const totalMinutes = unit.topics.reduce((sum, t) => sum + (t.minutes || 0), 0);
      return `<div class="unit-block">
        <h3><span class="dot" style="background:${esc(spec.accent)}"></span>Unit ${unit.unit}: ${esc(unit.name)} <span class="muted">(${unit.hours} h · ${totalMinutes} min planned)</span></h3>
        <table class="grid">
          <thead><tr><th>Topic</th><th class="c">Priority</th><th class="c">Min</th><th>What the paper asks</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>`;
    })
    .join('');

  const mcqList = spec.mcqs
    .map(
      (q, i) => `<div class="mcq">
        <div class="q"><b>Q${i + 1}.</b> ${esc(q.question)} <span class="muted">[Unit ${q.unit} · ${esc(q.topic)}]</span></div>
        <div class="opts">${q.options
          .map((o, oi) => `<span><b>${String.fromCharCode(65 + oi)}.</b> ${esc(o)}</span>`)
          .join('')}</div>
      </div>`,
    )
    .join('');

  const answerKey = spec.mcqs
    .map(
      (q, i) => `<div class="ans"><b>Q${i + 1} — ${String.fromCharCode(65 + q.correct)}.</b> ${esc(q.explanation)}</div>`,
    )
    .join('');

  const partBQuestions = spec.partB
    .map((q, i) => `<div class="lq"><b>B${i + 1}.</b> ${esc(q.question)} <span class="muted">(${q.marks} marks · Unit ${q.unit})</span></div>`)
    .join('');

  const partCQuestions = spec.partC
    .map((q, i) => `<div class="lq"><b>C${i + 1}.</b> ${esc(q.question)} <span class="muted">(${q.marks} marks · Unit ${q.unit})</span></div>`)
    .join('');

  const solutionBlock = (list, prefix) =>
    list
      .map(
        (q, i) => `<div class="sol">
          <div class="sol-q"><b>${prefix}${i + 1}.</b> ${esc(q.question)}</div>
          <ol>${q.modelAnswer.map((p) => `<li>${esc(p)}</li>`).join('')}</ol>
          ${q.keyPoints?.length ? `<div class="keypoints"><b>Key points:</b> ${q.keyPoints.map(esc).join(' · ')}</div>` : ''}
        </div>`,
      )
      .join('');

  const safeCombos = spec.safeCombo
    .map(
      (c) => `<tr><td class="c">${c.unit}</td><td>${esc(c.topics.join(', '))}</td><td class="c">${c.marks}</td><td>${esc(c.claim)}</td></tr>`,
    )
    .join('');

  const mustTopics = spec.units
    .flatMap((u) => u.topics.filter((t) => t.priority === 'must').map((t) => ({ unit: u.unit, ...t })))
    .map(
      (t) => `<li><span class="muted">U${t.unit}</span> ${esc(t.name)} <span class="muted">(${t.minutes} min)</span></li>`,
    )
    .join('');

  const resources = spec.resources
    .map(
      (r) => `<li>${esc(r.label)}${r.note ? ` — <span class="muted">${esc(r.note)}</span>` : ''}${r.url ? ` <span class="muted">${esc(r.url)}</span>` : ''}</li>`,
    )
    .join('');

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8" />
<title>${esc(spec.code)} — ${esc(spec.title)} — Master PDF</title>
<style>
  @page { size: A4; }
  * { box-sizing: border-box; }
  body { font-family: -apple-system, "Segoe UI", Arial, sans-serif; font-size: 9.3pt; line-height: 1.34; color: #111; margin: 0; }
  h1, h2, h3 { margin: 0 0 6px; line-height: 1.2; }
  h2 { font-size: 14pt; border-bottom: 2px solid ${esc(spec.accent)}; padding-bottom: 3px; margin-top: 4px; }
  h3 { font-size: 10.5pt; margin-top: 10px; }
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
  .badge { display: inline-block; padding: 0 5px; border-radius: 999px; font-size: 7.4pt; font-weight: 700; text-transform: uppercase; }
  .dot { display: inline-block; width: 9px; height: 9px; border-radius: 50%; margin-right: 6px; }
  .unit-block { page-break-inside: avoid; }
  .mcq { page-break-inside: avoid; margin-bottom: 5px; }
  .mcq .q { font-size: 9.2pt; }
  .opts { display: flex; flex-wrap: wrap; gap: 2px 18px; margin: 1px 0 0 12px; font-size: 8.8pt; color: #1f2937; }
  .ans { font-size: 8.8pt; margin-bottom: 4px; page-break-inside: avoid; }
  .lq { margin-bottom: 8px; page-break-inside: avoid; }
  .sol { page-break-inside: avoid; margin-bottom: 9px; }
  .sol-q { font-size: 9pt; margin-bottom: 2px; }
  .sol ol { font-size: 8.8pt; }
  .keypoints { font-size: 8.4pt; color: #374151; }
  .cols { columns: 2; column-gap: 14px; }
  .cols .mcq { break-inside: avoid; }
  .footer-note { margin-top: 14px; font-size: 8pt; color: #6b7280; border-top: 1px solid #e5e7eb; padding-top: 6px; }
  .kpi { display: flex; gap: 10px; flex-wrap: wrap; margin: 8px 0 12px; }
  .kpi div { border: 1px solid #e5e7eb; border-radius: 8px; padding: 8px 12px; min-width: 34mm; }
  .kpi b { display: block; font-size: 17pt; color: ${esc(spec.accent)}; }
  .kpi span { font-size: 8pt; color: #6b7280; text-transform: uppercase; letter-spacing: .4px; }
  .two-col { display: flex; gap: 18px; }
  .two-col > div { flex: 1; }
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
    <div><b>${partATotal}</b><span>Part A</span></div>
    <div><b>${partBTotal}</b><span>Part B</span></div>
    <div><b>${partCTotal}</b><span>Part C</span></div>
    <div><b>${esc(bp.total)}</b><span>Total</span></div>
  </div>
  <div class="disclaimer"><b>Student-made analysis. Not an official SRMIST document.</b><br />
  ${esc(spec.pyqNote)}</div>
  <p class="footer-note">Generated from the same subject data that powers the site, so the page and this PDF cannot disagree. Question sources are labelled reference archetypes; no question in this file is presented as coming from an SRM paper.</p>
</section>

<section class="page">
  <h2>Paper blueprint</h2>
  <table class="grid">
    <thead><tr><th>Part</th><th class="c">Questions</th><th class="c">Marks each</th><th class="c">Attempted</th><th class="c">Marks</th></tr></thead>
    <tbody>
      <tr><td>Part A — MCQ</td><td class="c">${bp.partA.count}</td><td class="c">${bp.partA.marksEach}</td><td class="c">${bp.partA.count}</td><td class="c">${partATotal}</td></tr>
      <tr><td>Part B — long answers</td><td class="c">${bp.partB.count}</td><td class="c">${bp.partB.marksEach}</td><td class="c">${bp.partB.answerAny}</td><td class="c">${partBTotal}</td></tr>
      <tr><td>Part C — long answers</td><td class="c">${bp.partC.count}</td><td class="c">${bp.partC.marksEach}</td><td class="c">${bp.partC.answerAny}</td><td class="c">${partCTotal}</td></tr>
      <tr><td><b>Total</b></td><td class="c">—</td><td class="c">—</td><td class="c">—</td><td class="c"><b>${esc(bp.total)}</b></td></tr>
    </tbody>
  </table>
  <p class="muted">SRMIST 2021 regulation structure. CLA carries 60% of the course; this end-semester paper carries 40%.</p>

  <h2>Safe combos</h2>
  <table class="grid">
    <thead><tr><th class="c">Unit</th><th>Topics</th><th class="c">Marks</th><th>Claim</th></tr></thead>
    <tbody>${safeCombos}</tbody>
  </table>
</section>

<section class="page">
  <h2>Five-unit syllabus map and condensed notes</h2>
  <p class="muted">Topics are copied from the official SRMIST unit-wise syllabus. Priority and the “what the paper asks” line are this analysis, not the syllabus.</p>
  ${unitSections}
</section>

<section class="page">
  <h2>Part A — MCQ bank (${spec.mcqs.length} questions)</h2>
  <p class="muted">Reference archetypes written to the SRMIST 75-mark pattern. Attempt each before turning to the answer key.</p>
  <div class="cols">${mcqList}</div>
</section>

<section class="page">
  <h2>Part A — answer key</h2>
  ${answerKey}
</section>

<section class="page">
  <h2>Part B — ${spec.partB.length} × ${bp.partB.marksEach} marks</h2>
  <p class="muted">Answer any ${bp.partB.answerAny}. Plan four to six points per answer.</p>
  ${partBQuestions}
  <h2 style="margin-top:16px">Part C — ${spec.partC.length} × ${bp.partC.marksEach} marks</h2>
  <p class="muted">Answer any ${bp.partC.answerAny}. Structure each answer as a claim, evidence and a worked example.</p>
  ${partCQuestions}
</section>

<section class="page">
  <h2>Solutions — Part B</h2>
  ${solutionBlock(spec.partB, 'B')}
  <h2 style="margin-top:14px">Solutions — Part C</h2>
  ${solutionBlock(spec.partC, 'C')}
</section>

<section class="page">
  <h2>Exam-day quick reference</h2>
  <div class="two-col">
    <div>
      <h3>Must-do topics</h3>
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
      <h3>Resources</h3>
      <ul>${resources}</ul>
    </div>
  </div>
  <p class="footer-note">This is an independent, student-made analysis. It is not affiliated with or endorsed by SRMIST. Do not use it during a live examination.</p>
</section>

</body></html>`;
}
