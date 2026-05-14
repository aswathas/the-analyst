import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, BookOpen, FileText, ChevronDown, ChevronUp,
  AlertTriangle, Shield, CheckCircle2, Target, Zap, TrendingUp
} from 'lucide-react';

// ─────────────────────────────────────────
// DATA (from 6 PYQ papers: May24–Nov25)
// ─────────────────────────────────────────

const PAPERS = [
  { code: 'May 2024 FN', date: '17.05.2024', highlight: 'Waterfall pros/cons + use case & sequence diagram + proactive vs reactive risk', keyTopics: ['Waterfall', 'Spiral', 'COCOMO', 'UML', 'Risk mgmt', 'Testing'] },
  { code: 'Jul 2024', date: '08.07.2024', highlight: 'COCOMO II numerical + functional/non-functional req for ATM', keyTopics: ['Agile', 'Spiral', 'COCOMO', 'Architecture', 'Black-box', 'Maintenance', 'Risk'] },
  { code: 'Dec 2024 FN', date: '02.12.2024', highlight: 'Scrum-based MVP planning + login manual testing', keyTopics: ['Waterfall', 'Agile', 'V-Model', 'Elicitation', 'COCOMO', 'Use Case', 'White-box', 'Risk'] },
  { code: 'May 2025 AN', date: '22.05.2025', highlight: 'Login manual test cases + PM conflict scenario (deadline/bugs/budget)', keyTopics: ['Scrum', 'Architecture', 'GUI', 'Desk check', 'Black-box', 'Maintenance', 'Risk'] },
  { code: 'Jul 2025 FN', date: '15.07.2025', highlight: 'Process models in detail + banking use case + sequence diagram', keyTopics: ['Lifecycle', 'Agile', 'SRS', 'COCOMO', 'Activity diagram', 'GUI', 'Testing', 'Risk', 'RMMM'] },
  { code: 'Nov 2025 FN', date: '27.11.2025', highlight: 'Agile execution with roles & artifacts + cart test cases', keyTopics: ['Waterfall', 'Agile', 'Scrum', 'Elicitation', 'COCOMO', 'Architecture', 'UML', 'Desk check', 'Risk', 'Maintenance'] },
];

const STATS = { papers: 6, mcqs: 20, marks: 75, safeScore: '65+', partB: 5, partC: 1 };

const UNITS = [
  { unit: 1, name: 'Process Models', marks: 15, color: '#ef4444', priority: 'HIGH' },
  { unit: 2, name: 'Requirements & Estimation', marks: 15, color: '#f59e0b', priority: 'HIGH' },
  { unit: 3, name: 'Architecture, UML, GUI', marks: 15, color: '#2997ff', priority: 'HIGH' },
  { unit: 4, name: 'Testing & Review', marks: 15, color: '#059669', priority: 'HIGH' },
  { unit: 5, name: 'Risk, Maintenance, Reengineering', marks: 15, color: '#a855f7', priority: 'HIGH' },
];

const TOPICS = [
  { topic: 'Process Models (Waterfall/Agile/Spiral)', score: 100, papers: 6, color: '#ef4444', unit: 1 },
  { topic: 'Requirements Engineering + SRS', score: 100, papers: 6, color: '#f59e0b', unit: 2 },
  { topic: 'COCOMO / Estimation', score: 100, papers: 6, color: '#f59e0b', unit: 2 },
  { topic: 'Software Architecture', score: 100, papers: 6, color: '#2997ff', unit: 3 },
  { topic: 'UML Diagrams (Use Case/Sequence)', score: 100, papers: 6, color: '#2997ff', unit: 3 },
  { topic: 'Testing (Black/White Box)', score: 100, papers: 6, color: '#059669', unit: 4 },
  { topic: 'Review Techniques', score: 83, papers: 5, color: '#059669', unit: 4 },
  { topic: 'Risk Management', score: 100, papers: 6, color: '#a855f7', unit: 5 },
  { topic: 'Maintenance & Reengineering', score: 100, papers: 6, color: '#a855f7', unit: 5 },
  { topic: 'GUI Design', score: 67, papers: 4, color: '#2997ff', unit: 3 },
];

const RADAR_DATA = [
  { unit: 'U1', mcq: 95, partB: 90, partC: 80, label: 'Process' },
  { unit: 'U2', mcq: 95, partB: 85, partC: 75, label: 'Req+Est' },
  { unit: 'U3', mcq: 90, partB: 95, partC: 85, label: 'Arch+UML' },
  { unit: 'U4', mcq: 95, partB: 80, partC: 95, label: 'Testing' },
  { unit: 'U5', mcq: 85, partB: 75, partC: 70, label: 'Risk+Mnt' },
];

const HEATMAP = [
  ['Y','Y','Y','Y','Y','Y'], // Process Models
  ['Y','Y','Y','Y','Y','Y'], // Requirements
  ['Y','Y','Y','Y','Y','Y'], // COCOMO
  ['Y','Y','Y','Y','Y','Y'], // Architecture
  ['Y','Y','Y','Y','Y','Y'], // UML
  ['Y','Y','Y','Y','Y','Y'], // Testing
  ['Y','Y','Y','Y','Y','Y'], // Risk
  ['Y','Y','Y','Y','Y','Y'], // Maintenance
  ['Y','Y','N','Y','Y','Y'], // Reviews
  ['Y','Y','Y','Y','Y','N'], // GUI
];

const PAPER_LABELS = ['May24','Jul24','Dec24','May25','Jul25','Nov25'];

// ─────────────────────────────────────────
// PART A — MCQ BANK (Unit-wise, PYQ ranked)
// ─────────────────────────────────────────

const PART_A_MCQS: Record<string, {
  source: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}[]> = {
  'U1 — Process Models': [
    { source: 'All 6 papers', question: 'Which is the classic sequential software process model?', options: ['Waterfall', 'Spiral', 'Agile', 'Incremental'], correct: 0, explanation: 'Waterfall = sequential phases: Requirements → Design → Implementation → Testing → Deployment → Maintenance.' },
    { source: 'May24 · Jul24 · Dec24 · May25', question: 'The spiral model is driven primarily by:', options: ['Risk analysis', 'User requirements', 'Budget', 'Schedule'], correct: 0, explanation: 'Spiral = risk-driven. Each loop starts with risk identification → analysis → engineering → planning.' },
    { source: 'Jul24 · Dec24 · Nov25', question: 'Which model is best when requirements are unclear and change frequently?', options: ['Waterfall', 'Agile/Scrum', 'V-Model', 'RAD'], correct: 1, explanation: 'Agile embraces change through iterative sprints. Fixed-requirement models (Waterfall) fail here.' },
    { source: 'May25 · Jul25 · Nov25', question: 'In Scrum, the time-boxed iteration period is called:', options: ['Phase', 'Sprint', 'Cycle', 'Increment'], correct: 1, explanation: 'Sprint = 2-4 week time-box. Product increment delivered each sprint. Scrum Master facilitates.' },
    { source: 'Dec24 · Nov25', question: 'V-Model associates every development phase with:', options: ['Risk assessment', 'A corresponding testing phase', 'Code review', 'User feedback'], correct: 1, explanation: 'V-Model: Requirements↔Acceptance, HLD↔System, LLD↔Integration, Coding↔Unit testing.' },
    { source: 'May24 · Jul25', question: 'A major drawback of the Waterfall model is:', options: ['Too many deliverables', 'No going back to previous phase', 'Expensive tools needed', 'Requires large team'], correct: 1, explanation: 'Waterfall = no backtracking. Requirements locked upfront. Any change = costly late-stage rework.' },
    { source: 'Jul24 · Nov25', question: 'Extreme Programming (XP) is characterized by:', options: ['Heavy documentation', 'Pair programming & short iterations', 'Formal change control', 'Sequential phases'], correct: 1, explanation: 'XP = pair programming, test-driven development, continuous integration, small releases, collective ownership.' },
    { source: 'Dec24 · May25', question: 'Which process model combines prototyping with the waterfall approach?', options: ['Spiral', 'Incremental', 'Evolutionary prototype', 'RAD'], correct: 2, explanation: 'Evolutionary prototype = iterative refinement. Prototype evolves into final product through repeated cycles.' },
    { source: 'SEPM_PYQ_Final_ExamPack.docx', question: 'Which activity is part of the generic software process framework?', options: ['Communication', 'Planning', 'Modeling', 'All of these'], correct: 3, explanation: 'Generic framework activities include communication, planning, modeling, construction, and deployment.' },
    { source: 'SEPM_PYQ_GPT55_WrittenAnswers_ExamPack.docx', question: 'Which model is most suitable when project risk is very high?', options: ['Waterfall', 'Spiral', 'RAD', 'Big Bang'], correct: 1, explanation: 'Spiral is explicitly risk-driven and performs risk analysis in each loop/cycle.' },
  ],
  'U2 — Requirements & Estimation': [
    { source: 'All 6 papers', question: 'Functional requirements describe:', options: ['Performance criteria', 'What the system must do', 'UI layout', 'Hardware specs'], correct: 1, explanation: 'Functional = system behavior (calculate, display, validate). Non-functional = performance, security, usability.' },
    { source: 'Jul24 · May25 · Jul25 · Nov25', question: 'Which is NOT a non-functional requirement?', options: ['Response time < 2s', 'System must authenticate users', 'System must handle 500 concurrent users', 'Data encrypted at rest'], correct: 1, explanation: '"Authenticate users" = functional (system does something). Others = performance/security non-functional.' },
    { source: 'Jul24 · Jul25 · Nov25', question: 'SRS stands for:', options: ['Software Requirement Specification', 'System Requirement Strategy', 'Software Review Specification', 'System Resource Standard'], correct: 0, explanation: 'SRS = Software Requirement Specification. Formal document listing all requirements, constraints, and system behavior.' },
    { source: 'Dec24 · May25 · Nov25', question: 'Which is a requirements elicitation technique?', options: ['Desk check', 'Interview, observation, questionnaire', 'Unit testing', 'Code review'], correct: 1, explanation: 'Elicitation = gathering requirements from stakeholders. Methods: interview, observation, questionnaire, workshop, brainstorming.' },
    { source: 'All 6 papers', question: 'COCOMO stands for:', options: ['Constructive Cost Model', 'Comprehensive Cost Management', 'Component Object Model', 'Computer Cost Optimization'], correct: 0, explanation: 'COCOMO = COnstructive COst MOdel by Barry Boehm. Estimates effort based on KLOC and cost drivers.' },
    { source: 'Jul24 · Dec24 · Jul25 · Nov25', question: 'In COCOMO Basic, effort is measured in:', options: ['Function points', 'Person-months', 'Lines of code', 'Hours'], correct: 1, explanation: 'Basic COCOMO: Effort = a × (KLOC)^b person-months. Tdev = c × (Effort)^d months.' },
    { source: 'Jul24 · May25 · Jul25', question: 'Which size measure counts the number of user inputs, outputs, inquiries, files?', options: ['KLOC', 'Function Points', 'Cyclomatic complexity', 'Object points'], correct: 1, explanation: 'Function Points = weighted sum of inputs, outputs, inquiries, files, interfaces. Used when LOC is unknown.' },
    { source: 'Nov25', question: 'COCOMO II is more suitable than COCOMO I because:', options: ['It uses less data', 'It handles modern reuse and risk factors', 'It ignores team size', 'It is older and proven'], correct: 1, explanation: 'COCOMO II = 17 cost drivers, supports reuse, modern life cycles. COCOMO I = only 15 drivers, no reuse.' },
    { source: 'SEPM_PYQ_Final_ExamPack.docx', question: 'Requirements elicitation is used to:', options: ['Gather stakeholder needs', 'Deploy the system', 'Write source code', 'Publish user manual'], correct: 0, explanation: 'Elicitation techniques (interviews, workshops, observation) are used to discover stakeholder needs.' },
    { source: 'SEPM_PYQ_GPT55_WrittenAnswers_ExamPack.docx', question: 'In Basic COCOMO, effort is primarily estimated from:', options: ['Number of meetings', 'Software size in KLOC', 'Number of test cases', 'Team hierarchy'], correct: 1, explanation: 'Basic COCOMO is size-driven; KLOC is the main input for effort estimation.' },
  ],
  'U3 — Architecture, UML, GUI': [
    { source: 'Jul24 · May25 · Jul25 · Nov25', question: 'Which UML diagram shows interactions between actors and the system?', options: ['Class diagram', 'Use case diagram', 'Sequence diagram', 'Activity diagram'], correct: 1, explanation: 'Use case = actor + use case ellipse + system boundary. Shows WHAT the system does, not HOW.' },
    { source: 'May24 · Dec24 · Jul25 · Nov25', question: 'Which diagram shows object interactions in time order?', options: ['Class diagram', 'Activity diagram', 'Sequence diagram', 'Component diagram'], correct: 2, explanation: 'Sequence = lifelines + messages + activation bars. Shows WHEN messages are sent between objects.' },
    { source: 'Jul24 · May25 · Nov25', question: 'Layered architecture organizes a system into:', options: ['Modules with similar function', 'Horizontal layers of abstraction', 'Client-server nodes', 'Event-driven components'], correct: 1, explanation: 'Layered = presentation → business logic → data access → database. Each layer only talks to adjacent layers.' },
    { source: 'May25 · Jul25 · Nov25', question: 'Cohesion refers to:', options: ['Dependencies between modules', 'How closely elements within a module relate', 'Testing coverage', 'Code review frequency'], correct: 1, explanation: 'High cohesion = module does one thing well. Low coupling = modules are independent. Both = good design.' },
    { source: 'Jul24 · Dec24', question: 'In GUI design, a toolbar provides:', options: ['Data validation', 'Quick access to frequently used commands', 'Error logging', 'Database connectivity'], correct: 1, explanation: 'Toolbar = row of icons/buttons for common actions. Accelerates interaction vs navigating menus.' },
    { source: 'Dec24 · Nov25', question: 'An activity diagram is similar to:', options: ['ER diagram', 'Flowchart', 'Class diagram', 'State diagram'], correct: 1, explanation: 'Activity = flowchart-like: decision nodes, forks, joins. Models workflow/process logic.' },
    { source: 'SEPM_PYQ_GPT55_WrittenAnswers_ExamPack.docx', question: 'The main benefit of layered architecture is:', options: ['More coupling', 'Separation of concerns', 'No need for testing', 'No need for documentation'], correct: 1, explanation: 'Layered architecture separates responsibilities across layers, improving maintainability and change management.' },
    { source: 'SEPM_PYQ_Final_ExamPack.docx', question: 'Which architecture style is commonly used in enterprise systems?', options: ['Client-server', 'Random architecture', 'Single function model', 'Linear model'], correct: 0, explanation: 'Client-server is a standard and widely used architectural style for distributed enterprise applications.' },
  ],
  'U4 — Testing & Review': [
    { source: 'All 6 papers', question: 'Black-box testing is based on:', options: ['Code structure', 'Requirements/specifications', 'Source code review', 'Developer knowledge'], correct: 1, explanation: 'Black-box = tests derived from requirements. Tester does not see code. Equivalence partitioning, boundary value analysis.' },
    { source: 'May24 · Jul24 · May25 · Nov25', question: 'White-box testing examines:', options: ['User requirements', 'Internal logic and code paths', 'Hardware performance', 'Network latency'], correct: 1, explanation: 'White-box = structural testing. Statement coverage, branch coverage, path coverage, cyclomatic complexity.' },
    { source: 'Jul24 · Jul25 · Nov25', question: 'Unit testing is done by:', options: ['End users', 'Customers', 'Developers', 'QA team'], correct: 2, explanation: 'Unit = developers test individual modules/functions. First level of testing. Uses white-box + black-box.' },
    { source: 'May24 · Dec24 · Jul25', question: 'Regression testing ensures:', options: ['New features work', 'Existing features still work after changes', 'Performance improves', 'Code is documented'], correct: 1, explanation: 'Regression = re-test existing functionality after code changes. Catches unintended side effects.' },
    { source: 'Jul24 · Dec24 · Nov25', question: 'Boundary value analysis tests values at:', options: ['Random points', 'Edges of equivalence classes', 'Center of ranges', 'Only maximum values'], correct: 1, explanation: 'BVA = test boundaries: min, min+, nominal, max-, max. For range 1-100: test 0, 1, 2, 99, 100, 101.' },
    { source: 'May24 · May25 · Nov25', question: 'A desk check is:', options: ['Automated test tool', 'Manual code walkthrough by developer', 'Performance benchmark', 'Security audit'], correct: 1, explanation: 'Desk check = developer mentally traces code with sample data. Simplest manual verification technique.' },
    { source: 'May24 · Dec24 · Jul25', question: 'A walkthrough is led by:', options: ['The author', 'A moderator (not the author)', 'The tester', 'The customer'], correct: 1, explanation: 'Walkthrough = moderator-led meeting. Author presents code. Team asks questions. Informal review.' },
    { source: 'SEPM_PYQ_GPT55_WrittenAnswers_ExamPack.docx', question: 'Which of the following is a white-box testing technique?', options: ['Boundary value analysis', 'Equivalence partitioning', 'Statement coverage', 'Decision table testing'], correct: 2, explanation: 'Statement/branch/path coverage are structural (white-box) techniques based on code logic.' },
    { source: 'SEPM_PYQ_Final_ExamPack.docx', question: 'The primary objective of regression testing is to:', options: ['Measure performance', 'Retest old functionality after change', 'Replace unit testing', 'Write new requirements'], correct: 1, explanation: 'Regression testing ensures changes do not break already-working parts of the system.' },
  ],
  'U5 — Risk, Maintenance, Reengineering': [
    { source: 'All 6 papers', question: 'Proactive risk strategy involves:', options: ['Fixing problems after they occur', 'Planning for risks before they happen', 'Ignoring risks', 'Delegating to management'], correct: 1, explanation: 'Proactive = identify risks early, plan mitigation. Reactive = respond after risk materializes. Proactive > reactive.' },
    { source: 'May24 · May25 · Jul25 · Nov25', question: 'The first step in risk management is:', options: ['Risk monitoring', 'Risk identification', 'Risk planning', 'Risk resolution'], correct: 1, explanation: 'Risk management: Identification → Analysis → Planning → Monitoring → Resolution. Identification first.' },
    { source: 'May25 · Jul25 · Nov25', question: 'Adaptive maintenance is performed to:', options: ['Fix bugs', 'Adapt to changing environment', 'Improve performance', 'Add new features'], correct: 1, explanation: '4 types: Corrective (fix bugs), Adaptive (env change), Perfective (enhance), Preventive (prevent future issues).' },
    { source: 'Jul24 · Dec24 · May25', question: 'Software reengineering involves:', options: ['Building new software', 'Understanding and transforming existing system', 'Only documentation', 'Only testing'], correct: 1, explanation: 'Reengineering = reverse engineering → restructuring → forward engineering. Extends system life without rewrite.' },
    { source: 'Nov25', question: 'Corrective maintenance is performed to:', options: ['Add features', 'Fix defects discovered after delivery', 'Improve performance', 'Adapt to new OS'], correct: 1, explanation: 'Corrective = bug fixes post-delivery. Most common maintenance type (~20% of total maintenance effort).' },
    { source: 'Jul24 · Dec24', question: 'RMMM plan stands for:', options: ['Risk Management and Monitoring Model', 'Risk Mitigation, Monitoring, and Management Plan', 'Requirements Management Method', 'Release Management Master Plan'], correct: 1, explanation: 'RMMM = Risk Mitigation, Monitoring, and Management Plan. Documents all identified risks with mitigation strategies.' },
    { source: 'SEPM_PYQ_GPT55_WrittenAnswers_ExamPack.docx', question: 'Perfective maintenance is done to:', options: ['Fix post-release defects', 'Adapt to environment changes', 'Improve performance/usability', 'Prevent future faults only'], correct: 2, explanation: 'Perfective maintenance enhances quality, usability, and performance based on evolving user/business expectations.' },
    { source: 'SEPM_PYQ_Final_ExamPack.docx', question: 'Why is maintenance important in software engineering?', options: ['All costs occur before release', 'Software never changes after release', 'Large effort is spent after deployment', 'Maintenance replaces testing'], correct: 2, explanation: 'Most real systems evolve continuously after deployment; maintenance consumes significant lifecycle effort.' },
  ],
};

// ─────────────────────────────────────────
// PART B — EXAM-READY ANSWERS (8 marks, unit-wise)
// ─────────────────────────────────────────

interface PartBQuestion {
  unit: number;
  question: string;
  sources: string[];
  marks: number;
  answer: string[];
  diagramType?: string;
}

const PART_B_QUESTIONS: PartBQuestion[] = [
  {
    unit: 1, question: 'Explain the Waterfall model with a neat diagram. What are its advantages and disadvantages?',
    sources: ['May24','Dec24','May25','Nov25'], marks: 8,
    answer: [
      '**Definition (1 mark):** The Waterfall model is a sequential software development life cycle model where each phase must be completed before the next begins. Proposed by Winston Royce in 1970.',
      '**Phases (3 marks):**\n1. **Requirements Analysis** — Gather and document all requirements\n2. **System Design** — High-level and low-level architecture\n3. **Implementation** — Code the system per design\n4. **Testing** — Verify system meets requirements\n5. **Deployment** — Release to customer\n6. **Maintenance** — Fix bugs and make enhancements',
      '**Advantages (2 marks):**\n- Simple and easy to understand\n- Phases are well-defined with clear deliverables\n- Suited for small projects with stable requirements\n- Easy to manage due to rigid structure',
      '**Disadvantages (2 marks):**\n- No backtracking — errors in early phases cascade downstream\n- Working software only available after the final phase\n- Cannot accommodate changing requirements\n- High risk and uncertainty for large projects',
    ],
    diagramType: 'waterfall',
  },
  {
    unit: 1, question: 'Compare Agile (Scrum) and Waterfall models. When would you choose each?',
    sources: ['Dec24','May25','Jul25','Nov25'], marks: 8,
    answer: [
      '**Scrum (3 marks):**\n- Iterative: work done in 2-4 week sprints\n- Roles: Product Owner, Scrum Master, Development Team\n- Artifacts: Product Backlog, Sprint Backlog, Increment\n- Daily standups, sprint review, retrospective\n- Embraces changing requirements\n- Working software delivered every sprint',
      '**Waterfall (3 marks):**\n- Sequential: each phase flows into the next\n- All requirements gathered upfront\n- No working software until final phase\n- Formal documentation at each stage\n- Resistant to requirement changes\n- Suited for projects with fixed scope',
      '**When to choose (2 marks):**\n- **Scrum**: Requirements unclear/evolving, customer involvement available, small team, fast feedback needed\n- **Waterfall**: Requirements fixed and well-understood, regulatory/compliance needs, large team, clear milestones needed',
    ],
    diagramType: 'agile-waterfall',
  },
  {
    unit: 2, question: 'Explain the COCOMO model. Differentiate between Basic and Intermediate COCOMO.',
    sources: ['Jul24','Dec24','May25','Jul25','Nov25'], marks: 8,
    answer: [
      '**Definition (1 mark):** COCOMO (COnstructive COst MOdel) is an algorithmic software cost estimation model developed by Barry Boehm. It estimates effort and schedule based on the size of the software product.',
      '**Basic COCOMO (3 marks):**\n- Effort = a × (KLOC)^b person-months\n- Development time = c × (Effort)^d months\n- Three modes: Organic (a=2.4, b=1.05), Semi-detached (a=3.0, b=1.12), Embedded (a=3.6, b=1.20)\n- Only considers KLOC as input\n- Suitable for rough early estimates',
      '**Intermediate COCOMO (3 marks):**\n- Same base formula as Basic\n- Adds 15 cost driver attributes that adjust the estimate\n- Cost drivers include: Required software reliability, Database size, Execution time constraint, Product complexity, Analyst capability, Programmer capability, Application experience, etc.\n- Each driver rated Very Low to Extra High (0.7 to 1.66)\n- Effort Adjustment Factor (EAF) = product of all driver ratings\n- Adjusted Effort = Basic Effort × EAF',
      '**Key difference (1 mark):** Basic uses only KLOC. Intermediate multiplies by cost driver ratings to account for project-specific factors, giving a more accurate estimate.',
    ],
  },
  {
    unit: 2, question: 'Explain functional and non-functional requirements with examples. What is SRS?',
    sources: ['Jul24','May25','Jul25','Nov25'], marks: 8,
    answer: [
      '**Functional Requirements (2 marks):**\nDefine WHAT the system must do. Describes specific behaviors, inputs, outputs, and processing.\n- Examples: "User shall be able to login with email and password"\n- "System shall generate monthly report in PDF format"\n- "Customer can add items to shopping cart"',
      '**Non-Functional Requirements (2 marks):**\nDefine HOW the system performs. Describe quality attributes and constraints.\n- **Performance**: Response time < 2 seconds\n- **Security**: Data encrypted using AES-256\n- **Usability**: Interface available in 3 languages\n- **Reliability**: System uptime 99.9%\n- **Scalability**: Support 1000 concurrent users',
      '**SRS — Software Requirement Specification (2 marks):**\n- Formal document that describes all requirements of the system\n- Serves as contract between customer and developer\n- Contains: Introduction, Overall description, Specific requirements, Appendices\n- Should be complete, consistent, verifiable, modifiable, traceable',
      '**Difference summary (2 marks):**\n- Functional = system behavior (what it does)\n- Non-functional = quality attributes (how well it does it)\n- Both are documented in SRS. Functional are testable via functional tests. Non-functional via performance/security tests.',
    ],
  },
  {
    unit: 3, question: 'Draw and explain a Use Case diagram for an ATM system.',
    sources: ['May24','Dec24','Jul25','Nov25'], marks: 8,
    answer: [
      '**Use Case Diagram (diagram — 3 marks):** [See diagram below]',
      '**Explanation (5 marks):**\n- **Actor**: Stick figure representing external entity (Customer, Bank Admin)\n- **Use Case**: Ellipse describing a system function (Withdraw Cash, Check Balance, Transfer Funds)\n- **System Boundary**: Rectangle enclosing all use cases\n- **Relationships**:\n  - **Include**: Mandatory sub-use case (e.g., "Withdraw Cash" includes "Authenticate")\n  - **Extend**: Optional sub-use case (e.g., "Print Receipt" extends "Withdraw Cash")\n  - **Generalization**: Parent-child relationship between use cases\n- **ATM Use Cases**: Login, Check Balance, Withdraw Cash, Deposit Cash, Transfer Funds, Change PIN, Print Receipt\n- **Customer actor** is associated with all primary use cases\n- **Bank Admin actor** manages system configuration',
    ],
    diagramType: 'usecase',
  },
  {
    unit: 3, question: 'Draw and explain a Sequence diagram for a Login process.',
    sources: ['Dec24','May25','Jul25','Nov25'], marks: 8,
    answer: [
      '**Sequence Diagram (diagram — 3 marks):** [See diagram below]',
      '**Explanation (5 marks):**\n- **Lifeline**: Dashed vertical line for each object/participant\n- **Activation box**: Thin rectangle on lifeline showing when object is active\n- **Messages**: Horizontal arrows between lifelines\n  - Solid arrow → synchronous message\n  - Dashed arrow → return/response\n  - Self-arrow → self-call\n- **Login flow**:\n  1. User → Login UI: enters credentials\n  2. Login UI → Controller: validate input\n  3. Controller → Database: query user record\n  4. Database → Controller: return user data\n  5. Controller → Controller: verify password (hash compare)\n  6. Controller → Login UI: authentication result\n  7. Login UI → User: show success/error message\n- **Alt/Opt frames**: Show conditional flows (e.g., password incorrect → retry)',
    ],
    diagramType: 'sequence',
  },
  {
    unit: 4, question: 'Differentiate black-box testing and white-box testing. Explain boundary value analysis.',
    sources: ['Jul24','May25','Jul25','Nov25'], marks: 8,
    answer: [
      '**Black-Box Testing (2 marks):**\n- Tests derived from requirements/specifications\n- Tester has no knowledge of internal code structure\n- Techniques: Equivalence partitioning, BVA, decision table, state transition\n- Focuses on functional requirements\n- Example: Test login by providing valid/invalid inputs',
      '**White-Box Testing (2 marks):**\n- Tests derived from internal code structure\n- Requires knowledge of source code and logic\n- Techniques: Statement coverage, branch coverage, path coverage\n- Focuses on code quality and logic paths\n- Example: Cyclomatic complexity-based test cases',
      '**Comparison (2 marks):**\n- Black-box = external behavior, done by testers\n- White-box = internal logic, done by developers\n- Black-box catches requirement gaps; white-box catches logic errors\n- Used together for comprehensive testing',
      '**Boundary Value Analysis (2 marks):**\n- Based on the observation that most errors occur at boundaries\n- If input range is [a, b], test: a-1, a, a+1, b-1, b, b+1\n- Example: Password length 8-20 chars → test lengths 7, 8, 9, 19, 20, 21\n- Also test: empty, null, very long input\n- Combines with equivalence partitioning for efficiency',
    ],
    diagramType: 'bva',
  },
  {
    unit: 5, question: 'Explain the risk management process. Differentiate proactive and reactive strategies.',
    sources: ['May24','Jul24','Dec24','May25','Jul25','Nov25'], marks: 8,
    answer: [
      '**Risk Management Process (4 marks):**\n1. **Risk Identification**: List all possible risks (technical, project, business)\n2. **Risk Analysis**: Assess probability (0-1) and impact (1-10) for each risk\n3. **Risk Planning**: Develop mitigation strategies for high-priority risks\n4. **Risk Monitoring**: Track risk status throughout the project\n5. **Risk Resolution**: Execute mitigation when risk materializes',
      '**Proactive Strategy (2 marks):**\n- Identify and plan for risks BEFORE they occur\n- Develop contingency plans\n- Allocate budget reserves\n- Conduct risk reviews at each milestone\n- Build quality into the process\n- **Example**: Identify "key developer may leave" → cross-train team members',
      '**Reactive Strategy (2 marks):**\n- Respond to risks AFTER they materialize\n- No advance planning or mitigation\n- firefighting mode — fixes are ad-hoc\n- More expensive and time-consuming\n- **Example**: Developer leaves → scramble to find replacement → project delays',
      '**Conclusion**: Proactive is always preferred. Reactive leads to crisis management.',
    ],
    diagramType: 'risk-matrix',
  },
  {
    unit: 1, question: 'Compare Waterfall, Incremental, Agile/Scrum, and Spiral models with suitable project scenarios.',
    sources: ['SEPM_PYQ_Final_ExamPack.docx','Jul25','Nov25'], marks: 8,
    answer: [
      '**Waterfall (2 marks):** Linear and phase-wise. Best for stable requirements, clear scope, and compliance-heavy projects. Weak for late requirement changes.',
      '**Incremental (2 marks):** Product delivered in small functional releases. Useful when core features must go live early and enhancements can follow iteratively.',
      '**Agile/Scrum (2 marks):** Iterative, sprint-based, and feedback-driven. Best for evolving requirements, close customer collaboration, and fast release cycles.',
      '**Spiral (2 marks):** Iterative with explicit risk analysis in each cycle. Best for large/high-risk projects where technical and business uncertainty is high.',
    ],
    diagramType: 'agile-waterfall',
  },
  {
    unit: 2, question: 'Explain requirements engineering steps and the characteristics of a good SRS.',
    sources: ['SEPM_PYQ_GPT55_WrittenAnswers_ExamPack.docx','Jul24','Nov25'], marks: 8,
    answer: [
      '**Requirements Engineering Steps (5 marks):**\n1. Feasibility study\n2. Elicitation (interviews, observation, workshops)\n3. Analysis and negotiation\n4. Specification (SRS)\n5. Validation\n6. Requirements management (change control and traceability)',
      '**Good SRS Characteristics (3 marks):**\n- Correct and complete\n- Consistent and unambiguous\n- Verifiable/testable\n- Modifiable and traceable\n- Clear contract between customer and development team',
    ],
  },
  {
    unit: 3, question: 'Explain software architecture and layered architecture with merits and limitations.',
    sources: ['SEPM_Complete_PYQ_Analysis_Breakdown.docx','Jul24','May25'], marks: 8,
    answer: [
      '**Software Architecture (2 marks):** High-level blueprint of system components, connectors, and constraints; drives maintainability, scalability, and team coordination.',
      '**Layered Architecture (3 marks):** Typical layers are Presentation, Business Logic, and Data Access. Each layer should interact primarily with adjacent layers.',
      '**Merits (2 marks):** Separation of concerns, easier maintenance/testing, independent evolution of layers, and cleaner team ownership.',
      '**Limitations (1 mark):** Performance overhead from cross-layer calls and reduced flexibility when strict layering is over-enforced.',
    ],
  },
  {
    unit: 4, question: 'Explain software review techniques: desk check, walkthrough, and formal review. Compare with testing.',
    sources: ['SEPM_Complete_PYQ_Analysis_Breakdown.docx','May24','Nov25'], marks: 8,
    answer: [
      '**Desk Check (2 marks):** Author manually traces logic/code with sample inputs to catch obvious defects early.',
      '**Walkthrough (2 marks):** Author-led peer session to explain design/code and collect feedback; less formal but effective for shared understanding.',
      '**Formal Review/Inspection (2 marks):** Structured, role-based process with checklists, defect logging, and follow-up actions.',
      '**Review vs Testing (2 marks):** Reviews are static verification (without execution); testing is dynamic verification (with execution). Both are complementary for quality.',
    ],
    diagramType: 'testing-levels',
  },
  {
    unit: 5, question: 'Explain software maintenance types and reengineering process with suitable examples.',
    sources: ['SEPM_PYQ_GPT55_WrittenAnswers_ExamPack.docx','Dec24','Nov25'], marks: 8,
    answer: [
      '**Maintenance Types (5 marks):**\n- Corrective: bug fixes after release\n- Adaptive: changes for new OS/regulations/environment\n- Perfective: feature/performance/usability enhancement\n- Preventive: refactoring and improvements to reduce future faults',
      '**Reengineering (3 marks):** Modernization without changing external behavior. Flow: Reverse Engineering -> Restructuring -> Forward Engineering. Used for legacy systems with high business value and poor maintainability.',
    ],
    diagramType: 'reengineering',
  },
];

// ─────────────────────────────────────────
// PART C — 15 MARK PREDICTIONS (Full model answers)
// ─────────────────────────────────────────

interface PartCQuestion {
  scenario: string;
  rank: string;
  rankColor: string;
  probability: number;
  unit: number;
  sources: string[];
  answer: string[];
  diagramTypes: string[];
}

const PART_C_QUESTIONS: PartCQuestion[] = [
  {
    scenario: 'A bank wants to build an Online Banking System. Explain the software process model selection with justification. Draw the Use Case diagram and Sequence diagram for the "Fund Transfer" functionality.',
    rank: 'HIGHLY PROBABLE', rankColor: '#ef4444', probability: 95, unit: 1,
    sources: ['Dec24 Q27','May25 Q27','Jul25 Q27','Nov25 Q27'],
    answer: [
      '**Part A: Process Model Selection (5 marks)**\n\nFor an Online Banking System, **Agile/Scrum** is the recommended model.\n\n**Justification:**\n1. **Evolving requirements**: Banking features change frequently (new regulations, security updates, mobile app integration)\n2. **Customer involvement**: Bank stakeholders need to see progress iteratively\n3. **Security is critical**: Each sprint can include security review\n4. **Incremental delivery**: Core banking (login, balance) first, then transfers, then advanced features\n5. **Risk reduction**: Each 2-week sprint delivers working software, catching issues early\n\n**Alternative considered — Waterfall**: Not suitable because banking requirements evolve with regulations and customer expectations. A 6-month waterfall cycle would deliver outdated features.\n\n**Alternative considered — Spiral**: Too heavy for a web application. Risk analysis overhead per cycle is unnecessary for a well-understood domain like banking.\n\n---\n\n**Part B: Use Case Diagram for Fund Transfer (5 marks)** [See diagram below]\n\n**Actors:** Customer, Bank System, External Bank\n\n**Use Cases:**\n- Login (include Authentication)\n- View Account Balance\n- Transfer Funds (extend Verify OTP, include Validate Account)\n- View Transaction History\n- Pay Bills\n- Logout\n\n**Relationships:**\n- "Transfer Funds" <<include>> "Validate Account"\n- "Transfer Funds" <<extend>> "Verify OTP" (for amounts > threshold)\n- "Login" <<include>> "Authentication"\n- Generalization: "Transfer Funds" has child cases "Within Bank Transfer" and "External Bank Transfer"\n\n---\n\n**Part C: Sequence Diagram for Fund Transfer (5 marks)** [See diagram below]\n\n**Objects:** Customer, LoginUI, TransferUI, Controller, AuthService, AccountService, NotificationService\n\n**Flow:**\n1. Customer → LoginUI: enter credentials\n2. LoginUI → AuthService: authenticate(user, pass)\n3. AuthService → LoginUI: auth success + token\n4. Customer → TransferUI: select transfer, enter amount, select payee\n5. TransferUI → Controller: initiateTransfer(from, to, amount, token)\n6. Controller → AuthService: validateToken(token)\n7. AuthService → Controller: token valid\n8. Controller → AccountService: checkBalance(fromAccount)\n9. AccountService → Controller: balance sufficient\n10. Controller → AccountService: debit(fromAccount, amount)\n11. Controller → AccountService: credit(toAccount, amount)\n12. Controller → NotificationService: sendConfirmation(toAccount holder)\n13. Controller → TransferUI: transfer success\n14. TransferUI → Customer: display confirmation with receipt',
    ],
    diagramTypes: ['usecase-banking', 'sequence-transfer'],
  },
  {
    scenario: 'Explain different types of software testing in detail. Design manual test cases for a Login page functionality.',
    rank: 'VERY LIKELY', rankColor: '#f59e0b', probability: 90, unit: 4,
    sources: ['Dec24 Q27','May25 Q27','Nov25 Q27'],
    answer: [
      '**Part A: Types of Testing (7 marks)**\n\n**1. Unit Testing:**\n- Tests individual modules, functions, or components\n- Done by developers using white-box techniques\n- Tools: JUnit, pytest, Jest\n- Example: Test a validatePassword() function\n\n**2. Integration Testing:**\n- Tests interaction between combined modules\n- Approaches: Top-down, Bottom-up, Big Bang, Sandwich\n- Detects interface defects\n- Example: Test login module + database connection together\n\n**3. System Testing:**\n- Tests the complete integrated system against requirements\n- Both functional and non-functional testing\n- End-to-end testing in an environment simulating production\n\n**4. Acceptance Testing:**\n- Validates system meets customer requirements\n- Alpha testing: done by customer at developer site\n- Beta testing: done by customer at customer site\n\n**5. Regression Testing:**\n- Re-run existing tests after code changes\n- Ensures new changes don\'t break existing functionality\n- Automated test suites are common for regression\n\n**6. Black-Box Testing:**\n- Based on requirements, not code\n- Techniques: Equivalence Partitioning, BVA, Decision Table\n\n**7. White-Box Testing:**\n- Based on code structure\n- Techniques: Statement Coverage, Branch Coverage, Path Coverage\n\n---\n\n**Part B: Manual Test Cases for Login (8 marks)**\n\n| Test ID | Description | Input | Expected Result |\n|---------|-------------|-------|-----------------|\n| TC01 | Valid login | valid email + correct password | Login success, redirect to dashboard |\n| TC02 | Invalid password | valid email + wrong password | "Invalid credentials" error |\n| TC03 | Invalid email | unregistered email + any password | "User not found" error |\n| TC04 | Empty fields | both fields empty | "Email and password required" |\n| TC05 | Empty password | valid email + empty password | "Password required" |\n| TC06 | SQL injection | email: admin\' OR 1=1 -- | Input sanitized, login rejected |\n| TC07 | XSS attempt | password: <script>alert(1)</script> | Input sanitized, no script execution |\n| TC08 | Password boundary | password exactly at min length (8 chars) | Login success |\n| TC09 | Password too short | password 7 chars (below min) | "Password must be 8+ characters" |\n| TC10 | Multiple failed login | 5 consecutive wrong attempts | Account locked for 15 minutes |',
    ],
    diagramTypes: ['testing-levels'],
  },
  {
    scenario: 'Explain software maintenance types in detail. What is software reengineering? Discuss the reengineering process with a diagram.',
    rank: 'POSSIBLE', rankColor: '#2997ff', probability: 75, unit: 5,
    sources: ['Jul24 Q27','Dec24','May25','Nov25'],
    answer: [
      '**Part A: Software Maintenance Types (8 marks)**\n\n**1. Corrective Maintenance (2 marks):**\n- Fixes defects/bugs discovered after delivery\n- Most frequent type (~20% of all maintenance)\n- Example: Fix calculation error in tax module\n- Triggered by user bug reports\n\n**2. Adaptive Maintenance (2 marks):**\n- Modifies system to adapt to external environment changes\n- Examples: New OS version, new database, new regulations, new hardware\n- Does not add new functionality\n- Example: Migrate from Oracle 11g to Oracle 19c\n\n**3. Perfective Maintenance (2 marks):**\n- Enhances existing functionality or adds new features\n- Based on user feedback and evolving business needs\n- Most costly maintenance type (~50% of effort)\n- Example: Add dark mode, improve search performance\n\n**4. Preventive Maintenance (2 marks):**\n- Modifies code to prevent future problems\n- Code restructuring, documentation updates, performance tuning\n- Reduces technical debt\n- Example: Refactor tightly-coupled modules to reduce dependency\n\n---\n\n**Part B: Software Reengineering (4 marks)**\n\n**Definition:** Reengineering is the systematic transformation of an existing system to improve maintainability, performance, or adaptability without changing its functionality.\n\n**Why reengineer?**\n- Legacy code is hard to maintain\n- Original developers are gone\n- Documentation is outdated or missing\n- Business logic needs preservation while modernizing tech\n\n**Reengineering Process (3 marks):** [See diagram below]\n1. **Reverse Engineering**: Analyze existing system to recover design, architecture, and requirements from source code\n2. **Restructuring**: Reorganize code without changing functionality (improve structure, reduce complexity)\n3. **Forward Engineering**: Apply modern engineering practices to rebuild/improve the system\n\n**Reverse Engineering → Restructuring → Forward Engineering** is the reengineering pipeline.',
    ],
    diagramTypes: ['reengineering'],
  },
];

// ─────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────

const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; }
  .sepm-page { font-family: 'Space Grotesk', sans-serif; background: #0a0a0a; color: #e5e5e5; min-height: 100vh; }
  .mono { font-family: 'JetBrains Mono', monospace; }
  @keyframes scanline { 0% { transform: translateY(-100%); } 100% { transform: translateY(100vh); } }
  .scanline-overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; overflow: hidden; pointer-events: none; z-index: 1; }
  .scanline-overlay::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 4px; background: linear-gradient(180deg, transparent, rgba(5,150,105,0.15), transparent); animation: scanline 4s linear infinite; }
  .card { background: #1c1c1e; border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; overflow: hidden; }
  .card-glow:hover { box-shadow: 0 0 30px rgba(5,150,105,0.1); }
`;

// ─────────────────────────────────────────
// SVG DIAGRAM COMPONENTS
// ─────────────────────────────────────────

function WaterfallDiagram() {
  const phases = ['Requirements','Design','Implementation','Testing','Deployment','Maintenance'];
  const colors = ['#ef4444','#f59e0b','#2997ff','#059669','#a855f7','#6b7280'];
  return (
    <svg width="320" height="400" viewBox="0 0 320 400" style={{ display: 'block', margin: '16px auto' }}>
      {phases.map((p, i) => (
        <g key={p}>
          <rect x={40} y={i * 58 + 8} width={240} height={44} rx={6} fill={`${colors[i]}20`} stroke={colors[i]} strokeWidth={1.5} />
          <text x={160} y={i * 58 + 36} textAnchor="middle" fill="#e5e5e5" fontSize={13} fontWeight={600}>{p}</text>
          {i < 5 && <line x1={160} y1={i * 58 + 52} x2={160} y2={(i + 1) * 58 + 8} stroke="#555" strokeWidth={1.5} markerEnd="url(#arrowG)" />}
        </g>
      ))}
      <defs><marker id="arrowG" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="8" markerHeight="8" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" fill="#555" /></marker></defs>
      <text x={160} y={390} textAnchor="middle" fill="#888" fontSize={10} fontFamily="'JetBrains Mono'">WATERFALL MODEL — Sequential Flow</text>
    </svg>
  );
}

function UseCaseDiagramBanking() {
  return (
    <svg width="420" height="340" viewBox="0 0 420 340" style={{ display: 'block', margin: '16px auto' }}>
      {/* System boundary */}
      <rect x={120} y={10} width={210} height={310} rx={10} fill="rgba(5,150,105,0.05)" stroke="#059669" strokeWidth={1.5} strokeDasharray="6,3" />
      <text x={225} y={30} textAnchor="middle" fill="#059669" fontSize={11} fontWeight={600}>Online Banking System</text>
      {/* Customer actor */}
      <g transform="translate(50,100)">
        <circle cx={0} cy={-20} r={12} fill="none" stroke="#e5e5e5" strokeWidth={1.5} />
        <line x1={0} y1={-8} x2={0} y2={20} stroke="#e5e5e5" strokeWidth={1.5} />
        <line x1={-15} y1={0} x2={15} y2={0} stroke="#e5e5e5" strokeWidth={1.5} />
        <line x1={0} y1={20} x2={-12} y2={40} stroke="#e5e5e5" strokeWidth={1.5} />
        <line x1={0} y1={20} x2={12} y2={40} stroke="#e5e5e5" strokeWidth={1.5} />
        <text x={0} y={56} textAnchor="middle" fill="#e5e5e5" fontSize={11}>Customer</text>
      </g>
      {/* Use cases */}
      {[
        { y: 50, label: 'Login' },
        { y: 95, label: 'View Balance' },
        { y: 140, label: 'Transfer Funds' },
        { y: 185, label: 'View History' },
        { y: 230, label: 'Pay Bills' },
        { y: 275, label: 'Logout' },
      ].map(uc => (
        <g key={uc.label}>
          <ellipse cx={225} cy={uc.y} rx={70} ry={18} fill="rgba(5,150,105,0.1)" stroke="#059669" strokeWidth={1} />
          <text x={225} y={uc.y + 4} textAnchor="middle" fill="#e5e5e5" fontSize={11}>{uc.label}</text>
          <line x1={78} y1={uc.y} x2={155} y2={uc.y} stroke="#555" strokeWidth={0.8} />
        </g>
      ))}
      {/* Include/extend */}
      <line x1={295} y1={140} x2={310} y2={95} stroke="#f59e0b" strokeWidth={1} strokeDasharray="4,2" />
      <text x={308} y={112} fill="#f59e0b" fontSize={8} transform="rotate(-55,308,112)">«include»</text>
      <text x={160} y={380} textAnchor="middle" fill="#888" fontSize={10} fontFamily="'JetBrains Mono'">USE CASE DIAGRAM — Online Banking</text>
    </svg>
  );
}

function SequenceDiagramTransfer() {
  const objects = ['Customer','TransferUI','Controller','AuthSvc','AcctSvc'];
  const ox = [30, 110, 210, 310, 400];
  return (
    <svg width="460" height="360" viewBox="0 0 460 360" style={{ display: 'block', margin: '16px auto' }}>
      {/* Object boxes */}
      {objects.map((o, i) => (
        <g key={o}>
          <rect x={ox[i] - 30} y={5} width={60} height={24} rx={4} fill="#1c1c1e" stroke="#059669" strokeWidth={1} />
          <text x={ox[i]} y={21} textAnchor="middle" fill="#e5e5e5" fontSize={9} fontWeight={500}>{o}</text>
          <line x1={ox[i]} y1={29} x2={ox[i]} y2={340} stroke="#444" strokeWidth={1} strokeDasharray="4,3" />
        </g>
      ))}
      {/* Messages */}
      {[
        { from: 0, to: 1, y: 55, label: 'enterTransferDetails()' },
        { from: 1, to: 2, y: 80, label: 'initiateTransfer(from,to,amt)' },
        { from: 2, to: 3, y: 105, label: 'validateToken(token)' },
        { from: 3, to: 2, y: 130, label: 'tokenValid', dashed: true },
        { from: 2, to: 4, y: 155, label: 'checkBalance(fromAcct)' },
        { from: 4, to: 2, y: 180, label: 'balance: 50000', dashed: true },
        { from: 2, to: 4, y: 210, label: 'debit(fromAcct, amount)' },
        { from: 4, to: 2, y: 235, label: 'debitSuccess', dashed: true },
        { from: 2, to: 4, y: 260, label: 'credit(toAcct, amount)' },
        { from: 4, to: 2, y: 285, label: 'creditSuccess', dashed: true },
        { from: 2, to: 1, y: 310, label: 'transferSuccess' },
        { from: 1, to: 0, y: 335, label: 'showConfirmation()', dashed: true },
      ].map((m, i) => (
        <g key={i}>
          <defs><marker id={`arr${i}`} viewBox="0 0 10 10" refX="10" refY="5" markerWidth={6} markerHeight={6} orient="auto"><path d="M0,0 L10,5 L0,10z" fill={m.dashed ? '#059669' : '#2997ff'} /></marker></defs>
          <line x1={ox[m.from]} y1={m.y} x2={ox[m.to]} y2={m.y} stroke={m.dashed ? '#059669' : '#2997ff'} strokeWidth={1} markerEnd={`url(#arr${i})`} strokeDasharray={m.dashed ? '4,2' : 'none'} />
          <text x={(ox[m.from] + ox[m.to]) / 2} y={m.y - 5} textAnchor="middle" fill="#aaa" fontSize={8}>{m.label}</text>
        </g>
      ))}
      <text x={230} y={358} textAnchor="middle" fill="#888" fontSize={10} fontFamily="'JetBrains Mono'">SEQUENCE DIAGRAM — Fund Transfer</text>
    </svg>
  );
}

function TestingLevelsDiagram() {
  const levels = [
    { name: 'Unit Testing', y: 250, w: 80, h: 60, color: '#ef4444' },
    { name: 'Integration', y: 190, w: 160, h: 50, color: '#f59e0b' },
    { name: 'System', y: 140, w: 240, h: 40, color: '#2997ff' },
    { name: 'Acceptance', y: 100, w: 300, h: 30, color: '#059669' },
  ];
  return (
    <svg width="380" height="300" viewBox="0 0 380 300" style={{ display: 'block', margin: '16px auto' }}>
      {levels.map(l => (
        <g key={l.name}>
          <rect x={(380 - l.w) / 2} y={l.y} width={l.w} height={l.h} rx={6} fill={`${l.color}15`} stroke={l.color} strokeWidth={1.5} />
          <text x={190} y={l.y + l.h / 2 + 4} textAnchor="middle" fill="#e5e5e5" fontSize={11} fontWeight={500}>{l.name}</text>
        </g>
      ))}
      <text x={190} y={85} textAnchor="middle" fill="#888" fontSize={10} fontFamily="'JetBrains Mono'">TESTING LEVELS — Pyramid Model</text>
    </svg>
  );
}

function RiskMatrixDiagram() {
  return (
    <svg width="320" height="280" viewBox="0 0 320 280" style={{ display: 'block', margin: '16px auto' }}>
      {/* Grid */}
      {[0,1,2,3].map(row => [0,1,2,3].map(col => {
        const risk = row + col;
        const color = risk <= 2 ? '#059669' : risk <= 4 ? '#f59e0b' : '#ef4444';
        return <rect key={`${row}-${col}`} x={60 + col * 62} y={40 + (3 - row) * 52} width={58} height={48} fill={`${color}18`} stroke={`${color}50`} strokeWidth={0.8} rx={3} />;
      }))}
      {/* Axis labels */}
      <text x={190} y={20} textAnchor="middle" fill="#888" fontSize={10}>Probability →</text>
      <text x={15} y={170} textAnchor="middle" fill="#888" fontSize={10} transform="rotate(-90,15,170)">Impact →</text>
      {/* Scale labels */}
      {['Low','Med','High','V.High'].map((l, i) => (
        <g key={l}>
          <text x={60 + i * 62 + 29} y={268} textAnchor="middle" fill="#666" fontSize={8}>{l}</text>
          <text x={46} y={60 + i * 52} textAnchor="end" fill="#666" fontSize={8}>{l}</text>
        </g>
      ))}
      {/* Risk items */}
      <text x={182} y={195} textAnchor="middle" fill="#ef4444" fontSize={8} fontWeight={600}>R1</text>
      <text x={244} y={143} textAnchor="middle" fill="#ef4444" fontSize={8} fontWeight={600}>R2</text>
      <text x={120} y={243} textAnchor="middle" fill="#f59e0b" fontSize={8} fontWeight={600}>R3</text>
      <text x={182} y={243} textAnchor="middle" fill="#f59e0b" fontSize={8} fontWeight={600}>R4</text>
      <text x={80} y={195} textAnchor="middle" fill="#059669" fontSize={8} fontWeight={600}>R5</text>
    </svg>
  );
}

function ReengineeringDiagram() {
  const steps = ['Existing\nSystem','Reverse\nEngineering','Restructuring','Forward\nEngineering','Improved\nSystem'];
  const colors = ['#6b7280','#2997ff','#f59e0b','#059669','#059669'];
  return (
    <svg width="380" height="180" viewBox="0 0 380 180" style={{ display: 'block', margin: '16px auto' }}>
      {steps.map((s, i) => (
        <g key={i}>
          <rect x={10 + i * 74} y={50} width={60} height={55} rx={8} fill={`${colors[i]}20`} stroke={colors[i]} strokeWidth={1.5} />
          {s.split('\n').map((line, li) => (
            <text key={li} x={40 + i * 74} y={72 + li * 16} textAnchor="middle" fill="#e5e5e5" fontSize={9}>{line}</text>
          ))}
          {i < 4 && <line x1={72 + i * 74} y1={77} x2={82 + i * 74} y2={77} stroke="#555" strokeWidth={1.2} markerEnd="url(#arrR)" />}
        </g>
      ))}
      <defs><marker id="arrR" viewBox="0 0 10 10" refX="10" refY="5" markerWidth={6} markerHeight={6} orient="auto"><path d="M0,0 L10,5 L0,10z" fill="#555" /></marker></defs>
      <text x={190} y={30} textAnchor="middle" fill="#888" fontSize={10} fontFamily="'JetBrains Mono'">REENGINEERING PROCESS</text>
      <text x={190} y={170} textAnchor="middle" fill="#555" fontSize={9}>Recover → Reorganize → Rebuild</text>
    </svg>
  );
}

function BVADiagram() {
  return (
    <svg width="360" height="160" viewBox="0 0 360 160" style={{ display: 'block', margin: '16px auto' }}>
      <text x={180} y={20} textAnchor="middle" fill="#888" fontSize={10} fontFamily="'JetBrains Mono'">BOUNDARY VALUE ANALYSIS — Range: 1–100</text>
      {[7,8,9,50,99,100,101].map((v, i) => {
        const isBound = [7,8,9,99,100,101].includes(v);
        const isBad = [7,101].includes(v);
        return (
          <g key={v}>
            <rect x={20 + i * 48} y={40} width={40} height={50} rx={6}
              fill={isBad ? 'rgba(239,68,68,0.2)' : isBound ? 'rgba(5,150,105,0.2)' : 'rgba(255,255,255,0.05)'}
              stroke={isBad ? '#ef4444' : isBound ? '#059669' : '#444'} strokeWidth={1.2} />
            <text x={40 + i * 48} y={70} textAnchor="middle" fill={isBad ? '#ef4444' : isBound ? '#059669' : '#888'} fontSize={14} fontWeight={600}>{v}</text>
            <text x={40 + i * 48} y={110} textAnchor="middle" fill="#666" fontSize={8}>{isBad ? 'OUTSIDE' : isBound ? 'BOUNDARY' : 'NOMINAL'}</text>
          </g>
        );
      })}
    </svg>
  );
}

function AgileWaterfallCompareDiagram() {
  return (
    <svg width="400" height="200" viewBox="0 0 400 200" style={{ display: 'block', margin: '16px auto' }}>
      {/* Waterfall side */}
      <text x={100} y={20} textAnchor="middle" fill="#ef4444" fontSize={11} fontWeight={600}>Waterfall</text>
      {['Requirements','Design','Code','Test','Deploy'].map((p, i) => (
        <rect key={p} x={20 + i * 35} y={35} width={32} height={40} rx={3} fill="rgba(239,68,68,0.15)" stroke="#ef4444" strokeWidth={1} />
      ))}
      <line x1={20} y1={85} x2={195} y2={85} stroke="#ef4444" strokeWidth={2} />
      <text x={108} y={102} textAnchor="middle" fill="#888" fontSize={9}>One delivery at end</text>
      {/* Agile side */}
      <text x={300} y={20} textAnchor="middle" fill="#059669" fontSize={11} fontWeight={600}>Agile/Scrum</text>
      {['S1','S2','S3','S4','S5'].map((s, i) => (
        <g key={s}>
          <rect x={220 + i * 35} y={35} width={32} height={40} rx={3} fill="rgba(5,150,105,0.15)" stroke="#059669" strokeWidth={1} />
          <text x={236 + i * 35} y={60} textAnchor="middle" fill="#059669" fontSize={10} fontWeight={600}>{s}</text>
        </g>
      ))}
      {[0,1,2,3,4].map(i => (
        <line key={i} x1={236 + i * 35} y1={85} x2={236 + i * 35} y2={95} stroke="#059669" strokeWidth={1} strokeDasharray="2,2" />
      ))}
      <text x={308} y={102} textAnchor="middle" fill="#888" fontSize={9}>Increment every sprint</text>
    </svg>
  );
}

function DiagramSelector({ type }: { type: string }) {
  switch (type) {
    case 'waterfall': return <WaterfallDiagram />;
    case 'agile-waterfall': return <AgileWaterfallCompareDiagram />;
    case 'usecase': return <UseCaseDiagramBanking />;
    case 'usecase-banking': return <UseCaseDiagramBanking />;
    case 'sequence': return <SequenceDiagramTransfer />;
    case 'sequence-transfer': return <SequenceDiagramTransfer />;
    case 'testing-levels': return <TestingLevelsDiagram />;
    case 'risk-matrix': return <RiskMatrixDiagram />;
    case 'reengineering': return <ReengineeringDiagram />;
    case 'bva': return <BVADiagram />;
    default: return null;
  }
}

// ─────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────

function StickyHeader({ onBack, activeTab, onTabChange }: { onBack: () => void; activeTab: string; onTabChange: (t: string) => void }) {
  return (
    <div style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(10,10,10,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '0 clamp(16px, 4vw, 32px)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 16, height: 56 }}>
        <button onClick={onBack} style={{ background: 'var(--analysis-input)', border: '1px solid var(--analysis-border)', borderRadius: 8, padding: '6px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#e5e5e5' }}><ArrowLeft size={16} /></button>
        <div style={{ flex: 1 }}>
          <div className="mono" style={{ fontSize: 10, color: '#059669', letterSpacing: '0.12em', textTransform: 'uppercase' }}>21CSC303J</div>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', letterSpacing: '-0.02em' }}>Software Engineering & Project Management</div>
        </div>
        <nav style={{ display: 'flex', gap: 4 }}>
          {[{ key: 'analysis', label: 'Analysis' }, { key: 'mastersheet', label: 'Master Sheet' }].map(tab => (
            <button key={tab.key} onClick={() => onTabChange(tab.key)} style={{ padding: '6px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: 'inherit', background: activeTab === tab.key ? '#059669' : 'transparent', color: activeTab === tab.key ? '#fff' : '#888', transition: 'all 0.15s' }}>{tab.label}</button>
          ))}
        </nav>
        <a href="/SEPM_Prep.pdf" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 8, background: 'var(--analysis-input)', color: '#888', textDecoration: 'none', fontSize: 12, border: '1px solid var(--analysis-border)' }}><BookOpen size={12} /> Prep Guide</a>
      </div>
    </div>
  );
}

function HeroSection() {
  return (
    <div style={{ position: 'relative', background: 'linear-gradient(180deg, #0f0f12 0%, #0a0a0a 100%)', padding: 'clamp(40px, 8vw, 80px) clamp(16px, 4vw, 48px)', overflow: 'hidden' }}>
      <div className="scanline-overlay" />
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: 'linear-gradient(rgba(5,150,105,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(5,150,105,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px', zIndex: 0 }} />
      <div style={{ position: 'absolute', top: 16, left: 16, width: 40, height: 1, background: '#059669', opacity: 0.4 }} />
      <div style={{ position: 'absolute', top: 16, left: 16, width: 1, height: 40, background: '#059669', opacity: 0.4 }} />
      <div style={{ position: 'absolute', bottom: 16, right: 16, width: 40, height: 1, background: '#059669', opacity: 0.4 }} />
      <div style={{ position: 'absolute', bottom: 16, right: 16, width: 1, height: 40, background: '#059669', opacity: 0.4 }} />
      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 2 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <div className="mono" style={{ fontSize: 10, color: '#059669', letterSpacing: '0.1em' }}>██ EXAM INTELLIGENCE ██</div>
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, rgba(255,255,255,0.1), transparent)' }} />
          <div className="mono" style={{ fontSize: 10, color: '#666', letterSpacing: '0.1em' }}>21CSC303J — SEPM</div>
        </div>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ fontSize: 'clamp(24px, 5vw, 42px)', fontWeight: 700, color: '#fff', letterSpacing: '-0.03em', marginBottom: 8, lineHeight: 1.1 }}>
          Software Engineering &<br /><span style={{ color: '#059669' }}>Project Management</span>
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.5 }} style={{ fontSize: 14, color: '#888', marginBottom: 32, maxWidth: 500 }}>
          PYQ analysis across 6 semester papers. Unit-wise coverage, probability rankings, and exam-ready model answers.
        </motion.p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 12, marginBottom: 24, maxWidth: 700 }}>
          {[
            { n: STATS.papers, l: 'Papers Analyzed', c: '#059669', icon: '◆' },
            { n: STATS.marks, l: 'Total Marks', c: '#f59e0b', icon: '◈' },
            { n: STATS.safeScore, l: 'Safe Score', c: '#ef4444', icon: '▲' },
            { n: '6/6', l: 'Topic Clusters', c: '#2997ff', icon: '◇' },
          ].map(({ n, l, c }, i) => (
            <motion.div key={l} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i, duration: 0.4 }} style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${c}25`, borderLeft: `2px solid ${c}`, borderRadius: 8, padding: '14px 16px' }}>
              <div className="mono" style={{ fontSize: 24, fontWeight: 700, color: c, letterSpacing: '-0.04em' }}>{n}</div>
              <div style={{ fontSize: 11, color: '#888', marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{l}</div>
            </motion.div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {[
            { icon: <CheckCircle2 size={11} />, text: 'Process Models — 6/6 papers', color: '#ef4444' },
            { icon: <CheckCircle2 size={11} />, text: 'UML Diagrams — 6/6 papers', color: '#2997ff' },
            { icon: <CheckCircle2 size={11} />, text: 'Testing — 6/6 papers', color: '#059669' },
            { icon: <AlertTriangle size={11} />, text: 'All 5 clusters = mandatory', color: '#ef4444' },
          ].map(({ icon, text, color }) => (
            <motion.div key={text} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 6, background: `${color}12`, border: `1px solid ${color}25`, fontSize: 12, color: '#ccc' }}>
              <span style={{ color }}>{icon}</span>{text}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RadarChart() {
  const cx = 160, cy = 145, r = 100, axes = 5;
  const datasets = [
    { label: 'MCQ Density', color: '#2997ff', values: RADAR_DATA.map(d => d.mcq) },
    { label: 'Part B Frequency', color: '#059669', values: RADAR_DATA.map(d => d.partB) },
    { label: 'Part C Presence', color: '#ef4444', values: RADAR_DATA.map(d => d.partC) },
  ];
  const toXY = (i: number, val: number) => { const a = (Math.PI * 2 * i) / axes - Math.PI / 2; const d = (val / 100) * r; return { x: cx + d * Math.cos(a), y: cy + d * Math.sin(a) }; };
  return (
    <div className="card" style={{ padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <Target size={14} color="#059669" />
        <h3 style={{ fontSize: 13, fontWeight: 600, color: '#fff', margin: 0 }}>UNIT COVERAGE RADAR</h3>
      </div>
      <div style={{ display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
        <svg width={320} height={290} viewBox="0 0 320 290">
          {[20, 40, 60, 80, 100].map(l => { const pts = Array.from({ length: axes }, (_, i) => { const { x, y } = toXY(i, l); return `${x},${y}`; }).join(' '); return <polygon key={l} points={pts} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={0.5} />; })}
          {Array.from({ length: axes }, (_, i) => { const { x, y } = toXY(i, 100); return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="rgba(255,255,255,0.08)" strokeWidth={0.5} />; })}
          {RADAR_DATA.map((d, i) => { const { x, y } = toXY(i, 118); return <text key={d.unit} x={x} y={y} textAnchor="middle" dominantBaseline="middle" fontSize={10} fontWeight={600} fill="#888" fontFamily="'JetBrains Mono'">{d.unit}</text>; })}
          {datasets.map((ds, di) => { const pts = ds.values.map((v, i) => { const { x, y } = toXY(i, v); return `${x},${y}`; }).join(' '); return <polygon key={di} points={pts} fill={`${ds.color}18`} stroke={ds.color} strokeWidth={1.5} opacity={0.9} />; })}
          {datasets.map((ds, di) => ds.values.map((v, i) => { const { x, y } = toXY(i, v); return <circle key={`${di}-${i}`} cx={x} cy={y} r={3} fill={ds.color} />; }))}
        </svg>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {datasets.map(ds => (<div key={ds.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}><div style={{ width: 24, height: 2, background: ds.color, borderRadius: 1 }} /><span style={{ fontSize: 11, color: '#888' }}>{ds.label}</span></div>))}
          <div style={{ marginTop: 8, fontSize: 10, color: '#555', lineHeight: 1.6 }}>5 axes = 5 units<br />Outer ring = 100</div>
        </div>
      </div>
    </div>
  );
}

function TopicFreqBars() {
  return (
    <div className="card" style={{ padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <TrendingUp size={14} color="#059669" />
        <h3 style={{ fontSize: 13, fontWeight: 600, color: '#fff', margin: 0 }}>TOPIC PRIORITY SCORE</h3>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {TOPICS.map((t, i) => (
          <div key={t.topic}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
              <span style={{ fontSize: 11, color: '#ccc' }}>{t.topic}</span>
              <span className="mono" style={{ fontSize: 10, color: '#666' }}>{t.score}% · {t.papers}/6</span>
            </div>
            <div style={{ height: 4, background: 'var(--analysis-hover)', borderRadius: 2, overflow: 'hidden' }}>
              <motion.div initial={{ width: 0 }} whileInView={{ width: `${t.score}%` }} viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }} style={{ height: '100%', background: t.color, borderRadius: 2, boxShadow: `0 0 6px ${t.color}40` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Heatmap() {
  return (
    <div className="card" style={{ padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <Zap size={14} color="#f59e0b" />
        <h3 style={{ fontSize: 13, fontWeight: 600, color: '#fff', margin: 0 }}>PAPER × TOPIC HEATMAP</h3>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 500 }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', fontSize: 10, color: '#555', fontWeight: 500, padding: '0 10px 8px 0', fontFamily: "'JetBrains Mono'", textTransform: 'uppercase' }}>Topic</th>
              {PAPER_LABELS.map(p => <th key={p} style={{ textAlign: 'center', fontSize: 10, color: '#555', fontWeight: 500, padding: '0 0 8px 8px', fontFamily: "'JetBrains Mono'" }}>{p}</th>)}
            </tr>
          </thead>
          <tbody>
            {TOPICS.map((t, i) => (
              <tr key={t.topic} style={{ background: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent' }}>
                <td style={{ fontSize: 11, color: '#bbb', padding: '6px 10px 6px 0', borderBottom: '1px solid rgba(255,255,255,0.03)', whiteSpace: 'nowrap' }}>{t.topic}</td>
                {HEATMAP[i].map((val, j) => (
                  <td key={j} style={{ textAlign: 'center', padding: '6px 0 6px 8px', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    {val === 'Y' ? (
                      <div style={{ width: 20, height: 20, borderRadius: 4, background: 'rgba(5,150,105,0.12)', border: '1px solid rgba(5,150,105,0.25)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ width: 6, height: 6, borderRadius: 2, background: '#059669' }} /></div>
                    ) : (
                      <div style={{ width: 20, height: 20, borderRadius: 4, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--analysis-border)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ width: 6, height: 6, borderRadius: 2, background: '#333' }} /></div>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PYQCards() {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <FileText size={14} color="#059669" />
        <h3 style={{ fontSize: 13, fontWeight: 600, color: '#fff', margin: 0 }}>PYQ PAPER SOURCES</h3>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
        {PAPERS.map((p, i) => (
          <motion.div key={p.code} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="card card-glow" style={{ padding: '16px 18px', cursor: 'default' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
              <div>
                <div className="mono" style={{ fontSize: 11, color: '#059669', marginBottom: 2 }}>{p.code}</div>
                <div className="mono" style={{ fontSize: 10, color: '#555' }}>{p.date}</div>
              </div>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#059669', boxShadow: '0 0 8px rgba(5,150,105,0.5)' }} />
            </div>
            <div style={{ fontSize: 11, color: '#888', marginBottom: 8, lineHeight: 1.5 }}>
              <Shield size={9} style={{ display: 'inline', marginRight: 4 }} />{p.highlight}
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {p.keyTopics.slice(0, 3).map(t => <span key={t} style={{ fontSize: 9, color: '#666', background: 'rgba(255,255,255,0.04)', padding: '2px 6px', borderRadius: 4 }}>{t}</span>)}
              {p.keyTopics.length > 3 && <span style={{ fontSize: 9, color: '#555', padding: '2px 6px' }}>+{p.keyTopics.length - 3}</span>}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function AccordionItem({ title, children, defaultOpen = false, color = '#059669' }: { title: string; children: React.ReactNode; defaultOpen?: boolean; color?: string }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ border: '1px solid var(--analysis-border)', borderRadius: 8, overflow: 'hidden', marginBottom: 6, background: open ? `${color}08` : 'transparent' }}>
      <button onClick={() => setOpen(!open)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: open ? color : '#ccc' }}>{title}</span>
        {open ? <ChevronUp size={14} color={color} /> : <ChevronDown size={14} color="#555" />}
      </button>
      <AnimatePresence>{open && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} style={{ overflow: 'hidden' }}><div style={{ padding: '0 14px 14px', borderTop: `1px solid ${color}15` }}>{children}</div></motion.div>}</AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────
// MASTER SHEET
// ─────────────────────────────────────────

function MasterSheet() {
  const [activeUnit, setActiveUnit] = useState<number | 'all'>('all');
  const [activePartA, setActivePartA] = useState(Object.keys(PART_A_MCQS)[0]);
  const topicsPartA = Object.keys(PART_A_MCQS);
  const totalPartAMcqs = Object.values(PART_A_MCQS).reduce((sum, list) => sum + list.length, 0);
  const filteredPartB = PART_B_QUESTIONS.filter(q => activeUnit === 'all' || q.unit === activeUnit);
  const unitColors: Record<number, string> = { 1: '#ef4444', 2: '#f59e0b', 3: '#2997ff', 4: '#059669', 5: '#a855f7' };

  return (
    <div>
      {/* Unit filter */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {[{ n: 'All', v: 'all' as const }, { n: 'U1', v: 1 }, { n: 'U2', v: 2 }, { n: 'U3', v: 3 }, { n: 'U4', v: 4 }, { n: 'U5', v: 5 }].map(u => (
          <button key={u.n} onClick={() => setActiveUnit(u.v)} style={{ padding: '6px 16px', borderRadius: 9999, cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: 'inherit', background: activeUnit === u.v ? '#059669' : 'rgba(255,255,255,0.06)', color: activeUnit === u.v ? '#fff' : '#888', border: activeUnit === u.v ? '1px solid rgba(5,150,105,0.3)' : '1px solid rgba(255,255,255,0.08)' }}>{u.n}</button>
        ))}
      </div>

      {/* ── PART A ── */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <div style={{ width: 3, height: 16, background: '#ef4444', borderRadius: 2 }} />
          <h3 style={{ fontSize: 14, fontWeight: 600, color: '#fff', margin: 0 }}>PART A — MCQ Bank (Exam-Ready)</h3>
          <span className="mono" style={{ fontSize: 11, color: '#555', marginLeft: 4 }}>20 × 1 = 20 marks</span>
        </div>
        <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
          {topicsPartA.map(t => (
            <button key={t} onClick={() => setActivePartA(t)} style={{ padding: '4px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 11, fontWeight: 500, fontFamily: 'inherit', background: activePartA === t ? 'rgba(5,150,105,0.2)' : 'rgba(255,255,255,0.04)', color: activePartA === t ? '#059669' : '#888', border: activePartA === t ? '1px solid rgba(5,150,105,0.3)' : '1px solid rgba(255,255,255,0.06)' }}>{t}</button>
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {PART_A_MCQS[activePartA]?.map((mcq, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="card" style={{ padding: 16 }}>
              <div className="mono" style={{ fontSize: 9, color: '#555', marginBottom: 8 }}>{mcq.source}</div>
              <div style={{ fontSize: 13, color: '#e5e5e5', marginBottom: 12, lineHeight: 1.5 }}>{mcq.question}</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                {mcq.options.map((opt, oi) => (
                  <div key={oi} style={{ padding: '8px 12px', borderRadius: 6, fontSize: 12, background: oi === mcq.correct ? 'rgba(5,150,105,0.15)' : 'rgba(255,255,255,0.03)', border: oi === mcq.correct ? '1px solid rgba(5,150,105,0.3)' : '1px solid rgba(255,255,255,0.06)', color: oi === mcq.correct ? '#059669' : '#999', fontFamily: "'JetBrains Mono'" }}>
                    <span style={{ color: oi === mcq.correct ? '#059669' : '#555', marginRight: 6 }}>{String.fromCharCode(65 + oi)}</span>{opt}
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 10, padding: '8px 10px', background: 'rgba(255,255,255,0.02)', borderRadius: 6, border: '1px solid var(--analysis-border)' }}>
                <span style={{ fontSize: 11, color: '#666' }}>{mcq.explanation}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── PART B ── */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <div style={{ width: 3, height: 16, background: '#f59e0b', borderRadius: 2 }} />
          <h3 style={{ fontSize: 14, fontWeight: 600, color: '#fff', margin: 0 }}>PART B — 8-Mark Model Answers (Exam-Ready)</h3>
          <span className="mono" style={{ fontSize: 11, color: '#555', marginLeft: 4 }}>5 × 8 = 40 marks</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filteredPartB.map((q, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
              <AccordionItem title={`U${q.unit} — ${q.question.slice(0, 60)}...`} defaultOpen={i === 0} color={unitColors[q.unit]}>
                <div className="mono" style={{ fontSize: 10, color: '#666', marginBottom: 8 }}>Sources: {q.sources.join(' | ')} · {q.marks} marks</div>
                {q.answer.map((para, pi) => (
                  <div key={pi} style={{ marginBottom: 12 }}>
                    {para.split('\n').map((line, li) => {
                      if (line.startsWith('**') && line.endsWith('**')) {
                        return <div key={li} style={{ fontSize: 12, fontWeight: 600, color: unitColors[q.unit], marginTop: 8, marginBottom: 4 }}>{line.replace(/\*\*/g, '')}</div>;
                      }
                      if (line.startsWith('**')) {
                        const boldEnd = line.indexOf('**', 2);
                        const boldText = boldEnd > -1 ? line.slice(2, boldEnd) : line;
                        const restText = boldEnd > -1 ? line.slice(boldEnd + 2) : '';
                        return <div key={li} style={{ fontSize: 12, color: '#bbb', lineHeight: 1.6, marginBottom: 2 }}><span style={{ color: '#e5e5e5', fontWeight: 500 }}>{boldText}</span>{restText}</div>;
                      }
                      return <div key={li} style={{ fontSize: 12, color: '#bbb', lineHeight: 1.6, marginBottom: 2, paddingLeft: line.startsWith('-') ? 12 : 0 }}>{line.startsWith('-') ? <span style={{ color: '#059669', marginRight: 6 }}>•</span> : ''}{line.startsWith('-') ? line.slice(1).trim() : line}</div>;
                    })}
                  </div>
                ))}
                {q.diagramType && <DiagramSelector type={q.diagramType} />}
              </AccordionItem>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── PART C ── */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <div style={{ width: 3, height: 16, background: '#30d158', borderRadius: 2 }} />
          <h3 style={{ fontSize: 14, fontWeight: 600, color: '#fff', margin: 0 }}>PART C — 15-Mark Predictions (Full Model Answers)</h3>
          <span className="mono" style={{ fontSize: 11, color: '#555', marginLeft: 4 }}>1 × 15 = 15 marks</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {PART_C_QUESTIONS.map((q, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="card" style={{ padding: 20, borderLeft: `3px solid ${q.rankColor}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
                <div>
                  <div style={{ fontSize: 11, color: q.rankColor, fontWeight: 700, marginBottom: 4 }}>{q.rank} — {q.probability}% probability</div>
                  <div className="mono" style={{ fontSize: 10, color: '#555' }}>Sources: {q.sources.join(' | ')} · Unit {q.unit}</div>
                </div>
                <div style={{ padding: '4px 10px', borderRadius: 6, fontSize: 10, fontWeight: 600, background: `${q.rankColor}15`, color: q.rankColor, border: `1px solid ${q.rankColor}30`, fontFamily: "'JetBrains Mono'" }}>U{q.unit}</div>
              </div>
              <div style={{ fontSize: 13, color: '#ccc', marginBottom: 16, lineHeight: 1.5 }}>{q.scenario}</div>
              {q.answer.map((para, pi) => (
                <div key={pi} style={{ marginBottom: 12 }}>
                  {para.split('\n').map((line, li) => {
                    if (line.startsWith('**') && line.endsWith('**')) {
                      return <div key={li} style={{ fontSize: 13, fontWeight: 600, color: '#e5e5e5', marginTop: 14, marginBottom: 6 }}>{line.replace(/\*\*/g, '')}</div>;
                    }
                    if (line.startsWith('---')) {
                      return <hr key={li} style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.08)', margin: '12px 0' }} />;
                    }
                    if (line.startsWith('|')) {
                      return <div key={li} style={{ fontSize: 11, color: '#bbb', fontFamily: "'JetBrains Mono'", lineHeight: 1.8, whiteSpace: 'pre', overflowX: 'auto' }}>{line}</div>;
                    }
                    if (line.startsWith('**')) {
                      const boldEnd = line.indexOf('**', 2);
                      const boldText = boldEnd > -1 ? line.slice(2, boldEnd) : line;
                      const restText = boldEnd > -1 ? line.slice(boldEnd + 2) : '';
                      return <div key={li} style={{ fontSize: 12, color: '#bbb', lineHeight: 1.6, marginBottom: 2 }}><span style={{ color: '#e5e5e5', fontWeight: 600 }}>{boldText}</span>{restText}</div>;
                    }
                    return <div key={li} style={{ fontSize: 12, color: '#bbb', lineHeight: 1.6, marginBottom: 2, paddingLeft: line.match(/^\d+\./) ? 0 : 0 }}>{line.match(/^\d+\./) ? <span style={{ color: '#059669', fontWeight: 600, marginRight: 6 }}>{line.match(/^\d+\./)?.[0]}</span> : ''}{line.match(/^\d+\./) ? line.replace(/^\d+\.\s*/, '') : line.startsWith('-') ? <><span style={{ color: '#059669', marginRight: 6 }}>•</span>{line.slice(1).trim()}</> : line}</div>;
                  })}
                </div>
              ))}
              {q.diagramTypes?.map(dt => <DiagramSelector key={dt} type={dt} />)}
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── EXAM STRATEGY ── */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <AlertTriangle size={14} color="#ef4444" />
          <h3 style={{ fontSize: 14, fontWeight: 600, color: '#fff', margin: 0 }}>EXAM STRATEGY</h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>
          <div className="card" style={{ padding: 16 }}>
            <div style={{ fontSize: 12, color: '#059669', fontWeight: 600, marginBottom: 12 }}>SCORE BREAKDOWN TARGET</div>
            {[
              { part: 'Part A (MCQs)', target: '17/20', color: '#30d158', note: `Study all ${totalPartAMcqs} MCQs in this sheet` },
              { part: 'Part B (Long)', target: '32/40', color: '#2997ff', note: 'Pick 4 from 5 — use model answers' },
              { part: 'Part C (15 marks)', target: '13/15', color: '#a855f7', note: 'Process model + UML diagrams' },
              { part: 'TOTAL', target: '62+/75', color: '#059669', note: 'Safe passing zone' },
            ].map(s => (
              <div key={s.part} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <span style={{ fontSize: 12, color: '#ccc' }}>{s.part}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span className="mono" style={{ fontSize: 13, color: s.color, fontWeight: 600 }}>{s.target}</span><span style={{ fontSize: 10, color: '#555' }}>{s.note}</span></div>
              </div>
            ))}
          </div>
          <div className="card" style={{ padding: 16 }}>
            <div style={{ fontSize: 12, color: '#ef4444', fontWeight: 600, marginBottom: 12 }}>PART-WISE TIPS</div>
            {[
              { part: 'Part A', tip: 'All 6 topic clusters appear 6/6 papers. Memorize definitions + distinctions. Focus on process models, testing types, COCOMO.' },
              { part: 'Part B', tip: 'Pick UML diagram question (guaranteed). Pick process model comparison. Pick testing theory. These 3 = 24 marks.' },
              { part: 'Part C', tip: 'HIGHLY PROBABLE: Process model + UML diagrams for banking/ATM. Practice drawing use case + sequence diagrams.' },
              { part: 'Diagrams', tip: 'Waterfall, Use Case, Sequence Diagram = most tested. Practice 2-3 times each. Neatness = marks.' },
            ].map(t => (
              <div key={t.part} style={{ marginBottom: 10 }}>
                <span style={{ fontSize: 11, color: '#f59e0b', fontWeight: 600 }}>{t.part}:</span>
                <span style={{ fontSize: 11, color: '#999', marginLeft: 6 }}>{t.tip}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── UNIT PRIORITY TABLE ── */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <Shield size={14} color="#059669" />
          <h3 style={{ fontSize: 14, fontWeight: 600, color: '#fff', margin: 0 }}>UNIT PRIORITY MATRIX</h3>
        </div>
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                {['Unit', 'Topic', 'MCQ', 'Part B', 'Part C', 'Priority'].map(h => (
                  <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 10, color: '#555', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: "'JetBrains Mono'" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {UNITS.map((u, i) => (
                <tr key={u.unit} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
                  <td style={{ padding: '10px 14px', fontSize: 12, color: u.color, fontWeight: 600, fontFamily: "'JetBrains Mono'" }}>U{u.unit}</td>
                  <td style={{ padding: '10px 14px', fontSize: 12, color: '#ccc' }}>{u.name}</td>
                  <td style={{ padding: '10px 14px', fontSize: 12, color: '#30d158', fontFamily: "'JetBrains Mono'" }}>{RADAR_DATA[i].mcq}%</td>
                  <td style={{ padding: '10px 14px', fontSize: 12, color: '#f59e0b', fontFamily: "'JetBrains Mono'" }}>{RADAR_DATA[i].partB}%</td>
                  <td style={{ padding: '10px 14px', fontSize: 12, color: '#a855f7', fontFamily: "'JetBrains Mono'" }}>{RADAR_DATA[i].partC}%</td>
                  <td style={{ padding: '10px 14px' }}>
                    <span style={{ padding: '3px 10px', borderRadius: 4, fontSize: 10, fontWeight: 600, background: 'rgba(239,68,68,0.18)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)', fontFamily: "'JetBrains Mono'" }}>HIGH</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────

interface Props { onBack: () => void; }

export function SEPMAnalysisPage({ onBack }: Props) {
  const [activeTab, setActiveTab] = useState<'analysis' | 'mastersheet'>('analysis');
  return (
    <>
      <style>{GLOBAL_STYLES}</style>
      <div className="sepm-page">
        <StickyHeader onBack={onBack} activeTab={activeTab} onTabChange={(t) => setActiveTab(t as typeof activeTab)} />
        <HeroSection />
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(16px, 4vw, 48px) clamp(16px, 4vw, 48px) 80px' }}>
          <AnimatePresence mode="wait">
            {activeTab === 'analysis' ? (
              <motion.div key="analysis" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16, marginBottom: 16 }}>
                  <RadarChart /><TopicFreqBars />
                </div>
                <div style={{ marginBottom: 16 }}><Heatmap /></div>
                <PYQCards />
              </motion.div>
            ) : (
              <motion.div key="mastersheet" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                <MasterSheet />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
