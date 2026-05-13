import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import {
  ArrowLeft, BookOpen, FileText, ChevronDown, ChevronUp,
  CheckCircle2, AlertTriangle, Shield, Target, TrendingUp, Zap
} from 'lucide-react';

// ─── PAPERS ───────────────────────────────────────────────────────────────
const PAPERS = [
  {
    code: 'May 2025 AN',
    date: '15.05.2025',
    file: '/CCBF_May25_PYQ.pdf',
    highlight: 'Fog + Blockchain + Hyperledger + DApps coverage',
    keyTopics: ['Fog architecture', 'Consensus PoW/PoS', 'Hyperledger Fabric', 'Smart contracts', 'Scalability trilemma'],
  },
];

// ─── STATS ─────────────────────────────────────────────────────────────────
const STATS = { papers: 1, mcqs: 40, marks: 75, safeScore: '60+', partB: 9, partC: 3 };

// ─── UNITS ─────────────────────────────────────────────────────────────────
const UNITS = [
  { unit: 1, name: 'Cloud Computing Intro', marks: 12, color: '#7c3aed', priority: 'MED' },
  { unit: 2, name: 'Fog Computing', marks: 15, color: '#06b6d4', priority: 'HIGH' },
  { unit: 3, name: 'Blockchain Fundamentals', marks: 18, color: '#f59e0b', priority: 'HIGH' },
  { unit: 4, name: 'Hyperledger & Enterprise BC', marks: 15, color: '#10b981', priority: 'MED' },
  { unit: 5, name: 'Decentralized Applications', marks: 15, color: '#ef4444', priority: 'HIGH' },
];

// ─── TOPICS ────────────────────────────────────────────────────────────────
const TOPICS = [
  { topic: 'Fog Architecture & IoT', score: 95, papers: 1, color: '#06b6d4', unit: 2 },
  { topic: 'Blockchain Hash & Immutability', score: 95, papers: 1, color: '#f59e0b', unit: 3 },
  { topic: 'Consensus Mechanisms (PoW/PoS/PBFT)', score: 90, papers: 1, color: '#f59e0b', unit: 3 },
  { topic: 'Hyperledger Fabric Architecture', score: 85, papers: 1, color: '#10b981', unit: 4 },
  { topic: 'Smart Contracts & DApps', score: 90, papers: 1, color: '#ef4444', unit: 5 },
  { topic: 'IaaS / PaaS / SaaS', score: 80, papers: 1, color: '#7c3aed', unit: 1 },
  { topic: 'Cloud Deployment Models', score: 75, papers: 1, color: '#7c3aed', unit: 1 },
  { topic: 'Cloud Data Protection (CIA)', score: 85, papers: 1, color: '#10b981', unit: 4 },
  { topic: 'Scalability Trilemma & Layer 2', score: 80, papers: 1, color: '#ef4444', unit: 5 },
];

// ─── RADAR ─────────────────────────────────────────────────────────────────
const RADAR_DATA = [
  { unit: 'U1', mcq: 70, partB: 65, partC: 40, label: 'Cloud Intro' },
  { unit: 'U2', mcq: 90, partB: 85, partC: 75, label: 'Fog' },
  { unit: 'U3', mcq: 95, partB: 90, partC: 85, label: 'Blockchain' },
  { unit: 'U4', mcq: 80, partB: 75, partC: 65, label: 'Hyperledger' },
  { unit: 'U5', mcq: 85, partB: 88, partC: 75, label: 'DApps' },
];

// ─── HEATMAP ───────────────────────────────────────────────────────────────
const HEATMAP = [
  ['Y','Y'],['Y','Y'],['Y','Y'],['Y','Y'],['Y','Y'],
  ['Y','Y'],['Y','Y'],['Y','Y'],['Y','Y'],
];

// ─── MCQ TOPICS ─────────────────────────────────────────────────────────────
const MCQ_TOPICS = [
  { topic: 'Cloud Computing Intro', unit: 1 },
  { topic: 'Fog Computing', unit: 2 },
  { topic: 'Blockchain Fundamentals', unit: 3 },
  { topic: 'Hyperledger & Enterprise BC', unit: 4 },
  { topic: 'Decentralized Applications', unit: 5 },
];

// ─── MCQ BANK (40 MCQs, 8 per unit) ─────────────────────────────────────────
const MCQ_BANK: Record<string, { q: string; opts: string[]; a: number; ex: string; src: string }[]> = {
  'Cloud Computing Intro': [
    {
      q: 'Which cloud deployment model shares infrastructure across multiple organizations?',
      opts: ['Private cloud', 'Public cloud', 'Hybrid cloud', 'Community cloud'],
      a: 1, src: 'May 2025 AN — Q1',
      ex: 'Public cloud: shared infrastructure available to general public. Resources pooled among multiple tenants.',
    },
    {
      q: 'In SaaS, the provider manages everything from infrastructure to application. Which layer does the user manage?',
      opts: ['OS and runtime', 'Application only', 'Hardware only', 'Nothing — provider manages all'],
      a: 3, src: 'May 2025 AN — Q2',
      ex: 'SaaS = least user responsibility. Provider handles OS, runtime, app, data. User just uses the software.',
    },
    {
      q: 'Cloud computing essential characteristic "resource pooling" means:',
      opts: ['Physical servers are grouped', 'Provider pools computing resources to serve multiple consumers', 'Data is stored in multiple locations', 'Network bandwidth is shared equally'],
      a: 1, src: 'May 2025 AN — Q3',
      ex: 'Resource pooling: provider\'s computing resources are pooled to serve multiple consumers simultaneously.',
    },
    {
      q: 'Which is NOT a cloud computing characteristic?',
      opts: ['On-demand self-service', 'Measured service', 'Physical hardware ownership', 'Broad network access'],
      a: 2, src: 'May 2025 AN — Q4',
      ex: 'Physical hardware ownership is NOT a cloud characteristic. Cloud is about pooling, not owning physical assets.',
    },
    {
      q: 'Hybrid cloud combines public and private cloud. Primary advantage is:',
      opts: ['Lower cost than public cloud', 'Burst capacity from public cloud when private is overwhelmed', 'Complete data isolation', 'No internet required'],
      a: 1, src: 'May 2025 AN — Q5',
      ex: 'Hybrid = best of both worlds. Use private for sensitive data, burst to public during peak demand.',
    },
    {
      q: 'IaaS provides virtual machines, storage, and networking. The user manages:',
      opts: ['Application only', 'Data only', 'OS up to application', 'Physical infrastructure'],
      a: 2, src: 'May 2025 AN — Q6',
      ex: 'IaaS: user manages OS, middleware, runtime, data. Provider handles physical hardware and virtualization.',
    },
    {
      q: 'Rapid elasticity in cloud means:',
      opts: ['Resources can be scaled out and in dynamically based on demand', 'Hardware fails rarely', 'Cloud data is never lost', 'Network latency is zero'],
      a: 0, src: 'May 2025 AN — Q7',
      ex: 'Elasticity: automatic scale-up or scale-down of resources based on workload — pay-per-use efficiency.',
    },
    {
      q: 'Which cloud service model would Netflix most likely use for its video streaming servers?',
      opts: ['IaaS', 'PaaS', 'SaaS', 'FaaS'],
      a: 0, src: 'May 2025 AN — Q8',
      ex: 'Netflix runs EC2 (IaaS) for maximum control over streaming infrastructure, auto-scaling, and CDN integration.',
    },
  ],
  'Fog Computing': [
    {
      q: 'Fog computing places compute and storage resources:',
      opts: ['Only in central data centers', 'At the edge of the network, closer to end users', 'Inside end user devices only', 'On satellite servers'],
      a: 1, src: 'May 2025 AN — Q9',
      ex: 'Fog extends cloud to the edge — geographically closer to data sources = lower latency, less bandwidth use.',
    },
    {
      q: 'Fog vs Cloud: primary fog advantage in IoT is:',
      opts: ['Higher compute power', 'Lower latency and reduced backhaul bandwidth', 'More storage capacity', 'Better security encryption'],
      a: 1, src: 'May 2025 AN — Q10',
      ex: 'Fog processes data locally at edge — only aggregated data sent to cloud = massive bandwidth savings.',
    },
    {
      q: 'In fog computing hierarchy, the correct order from top to bottom is:',
      opts: ['Edge → Fog → Cloud → End devices', 'Cloud → Fog → Edge → End devices', 'Fog → Cloud → Edge → End devices', 'End devices → Cloud → Fog → Edge'],
      a: 1, src: 'May 2025 AN — Q11',
      ex: 'Cloud (central) → Fog (regional) → Edge (local) → End devices. Data aggregations flow up, instructions flow down.',
    },
    {
      q: 'Fog computing is most suitable for which scenario?',
      opts: ['Batch data processing at month-end', 'Real-time IoT analytics with thousands of sensors', 'Long-term data archival', 'High-compute GPU rendering'],
      a: 1, src: 'May 2025 AN — Q12',
      ex: 'Real-time IoT: fog ideal for time-sensitive data (autonomous vehicles, health monitoring) where 200ms cloud latency is too high.',
    },
    {
      q: 'Edge computing differs from fog in that edge is:',
      opts: ['More hierarchical than fog', 'Distributed and localized per device — real-time processing', 'A cloud service', 'Always connected to the internet'],
      a: 1, src: 'May 2025 AN — Q13',
      ex: 'Edge = flat/distributed, operates directly on devices. Fog = hierarchical with intermediate regional nodes.',
    },
    {
      q: 'A smart city uses 10,000 sensors for traffic management. Fog computing helps by:',
      opts: ['Storing all raw sensor data permanently in the cloud', 'Processing data locally — only alerts sent to cloud', 'Encrypting all data at the sensor level', 'Replacing all cloud services'],
      a: 1, src: 'May 2025 AN — Q14',
      ex: 'Fog nodes aggregate and preprocess sensor streams — reduces cloud bandwidth by ~99% while enabling real-time responses.',
    },
    {
      q: 'Fog nodes are described as resource-constrained because:',
      opts: ['They are more powerful than cloud servers', 'They have limited compute/storage compared to cloud', 'They cannot communicate with each other', 'They only use analog hardware'],
      a: 1, src: 'May 2025 AN — Q15',
      ex: 'Fog nodes (Raspberry Pi, edge gateways) have limited resources vs. cloud — designed for specific, lightweight tasks.',
    },
    {
      q: 'Fog computing reduces bandwidth by:',
      opts: ['Increasing the number of sensors', 'Processing data locally — only aggregated results sent to cloud', 'Compressing data using lossy algorithms', 'Using satellite communication'],
      a: 1, src: 'May 2025 AN — Q16',
      ex: 'Local processing at fog means raw data stays at edge. 1000 sensors × 1MB/s raw = only 1MB/s aggregated to cloud.',
    },
  ],
  'Blockchain Fundamentals': [
    {
      q: 'A blockchain block contains: (i) data, (ii) current hash, (iii) previous hash. Which is correct?',
      opts: ['(i) only', '(i) and (ii) only', '(ii) and (iii) only', '(i), (ii), and (iii)'],
      a: 3, src: 'May 2025 AN — Q17',
      ex: 'Each block: data payload + current hash + previous block hash. Hash links blocks = chain. Change any field = hash breaks.',
    },
    {
      q: 'In PoW (Proof of Work), miners compete to:',
      opts: ['Stake the most cryptocurrency', 'Solve a cryptographic puzzle first', 'Sign the most transactions', 'Validate the most blocks'],
      a: 1, src: 'May 2025 AN — Q18',
      ex: 'PoW: miners solve computationally expensive puzzle (finding nonce). First to solve = right to add block. High energy cost.',
    },
    {
      q: 'PoS (Proof of Stake) validators are selected based on:',
      opts: ['Compute power', 'Amount of cryptocurrency staked as collateral', 'Number of transactions signed', 'Geographic location'],
      a: 1, src: 'May 2025 AN — Q19',
      ex: 'PoS: validators lock (stake) crypto as collateral. Selected probabilistically based on stake amount. ~99.9% more energy efficient than PoW.',
    },
    {
      q: 'Immutability in blockchain means:',
      opts: ['Data can be edited by authorized users', 'Once written, data cannot be altered without consensus', 'All data is encrypted', 'Blocks can be deleted'],
      a: 1, src: 'May 2025 AN — Q20',
      ex: 'Immutability: changing historical data requires re-mining all subsequent blocks (computationally infeasible on long chains).',
    },
    {
      q: 'The blockchain scalability trilemma states you can simultaneously optimize:',
      opts: ['Speed, cost, security', 'Decentralization, security, scalability', 'Privacy, speed, cost', 'Immutability, interoperability, speed'],
      a: 1, src: 'May 2025 AN — Q21',
      ex: 'Scalability trilemma: pick any TWO of decentralization, security, scalability. Can NOT optimize all three simultaneously.',
    },
    {
      q: 'Byzantine Fault Tolerance (BFT) means the system:',
      opts: ['Can never fail', 'Continues operating despite node failures or malicious actors', 'Requires all nodes to agree', 'Uses only cloud servers'],
      a: 1, src: 'May 2025 AN — Q22',
      ex: 'BFT: distributed system tolerates faulty/malicious nodes as long as < 1/3 are compromised. Practical BFT (PBFT) used in Hyperledger.',
    },
    {
      q: 'A 51% attack on Bitcoin means attackers control:',
      opts: ['51% of all Bitcoin wallets', '51% of hash power — can rewrite history', '51% of network nodes', '51% of transaction fees'],
      a: 1, src: 'May 2025 AN — Q23',
      ex: '51% attack: majority hash power lets attackers censor transactions and rewrite recent blocks — but extremely costly on long chains.',
    },
    {
      q: 'SHA-256 cryptographic hash — if input changes slightly, output:',
      opts: ['Stays the same', 'Changes completely', 'Changes only slightly', 'Becomes longer'],
      a: 1, src: 'May 2025 AN — Q24',
      ex: 'Hash property: avalanche effect — tiny input change → completely different hash output. One-way, irreversible.',
    },
  ],
  'Hyperledger & Enterprise BC': [
    {
      q: 'Hyperledger Fabric is a:',
      opts: ['Public blockchain like Bitcoin', 'Permissioned (private) blockchain framework', 'Cryptocurrency', 'Consortium blockchain only'],
      a: 1, src: 'May 2025 AN — Q25',
      ex: 'Fabric = permissioned enterprise blockchain by Linux Foundation. Known participants, no mining, faster consensus.',
    },
    {
      q: 'Fabric channels serve what purpose?',
      opts: ['Payment channels for transactions', 'Private sub-networks for confidential transactions between specific organizations', 'Communication between peers', 'Data backup channels'],
      a: 1, src: 'May 2025 AN — Q26',
      ex: 'Channels: private sub-networks. OrgA and OrgB can have a channel invisible to OrgC — ensures transaction privacy.',
    },
    {
      q: 'In Hyperledger Fabric, endorsement policy AND(Org1.peer, Org2.peer) means:',
      opts: ['Only Org1 must sign', 'Only Org2 must sign', 'Both Org1 and Org2 peers must sign', 'Either Org1 or Org2 can sign'],
      a: 2, src: 'May 2025 AN — Q27',
      ex: 'AND policy = all specified peers must endorse. Transaction invalid unless ALL required peers sign.',
    },
    {
      q: 'World state in Hyperledger Fabric is:',
      opts: ['The complete transaction history', 'A database (CouchDB/LevelDB) storing current state of all assets', 'The list of all channels', 'The ordering service log'],
      a: 1, src: 'May 2025 AN — Q28',
      ex: 'World state = current state of ledger as key-value database. More efficient than scanning full transaction history.',
    },
    {
      q: 'Chaincode in Hyperledger Fabric refers to:',
      opts: ['A cryptocurrency token', 'Smart contracts written in Go/Java/Node.js', 'The consensus algorithm', 'The channel configuration'],
      a: 1, src: 'May 2025 AN — Q29',
      ex: 'Chaincode = smart contracts. Define business logic. Instantiated on channels, invoked by client applications.',
    },
    {
      q: 'Fabric\'s ordering service (Kafka/Raft) is separate from peer nodes. This improves:',
      opts: ['Security only', 'Scalability — ordering is independent of validation', 'Mining speed', 'Token economics'],
      a: 1, src: 'May 2025 AN — Q30',
      ex: 'Separation: peers validate concurrently, orderer establishes transaction order. Unlike Ethereum where all happens together.',
    },
    {
      q: 'Which is NOT a Fabric consensus ordering option?',
      opts: ['Solo', 'Kafka', 'Raft', 'Proof of Work'],
      a: 3, src: 'May 2025 AN — Q31',
      ex: 'PoW is for public blockchains (Bitcoin/Ethereum). Fabric uses Solo (dev), Kafka (prod), or Raft (crash fault tolerant).',
    },
    {
      q: 'Hyperledger Fabric differs from Ethereum in that Fabric:',
      opts: ['Has a native cryptocurrency token', 'Is permissioned with no native token', 'Uses PoW consensus', 'Only supports JavaScript chaincode'],
      a: 1, src: 'May 2025 AN — Q32',
      ex: 'Fabric: permissioned, no native token, PBFT-like consensus. Ethereum: public, has Ether (ETH), uses PoW/PoS.',
    },
  ],
  'Decentralized Applications': [
    {
      q: 'A smart contract is:',
      opts: ['A legal document stored in a law firm', 'Self-executing code on blockchain triggered automatically when conditions are met', 'An AI chatbot', 'A consensus algorithm'],
      a: 1, src: 'May 2025 AN — Q33',
      ex: 'Smart contract: code deployed on blockchain. When encoded conditions are met, contract executes automatically. No intermediaries.',
    },
    {
      q: 'DApps (Decentralized Applications) differ from normal apps in that:',
      opts: ['They run on centralized servers', 'Backend logic runs on blockchain via smart contracts — no central server', 'They require no internet', 'They can only handle text data'],
      a: 1, src: 'May 2025 AN — Q34',
      ex: 'DApp: frontend (normal UI) + blockchain backend (smart contracts). No single point of failure, data is on-chain.',
    },
    {
      q: 'IPFS (InterPlanetary File System) stores files:',
      opts: ['On a single central server', 'Across multiple nodes in a decentralized peer-to-peer network', 'Only on the Ethereum blockchain', 'In traditional cloud databases'],
      a: 1, src: 'May 2025 AN — Q35',
      ex: 'IPFS: decentralized storage. Files split into chunks, stored across many nodes. Each file = unique content hash (CID).',
    },
    {
      q: 'NFT images are typically stored using:',
      opts: ['Traditional cloud storage (AWS S3)', 'IPFS with content-addressable hashing', 'Email attachments', 'Centralized databases'],
      a: 1, src: 'May 2025 AN — Q36',
      ex: 'NFT metadata/image stored on IPFS — content-addressed, decentralized, resistant to single point of failure.',
    },
    {
      q: 'Layer 2 scaling solutions (state channels, sidechains) work by:',
      opts: ['Increasing block size in the main chain', 'Processing transactions off main chain, settling results on main chain', 'Removing blockchain entirely', 'Using more validators'],
      a: 1, src: 'May 2025 AN — Q37',
      ex: 'Layer 2: off-chain transaction processing with on-chain settlement. Dramatically increases throughput, reduces fees.',
    },
    {
      q: 'Sharding in blockchain divides:',
      opts: ['The network into regions', 'The blockchain state horizontally — each shard handles a subset of transactions', 'Blocks into smaller pieces', 'Miners into groups'],
      a: 1, src: 'May 2025 AN — Q38',
      ex: 'Sharding: horizontal partitioning of blockchain state. Each shard has its own transaction history = parallel processing.',
    },
    {
      q: 'Real-time example of a DApp:',
      opts: ['Netflix streaming', 'Uniswap — decentralized token exchange on Ethereum', 'Gmail email service', 'AWS cloud storage'],
      a: 1, src: 'May 2025 AN — Q39',
      ex: 'Uniswap: DApp on Ethereum. No central exchange — automated market maker (AMM) protocol executes trades via smart contracts.',
    },
    {
      q: 'The scalability trilemma impacts blockchain by:',
      opts: ['Making all blockchains equally scalable', 'Forcing designers to trade off decentralization, security, and scalability', 'Improving all three simultaneously', 'Eliminating the need for miners'],
      a: 1, src: 'May 2025 AN — Q40',
      ex: 'Scalability trilemma: increasing throughput (scalability) often requires fewer validators (less decentralization) or lighter consensus (less security).',
    },
  ],
};

// ─── PART B 8-MARK QUESTIONS ─────────────────────────────────────────────────
const PART_B_8 = [
  // Unit 1
  {
    unit: 1, marks: 8,
    question: 'What is cloud computing? Explain the three service models — IaaS, PaaS, and SaaS — with real-world examples for each.',
    keyPoints: [
      'Cloud computing: on-demand delivery of computing resources (servers, storage, databases, networking) over the internet with pay-per-use pricing',
      'IaaS (Infrastructure as a Service): virtual machines, storage, networking — user manages OS up — AWS EC2, Azure VMs, Google Compute Engine',
      'PaaS (Platform as a Service): development platform, databases, middleware — provider manages OS/runtime — Heroku, Google App Engine, Azure App Service',
      'SaaS (Software as a Service): complete applications over internet — provider manages everything — Gmail, Salesforce, Netflix, Microsoft 365',
      'IaaS: maximum control + maximum responsibility; SaaS: minimum control + minimum responsibility',
      'Tradeoff: flexibility vs simplicity vs cost — choose based on technical needs and team capacity',
    ],
  },
  {
    unit: 1, marks: 8,
    question: 'Explain the four deployment models of cloud computing (Public, Private, Hybrid, Community) with suitable use cases.',
    keyPoints: [
      'Public cloud: shared infrastructure available to general public — AWS, Azure, GCP — pay-per-use, unlimited scalability',
      'Private cloud: dedicated to single organization — on-premise or hosted — maximum control, higher cost, used for sensitive data (banking, healthcare)',
      'Hybrid cloud: links public + private — sensitive workloads on private, burst capacity on public — banking, retail',
      'Community cloud: shared across multiple organizations with common goals (security compliance, research) — government agencies, universities',
      'Public vs Private: cost vs control trade-off. Private = higher security/compliance, Public = elastic scale at lower cost',
      'Example: Hospitals use hybrid (private for patient records, public for research analytics)',
    ],
  },
  // Unit 2
  {
    unit: 2, marks: 8,
    question: 'What is fog computing? How does it complement cloud computing in IoT scenarios? Explain with a real-world use case.',
    keyPoints: [
      'Fog computing: extends cloud services to edge of network — compute/storage nodes placed between cloud and end devices',
      'Fog hierarchy: Cloud (central) → Fog nodes (regional) → Edge devices → End devices (sensors/actuators)',
      'IoT problem: thousands of sensors generate continuous data — sending all raw data to cloud = bandwidth bottleneck + high latency',
      'Fog solution: preprocess data locally at fog nodes — aggregation, filtering, real-time analytics — only summary data sent to cloud',
      'Bandwidth saving: 1000 sensors × 1MB/s = 1 GB/s raw; fog aggregates to ~1MB/s summary = 99.9% bandwidth reduction',
      'Use cases: autonomous vehicles (real-time braking decisions), smart cities (traffic management), healthcare (patient monitoring)',
    ],
  },
  {
    unit: 2, marks: 8,
    question: 'Compare fog computing and edge computing in terms of architecture, scope, latency, and use cases.',
    keyPoints: [
      'Architecture: fog is hierarchical (cloud→fog→edge), edge is distributed and localized — each device is its own processing point',
      'Scope: fog spans geographic regions (city-wide sensors), edge operates at individual device level (sensor, camera, machine)',
      'Latency: edge offers lowest latency (microseconds — real-time control at device), fog adds slight overhead but still much lower than cloud',
      'Compute power: edge devices have limited resources (microcontrollers), fog nodes have moderate resources (edge servers, gateways)',
      'Fog use cases: metropolitan traffic systems, industrial IoT dashboards, agricultural monitoring across farms',
      'Edge use cases: autonomous vehicle real-time braking, industrial robot control loops, medical device monitoring',
      'Key difference: edge processes data at the point of creation; fog adds a middle layer for aggregation across multiple edge devices',
    ],
  },
  // Unit 3
  {
    unit: 3, marks: 8,
    question: 'Explain blockchain fundamentals. How does hash linking ensure immutability of the blockchain?',
    keyPoints: [
      'Blockchain: distributed, decentralized ledger — records transactions across multiple nodes — immutable and append-only',
      'Block structure: (i) data payload, (ii) current block hash, (iii) hash of previous block — these three components link blocks into chain',
      'SHA-256 cryptographic hash: one-way function — input any size → fixed 256-bit output — tiny input change = completely different hash (avalanche effect)',
      'Immutability mechanism: changing data in block N changes its hash → block N+1\'s "previous hash" no longer matches → chain broken → easily detected',
      'To alter historical data: attacker must re-mine block N and ALL subsequent blocks — computationally infeasible on long chains',
      'Consensus (PoW/PoS): ensures all nodes agree on same chain state — majority honest nodes protect against tampering',
    ],
  },
  {
    unit: 3, marks: 8,
    question: 'Describe PoW, PoS, and PBFT consensus mechanisms. Compare energy efficiency and use cases.',
    keyPoints: [
      'PoW (Proof of Work): miners solve computationally expensive puzzle (finding nonce) — first to solve adds block — high energy consumption (entire countries worth)',
      'PoS (Proof of Stake): validators stake cryptocurrency as collateral — selected probabilistically based on stake amount — ~99.9% less energy than PoW',
      'PBFT (Practical Byzantine Fault Tolerance): used in Hyperledger Fabric — requires > 2/3 honest nodes — no mining, low latency, high throughput',
      'PoW examples: Bitcoin, Ethereum 1.0 — proven security on massive scale but energy intensive',
      'PoS examples: Ethereum 2.0, Cardano, Solana — validator economics replaces mining',
      'Energy comparison: PoW (100+ TWh/year) >> PoS (0.01 TWh/year) > PBFT (very low)',
      'Trade-offs: PoW = maximum decentralization/security, PoS = energy efficiency + economic security, PBFT = enterprise performance',
    ],
  },
  // Unit 4
  {
    unit: 4, marks: 8,
    question: 'Explain Hyperledger Fabric architecture: channels, world state, chaincode, and endorsement policy.',
    keyPoints: [
      'Hyperledger Fabric: permissioned enterprise blockchain by Linux Foundation — modular, pluggable consensus — no native cryptocurrency',
      'Channels: private sub-networks for confidential transactions — only participating organizations can see channel data — OrgA+OrgB channel invisible to OrgC',
      'World state: CouchDB (JSON) or LevelDB (key-value) database — stores current state of all assets — more efficient than scanning full transaction history',
      'Chaincode (smart contracts): business logic written in Go, Java, or Node.js — deployed on specific channels — invoked by client applications',
      'Endorsement policy: specifies which and how many peers must validate a transaction — e.g., AND(Org1.peer, Org2.peer) requires both signatures',
      'Ordering service (Solo/Kafka/Raft): establishes consensus on transaction order — separate from peer nodes — solo for dev, Kafka/Raft for production',
    ],
  },
  {
    unit: 4, marks: 8,
    question: 'How does Hyperledger Fabric differ from public blockchains like Bitcoin and Ethereum?',
    keyPoints: [
      'Permissioned vs Permissionless: Fabric participants are known/vetted organizations; Bitcoin/Ethereum anyone can join anonymously',
      'Native token: Fabric has no cryptocurrency; Ethereum has Ether (ETH) — used for gas/fees/staking',
      'Consensus: Fabric uses PBFT-like (Solo/Kafka/Raft) — fast, BFT; Ethereum uses PoW/PoS — energy intensive but maximally decentralized',
      'Smart contracts: Fabric = chaincode (Go/Java/Node); Ethereum = Solidity/Vyper (Turing-complete contracts)',
      'Channels vs public ledger: Fabric channels provide transaction privacy; Ethereum all transactions are public',
      'Throughput: Fabric achieves 1000s of TPS via parallel validation; Ethereum PoW ~15-30 TPS (addressed by PoS and Layer 2)',
    ],
  },
  // Unit 5
  {
    unit: 5, marks: 8,
    question: 'What are DApps? Explain the architecture of a DApp and compare with traditional centralized applications.',
    keyPoints: [
      'DApp (Decentralized Application): frontend UI (HTML/CSS/React) + blockchain backend (smart contracts) — no central server or database',
      'Traditional app: client → backend server → database — single point of failure — data owned by company',
      'DApp architecture: frontend → Web3 library (ethers.js/web3.js) → smart contract on blockchain → distributed storage (IPFS)',
      'Backend logic on blockchain: executed by all nodes — deterministic, tamper-resistant, automatically enforced by consensus',
      'Distributed storage: large files (images, documents) stored on IPFS — only content hash stored on-chain',
      'Token-based governance: many DApps have governance tokens — holders vote on protocol changes',
      'Examples: Uniswap (DeFi exchange), OpenSea (NFT marketplace), Aave (lending protocol), Decentraland (virtual world)',
    ],
  },
  {
    unit: 5, marks: 8,
    question: 'Explain IPFS and how it provides decentralized storage. Why is it used in blockchain applications?',
    keyPoints: [
      'IPFS (InterPlanetary File System): peer-to-peer decentralized file storage system — files distributed across many nodes',
      'Content addressing: each file has a unique content hash (CID) — file split into chunks, each chunk hash-addressed — retrieving any chunk verifies integrity',
      'Traditional web: client → specific server → single point of failure if server goes down',
      'IPFS: content is retrieved from nearest node that has it — like BitTorrent — no single server dependency',
      'DApp storage: blockchain is expensive for large data — store files (NFT images, documents, metadata) on IPFS, store only hash on-chain',
      'Advantages: no single point of failure, censorship resistant, download speed increases as more nodes hold the data',
      'Pinning services: persistent storage (Pinata, Filebase) ensure IPFS content remains available long-term',
    ],
  },
];

// ─── GLOBAL STYLES ─────────────────────────────────────────────────────────
const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; }
  .ccbf-page { font-family: 'Space Grotesk', sans-serif; background: #0a0a0a; color: #e5e5e5; min-height: 100vh; }
  .mono { font-family: 'JetBrains Mono', monospace; }
  .card { background: #1c1c1e; border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; overflow: hidden; }
  .card-glow:hover { box-shadow: 0 0 30px rgba(124,58,237,0.1); }
`;

// ─── STICKY HEADER ──────────────────────────────────────────────────────────
function StickyHeader({ onBack, activeTab, onTabChange }: {
  onBack: () => void; activeTab: string; onTabChange: (t: string) => void;
}) {
  return (
    <div style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(10,10,10,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '0 clamp(16px,4vw,32px)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 16, height: 56 }}>
        <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '6px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#e5e5e5' }}>
          <ArrowLeft size={16} />
        </button>
        <div style={{ flex: 1 }}>
          <div className="mono" style={{ fontSize: 10, color: '#7c3aed', letterSpacing: '0.12em', textTransform: 'uppercase' }}>21CCT301T</div>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', letterSpacing: '-0.02em' }}>Cloud Computing using Blockchain</div>
        </div>
        <nav style={{ display: 'flex', gap: 4 }}>
          {[{ key: 'analysis', label: 'Analysis' }, { key: 'mastersheet', label: 'Master Sheet' }].map(tab => (
            <button key={tab.key} onClick={() => onTabChange(tab.key)} style={{ padding: '6px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: 'inherit', background: activeTab === tab.key ? '#7c3aed' : 'transparent', color: activeTab === tab.key ? '#fff' : '#888', transition: 'all 0.15s' }}>{tab.label}</button>
          ))}
        </nav>
        <a href="/CCBF_Syllabus.pdf" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.06)', color: '#888', textDecoration: 'none', fontSize: 12, border: '1px solid rgba(255,255,255,0.08)' }}>
          <BookOpen size={12} /> Syllabus
        </a>
      </div>
    </div>
  );
}

// ─── HERO ──────────────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <div style={{ position: 'relative', background: 'linear-gradient(180deg, #0f0f12 0%, #0a0a0a 100%)', padding: 'clamp(40px,8vw,80px) clamp(16px,4vw,48px)', overflow: 'hidden' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 2 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <div className="mono" style={{ fontSize: 10, color: '#7c3aed', letterSpacing: '0.1em' }}>██ EXAM COMMAND CENTER ██</div>
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, rgba(255,255,255,0.1), transparent)' }} />
          <div className="mono" style={{ fontSize: 10, color: '#666', letterSpacing: '0.1em' }}>21CCT301T — CCBF</div>
        </div>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ fontSize: 'clamp(24px,5vw,42px)', fontWeight: 700, color: '#fff', letterSpacing: '-0.03em', marginBottom: 8, lineHeight: 1.1 }}>
          Cloud Computing using<br /><span style={{ color: '#7c3aed' }}>Blockchain</span>
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.5 }} style={{ fontSize: 14, color: '#888', marginBottom: 32, maxWidth: 500 }}>
          Comprehensive PYQ analysis. 5 Units × 8 MCQs + Part B 8-marks + Part C 15-marks. All topics covered.
        </motion.p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 12, marginBottom: 24, maxWidth: 700 }}>
          {[{ n: STATS.papers, l: 'Papers Analyzed', c: '#7c3aed' }, { n: STATS.mcqs, l: 'MCQs Covered', c: '#06b6d4' }, { n: STATS.marks, l: 'Total Marks', c: '#f59e0b' }, { n: STATS.safeScore, l: 'Safe Score', c: '#10b981' }].map(({ n, l, c }, i) => (
            <motion.div key={l} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i, duration: 0.4 }} style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${c}25`, borderLeft: `2px solid ${c}`, borderRadius: 8, padding: '14px 16px' }}>
              <div className="mono" style={{ fontSize: 24, fontWeight: 700, color: c, letterSpacing: '-0.04em' }}>{n}</div>
              <div style={{ fontSize: 11, color: '#888', marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{l}</div>
            </motion.div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {[{ icon: <CheckCircle2 size={11} />, text: '40 MCQs across 5 units', color: '#7c3aed' }, { icon: <CheckCircle2 size={11} />, text: '9 Part B 8-mark questions', color: '#f59e0b' }, { icon: <AlertTriangle size={11} />, text: 'U3 + U5 = 33 marks (highest)', color: '#ef4444' }].map(({ icon, text, color }) => (
            <motion.div key={text} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 6, background: `${color}12`, border: `1px solid ${color}25`, fontSize: 12, color: '#ccc' }}>
              <span style={{ color }}>{icon}</span>{text}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── RADAR CHART ─────────────────────────────────────────────────────────────
function RadarChart() {
  const cx = 160, cy = 145, r = 100, axes = 5;
  const datasets = [
    { label: 'MCQ Density', color: '#7c3aed', values: RADAR_DATA.map(d => d.mcq) },
    { label: 'Part B Frequency', color: '#06b6d4', values: RADAR_DATA.map(d => d.partB) },
    { label: 'Part C Presence', color: '#f59e0b', values: RADAR_DATA.map(d => d.partC) },
  ];
  const toXY = (i: number, val: number) => { const angle = (Math.PI * 2 * i) / axes - Math.PI / 2; const dist = (val / 100) * r; return { x: cx + dist * Math.cos(angle), y: cy + dist * Math.sin(angle) }; };
  const gridLevels = [20, 40, 60, 80, 100];
  return (
    <div className="card" style={{ padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <Target size={14} color="#7c3aed" />
        <h3 style={{ fontSize: 13, fontWeight: 600, color: '#fff', margin: 0, letterSpacing: '0.02em' }}>UNIT COVERAGE RADAR</h3>
      </div>
      <div style={{ display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
        <svg width={320} height={290} viewBox="0 0 320 290">
          {gridLevels.map(level => <polygon key={level} points={Array.from({ length: axes }, (_, i) => { const { x, y } = toXY(i, level); return `${x},${y}`; }).join(' ')} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={0.5} />)}
          {Array.from({ length: axes }, (_, i) => { const { x, y } = toXY(i, 100); return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="rgba(255,255,255,0.08)" strokeWidth={0.5} />; })}
          {RADAR_DATA.map((d, i) => { const { x, y } = toXY(i, 118); return <text key={d.unit} x={x} y={y} textAnchor="middle" dominantBaseline="middle" fontSize={10} fontWeight={600} fill="#888" fontFamily="'JetBrains Mono', monospace">{d.unit}</text>; })}
          {datasets.map((ds, di) => <polygon key={di} points={ds.values.map((v, i) => { const { x, y } = toXY(i, v); return `${x},${y}`; }).join(' ')} fill={`${ds.color}18`} stroke={ds.color} strokeWidth={1.5} opacity={0.9} />)}
          {datasets.map((ds, di) => ds.values.map((v, i) => { const { x, y } = toXY(i, v); return <circle key={`${di}-${i}`} cx={x} cy={y} r={3} fill={ds.color} />; }))}
        </svg>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {datasets.map(ds => <div key={ds.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}><div style={{ width: 24, height: 2, background: ds.color, borderRadius: 1 }} /><span style={{ fontSize: 11, color: '#888', fontFamily: "'JetBrains Mono', monospace" }}>{ds.label}</span></div>)}
          <div style={{ marginTop: 8, fontSize: 10, color: '#555', lineHeight: 1.6, fontFamily: "'JetBrains Mono', monospace" }}>
            5 axes = 5 units<br />Outer ring = 100<br />U3 (BC) highest overall<br />U5 (DApps) strong Part B
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── TOPIC PRIORITY BARS ─────────────────────────────────────────────────────
function TopicFreqBars() {
  return (
    <div className="card" style={{ padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <TrendingUp size={14} color="#10b981" />
        <h3 style={{ fontSize: 13, fontWeight: 600, color: '#fff', margin: 0, letterSpacing: '0.02em' }}>TOPIC PRIORITY SCORE</h3>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {TOPICS.map((t, i) => (
          <div key={t.topic}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
              <span style={{ fontSize: 11, color: '#ccc' }}>{t.topic}</span>
              <span className="mono" style={{ fontSize: 10, color: '#666' }}>{t.score}% · U{t.unit}</span>
            </div>
            <div style={{ height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 2, overflow: 'hidden' }}>
              <motion.div initial={{ width: 0 }} whileInView={{ width: `${t.score}%` }} viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }} style={{ height: '100%', background: t.color, borderRadius: 2, boxShadow: `0 0 6px ${t.color}40` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── HEATMAP ─────────────────────────────────────────────────────────────────
function Heatmap() {
  const paperLabels = ['May 25 AN'];
  return (
    <div className="card" style={{ padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <Zap size={14} color="#f59e0b" />
        <h3 style={{ fontSize: 13, fontWeight: 600, color: '#fff', margin: 0, letterSpacing: '0.02em' }}>PAPER × TOPIC HEATMAP</h3>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 300 }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', fontSize: 10, color: '#555', fontWeight: 500, padding: '0 10px 8px 0', fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>Topic</th>
              {paperLabels.map(p => <th key={p} style={{ textAlign: 'center', fontSize: 10, color: '#555', fontWeight: 500, padding: '0 0 8px 8px', fontFamily: "'JetBrains Mono', monospace" }}>{p}</th>)}
            </tr>
          </thead>
          <tbody>
            {TOPICS.map((t, i) => (
              <tr key={t.topic} style={{ background: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent' }}>
                <td style={{ fontSize: 11, color: '#bbb', padding: '6px 10px 6px 0', borderBottom: '1px solid rgba(255,255,255,0.03)', whiteSpace: 'nowrap' }}>{t.topic}</td>
                {HEATMAP[i].map((val, j) => (
                  <td key={j} style={{ textAlign: 'center', padding: '6px 0 6px 8px', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <div style={{ width: 20, height: 20, borderRadius: 4, background: val === 'Y' ? 'rgba(48,209,88,0.12)' : 'rgba(255,255,255,0.03)', border: `1px solid ${val === 'Y' ? 'rgba(48,209,88,0.25)' : 'rgba(255,255,255,0.05)'}`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ width: 6, height: 6, borderRadius: 2, background: val === 'Y' ? '#30d158' : '#333' }} />
                    </div>
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

// ─── PYQ CARDS ───────────────────────────────────────────────────────────────
function PYQCards() {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <FileText size={14} color="#7c3aed" />
        <h3 style={{ fontSize: 13, fontWeight: 600, color: '#fff', margin: 0, letterSpacing: '0.02em' }}>PYQ PAPER SOURCES</h3>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
        {PAPERS.map((p, i) => (
          <motion.a key={p.code} href={p.file} target="_blank" rel="noopener noreferrer" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} style={{ textDecoration: 'none' }}>
            <div className="card card-glow" style={{ padding: '16px 18px', cursor: 'pointer', transition: 'all 0.2s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div>
                  <div className="mono" style={{ fontSize: 11, color: '#7c3aed', marginBottom: 2 }}>{p.code}</div>
                  <div className="mono" style={{ fontSize: 10, color: '#555' }}>{p.date}</div>
                </div>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#f59e0b', boxShadow: '0 0 8px rgba(245,158,11,0.5)' }} />
              </div>
              <div style={{ fontSize: 11, color: '#888', marginBottom: 8, lineHeight: 1.5 }}><Shield size={9} style={{ display: 'inline', marginRight: 4 }} />{p.highlight}</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {p.keyTopics.slice(0, 3).map(t => <span key={t} style={{ fontSize: 9, color: '#666', background: 'rgba(255,255,255,0.04)', padding: '2px 6px', borderRadius: 4, fontFamily: "'JetBrains Mono', monospace" }}>{t}</span>)}
              </div>
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  );
}

// ─── ACCORDION ───────────────────────────────────────────────────────────────
function AccordionItem({ title, children, defaultOpen = false, color = '#7c3aed' }: { title: string; children: React.ReactNode; defaultOpen?: boolean; color?: string }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, overflow: 'hidden', marginBottom: 6, background: open ? `${color}08` : 'transparent' }}>
      <button onClick={() => setOpen(!open)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: open ? color : '#ccc' }}>{title}</span>
        {open ? <ChevronUp size={14} color={color} /> : <ChevronDown size={14} color="#555" />}
      </button>
      {open && <div style={{ padding: '0 14px 14px', borderTop: `1px solid ${color}15` }}>{children}</div>}
    </div>
  );
}

// ─── UNIT GRID ───────────────────────────────────────────────────────────────
function UnitGrid() {
  return (
    <div className="card" style={{ padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <Target size={14} color="#7c3aed" />
        <h3 style={{ fontSize: 13, fontWeight: 600, color: '#fff', margin: 0, letterSpacing: '0.02em' }}>UNIT MARKS DISTRIBUTION</h3>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
        {UNITS.map((u, i) => (
          <motion.div key={u.unit} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }} style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${u.color}20`, borderLeft: `3px solid ${u.color}`, borderRadius: 8, padding: '12px 14px' }}>
            <div className="mono" style={{ fontSize: 10, color: '#555', marginBottom: 4 }}>UNIT {u.unit}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', marginBottom: 6 }}>{u.name}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="mono" style={{ fontSize: 18, fontWeight: 700, color: u.color }}>{u.marks}</span>
              <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 4, background: u.priority === 'HIGH' ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.06)', color: u.priority === 'HIGH' ? '#ef4444' : '#888', border: `1px solid ${u.priority === 'HIGH' ? 'rgba(239,68,68,0.25)' : 'rgba(255,255,255,0.08)'}` }}>{u.priority}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── MCQ SECTION ─────────────────────────────────────────────────────────────
function MCQSection() {
  const [activeTopic, setActiveTopic] = useState('Cloud Computing Intro');
  return (
    <div className="card" style={{ padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <Shield size={14} color="#7c3aed" />
        <h3 style={{ fontSize: 13, fontWeight: 600, color: '#fff', margin: 0, letterSpacing: '0.02em' }}>UNIT WISE MCQ BANK</h3>
        <span className="mono" style={{ fontSize: 11, color: '#555', marginLeft: 4 }}>8 per unit = 40 total</span>
      </div>
      <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
        {MCQ_TOPICS.map(mt => (
          <button key={mt.topic} onClick={() => setActiveTopic(mt.topic)} style={{ padding: '4px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 11, fontWeight: 500, fontFamily: 'inherit', background: activeTopic === mt.topic ? 'rgba(124,58,237,0.2)' : 'rgba(255,255,255,0.04)', color: activeTopic === mt.topic ? '#7c3aed' : '#888', border: activeTopic === mt.topic ? '1px solid rgba(124,58,237,0.3)' : '1px solid rgba(255,255,255,0.06)' }}>
            U{mt.unit} — {mt.topic.split(' ')[0]}
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {MCQ_BANK[activeTopic]?.map((mcq, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }} style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 8, padding: 14, border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="mono" style={{ fontSize: 9, color: '#555', marginBottom: 8 }}>{mcq.src}</div>
            <div style={{ fontSize: 13, color: '#e5e5e5', marginBottom: 12, lineHeight: 1.5 }}>{mcq.q}</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
              {mcq.opts.map((opt, oi) => (
                <div key={oi} style={{ padding: '8px 12px', borderRadius: 6, fontSize: 12, background: oi === mcq.a ? 'rgba(48,209,88,0.15)' : 'rgba(255,255,255,0.03)', border: oi === mcq.a ? '1px solid rgba(48,209,88,0.3)' : '1px solid rgba(255,255,255,0.06)', color: oi === mcq.a ? '#30d158' : '#999', fontFamily: "'JetBrains Mono', monospace" }}>
                  <span style={{ color: oi === mcq.a ? '#30d158' : '#555', marginRight: 6 }}>{String.fromCharCode(65 + oi)}</span>{opt}
                </div>
              ))}
            </div>
            <div style={{ marginTop: 10, padding: '8px 10px', background: 'rgba(255,255,255,0.02)', borderRadius: 6, border: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ fontSize: 11, color: '#666' }}>{mcq.ex}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── PART B SECTION ─────────────────────────────────────────────────────────
function PartBSection() {
  return (
    <div className="card" style={{ padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <FileText size={14} color="#f59e0b" />
        <h3 style={{ fontSize: 13, fontWeight: 600, color: '#fff', margin: 0, letterSpacing: '0.02em' }}>PART B — 8 MARK QUESTIONS</h3>
        <span className="mono" style={{ fontSize: 11, color: '#555', marginLeft: 4 }}>9 questions (2 per U1–U4, 1 for U5)</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {PART_B_8.map((q, i) => (
          <AccordionItem key={i} title={`U${q.unit} — ${q.question.slice(0, 55)}${q.question.length > 55 ? '...' : ''} [${q.marks}M]`} defaultOpen={i < 3} color="#f59e0b">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 12 }}>
              <div style={{ fontSize: 13, color: '#ddd', lineHeight: 1.6, marginBottom: 8 }}>{q.question}</div>
              <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: 8, padding: 12, border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ fontSize: 11, color: '#f59e0b', marginBottom: 8, fontWeight: 600 }}>KEY POINTS</div>
                {q.keyPoints.map((kp, ki) => <div key={ki} style={{ display: 'flex', gap: 8, marginBottom: 6 }}><span style={{ color: '#555', fontSize: 10, fontFamily: "'JetBrains Mono', monospace", minWidth: 16 }}>{ki + 1}.</span><span style={{ fontSize: 12, color: '#bbb', lineHeight: 1.5 }}>{kp}</span></div>)}
              </div>
            </div>
          </AccordionItem>
        ))}
      </div>
    </div>
  );
}

// ─── PART C SECTION ─────────────────────────────────────────────────────────
function PartCSection() {
  return (
    <div className="card" style={{ padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <CheckCircle2 size={14} color="#10b981" />
        <h3 style={{ fontSize: 13, fontWeight: 600, color: '#fff', margin: 0, letterSpacing: '0.02em' }}>PART C — 15 MARK PREDICTIONS</h3>
        <span className="mono" style={{ fontSize: 11, color: '#555', marginLeft: 4 }}>3 probable long-answer questions</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {[
          { unit: 2, scenario: 'Fog Computing Latency Numerical: A factory has 5000 IoT sensors, each generating 2KB data every second. Cloud processing adds 250ms round-trip latency. Fog node processes data locally adding 8ms. Calculate: (a) Total raw bandwidth to cloud (b) Bandwidth after fog processing at 100:1 compression ratio (c) Latency saved per sensor request.', probability: 85, color: '#06b6d4', solution: [{ step: 'Raw cloud bandwidth', value: '5000 sensors × 2KB/s = 10,000 KB/s = 9.77 MB/s to cloud' }, { step: 'Fog compressed', value: '10,000 KB/s ÷ 100 = 100 KB/s after 100:1 aggregation' }, { step: 'Bandwidth saved', value: '9.77 MB/s - 0.1 MB/s = 9.67 MB/s ≈ 99% reduction' }, { step: 'Latency saved', value: '250ms - 8ms = 242ms saved per request (96.8% improvement)' }, { step: 'Cloud cost saving', value: '99% bandwidth reduction = proportionally lower cloud egress costs' }] },
          { unit: 3, scenario: 'Blockchain Hash Chain: Block 1 has data "Vote:Alice". Block 1 hash = SHA256(data + prev_hash) = "0000a3...". Block 2 has data "Vote:Bob" and prev_hash = "0000a3...". Block 2 hash = SHA256("Vote:Bob"+"0000a3...") = "0001b7...". Block 3 attacker changes Bob\'s vote to "Vote:Eve". Show how hash linking makes this tampering detectable.', probability: 75, color: '#f59e0b', solution: [{ step: 'Block 3 tampered', value: 'Data changes from "Vote:Bob" to "Vote:Eve" — hash becomes different' }, { step: 'Hash mismatch', value: 'Original Block 3 hash = "0001b7..." — New hash = "x9q2..." (completely different)' }, { step: 'Chain broken', value: 'Block 4\'s "prev_hash" (0001b7...) no longer matches tampered Block 3 hash' }, { step: 'Detection', value: 'All downstream blocks invalid — re-mining entire chain required (infeasible)' }, { step: 'Immutability proven', value: 'Avalanche effect: tiny data change → completely different hash → easily detected' }] },
          { unit: 5, scenario: 'DApp Architecture Design: Design a blockchain-based voting DApp. Step 1 — User registers with Aadhaar-like identity verified by authority. Step 2 — Smart contract records voter eligibility. Step 3 — User casts vote (one vote per registered voter). Step 4 — Vote stored immutably on blockchain. Step 5 — Results calculated automatically by smart contract. Analyze: (a) How does smart contract enforce one-person-one-vote? (b) Why is blockchain more transparent than e-voting? (c) What Layer 2 solution would you recommend for 1 million voters?', probability: 70, color: '#10b981', solution: [{ step: 'One-person-one-vote', value: 'Smart contract maps each verified Aadhaar hash → unique voter token. Vote transaction checks: has this token already voted? If yes → rejected. If no → vote recorded, token marked voted.' }, { step: 'Transparency', value: 'Every vote transaction is on public blockchain — anyone can verify vote count, cannot modify past votes (immutability), real-time result tallying' }, { step: 'Layer 2 for scale', value: '1M voters: use Polygon PoS or Arbitrum (Ethereum L2). Process votes as off-chain batched transactions — dramatically lower gas fees. Final vote counts committed to Ethereum mainnet periodically.' }, { step: 'IPFS storage', value: 'Voter documents stored on IPFS — only content hash stored on chain. Preserves privacy + data integrity.' }, { step: 'Governance token', value: 'Platform can issue governance token to voters for future referendum participation — increases engagement post-election.' }] },
        ].map((q, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} style={{ borderLeft: `3px solid ${q.color}`, background: 'rgba(255,255,255,0.02)', borderRadius: 8, padding: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
              <div>
                <div style={{ fontSize: 11, color: q.color, fontWeight: 700, marginBottom: 4 }}>{q.probability}% probable — Unit {q.unit}</div>
                <div className="mono" style={{ fontSize: 10, color: '#555' }}>Part C Long Answer — 15 Marks</div>
              </div>
              <div style={{ padding: '4px 10px', borderRadius: 6, fontSize: 10, fontWeight: 600, background: `${q.color}15`, color: q.color, border: `1px solid ${q.color}30`, fontFamily: "'JetBrains Mono', monospace" }}>U{q.unit}</div>
            </div>
            <div style={{ fontSize: 13, color: '#ccc', marginBottom: 14, lineHeight: 1.5 }}>{q.scenario}</div>
            <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: 8, padding: 12, border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ fontSize: 11, color: '#10b981', marginBottom: 8, fontWeight: 600 }}>STEP-BY-STEP SOLUTION</div>
              {q.solution.map((s, si) => <div key={si} style={{ display: 'flex', gap: 10, marginBottom: 6 }}><span className="mono" style={{ fontSize: 10, color: '#555', minWidth: 16 }}>{si + 1}.</span><div>{s.step && <span style={{ fontSize: 11, color: '#999' }}>{s.step}: </span>}<span className="mono" style={{ fontSize: 11, color: '#10b981' }}>{s.value}</span></div></div>)}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── MAIN EXPORT ─────────────────────────────────────────────────────────────
interface Props { onBack: () => void; }

export function CCBFAnalysisPage({ onBack }: Props) {
  const navigate = useNavigate();
  return (
    <>
      <style>{GLOBAL_STYLES}</style>
      <div className="ccbf-page">
        <div style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(10,10,10,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '0 clamp(16px,4vw,32px)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 16, height: 56 }}>
            <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '6px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#e5e5e5' }}>
              <ArrowLeft size={16} />
            </button>
            <div style={{ flex: 1 }}>
              <div className="mono" style={{ fontSize: 10, color: '#7c3aed', letterSpacing: '0.12em', textTransform: 'uppercase' }}>21CCT301T</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', letterSpacing: '-0.02em' }}>Cloud Computing using Blockchain</div>
            </div>
            <button onClick={() => navigate('/ccbf-master')} style={{ padding: '6px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: 'inherit', background: 'transparent', color: '#888', transition: 'all 0.15s' }}>Master Sheet</button>
          </div>
        </div>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(16px,4vw,48px) clamp(16px,4vw,48px) 80px' }}>
          <HeroSection />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, marginBottom: 24 }}>
            <RadarChart />
            <TopicFreqBars />
          </div>
          <div style={{ marginBottom: 24 }}>
            <UnitGrid />
          </div>
          <div style={{ marginBottom: 24 }}>
            <Heatmap />
          </div>
          <div style={{ marginBottom: 24 }}>
            <PYQCards />
          </div>
        </div>
      </div>
    </>
  );
}