import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import {
  ArrowLeft, BookOpen, FileText, ChevronDown, ChevronUp,
  CheckCircle2, AlertTriangle, Shield, Target, TrendingUp, Zap
} from 'lucide-react';

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
    { q: 'Which cloud deployment model shares infrastructure across multiple organizations?', opts: ['Private cloud', 'Public cloud', 'Hybrid cloud', 'Community cloud'], a: 1, src: 'May 2025 AN — Q1', ex: 'Public cloud: shared infrastructure available to general public. Resources pooled among multiple tenants.' },
    { q: 'In SaaS, the provider manages everything from infrastructure to application. Which layer does the user manage?', opts: ['OS and runtime', 'Application only', 'Hardware only', 'Nothing — provider manages all'], a: 3, src: 'May 2025 AN — Q2', ex: 'SaaS = least user responsibility. Provider handles OS, runtime, app, data. User just uses the software.' },
    { q: 'Cloud computing essential characteristic "resource pooling" means:', opts: ['Physical servers are grouped', 'Provider pools computing resources to serve multiple consumers', 'Data is stored in multiple locations', 'Network bandwidth is shared equally'], a: 1, src: 'May 2025 AN — Q3', ex: 'Resource pooling: provider\'s computing resources are pooled to serve multiple consumers simultaneously.' },
    { q: 'Which is NOT a cloud computing characteristic?', opts: ['On-demand self-service', 'Measured service', 'Physical hardware ownership', 'Broad network access'], a: 2, src: 'May 2025 AN — Q4', ex: 'Physical hardware ownership is NOT a cloud characteristic. Cloud is about pooling, not owning physical assets.' },
    { q: 'Hybrid cloud combines public and private cloud. Primary advantage is:', opts: ['Lower cost than public cloud', 'Burst capacity from public cloud when private is overwhelmed', 'Complete data isolation', 'No internet required'], a: 1, src: 'May 2025 AN — Q5', ex: 'Hybrid = best of both worlds. Use private for sensitive data, burst to public during peak demand.' },
    { q: 'IaaS provides virtual machines, storage, and networking. The user manages:', opts: ['Application only', 'Data only', 'OS up to application', 'Physical infrastructure'], a: 2, src: 'May 2025 AN — Q6', ex: 'IaaS: user manages OS, middleware, runtime, data. Provider handles physical hardware and virtualization.' },
    { q: 'Rapid elasticity in cloud means:', opts: ['Resources can be scaled out and in dynamically based on demand', 'Hardware fails rarely', 'Cloud data is never lost', 'Network latency is zero'], a: 0, src: 'May 2025 AN — Q7', ex: 'Elasticity: automatic scale-up or scale-down of resources based on workload — pay-per-use efficiency.' },
    { q: 'Which cloud service model would Netflix most likely use for its video streaming servers?', opts: ['IaaS', 'PaaS', 'SaaS', 'FaaS'], a: 0, src: 'May 2025 AN — Q8', ex: 'Netflix runs EC2 (IaaS) for maximum control over streaming infrastructure, auto-scaling, and CDN integration.' },
  ],
  'Fog Computing': [
    { q: 'Fog computing places compute and storage resources:', opts: ['Only in central data centers', 'At the edge of the network, closer to end users', 'Inside end user devices only', 'On satellite servers'], a: 1, src: 'May 2025 AN — Q9', ex: 'Fog extends cloud to the edge — geographically closer to data sources = lower latency, less bandwidth use.' },
    { q: 'Fog vs Cloud: primary fog advantage in IoT is:', opts: ['Higher compute power', 'Lower latency and reduced backhaul bandwidth', 'More storage capacity', 'Better security encryption'], a: 1, src: 'May 2025 AN — Q10', ex: 'Fog processes data locally at edge — only aggregated data sent to cloud = massive bandwidth savings.' },
    { q: 'In fog computing hierarchy, the correct order from top to bottom is:', opts: ['Edge → Fog → Cloud → End devices', 'Cloud → Fog → Edge → End devices', 'Fog → Cloud → Edge → End devices', 'End devices → Cloud → Fog → Edge'], a: 1, src: 'May 2025 AN — Q11', ex: 'Cloud (central) → Fog (regional) → Edge (local) → End devices. Data aggregations flow up, instructions flow down.' },
    { q: 'Fog computing is most suitable for which scenario?', opts: ['Batch data processing at month-end', 'Real-time IoT analytics with thousands of sensors', 'Long-term data archival', 'High-compute GPU rendering'], a: 1, src: 'May 2025 AN — Q12', ex: 'Real-time IoT: fog ideal for time-sensitive data (autonomous vehicles, health monitoring) where 200ms cloud latency is too high.' },
    { q: 'Edge computing differs from fog in that edge is:', opts: ['More hierarchical than fog', 'Distributed and localized per device — real-time processing', 'A cloud service', 'Always connected to the internet'], a: 1, src: 'May 2025 AN — Q13', ex: 'Edge = flat/distributed, operates directly on devices. Fog = hierarchical with intermediate regional nodes.' },
    { q: 'A smart city uses 10,000 sensors for traffic management. Fog computing helps by:', opts: ['Storing all raw sensor data permanently in the cloud', 'Processing data locally — only alerts sent to cloud', 'Encrypting all data at the sensor level', 'Replacing all cloud services'], a: 1, src: 'May 2025 AN — Q14', ex: 'Fog nodes aggregate and preprocess sensor streams — reduces cloud bandwidth by ~99% while enabling real-time responses.' },
    { q: 'Fog nodes are described as resource-constrained because:', opts: ['They are more powerful than cloud servers', 'They have limited compute/storage compared to cloud', 'They cannot communicate with each other', 'They only use analog hardware'], a: 1, src: 'May 2025 AN — Q15', ex: 'Fog nodes (Raspberry Pi, edge gateways) have limited resources vs. cloud — designed for specific, lightweight tasks.' },
    { q: 'Fog computing reduces bandwidth by:', opts: ['Increasing the number of sensors', 'Processing data locally — only aggregated results sent to cloud', 'Compressing data using lossy algorithms', 'Using satellite communication'], a: 1, src: 'May 2025 AN — Q16', ex: 'Local processing at fog means raw data stays at edge. 1000 sensors × 1MB/s raw = only 1MB/s aggregated to cloud.' },
  ],
  'Blockchain Fundamentals': [
    { q: 'A blockchain block contains: (i) data, (ii) current hash, (iii) previous hash. Which is correct?', opts: ['(i) only', '(i) and (ii) only', '(ii) and (iii) only', '(i), (ii), and (iii)'], a: 3, src: 'May 2025 AN — Q17', ex: 'Each block: data payload + current hash + previous block hash. Hash links blocks = chain. Change any field = hash breaks.' },
    { q: 'In PoW (Proof of Work), miners compete to:', opts: ['Stake the most cryptocurrency', 'Solve a cryptographic puzzle first', 'Sign the most transactions', 'Validate the most blocks'], a: 1, src: 'May 2025 AN — Q18', ex: 'PoW: miners solve computationally expensive puzzle (finding nonce). First to solve = right to add block. High energy cost.' },
    { q: 'PoS (Proof of Stake) validators are selected based on:', opts: ['Compute power', 'Amount of cryptocurrency staked as collateral', 'Number of transactions signed', 'Geographic location'], a: 1, src: 'May 2025 AN — Q19', ex: 'PoS: validators lock (stake) crypto as collateral. Selected probabilistically based on stake amount. ~99.9% more energy efficient than PoW.' },
    { q: 'Immutability in blockchain means:', opts: ['Data can be edited by authorized users', 'Once written, data cannot be altered without consensus', 'All data is encrypted', 'Blocks can be deleted'], a: 1, src: 'May 2025 AN — Q20', ex: 'Immutability: changing historical data requires re-mining all subsequent blocks (computationally infeasible on long chains).' },
    { q: 'The blockchain scalability trilemma states you can simultaneously optimize:', opts: ['Speed, cost, security', 'Decentralization, security, scalability', 'Privacy, speed, cost', 'Immutability, interoperability, speed'], a: 1, src: 'May 2025 AN — Q21', ex: 'Scalability trilemma: pick any TWO of decentralization, security, scalability. Can NOT optimize all three simultaneously.' },
    { q: 'Byzantine Fault Tolerance (BFT) means the system:', opts: ['Can never fail', 'Continues operating despite node failures or malicious actors', 'Requires all nodes to agree', 'Uses only cloud servers'], a: 1, src: 'May 2025 AN — Q22', ex: 'BFT: distributed system tolerates faulty/malicious nodes as long as < 1/3 are compromised. Practical BFT (PBFT) used in Hyperledger.' },
    { q: 'A 51% attack on Bitcoin means attackers control:', opts: ['51% of all Bitcoin wallets', '51% of hash power — can rewrite history', '51% of network nodes', '51% of transaction fees'], a: 1, src: 'May 2025 AN — Q23', ex: '51% attack: majority hash power lets attackers censor transactions and rewrite recent blocks — but extremely costly on long chains.' },
    { q: 'SHA-256 cryptographic hash — if input changes slightly, output:', opts: ['Stays the same', 'Changes completely', 'Changes only slightly', 'Becomes longer'], a: 1, src: 'May 2025 AN — Q24', ex: 'Hash property: avalanche effect — tiny input change → completely different hash output. One-way, irreversible.' },
  ],
  'Hyperledger & Enterprise BC': [
    { q: 'Hyperledger Fabric is a:', opts: ['Public blockchain like Bitcoin', 'Permissioned (private) blockchain framework', 'Cryptocurrency', 'Consortium blockchain only'], a: 1, src: 'May 2025 AN — Q25', ex: 'Fabric = permissioned enterprise blockchain by Linux Foundation. Known participants, no mining, faster consensus.' },
    { q: 'Fabric channels serve what purpose?', opts: ['Payment channels for transactions', 'Private sub-networks for confidential transactions between specific organizations', 'Communication between peers', 'Data backup channels'], a: 1, src: 'May 2025 AN — Q26', ex: 'Channels: private sub-networks. OrgA and OrgB can have a channel invisible to OrgC — ensures transaction privacy.' },
    { q: 'In Hyperledger Fabric, endorsement policy AND(Org1.peer, Org2.peer) means:', opts: ['Only Org1 must sign', 'Only Org2 must sign', 'Both Org1 and Org2 peers must sign', 'Either Org1 or Org2 can sign'], a: 2, src: 'May 2025 AN — Q27', ex: 'AND policy = all specified peers must endorse. Transaction invalid unless ALL required peers sign.' },
    { q: 'World state in Hyperledger Fabric is:', opts: ['The complete transaction history', 'A database (CouchDB/LevelDB) storing current state of all assets', 'The list of all channels', 'The ordering service log'], a: 1, src: 'May 2025 AN — Q28', ex: 'World state = current state of ledger as key-value database. More efficient than scanning full transaction history.' },
    { q: 'Chaincode in Hyperledger Fabric refers to:', opts: ['A cryptocurrency token', 'Smart contracts written in Go/Java/Node.js', 'The consensus algorithm', 'The channel configuration'], a: 1, src: 'May 2025 AN — Q29', ex: 'Chaincode = smart contracts. Define business logic. Instantiated on channels, invoked by client applications.' },
    { q: 'Fabric\'s ordering service (Kafka/Raft) is separate from peer nodes. This improves:', opts: ['Security only', 'Scalability — ordering is independent of validation', 'Mining speed', 'Token economics'], a: 1, src: 'May 2025 AN — Q30', ex: 'Separation: peers validate concurrently, orderer establishes transaction order. Unlike Ethereum where all happens together.' },
    { q: 'Which is NOT a Fabric consensus ordering option?', opts: ['Solo', 'Kafka', 'Raft', 'Proof of Work'], a: 3, src: 'May 2025 AN — Q31', ex: 'PoW is for public blockchains (Bitcoin/Ethereum). Fabric uses Solo (dev), Kafka (prod), or Raft (crash fault tolerant).' },
    { q: 'Hyperledger Fabric differs from Ethereum in that Fabric:', opts: ['Has a native cryptocurrency token', 'Is permissioned with no native token', 'Uses PoW consensus', 'Only supports JavaScript chaincode'], a: 1, src: 'May 2025 AN — Q32', ex: 'Fabric: permissioned, no native token, PBFT-like consensus. Ethereum: public, has Ether (ETH), uses PoW/PoS.' },
  ],
  'Decentralized Applications': [
    { q: 'A smart contract is:', opts: ['A legal document stored in a law firm', 'Self-executing code on blockchain triggered automatically when conditions are met', 'An AI chatbot', 'A consensus algorithm'], a: 1, src: 'May 2025 AN — Q33', ex: 'Smart contract: code deployed on blockchain. When encoded conditions are met, contract executes automatically. No intermediaries.' },
    { q: 'DApps (Decentralized Applications) differ from normal apps in that:', opts: ['They run on centralized servers', 'Backend logic runs on blockchain via smart contracts — no central server', 'They require no internet', 'They can only handle text data'], a: 1, src: 'May 2025 AN — Q34', ex: 'DApp: frontend (normal UI) + blockchain backend (smart contracts). No single point of failure, data is on-chain.' },
    { q: 'IPFS (InterPlanetary File System) stores files:', opts: ['On a single central server', 'Across multiple nodes in a decentralized peer-to-peer network', 'Only on the Ethereum blockchain', 'In traditional cloud databases'], a: 1, src: 'May 2025 AN — Q35', ex: 'IPFS: decentralized storage. Files split into chunks, stored across many nodes. Each file = unique content hash (CID).' },
    { q: 'NFT images are typically stored using:', opts: ['Traditional cloud storage (AWS S3)', 'IPFS with content-addressable hashing', 'Email attachments', 'Centralized databases'], a: 1, src: 'May 2025 AN — Q36', ex: 'NFT metadata/image stored on IPFS — content-addressed, decentralized, resistant to single point of failure.' },
    { q: 'Layer 2 scaling solutions (state channels, sidechains) work by:', opts: ['Increasing block size in the main chain', 'Processing transactions off main chain, settling results on main chain', 'Removing blockchain entirely', 'Using more validators'], a: 1, src: 'May 2025 AN — Q37', ex: 'Layer 2: off-chain transaction processing with on-chain settlement. Dramatically increases throughput, reduces fees.' },
    { q: 'Sharding in blockchain divides:', opts: ['The network into regions', 'The blockchain state horizontally — each shard handles a subset of transactions', 'Blocks into smaller pieces', 'Miners into groups'], a: 1, src: 'May 2025 AN — Q38', ex: 'Sharding: horizontal partitioning of blockchain state. Each shard has its own transaction history = parallel processing.' },
    { q: 'Real-time example of a DApp:', opts: ['Netflix streaming', 'Uniswap — decentralized token exchange on Ethereum', 'Gmail email service', 'AWS cloud storage'], a: 1, src: 'May 2025 AN — Q39', ex: 'Uniswap: DApp on Ethereum. No central exchange — automated market maker (AMM) protocol executes trades via smart contracts.' },
    { q: 'The scalability trilemma impacts blockchain by:', opts: ['Making all blockchains equally scalable', 'Forcing designers to trade off decentralization, security, and scalability', 'Improving all three simultaneously', 'Eliminating the need for miners'], a: 1, src: 'May 2025 AN — Q40', ex: 'Scalability trilemma: increasing throughput (scalability) often requires fewer validators (less decentralization) or lighter consensus (less security).' },
  ],
};

// ─── GLOBAL STYLES ─────────────────────────────────────────────────────────
const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; }
  .ccbf-page { font-family: 'Space Grotesk', sans-serif; background: #0a0a0a; color: #e5e5e5; min-height: 100vh; }
  .mono { font-family: 'JetBrains Mono', monospace; }
  .card { background: #1c1c1e; border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; overflow: hidden; }
`;

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

// ─── PART B 8-MARK QUESTIONS ─────────────────────────────────────────────────
const PART_B_8 = [
  { unit: 1, marks: 8, question: 'What is cloud computing? Explain the three service models — IaaS, PaaS, and SaaS — with real-world examples.', keyPoints: ['Cloud computing: on-demand delivery of computing resources over internet with pay-per-use pricing', 'IaaS: virtual machines, storage, networking — user manages OS up — AWS EC2, Azure VMs', 'PaaS: development platform, databases, middleware — provider manages OS/runtime — Heroku, Google App Engine', 'SaaS: complete applications over internet — provider manages everything — Gmail, Netflix, Salesforce', 'IaaS: maximum control + responsibility; SaaS: minimum control + minimum responsibility', 'Tradeoff: flexibility vs simplicity vs cost — choose based on technical needs'] },
  { unit: 1, marks: 8, question: 'Explain the four cloud deployment models (Public, Private, Hybrid, Community) with suitable use cases.', keyPoints: ['Public cloud: shared infrastructure — AWS, Azure, GCP — pay-per-use, unlimited scalability', 'Private cloud: dedicated to single organization — on-premise or hosted — maximum control, higher cost, sensitive data', 'Hybrid cloud: public + private linked — sensitive workloads on private, burst capacity on public', 'Community cloud: shared across organizations with common goals — government, universities', 'Public vs Private: cost vs control. Private = higher security, Public = elastic scale', 'Example: Hospitals use hybrid (private for patient records, public for research)'] },
  { unit: 2, marks: 8, question: 'What is fog computing? How does it complement cloud computing in IoT scenarios?', keyPoints: ['Fog computing: extends cloud to edge of network — compute/storage nodes between cloud and end devices', 'Fog hierarchy: Cloud → Fog nodes (regional) → Edge devices → End devices (sensors)', 'IoT problem: thousands of sensors generate continuous data — cloud bandwidth bottleneck + high latency', 'Fog solution: preprocess data locally — aggregation, filtering, real-time analytics — only summary to cloud', 'Bandwidth saving: 1000 sensors × 1MB/s = 1 GB/s raw; fog aggregates to ~1MB/s = 99.9% reduction', 'Use cases: autonomous vehicles, smart cities, healthcare monitoring'] },
  { unit: 2, marks: 8, question: 'Compare fog computing and edge computing: architecture, scope, latency, and use cases.', keyPoints: ['Architecture: fog is hierarchical (cloud→fog→edge); edge is distributed and localized per device', 'Scope: fog spans geographic regions; edge operates at individual device level', 'Latency: edge lowest (microseconds, real-time control); fog adds slight overhead but much lower than cloud', 'Fog use cases: metropolitan traffic systems, industrial IoT dashboards', 'Edge use cases: autonomous vehicle braking, industrial robot control, medical device monitoring', 'Edge processes at point of creation; fog adds middle layer for aggregation across edge devices'] },
  { unit: 3, marks: 8, question: 'Explain blockchain fundamentals. How does hash linking ensure immutability?', keyPoints: ['Blockchain: distributed, decentralized ledger — immutable, append-only, records across multiple nodes', 'Block structure: (i) data payload, (ii) current hash, (iii) previous block hash — links blocks into chain', 'SHA-256: one-way function — input any size → 256-bit output — tiny change = completely different hash', 'Immutability: changing data in block N → hash changes → block N+1 prev_hash mismatches → chain broken', 'To alter: must re-mine block N and ALL subsequent blocks — computationally infeasible on long chains', 'Consensus (PoW/PoS): all nodes agree on chain state — majority honest nodes protect against tampering'] },
  { unit: 3, marks: 8, question: 'Describe PoW, PoS, and PBFT consensus mechanisms. Compare energy efficiency.', keyPoints: ['PoW: miners solve computational puzzle (nonce) — first to solve adds block — high energy (entire countries)', 'PoS: validators stake crypto as collateral — selected probabilistically by stake — 99.9% less energy than PoW', 'PBFT: Practical BFT — used in Hyperledger Fabric — requires > 2/3 honest nodes — no mining, low latency', 'PoW: Bitcoin, Ethereum 1.0 — proven security, energy intensive', 'PoS: Ethereum 2.0, Cardano — validator economics replaces mining', 'Energy: PoW (100+ TWh/year) >> PoS (~0.01 TWh/year) > PBFT (very low)'] },
  { unit: 4, marks: 8, question: 'Explain Hyperledger Fabric: channels, world state, chaincode, and endorsement policy.', keyPoints: ['Hyperledger Fabric: permissioned enterprise blockchain — modular, pluggable consensus — no native cryptocurrency', 'Channels: private sub-networks for confidential transactions — only participating orgs see channel data', 'World state: CouchDB (JSON) or LevelDB (key-value) — stores current state of all assets', 'Chaincode: smart contracts in Go/Java/Node.js — deployed on channels — invoked by client apps', 'Endorsement policy: which peers must validate — e.g., AND(Org1.peer, Org2.peer) requires both signatures', 'Ordering service (Solo/Kafka/Raft): establishes transaction order — separate from peer nodes for scalability'] },
  { unit: 4, marks: 8, question: 'How does Hyperledger Fabric differ from public blockchains (Bitcoin, Ethereum)?', keyPoints: ['Permissioned vs Permissionless: Fabric = known/vetted orgs; Bitcoin/Ethereum = anyone can join anonymously', 'Native token: Fabric = none; Ethereum = Ether (ETH) for gas/fees/staking', 'Consensus: Fabric uses PBFT (Solo/Kafka/Raft) — fast, BFT; Ethereum uses PoW/PoS — energy intensive', 'Smart contracts: Fabric = chaincode (Go/Java/Node); Ethereum = Solidity/Vyper', 'Privacy: Fabric channels hide transactions; Ethereum all transactions public', 'Throughput: Fabric 1000s TPS via parallel validation; Ethereum PoW ~15-30 TPS'] },
  { unit: 5, marks: 8, question: 'What are DApps? Explain DApp architecture vs traditional centralized applications.', keyPoints: ['DApp: frontend UI (HTML/CSS/React) + blockchain backend (smart contracts) — no central server', 'Traditional app: client → backend server → database — single point of failure — data owned by company', 'DApp: frontend → Web3 library → smart contract on blockchain → distributed storage (IPFS)', 'Backend on blockchain: executed by all nodes — deterministic, tamper-resistant, auto-enforced by consensus', 'Large files: stored on IPFS, only content hash on-chain — reduces blockchain storage cost', 'Examples: Uniswap (DeFi exchange), OpenSea (NFT marketplace), Aave (lending)'] },
];

// ─── PART B SECTION ─────────────────────────────────────────────────────────
function PartBSection() {
  return (
    <div className="card" style={{ padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <FileText size={14} color="#f59e0b" />
        <h3 style={{ fontSize: 13, fontWeight: 600, color: '#fff', margin: 0, letterSpacing: '0.02em' }}>PART B — 8 MARK QUESTIONS</h3>
        <span className="mono" style={{ fontSize: 11, color: '#555', marginLeft: 4 }}>9 questions</span>
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

// ─── PART C 15-MARK QUESTIONS ───────────────────────────────────────────────
const PART_C = [
  { unit: 2, scenario: 'Fog Latency Numerical: A factory has 5000 IoT sensors, each generating 2KB data every second. Cloud processing adds 250ms round-trip latency. Fog node processes data locally adding 8ms. Calculate: (a) Total raw bandwidth to cloud (b) Bandwidth after fog at 100:1 compression (c) Latency saved per request.', probability: 85, color: '#06b6d4', solution: [{ step: 'Raw cloud bandwidth', value: '5000 × 2KB/s = 10,000 KB/s = 9.77 MB/s to cloud' }, { step: 'Fog compressed', value: '10,000 KB/s ÷ 100 = 100 KB/s after 100:1 aggregation' }, { step: 'Bandwidth saved', value: '9.77 MB/s - 0.1 MB/s = 9.67 MB/s ≈ 99% reduction' }, { step: 'Latency saved', value: '250ms - 8ms = 242ms saved (96.8% improvement)' }, { step: 'Cost impact', value: '99% bandwidth reduction = proportionally lower cloud egress costs' }] },
  { unit: 3, scenario: 'Blockchain Hash Chain: Block 1 data="Vote:Alice", hash="0000a3...". Block 2 data="Vote:Bob", prev_hash="0000a3...", hash="0001b7...". Attacker changes Block 3 data from "Vote:Bob" to "Vote:Eve". Show how hash linking makes tampering detectable.', probability: 75, color: '#f59e0b', solution: [{ step: 'Block 3 tampered', value: 'Data changes "Vote:Bob" → "Vote:Eve" — hash becomes completely different' }, { step: 'Hash mismatch', value: 'Original Block 3 hash = "0001b7..." — New hash = "x9q2..." (avalanche effect)' }, { step: 'Chain broken', value: 'Block 4\'s "prev_hash" (0001b7...) no longer matches tampered Block 3 hash' }, { step: 'Detection', value: 'All downstream blocks invalid — re-mining entire chain required (infeasible)' }, { step: 'Immutability proven', value: 'Tiny data change → completely different hash → chain breakage easily detected' }] },
  { unit: 5, scenario: 'DApp Design: Design a blockchain voting DApp. (a) User registers with verified identity — smart contract records eligibility. (b) User casts vote — smart contract enforces one-person-one-vote. (c) Vote stored immutably on blockchain. (d) Results auto-calculated. Analyze: Why blockchain more transparent than e-voting? Layer 2 recommendation for 1M voters?', probability: 70, color: '#10b981', solution: [{ step: 'One-person-one-vote', value: 'Smart contract maps verified ID hash → unique voter token. Vote checks: has token voted? Yes → rejected, No → vote recorded, token marked voted.' }, { step: 'Transparency', value: 'Every vote on public blockchain — anyone can verify count, cannot modify past votes, real-time tallying' }, { step: 'Layer 2 for scale', value: 'Polygon PoS or Arbitrum for 1M voters — batch off-chain, commit final counts to Ethereum mainnet' }, { step: 'IPFS storage', value: 'Voter documents on IPFS — only content hash on-chain — preserves privacy + integrity' }, { step: 'Governance token', value: 'Platform can issue governance token for future referendum participation' }] },
];

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
        {PART_C.map((q, i) => (
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

// ─── PROPS & EXPORTS ─────────────────────────────────────────────────────────
interface Props { onBack: () => void; }

export function CCBFMasterSheet({ onBack }: Props) {
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
              <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', letterSpacing: '-0.02em' }}>CCBF — Master Sheet</div>
            </div>
            <button onClick={() => navigate('/ccbf-analysis')} style={{ padding: '6px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: 'inherit', background: 'transparent', color: '#888', transition: 'all 0.15s' }}>Analysis</button>
          </div>
        </div>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(16px,4vw,48px) clamp(16px,4vw,48px) 80px' }}>
          <div style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.12) 0%, rgba(6,182,212,0.08) 100%)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 16, padding: '24px 28px', marginBottom: 32 }}>
            <div className="mono" style={{ fontSize: 10, color: '#7c3aed', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>21CCT301T — COMPLETE STUDY PACKAGE</div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: '#fff', margin: '0 0 8px', letterSpacing: '-0.02em' }}>CCBF Master Sheet</h2>
            <p style={{ fontSize: 13, color: '#888', margin: 0 }}>40 MCQs · 9 Part B 8-marks · 3 Part C 15-marks · 5 Units</p>
            <div style={{ display: 'flex', gap: 12, marginTop: 14, flexWrap: 'wrap' }}>
              {[{ n: '40', l: 'MCQs' }, { n: '9', l: '8-Marks' }, { n: '3', l: '15-Marks' }, { n: '75', l: 'Total' }].map(s => <div key={s.l} style={{ background: 'rgba(0,0,0,0.3)', borderRadius: 8, padding: '8px 14px', textAlign: 'center' }}><div className="mono" style={{ fontSize: 20, fontWeight: 700, color: '#7c3aed' }}>{s.n}</div><div style={{ fontSize: 10, color: '#555', textTransform: 'uppercase' }}>{s.l}</div></div>)}
            </div>
          </div>
          <MCQSection />
          <div style={{ height: 24 }} />
          <PartBSection />
          <div style={{ height: 24 }} />
          <PartCSection />
          <div style={{ height: 40 }} />
        </div>
      </div>
    </>
  );
}

export default CCBFMasterSheet;