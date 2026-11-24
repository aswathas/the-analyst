import type { SubjectSpec } from './types';

// 21CSE433T — Blockchain Business Models (Professional Elective)
// Exam pattern: Part A 20x1 | Part B 5x8 (answer any 5) | Part C 2x15 (answer any 1) = 75 marks
// Syllabus: CSE-CS-2021.pdf pages 390-391. First-time-offered elective — no end-sem paper exists.

export const BUSINESS_MODELS_21CSE433T: SubjectSpec = {
  code: '21CSE433T',
  title: 'Blockchain Business Models',
  shortTitle: 'Business Models',
  category: 'professional-elective',
  semester: 7,
  examDate: '2026-11-26',
  examSession: 'FN',
  accent: '#dc2626',
  hours: 45,
  credits: 3,
  oneLiner:
    'Crypto fundamentals to business models — SHA-256, every consensus mechanism, Merkle trees, token economies and BaaS.',
  pyqStatus: 'none-first-offered',
  pyqNote:
    'First-time-offered elective: no end-semester question paper has ever been published for 21CSE433T, so there is no previous paper to reverse-engineer from. This analysis is built from the official SRMIST unit-wise syllabus (CSE-CS-2021.pdf, pages 390-391) and the published 75-mark pattern (Part A 20x1, Part B 5x8 answer any 5, Part C 2x15 answer any 1). Every question below is an archetype written against the syllabus, not a question lifted from a real paper.',
  units: [
    {
      unit: 1,
      name: 'Introduction to Blockchain Technologies',
      hours: 9,
      topics: [
        {
          name: 'History of Blockchain',
          priority: 'should',
          minutes: 25,
          why: 'a 5-marker asking you to trace the path from centralised databases and double-spending through Bitcoin to permissioned enterprise ledgers, with named milestones per era.',
        },
        {
          name: 'Terminologies in Blockchain',
          priority: 'must',
          minutes: 30,
          why: 'a 15-marker defining block, nonce, difficulty, block time, chain, fork, node, wallet and address, and a 1-marker MCQ on any one term such as what a nonce does.',
        },
        {
          name: 'Types of Blockchain',
          priority: 'must',
          minutes: 30,
          why: 'a 5-marker comparing public, private, consortium and hybrid chains on permissioning, identity, consensus and governance, and a 1-marker MCQ naming which type fits a vetted supply-chain consortium.',
        },
        {
          name: 'Applications of Blockchain',
          priority: 'should',
          minutes: 20,
          why: 'a 5-marker asking you to place named domains — finance and payments, supply chain, healthcare records, identity, land registry — against the problem each one solves, rather than listing sectors.',
        },
        {
          name: 'How blockchain works',
          priority: 'must',
          minutes: 35,
          why: 'a 15-marker tracing a transaction from signing through broadcast, validation, block assembly, consensus and appending, and a 1-marker MCQ on what a tampered historical transaction forces the network to redo.',
        },
        {
          name: 'Ingredients of Blockchain',
          priority: 'must',
          minutes: 25,
          why: 'a 5-marker listing the ingredients — hash function, digital signature, distributed ledger, consensus mechanism, asymmetric key pairs, block/time stamp, mining — and a 1-marker MCQ on the role of the digital signature.',
        },
        {
          name: 'Case Study: Create a survey report of the various types of Blockchain and its real time use cases',
          priority: 'skip',
          minutes: 10,
          why: 'Assignment work, not written-paper material. The official syllabus lists this as a Case Study to submit as coursework; it carries no marks in the end-sem written paper, so cover it only after the written units are done.',
        },
      ],
    },
    {
      unit: 2,
      name: 'Cryptography',
      hours: 9,
      topics: [
        {
          name: 'Introduction to cryptography',
          priority: 'should',
          minutes: 20,
          why: 'a 5-marker setting out the goals — confidentiality, integrity, authentication, non-repudiation — and the three families of schemes that deliver them.',
        },
        {
          name: 'Encryption and Decryption',
          priority: 'must',
          minutes: 30,
          why: 'a 5-marker distinguishing plaintext, ciphertext, key, symmetric and asymmetric encryption, and the 1-marker MCQ on which key does which job.',
        },
        {
          name: 'Ciphers',
          priority: 'must',
          minutes: 30,
          why: 'a 5-marker separating block ciphers from stream ciphers with an example of each and where each is used, plus a 1-marker MCQ on AES.',
        },
        {
          name: 'Cryptography using arithmetic modulo primes',
          priority: 'must',
          minutes: 45,
          why: 'a 15-marker deriving modular exponentiation, Fermat\'s little theorem and Diffie-Hellman over a prime modulus, with a 1-marker MCQ that makes you compute a public value mod p.',
        },
        {
          name: 'Hashing algorithms',
          priority: 'must',
          minutes: 30,
          why: 'a 5-marker stating the properties that make a hash cryptographic — determinism, fixed length, one-wayness, avalanche, collision resistance — and a 1-marker MCQ on which property distinguishes a hash from a checksum.',
        },
        {
          name: 'SHA-256 algorithm',
          priority: 'must',
          minutes: 60,
          why: 'the heaviest topic in the course: an 8-marker asking you to work out how many 512-bit blocks a given message length occupies and to state the padding rule, plus a 1-marker MCQ with the SHA-256("abc") test vector.',
        },
        {
          name: 'Application of SHA algorithm',
          priority: 'must',
          minutes: 30,
          why: 'a 5-marker naming where SHA-256 is used inside blockchain — block identifiers, Merkle roots, proof of work, address derivation — and why hashing rather than signing is used for every block.',
        },
        {
          name: 'Case Study: Implement a program to convert given text into hashes using the SHA-256 algorithm',
          priority: 'skip',
          minutes: 10,
          why: 'Assignment work, not written-paper material. The official syllabus lists this as a Case Study to submit as coursework; it carries no marks in the end-sem written paper, so cover it only after the written units are done.',
        },
      ],
    },
    {
      unit: 3,
      name: 'Consensus Mechanisms',
      hours: 9,
      topics: [
        {
          name: 'Introduction to Consensus Methods',
          priority: 'should',
          minutes: 20,
          why: 'a 5-marker stating the distributed-systems problem a blockchain consensus must solve — agreement, termination and safety despite Byzantine or selfish participants — and what each mechanism spends to achieve it.',
        },
        {
          name: 'Proof of Work (PoW)',
          priority: 'must',
          minutes: 40,
          why: 'a 15-marker on the target/difficulty rule, the nonce search, the 51% attack and the cost of attacking, plus a 1-marker MCQ naming the attack that needs majority hash power.',
        },
        {
          name: 'Proof of Stake (PoS)',
          priority: 'must',
          minutes: 40,
          why: 'a 15-marker on validator selection by stake, slashing, the nothing-at-stake and long-range attack families and deterministic finality, plus a 1-marker MCQ on what happens to an equivocating validator.',
        },
        {
          name: 'Proof of Burn (PoB)',
          priority: 'must',
          minutes: 25,
          why: 'a 5-marker explaining that commitment is bought with destroyed tokens rather than burnt electricity or locked capital, and a 1-marker MCQ on what the participant actually does.',
        },
        {
          name: 'Proof of Activity (PoA)',
          priority: 'must',
          minutes: 25,
          why: 'a 5-marker on the PoW-plus-PoS hybrid, the stake-confirmation window and what happens when the stake is not confirmed, plus a 1-marker MCQ distinguishing it from pure PoW and pure PoS.',
        },
        {
          name: 'Proof of Elapsed Time (PoET)',
          priority: 'must',
          minutes: 25,
          why: 'a 5-marker on the permissioned, TEE-based, random-wait mechanism and its trust assumption, and a 1-marker MCQ identifying the mechanism by its trusted-execution-environment signature.',
        },
        {
          name: 'Simplified Byzantine Fault Tolerance',
          priority: 'must',
          minutes: 35,
          why: 'a 15-marker on the leader-based voting protocol, its request/prepare/commit rounds, deterministic finality and the 3f+1 fault bound, plus a 1-marker MCQ computing the node count needed to tolerate f faults.',
        },
        {
          name: 'Mining',
          priority: 'must',
          minutes: 30,
          why: 'a 5-marker on the double-SHA-256 nonce search, the block subsidy halving schedule and the transition to fee-funded security, plus a 1-marker MCQ that makes you compute the subsidy after n halvings.',
        },
        {
          name: 'Case Study: Prepare a comparison study report of the various consensus methods for financial transactions',
          priority: 'skip',
          minutes: 10,
          why: 'Assignment work, not written-paper material. The official syllabus lists this as a Case Study to submit as coursework; it carries no marks in the end-sem written paper, so cover it only after the written units are done.',
        },
      ],
    },
    {
      unit: 4,
      name: 'Data Structure of Blockchain',
      hours: 9,
      topics: [
        {
          name: 'Data structures for Blockchain',
          priority: 'must',
          minutes: 25,
          why: 'a 5-marker naming the chain of linked blocks, the transaction list, the Merkle tree and the header fields, and why a linked-list-of-hashes beats a flat table for tamper evidence.',
        },
        {
          name: 'Merkle Trees',
          priority: 'must',
          minutes: 45,
          why: 'a 15-marker building the tree level by level and proving inclusion of one transaction with sibling hashes, plus 1-marker MCQs that make you count the hash nodes and the proof length.',
        },
        {
          name: 'Shared data',
          priority: 'should',
          minutes: 20,
          why: 'a 5-marker distinguishing public shared data, permissioned shared data and private/off-chain data with only hashes on chain — the data-confidentiality pattern every enterprise project uses.',
        },
        {
          name: 'Protocols',
          priority: 'should',
          minutes: 20,
          why: 'a 5-marker separating the consensus protocol, the peer-to-peer gossip and broadcast protocol, and the application-facing protocol, and saying what each layer is responsible for.',
        },
        {
          name: 'Fat Protocols',
          priority: 'must',
          minutes: 25,
          why: 'a 5-marker on the thin-versus-fat protocol framing — where the rules live, in the consensus layer or in the application layer — and why smart contracts make protocols fat.',
        },
        {
          name: 'Platforms',
          priority: 'should',
          minutes: 15,
          why: 'a 5-marker placing the major permissioned and public platforms — Ethereum, Hyperledger Fabric, Corda, Quorum — by identity model, consensus and finality.',
        },
        {
          name: 'DAPPS',
          priority: 'should',
          minutes: 20,
          why: 'a 5-marker on the decentralised application anatomy — front end, wallet, node, contract, oracle — and how each piece maps onto the business-model types of Unit 5.',
        },
        {
          name: 'Smart Contracts',
          priority: 'must',
          minutes: 30,
          why: 'a 15-marker on deploy-and-execute semantics, immutability of code versus mutability of state, gas, events and access control, and a 1-marker MCQ on what makes a deployed contract different from a normal program.',
        },
        {
          name: 'Case Study: Create a simple smart contract for user identity management using Solidity',
          priority: 'skip',
          minutes: 10,
          why: 'Assignment work, not written-paper material. The official syllabus lists this as a Case Study to submit as coursework; it carries no marks in the end-sem written paper, so cover it only after the written units are done.',
        },
      ],
    },
    {
      unit: 5,
      name: 'Blockchain Business Models',
      hours: 9,
      topics: [
        {
          name: 'Introduction to Blockchain Business Models',
          priority: 'must',
          minutes: 25,
          why: 'a 5-marker framing a blockchain business model as who runs the network, who pays for it, where the value accrues and what is tokenised, plus a 1-marker MCQ naming the model behind a managed cloud chain.',
        },
        {
          name: 'Need for blockchain business models',
          priority: 'should',
          minutes: 20,
          why: 'a 5-marker justifying why a technical architecture needs an explicit revenue and incentive model, and what happens to a consortium when nobody pays for the shared ledger.',
        },
        {
          name: 'Traditional business models',
          priority: 'should',
          minutes: 25,
          why: 'a 5-marker contrasting subscription, licence, marketplace, freemium and professional-services models that a blockchain model is derived from, and where each breaks down.',
        },
        {
          name: 'Types of Blockchain Business Models',
          priority: 'must',
          minutes: 35,
          why: 'a 15-marker comparing the taxonomy — BaaS, marketplace, platform/infrastructure, software products, professional services and P2P — and a 1-marker MCQ identifying which model a named company is running.',
        },
        {
          name: 'Blockchain as a Service (BaaS)',
          priority: 'must',
          minutes: 35,
          why: 'a 15-marker on what a BaaS provider actually runs — nodes, consensus, key custody, monitoring, SLA — versus what the customer keeps, and a 1-marker MCQ on the BaaS definition.',
        },
        {
          name: 'Token Economy',
          priority: 'must',
          minutes: 40,
          why: 'a 15-marker on token classification (utility, security, commodity), supply and distribution, value accrual and the regulatory line between utility and investment, plus a 1-marker MCQ on where token value comes from.',
        },
        {
          name: 'Utility Token Business Model',
          priority: 'must',
          minutes: 30,
          why: 'a 5-marker on the demand loop where holding the token unlocks network utility, and why the model breaks if the utility is thin or the token pays no real costs.',
        },
        {
          name: 'Blockchain-Based Software Products',
          priority: 'should',
          minutes: 20,
          why: 'a 5-marker distinguishing selling software that happens to touch a chain from selling the chain itself — licence and subscription revenue without operating infrastructure.',
        },
        {
          name: 'P2P Blockchain Business Model',
          priority: 'should',
          minutes: 25,
          why: 'a 5-marker on participants transacting directly with each other over a shared ledger and how the coordinator earns from the network rather than from the transactions.',
        },
        {
          name: 'Blockchain Professional Services',
          priority: 'should',
          minutes: 20,
          why: 'a 5-marker on advisory, integration and managed-operations revenue and the common pitfall of selling hours instead of an outcome.',
        },
        {
          name: 'Blockchain for banking and financial transactions',
          priority: 'must',
          minutes: 40,
          why: 'a 15-marker on settlement, the principal-versus-payment problem, atomic delivery-versus-payment, KYC/AML and the real cost model for a bank\'s back office, plus a 1-marker MCQ on PvP risk.',
        },
        {
          name: 'Case Study: Create a simple wallet transaction from one account to another using MetaMask',
          priority: 'skip',
          minutes: 10,
          why: 'Assignment work, not written-paper material. The official syllabus lists this as a Case Study to submit as coursework; it carries no marks in the end-sem written paper, so cover it only after the written units are done.',
        },
      ],
    },
  ],
  blueprint: {
    partA: { count: 20, marksEach: 1 },
    partB: { count: 5, marksEach: 8, answerAny: 5 },
    partC: { count: 2, marksEach: 15, answerAny: 1 },
    total: 75,
  },
  safeCombo: [
    {
      unit: 2,
      topics: [
        'Encryption and Decryption',
        'Ciphers',
        'Cryptography using arithmetic modulo primes',
        'Hashing algorithms',
        'SHA-256 algorithm',
      ],
      marks: 18,
      claim: '5 topics from Unit 2 (Cryptography) alone clear 18 of 75 marks on the paper',
    },
    {
      unit: 3,
      topics: [
        'Proof of Work (PoW)',
        'Proof of Stake (PoS)',
        'Proof of Burn (PoB)',
        'Proof of Activity (PoA)',
        'Proof of Elapsed Time (PoET)',
      ],
      marks: 17,
      claim: 'the 5 consensus topics in Unit 3 add another 17 of 75 marks',
    },
    {
      unit: 4,
      topics: ['Data structures for Blockchain', 'Merkle Trees', 'Fat Protocols', 'Smart Contracts'],
      marks: 12,
      claim: 'Merkle trees, fat protocols and smart contracts in Unit 4 add 12 of 75 marks',
    },
    {
      unit: 5,
      topics: [
        'Types of Blockchain Business Models',
        'Blockchain as a Service (BaaS)',
        'Token Economy',
        'Utility Token Business Model',
      ],
      marks: 13,
      claim: 'business models, BaaS and the token economy in Unit 5 add 13 of 75 marks',
    },
    {
      unit: 1,
      topics: ['Types of Blockchain', 'How blockchain works', 'Ingredients of Blockchain'],
      marks: 8,
      claim: 'three Unit 1 fundamentals close the set for 8 of 75 marks',
    },
  ],
  mcqs: [
    // ---------------- Unit 1 — Introduction to Blockchain Technologies ----------------
    {
      id: 'bm-u1-m1',
      unit: 1,
      topic: 'Types of Blockchain',
      question:
        'A group of manufacturers forms a supply-chain consortium in which each member is vetted by a standards body, every participant\'s real identity is known to the network, and no outsider can read the shared ledger. Which type of blockchain is this?',
      options: [
        'A permissioned blockchain',
        'A public permissionless blockchain',
        'A hybrid blockchain with an open read layer',
        'A proof-of-stake public blockchain',
      ],
      correct: 0,
      explanation:
        'Permissioned (private/consortium) chains gate membership and read access by identity, which is what lets a vetted group of manufacturers share one ledger. A public chain has no membership control and open reads; a hybrid still exposes the transaction layer publicly.',
      source: 'archetype',
    },
    {
      id: 'bm-u1-m2',
      unit: 1,
      topic: 'How blockchain works',
      question:
        'An attacker edits one transaction inside block 100 of a proof-of-work chain. For the tampered chain to be accepted again by honest nodes, what must happen?',
      options: [
        'Only block 100 has to be re-mined, because later blocks store transaction payloads and not hashes',
        'Every block after 100 has to be re-mined, because each header commits to the hash of the previous block',
        'Only the Merkle root of block 100 changes, so all later blocks remain valid',
        'The tampered block must be re-signed by the network, but the block hashes themselves stay the same',
      ],
      correct: 1,
      explanation:
        'Each block header stores the previous block\'s hash, so changing block 100 changes the header of block 101, which changes block 101\'s own hash and so on down the chain — every later block must be re-mined. That chained dependency is exactly what makes the history tamper-evident.',
      source: 'archetype',
    },
    {
      id: 'bm-u1-m3',
      unit: 1,
      topic: 'Ingredients of Blockchain',
      question:
        'In a blockchain transaction, the digital signature is produced with the sender\'s key. What does that signature guarantee?',
      options: [
        'That only the sender could have authorised the spend, and any node can verify it against the sender\'s public key',
        'That anyone holding the sender\'s address can move the funds, which is why addresses are shared freely',
        'That the block miner approved the transaction and therefore vouches for it',
        'That the transaction contents stay confidential, because the signature encrypts the payload',
      ],
      correct: 0,
      explanation:
        'The signature is generated with the private key, so only its holder can authorise the spend, and it is checked with the public key that is already on the chain — this gives authentication, integrity and non-repudiation. It does not hide the payload, and miners do not vouch for transactions.',
      source: 'archetype',
    },

    // ---------------- Unit 2 — Cryptography ----------------
    {
      id: 'bm-u2-m1',
      unit: 2,
      topic: 'Ciphers',
      question: 'Which statement correctly describes a stream cipher?',
      options: [
        'It generates a keystream from the key and XORs it with the plaintext, so it works on arbitrary lengths without padding',
        'It encrypts fixed-size blocks independently, so identical plaintext blocks produce identical ciphertext blocks',
        'It uses a public key to encrypt and a matching private key to decrypt',
        'It is deliberately slow, so that brute-forcing the key is computationally infeasible',
      ],
      correct: 0,
      explanation:
        'A stream cipher (RC4, ChaCha20) encrypts byte by byte using a keystream, so no padding is needed; the second option describes a block cipher in ECB mode, which leaks patterns. Asymmetric ciphers use a key pair, and slowness is a property of key derivation, not of stream ciphers.',
      source: 'archetype',
    },
    {
      id: 'bm-u2-m2',
      unit: 2,
      topic: 'Cryptography using arithmetic modulo primes',
      question:
        'Two parties run Diffie-Hellman over a prime modulus p = 23 with generator g = 5. Party A holds private key a = 6 and publishes A = g^a mod p. What is A?',
      options: ['8', '19', '2', '12'],
      correct: 0,
      explanation:
        '5^2 = 25 ≡ 2 (mod 23) and 5^4 ≡ 4 (mod 23), so 5^6 = 5^4 · 5^2 ≡ 4 · 2 = 8 (mod 23). The other values come from the other party\'s public value (19) and from the shared secret (2), neither of which is A.',
      source: 'archetype',
    },
    {
      id: 'bm-u2-m3',
      unit: 2,
      topic: 'Hashing algorithms',
      question: 'Which property separates a cryptographic hash function such as SHA-256 from an ordinary checksum?',
      options: [
        'It is collision-resistant: finding two different inputs with the same digest is computationally infeasible',
        'Its digest is always longer than the message it hashes',
        'It can be decoded back to the plaintext using the publisher\'s public key',
        'It requires a secret key that both the sender and the receiver must keep',
      ],
      correct: 0,
      explanation:
        'Collision resistance plus pre-image resistance is what makes a hash cryptographic; an ordinary checksum is easily collided. A hash needs no key at all (option 4) and cannot be decoded (option 3), and its output length is fixed regardless of input length.',
      source: 'archetype',
    },
    {
      id: 'bm-u2-m4',
      unit: 2,
      topic: 'SHA-256 algorithm',
      question: 'What is the SHA-256 digest of the 3-byte string "abc"?',
      options: [
        'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad',
        'a9993e364706816aba3e25717850c26c9cd0d89d',
        '900150983cd24fb0d6963f7d28e17f72',
        'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      ],
      correct: 0,
      explanation:
        'This is the FIPS 180-4 test vector: "abc" pads to exactly one 512-bit block (0x616263, then 0x80, then 52 zero bytes, then the 64-bit length 24) and compresses to the digest above. Option 1 is the SHA-1 of "abc", option 2 its MD5, and option 3 the SHA-256 of the empty string.',
      source: 'archetype',
    },
    {
      id: 'bm-u2-m5',
      unit: 2,
      topic: 'SHA-256 algorithm',
      question:
        'A 56-byte message is fed to SHA-256. How many 512-bit compression blocks are processed?',
      options: ['1', '2', '3', '4'],
      correct: 1,
      explanation:
        'Padding appends a single 1-bit and then a 64-bit length field, so the padded length is 56 x 8 + 1 + 64 = 513 bits, which needs two 512-bit blocks. A 55-byte message would fit one block (440 + 1 + 64 = 505 bits), so 56 bytes is exactly the boundary case.',
      source: 'archetype',
    },

    // ---------------- Unit 3 — Consensus Mechanisms ----------------
    {
      id: 'bm-u3-m1',
      unit: 3,
      topic: 'Proof of Work (PoW)',
      question: 'Which single event lets an attacker in a proof-of-work chain rewrite recent history?',
      options: [
        'A 51% attack — the attacker controls more than half the network hash rate',
        'A Sybil attack — the attacker spins up many identities at no cost',
        'An eclipse attack — the attacker surrounds a target node with hostile peers',
        'A nothing-at-stake attack — the attacker signs conflicting blocks at no cost',
      ],
      correct: 0,
      explanation:
        'A 51% attack needs majority hash power, which is exactly what PoW is designed to make expensive. Sybil and eclipse attacks are identity and network-layer attacks, and nothing-at-stake is the attack against Proof of Stake, not PoW.',
      source: 'archetype',
    },
    {
      id: 'bm-u3-m2',
      unit: 3,
      topic: 'Proof of Stake (PoS)',
      question:
        'In a proof-of-stake chain, a validator is caught signing two conflicting blocks for the same slot. What does the protocol do?',
      options: [
        'It slashes the validator — a part of the stake is burned and the validator is ejected from the active set',
        'It rewards the validator with a larger block reward for supporting consensus',
        'It does nothing, because slashing rules are advisory and not enforced by the protocol',
        'It converts the validator to a full node and requires it to serve the chain for a fixed period',
      ],
      correct: 0,
      explanation:
        'Slashing is the economic answer to equivocation and the nothing-at-stake attack: misbehaviour costs the validator a share of its stake and removes it from the set. The other options describe rewards or non-existent penalties.',
      source: 'archetype',
    },
    {
      id: 'bm-u3-m3',
      unit: 3,
      topic: 'Proof of Burn (PoB)',
      question: 'In a proof-of-burn chain, what must a participant do to prove commitment to the network?',
      options: [
        'Permanently destroy tokens by sending them to an address that can never spend them',
        'Pay an increased transaction fee to the miner that includes its transaction',
        'Solve a computationally hard hash puzzle until the digest falls below the target',
        'Wait out a random period obtained from a trusted execution environment',
      ],
      correct: 0,
      explanation:
        'PoB buys commitment with burned capital — the coins are provably destroyed, so the commitment cannot be recycled. Option 2 is a fee market, option 3 is Proof of Work, and option 4 is Proof of Elapsed Time.',
      source: 'archetype',
    },
    {
      id: 'bm-u3-m4',
      unit: 3,
      topic: 'Proof of Elapsed Time (PoET)',
      question:
        'Which consensus mechanism is built on a random wait period plus a trusted execution environment such as Intel SGX?',
      options: [
        'Proof of Elapsed Time (PoET)',
        'Proof of Activity (PoA)',
        'Simplified Byzantine Fault Tolerance (SBFT)',
        'Proof of Burn (PoB)',
      ],
      correct: 0,
      explanation:
        'PoET (used by Nervos) has each candidate draw a random number from a TEE and the lowest value wins the round — energy-free but dependent on trusting the TEE vendor. PoA is a PoW-plus-PoS hybrid, SBFT is a voting protocol, and PoB burns coins.',
      source: 'archetype',
    },
    {
      id: 'bm-u3-m5',
      unit: 3,
      topic: 'Mining',
      question:
        'A proof-of-work chain halves the block subsidy every 210,000 blocks, starting from 50 coins. What is the subsidy after the fourth halving?',
      options: ['6.25', '3.125', '1.5625', '12.5'],
      correct: 1,
      explanation:
        '50 → 25 (1st) → 12.5 (2nd) → 6.25 (3rd) → 3.125 (4th), each halving dividing the subsidy by two. Option 1 is the third halving and option 3 is the fifth.',
      source: 'archetype',
    },

    // ---------------- Unit 4 — Data Structure of Blockchain ----------------
    {
      id: 'bm-u4-m1',
      unit: 4,
      topic: 'Merkle Trees',
      question:
        'A block contains 4 transactions, each of which is hashed to build a Merkle tree over them. How many hash values exist in the whole tree?',
      options: ['7', '4', '8', '6'],
      correct: 0,
      explanation:
        'Level 1 holds 4 leaf hashes, level 2 holds 2 hashes of pairs, and the root holds 1 — so 4 + 2 + 1 = 7 hash values (the general count for n leaves is 2n - 1). The Merkle root is the single hash that goes into the block header.',
      source: 'archetype',
    },
    {
      id: 'bm-u4-m2',
      unit: 4,
      topic: 'Fat Protocols',
      question:
        'In the "fat protocol" framing of blockchain, a thin protocol provides only consensus and message ordering. What does a fat protocol add?',
      options: [
        'Application logic embedded at the protocol layer, so the rules of the application are enforced by the chain itself',
        'The consensus algorithm moved into a hardware security module',
        'Removal of the need for digital signatures, because the network as a whole vouches for the data',
        'Storage of the full application state on every node instead of only the block headers',
      ],
      correct: 0,
      explanation:
        'A fat protocol pushes the application\'s rules down into the protocol — which is exactly what smart contracts are. The other options misdescribe it: the consensus algorithm stays in software, signatures remain essential, and nodes still store only what the protocol requires.',
      source: 'archetype',
    },
    {
      id: 'bm-u4-m3',
      unit: 4,
      topic: 'Smart Contracts',
      question: 'Which statement about a smart contract deployed on a public chain such as Ethereum is correct?',
      options: [
        'Its code, once deployed, cannot be modified, while the state it stores can change as its functions are called',
        'It is a legal agreement that the courts of the deploying country enforce',
        'It can be upgraded at any time by its creator without deploying a new contract',
        'It runs only when a node operator invokes it manually, not automatically on every transaction',
      ],
      correct: 0,
      explanation:
        'Deployment is immutable — the bytecode at the address is fixed — but the contract\'s storage changes every time its functions execute, which is how stateful contracts work. Legal enforceability is not automatic, and contracts execute automatically on transaction delivery.',
      source: 'archetype',
    },

    // ---------------- Unit 5 — Blockchain Business Models ----------------
    {
      id: 'bm-u5-m1',
      unit: 5,
      topic: 'Blockchain as a Service (BaaS)',
      question: 'Which description best captures Blockchain as a Service (BaaS)?',
      options: [
        'A managed offering in which a provider runs the chain, the nodes, the consensus and the key custody on the customer\'s behalf, usually on a subscription',
        'A model in which every participant must run a full node and validate every block themselves',
        'A peer-to-peer model in which participants exchange blocks directly with each other and pay no operator',
        'A token model in which services are bought with utility tokens held by the customer',
      ],
      correct: 0,
      explanation:
        'BaaS moves the running of the infrastructure to a provider who owns the nodes, consensus and keys, while the customer keeps the business logic and the data model. Option 2 describes a self-hosted permissionless chain, option 3 a P2P model, and option 4 a utility-token model.',
      source: 'archetype',
    },
    {
      id: 'bm-u5-m2',
      unit: 5,
      topic: 'Utility Token Business Model',
      question: 'In a utility token business model, where does the token\'s value primarily come from?',
      options: [
        'From the right to use the network\'s services, so demand for the utility creates demand for the token',
        'From a promise of future price appreciation paid to the holders',
        'From a legal claim on the profits of the issuer that will be paid out',
        'From a fixed redeemable value pegged to a fiat currency held in reserve',
      ],
      correct: 0,
      explanation:
        'A utility token earns its value from network use, not from an investment promise — that distinction is also the regulatory line between a utility token and a security. Option 4 describes a stablecoin, option 3 a security, and option 2 the thing utility-token rules are designed to avoid.',
      source: 'archetype',
    },
    {
      id: 'bm-u5-m3',
      unit: 5,
      topic: 'Types of Blockchain Business Models',
      question:
        'A vendor sells an annual licence for a treasury-management suite that connects to a customer\'s existing blockchain node. The vendor never operates a network. Which business model is this?',
      options: [
        'Blockchain-Based Software Products',
        'Blockchain as a Service (BaaS)',
        'P2P Blockchain Business Model',
        'Blockchain Professional Services',
      ],
      correct: 0,
      explanation:
        'Licensing software that touches a chain, without running the chain, is a software-product model — revenue from licence and subscription, not from operating infrastructure. BaaS means running the chain, P2P means a shared ledger operated by its participants, and professional services means selling advisory and integration effort.',
      source: 'archetype',
    },
    {
      id: 'bm-u5-m4',
      unit: 5,
      topic: 'Blockchain for banking and financial transactions',
      question:
        'In cross-border settlement between two banks, the "principal versus payment" (PvP) risk is that the payment leg fails while the securities leg has already settled. How does a shared ledger reduce it?',
      options: [
        'By making the two legs atomic — delivery versus payment settles together against one shared, agreed state',
        'By narrowing the foreign-exchange spread through a deeper order book',
        'By encrypting the payment messages so that the banks cannot read each other\'s amounts',
        'By removing the need for a central counterparty, since smart contracts settle by themselves',
      ],
      correct: 0,
      explanation:
        'Atomic DvP collapses the two legs into one transaction on one ledger, so neither side can be left holding value without receiving it. Encryption does not change settlement timing, a deeper order book does not change counterparty risk, and contracts still settle against counterparties and collateral.',
      source: 'archetype',
    },
  ],
  partB: [
    {
      id: 'bm-b1',
      unit: 1,
      marks: 8,
      question:
        'Explain how a blockchain works, from the moment a transaction is created to the moment its block is accepted into the chain, and state what makes this different from a conventional database.',
      modelAnswer: [
        'The transaction is created and digitally signed with the sender\'s private key; the signature proves origin and authorises spending the referenced output.',
        'It is broadcast to the peer-to-peer network, and every node validates it against its copy of the state: the inputs must exist and be unspent, and the value must balance.',
        'Valid transactions are assembled into a block whose header holds the Merkle root of its transactions, the previous block\'s hash, a timestamp, a nonce and the difficulty target.',
        'Nodes then run the same consensus mechanism to agree on one valid block; under Proof of Work the winner is the node whose double SHA-256 of the header falls below the target.',
        'The accepted block is appended to the chain. Because each header commits to the previous header hash, changing one historical transaction forces every later block to be re-mined — that is the tamper-evidence.',
        'Contrast with a database: there is no single owner or administrator who can delete or rewrite a row, every full node holds a replica, and truth is settled by consensus rather than by permissions.',
      ],
      keyPoints: [
        'transaction signing and broadcast',
        'node validation against state',
        'block header: Merkle root, previous hash, timestamp, nonce, target',
        'consensus decides the valid block',
        'chained hashes give tamper evidence',
        'no admin, replication, consensus over permissions',
      ],
    },
    {
      id: 'bm-b2',
      unit: 2,
      marks: 8,
      question:
        'Describe the SHA-256 algorithm: its padding rule, its block and round structure, and its applications inside a blockchain. Include a worked calculation.',
      modelAnswer: [
        'SHA-256 produces a fixed 256-bit (32-byte) digest for any input and is a Merkle-Damgard construction: a compression function iterated over 512-bit blocks.',
        'Padding rule: append a single 1-bit, then k zero bits, then the original message length as a 64-bit big-endian integer, so the padded length is a multiple of 512 bits. Worked: a 55-byte message fits one block (440 + 1 + 64 = 505 bits) but a 56-byte message needs two (448 + 1 + 64 = 513 bits).',
        'Each 512-bit block is split into sixteen 32-bit words and expanded by the message schedule into 64 words; the round function then runs 64 rounds over eight working variables (a to h), each round mixing a round constant, a schedule word and earlier words.',
        'The 64 round constants are the first 32 bits of the fractional parts of the cube roots of the first 64 primes, and the eight initial hash values are the square roots of the first eight primes.',
        'Worked check on the standard vector: "abc" = 0x616263, then 0x80, then 52 zero bytes, then the length 24 in 64 bits, giving exactly one block, whose digest is ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad.',
        'Applications: transaction and block identifiers, Merkle tree construction, proof of work (the double hash of the header must fall below the target), address derivation, and any tamper-evident commitment to data.',
      ],
      keyPoints: [
        'fixed 256-bit digest, Merkle-Damgard over 512-bit blocks',
        'padding: 1-bit, zeros, 64-bit length',
        'worked block count for 55 vs 56 byte messages',
        '64 rounds, 8 working variables, 64-word message schedule',
        'constants from cube roots, IV from square roots of primes',
        'applications: block ids, Merkle root, proof of work, addresses',
      ],
    },
    {
      id: 'bm-b3',
      unit: 2,
      marks: 8,
      question:
        'Explain cryptography using arithmetic modulo primes. Cover modular exponentiation, Fermat\'s little theorem and key exchange over a prime modulus, with a worked calculation, and say why blockchain uses these primitives.',
      modelAnswer: [
        'Modular arithmetic confines values to residue classes; with a prime modulus p every value a not divisible by p has a multiplicative inverse, and Fermat\'s little theorem gives a^(p-1) = 1 (mod p).',
        'The hardness assumption is the discrete logarithm: given p, g and B = g^b mod p, recovering b is computationally infeasible, and this is what Diffie-Hellman and ElGamal are built on.',
        'Worked Diffie-Hellman: p = 23, g = 5, a = 6, b = 15. A = 5^6 mod 23 = 8, since 5^2 = 2 and 5^4 = 4 (mod 23) so 5^6 = 8; B = 5^15 mod 23 = 19; the shared key is 19^6 mod 23 = 8^15 mod 23 = 2.',
        'RSA uses the same arithmetic: with n = pq, phi(n) = (p-1)(q-1), choose e coprime to phi(n) and d = e^-1 mod phi(n); then c = m^e mod n and m = c^d mod n.',
        'Hashing is the other modular-arithmetic workhorse: SHA-256 computes over residues modulo 2^32, so every addition is a modular addition and every right rotation is a rotation.',
        'In blockchain these primitives give transaction signing (ECDSA over a prime-order curve), address binding and integrity. Hashing is used instead of signing wherever possible because it is orders of magnitude cheaper, so consensus leans on SHA-256 rather than on a signature per block.',
      ],
      keyPoints: [
        'modular arithmetic and multiplicative inverses',
        'Fermat\'s little theorem a^(p-1) = 1 mod p',
        'discrete logarithm hardness assumption',
        'worked Diffie-Hellman: A = 8, B = 19, shared key = 2',
        'RSA: n, phi(n), e, d, c = m^e, m = c^d',
        'why blockchain uses hashing over signing for blocks',
      ],
    },
    {
      id: 'bm-b4',
      unit: 3,
      marks: 8,
      question:
        'Compare Proof of Work, Proof of Stake and Proof of Burn as consensus mechanisms for financial transactions, covering what is spent, the security assumption, energy and hardware cost, finality and the attack surface.',
      modelAnswer: [
        'Proof of Work buys the right to propose a block with computation: a miner hashes the header until the digest falls below the target set by the difficulty.',
        'Proof of Stake buys it with locked capital: the proposer is chosen pseudo-randomly weighted by stake, and misbehaviour is punished by slashing, so the attack threshold is a share of total stake (33% or 51% depending on the scheme).',
        'Proof of Burn buys commitment with destroyed tokens sent to an unspendable address, so the cost of attacking is spent capital rather than spent electricity.',
        'Security assumptions differ: PoW assumes nobody can assemble 51% of the world hash rate; PoS assumes nobody can control a third of the stake and that slashing is enforced; PoB assumes nobody can burn more than the defence.',
        'Energy and hardware: PoW consumes real electricity and needs ASICs, so entry costs are high and mining pools centralise; PoS and PoB consume almost no energy and need no special hardware, so entry is cheap but stake or burn becomes the barrier.',
        'Finality and fit for finance: PoW gives only probabilistic finality with slow block times, which is awkward for a settlement window; PoS can give deterministic finality and is cheap and fast; PoB is rarely deployed at scale, so a bank would normally choose a PoS variant or a permissioned mechanism instead.',
      ],
      keyPoints: [
        'PoW: computation, difficulty target, 51% hash-rate assumption',
        'PoS: locked stake, pseudo-random selection, slashing, 33%/51% stake thresholds',
        'PoB: tokens destroyed to an unspendable address',
        'energy, ASIC and entry-cost comparison',
        'probabilistic vs deterministic finality and block-time effects',
        'which mechanism suits a bank settlement rail and why',
      ],
    },
    {
      id: 'bm-b5',
      unit: 3,
      marks: 8,
      question:
        'Explain Proof of Activity, Proof of Elapsed Time and Simplified Byzantine Fault Tolerance, and explain where mining fits into this family of mechanisms.',
      modelAnswer: [
        'Proof of Activity is a hybrid: a miner first wins a Proof of Work puzzle and must also stake, and the block survives only if that stake is confirmed in the following blocks; otherwise the block is discarded and the next miner proceeds.',
        'Because PoA demands both hash power and stake, an attacker must pay for both, which closes the cheap attacks that hit pure PoW and pure PoS separately.',
        'Proof of Elapsed Time is designed for permissioned consortiums: each round has a fixed wait, the eligible node draws a random number from a trusted execution environment such as Intel SGX, and the lowest number wins — energy-free, but dependent on trusting the TEE vendor.',
        'Simplified Byzantine Fault Tolerance is a leader-based voting protocol used by Hyperledger Fabric: request, prepare and commit rounds let 3f+1 nodes tolerate f faulty nodes with immediate deterministic finality and no mining at all.',
        'Mining is the execution step of Proof of Work: miners repeat SHA-256(SHA-256(header)) over nonces until the digest is below the target implied by the difficulty, and the first to find it earns the block subsidy plus fees; the subsidy halves every 210,000 blocks (50, 25, 12.5, 6.25, 3.125), pushing security gradually towards transaction fees.',
        'The comparison that matters for financial transactions: SBFT and PoET suit a known set of banks because they give sub-second deterministic finality at no energy cost, while PoA keeps openness but inherits both PoW energy cost and stake locking.',
      ],
      keyPoints: [
        'PoA: PoW plus PoS, stake confirmation window, both costs to attack',
        'PoET: permissioned, TEE/SGX, random wait, no energy waste',
        'SBFT: leader-based request/prepare/commit, 3f+1, deterministic finality',
        'mining: double SHA-256 nonce search, subsidy halving schedule',
        'comparison table on finality, latency and trust assumptions',
        'which suits a banking consortium',
      ],
    },
  ],
  partC: [
    {
      id: 'bm-c1',
      unit: 3,
      marks: 15,
      question:
        'Evaluate the claim that "Proof of Stake is a drop-in replacement for Proof of Work for a bank\'s cross-border settlement network". Critically compare the two on security assumptions, attack economics, finality, energy cost and governance, then give a reasoned recommendation.',
      modelAnswer: [
        'Define the test: a drop-in replacement must keep the same threat model, the same finality guarantee and the same settlement latency, with no fork and no change to the trust base.',
        'Security assumptions differ in kind. PoW assumes an attacker cannot assemble 51% of the world hash rate at the prevailing ASIC and electricity cost; PoS assumes an attacker cannot control a third of the staked value and that the slashing rules are enforced by the honest majority of stake.',
        'Attack economics do not map one to one: rented hash power still costs the attacker external capital and electricity, whereas in PoS the capital sits inside the system and can be attacked with the classic nothing-at-stake and long-range attacks, which slashing, stake ageing and checkpointing are designed to blunt.',
        'Finality: PoW offers only probabilistic finality, with six confirmations giving high but never absolute confidence and a roughly ten-minute block time; PoS with checkpoints and slashing can give deterministic finality, which is what a legal-finality cut-off in a settlement window requires.',
        'Energy and cost: PoW spends real energy per block and imposes that cost on every participant; PoS spends almost none, so fees and confirmation latency fall — a direct gain for intraday remittance and a genuine cost advantage.',
        'Governance and migration: PoW has years of deployed, adversarially tested security and a mature mining industry, while PoS changes the rule set, needs a validator and custody ecosystem, and requires protocol upgrades and new governance — so it is a multi-year programme, not a switch.',
        'Critique: PoS genuinely dominates on energy and finality, but it does not remove trust, it relocates it from electricity and silicon to staked capital, validator software and the governance that writes the slashing rules, so the trust base changes and "drop-in replacement" is the wrong claim.',
        'Recommendation: do not migrate blind — pilot the settlement on a permissioned consortium chain using SBFT or PoET with a federated set of the participating banks for deterministic, low-latency finality, keep an externally auditable hash-chain or anchoring for regulators, and adopt public-chain PoS only once the slashing, custody and governance rules have been validated legally and operationally.',
      ],
      keyPoints: [
        'criteria for a drop-in replacement',
        'PoW 51% hash assumption vs PoS 33%/51% stake thresholds',
        'nothing-at-stake and long-range attacks and their mitigations',
        'probabilistic vs deterministic finality and legal finality',
        'energy cost and settlement latency',
        'governance, ecosystem and migration effort',
        'trust is relocated, not removed',
        'recommendation: permissioned pilot with federated validators',
      ],
    },
    {
      id: 'bm-c2',
      unit: 5,
      marks: 15,
      question:
        'A consortium of four banks wants to launch a cross-border remittance service for SME customers. Using the Unit 5 business-model taxonomy, design the business model: the model type and revenue, BaaS versus build, whether a token economy is needed, the consensus choice, the data structures, the identity smart contract, and the operational and governance model.',
      modelAnswer: [
        'Choose the model type and justify it: a P2P / platform model in which the consortium operates the shared settlement rail and the banks are participants, not a professional-services resale — the value comes from a shared rail used by all four banks, so the P2P Blockchain Business Model with a platform layer fits.',
        'BaaS versus build: adopt Blockchain as a Service for the ledger, nodes and key custody so the banks avoid running consensus themselves, while the consortium keeps the business rules, the data model and the customer relationship; the contract must fix exit, data residency and migration terms because BaaS creates vendor lock-in.',
        'Revenue model: charge the SME a transparent per-remittance fee plus a small FX spread, split among the banks, or run a shared subscription wallet from which the consortium takes a per-transaction fee — the fee must exceed on-chain compute plus custody plus the cost of the fiat leg, or the consortium runs at a loss.',
        'Token economy: issue no speculative token and no security token; at most a utility token that carries governance rights over chain upgrades or a unit of account for the fee ledger, kept non-interest-bearing, because a promise of returns would pull the scheme into securities regulation.',
        'Consensus: the participants are known, so use a permissioned mechanism — Simplified Byzantine Fault Tolerance for immediate deterministic finality with f faults tolerated in 3f+1 nodes, or PoET where a trusted execution environment is available; permissionless PoW or PoS would add Sybil exposure and a finality delay that a settlement rail cannot accept.',
        'Data structures: each block holds transactions and commits to them with a Merkle root in the header, so a light client proves inclusion with a Merkle proof of log2(n) sibling hashes; KYC documents and identity attributes stay off-chain or in a permissioned shared store, with only their hashes, consent and timestamps on the chain.',
        'Identity smart contract: implement the identity contract in Solidity as the Unit 4 case study asks — a mapping of identity hashes to attested attributes with role-based access control (only the KYC issuer may attest, the customer may revoke consent, auditors may read) and events emitted on every state change, so the rule is enforced by code rather than by trust in the operator.',
        'Operations, governance and justification: node admission and change control by consortium agreement, managed customer wallets with the bank as custodian, an audit trail for regulators, a data model per Unit 4 shared-data patterns, and a named exit plan; close by stating the risk that actually kills the business case — legal finality of the on-chain record, and the fact that the cash leg still runs over existing banking rails even with atomic delivery-versus-payment.',
      ],
      keyPoints: [
        'P2P / platform model chosen and justified',
        'BaaS for infrastructure, exit and lock-in terms',
        'revenue: per-transaction fee and FX spread vs operating cost',
        'no security token; utility/governance token only',
        'permissioned consensus: SBFT or PoET, 3f+1 fault bound',
        'Merkle roots, Merkle proofs, off-chain data with on-chain hashes',
        'Solidity identity contract with access control and events',
        'governance, custody, audit trail and the legal-finality risk',
      ],
    },
  ],
  ct: {
    mcqs: [
      {
        id: 'ct-bm-m1',
        unit: 1,
        topic: 'Types of Blockchain',
        question:
          'In which type of blockchain can anyone read and submit transactions, but where a participant must hold a granted identity to sign them?',
        options: [
          'Public blockchain',
          'Hybrid blockchain',
          'Private blockchain',
          'None of these',
        ],
        correct: 1,
        explanation:
          'A hybrid chain keeps the write path permissioned — participation requires a granted identity — while the transaction layer stays open to the public, which is how some enterprise networks are built. A pure public chain has no identity requirement and a pure private chain restricts reads too.',
        source: 'archetype',
      },
      {
        id: 'ct-bm-m2',
        unit: 1,
        topic: 'Terminologies in Blockchain',
        question: 'In blockchain terminology, what is a nonce used for?',
        options: [
          'A unique 32-bit serial number assigned to every transaction in the mempool',
          'A value varied during mining so that the block hash falls below the target difficulty',
          'The position of a block in the chain, used to order it',
          'The reward paid to the miner who produces the block',
        ],
        correct: 1,
        explanation:
          'The nonce is the field a miner varies while hashing the block header until the digest meets the target; that search is the proof of work. The other options describe a transaction identifier, the block height and the block reward.',
        source: 'archetype',
      },
      {
        id: 'ct-bm-m3',
        unit: 2,
        topic: 'SHA-256 algorithm',
        question: 'A 64-byte message is fed to SHA-256. How many 512-bit compression blocks are processed?',
        options: ['1', '2', '3', '4'],
        correct: 1,
        explanation:
        'The message is 512 bits; adding the 1-bit marker and the 64-bit length field gives 512 + 1 + 64 = 577 bits, which needs two blocks. This is the same boundary arithmetic as the 55-versus-56-byte case.',
        source: 'archetype',
      },
      {
        id: 'ct-bm-m4',
        unit: 2,
        topic: 'Ciphers',
        question: 'Which statement about the AES cipher is correct?',
        options: [
          'It is a symmetric block cipher operating on 128-bit blocks with 128, 192 or 256-bit keys, and decryption uses the inverse cipher',
          'It is a stream cipher that encrypts one bit at a time using a keystream',
          'It is an asymmetric cipher whose public key decrypts what the private key encrypted',
          'It guarantees message authenticity as well as confidentiality',
        ],
        correct: 0,
        explanation:
        'AES is a symmetric block cipher with an inverse cipher for decryption, so the same key is used both ways. Option 2 describes a stream cipher, option 3 an asymmetric scheme, and option 4 confuses encryption with a MAC.',
        source: 'archetype',
      },
      {
        id: 'ct-bm-m5',
        unit: 2,
        topic: 'Cryptography using arithmetic modulo primes',
        question: 'Using Fermat\'s little theorem, what is 7^(p-1) mod p when p = 11?',
        options: ['1', '7', '11', '0'],
        correct: 0,
      explanation:
        'Since 11 is prime and 7 is not a multiple of 11, Fermat\'s little theorem gives 7^10 = 1 (mod 11). The theorem needs the modulus to be prime and the base to be coprime to it, which is why key exchange uses a prime modulus.',
        source: 'archetype',
      },
      {
        id: 'ct-bm-m6',
        unit: 3,
        topic: 'Proof of Work (PoW)',
        question: 'What happens to the block rate when the difficulty of a proof-of-work chain is increased while hash rate stays constant?',
        options: [
          'Blocks arrive more slowly, and the network needs more hashes per block to keep the same security',
          'The block subsidy is halved immediately',
          'The chain reorganises to the longest chain',
          'A miner with more hash power is guaranteed to win every subsequent block',
        ],
        correct: 0,
      explanation:
        'Higher difficulty means a lower target, so more hashes are needed per block and blocks arrive more slowly; the expected time per block is held constant by the difficulty adjustment. It does not halve the subsidy, force a reorganisation, or guarantee any miner a win.',
        source: 'archetype',
      },
      {
        id: 'ct-bm-m7',
        unit: 3,
        topic: 'Simplified Byzantine Fault Tolerance',
        question:
        'In Simplified Byzantine Fault Tolerance, how many nodes are required in total to tolerate f faulty nodes?',
        options: ['f + 1', '2f + 1', '3f + 1', '2f'],
        correct: 2,
      explanation:
        'SBFT needs 3f+1 nodes to reach consensus with up to f Byzantine faults — for f = 1 that is 4 nodes. The 2f+1 figure belongs to the older Byzantine Generals formulation, and 2f+1 is not enough for the multi-round voting SBFT uses.',
        source: 'archetype',
      },
      {
        id: 'ct-bm-m8',
        unit: 3,
        topic: 'Proof of Activity (PoA)',
        question: 'In Proof of Activity, what must a miner do besides solve the proof-of-work puzzle?',
        options: [
          'Stake coins, and the block survives only if that stake is confirmed in the following blocks',
          'Obtain a random number from a trusted execution environment',
          'Collect votes from a majority of the nodes before the block counts',
          'Pay the transaction fee twice to show commitment',
        ],
        correct: 0,
      explanation:
        'PoA is a PoW-plus-PoS hybrid: the miner wins the hash puzzle and then has to have a stake that gets confirmed in the next blocks, or the block is discarded. The TEE option is PoET and the voting option describes SBFT.',
        source: 'archetype',
      },
      {
        id: 'ct-bm-m9',
        unit: 4,
        topic: 'Merkle Trees',
        question:
          'A block contains 8 transactions and a light client wants to prove that one of them is included. How many sibling hashes does the Merkle proof contain?',
        options: ['3', '7', '8', '1'],
        correct: 0,
      explanation:
        'The proof length is log2(n), so for 8 transactions it is 3 sibling hashes, which the client hashes together to recompute the Merkle root and compare it with the header. The value 7 is the total node count of the tree, not the proof size.',
        source: 'archetype',
      },
      {
        id: 'ct-bm-m10',
        unit: 5,
        topic: 'Token Economy',
        question: 'In the token economy, what distinguishes a utility token from a commodity token?',
        options: [
          'A utility token has no intrinsic value outside its network, while a commodity has value independent of any network',
          'A utility token is mined with proof of work, while a commodity is issued by a foundation',
          'A utility token is redeemable for a fixed quantity of fiat, while a commodity is not',
          'A utility token pays a dividend to holders, while a commodity does not',
        ],
        correct: 0,
      explanation:
        'Utility tokens are valued only by what the network lets you do with them; commodities such as gold have value outside any blockchain. Options 3 and 4 describe stablecoins and securities, which are different categories again.',
        source: 'archetype',
      },
    ],
    partB: [
      {
        id: 'ct-bm-b1',
        unit: 1,
        marks: 4,
        question:
          'Differentiate between public, private and consortium blockchains, giving one example of each.',
        modelAnswer: [
          'Public: anyone can read, write and participate; identity is pseudonymous; consensus is open (PoW or PoS); example Bitcoin.',
          'Private: one organisation controls membership, permissions and the ledger; consensus can be cheap; example a bank\'s internal trade-settlement ledger.',
          'Consortium: a group of known organisations shares the ledger under agreed rules and governance; example a trade-finance network run by a group of banks.',
          'The distinguishing axes are who can read, who can write, how identity is handled, who governs and what the consensus costs — a 1-marker on these axes scores the same as naming the three examples.',
        ],
        keyPoints: [
          'public: open read and write, pseudonymous identity',
          'private: single owner controls membership and permissions',
          'consortium: shared by a known group under joint governance',
          'distinguishing axes: read, write, identity, governance, consensus cost',
        ],
      },
      {
        id: 'ct-bm-b2',
        unit: 2,
        marks: 4,
        question:
          'Explain the difference between a block cipher and a stream cipher with one example of each, and state where each is used.',
        modelAnswer: [
          'A block cipher encrypts fixed-size blocks of plaintext independently under a shared secret key; the same key encrypts and decrypts; example AES, used in file and disk encryption and inside TLS.',
          'A stream cipher generates a keystream from the key and XORs it with the plaintext, so it handles any length without padding; example ChaCha20 or RC4, used where speed and streaming matter such as TLS and disk encryption.',
          'Because ECB-mode block ciphers leak identical-block patterns, modern usage chains them in CBC, CTR or GCM modes; GCM adds an authentication tag.',
          'Block ciphers suit fixed-size records and authenticated modes; stream ciphers suit continuous data and low-latency streaming.',
        ],
        keyPoints: [
          'block cipher: fixed-size blocks, shared key, example AES',
          'stream cipher: keystream XOR, no padding, example ChaCha20',
          'ECB leaks patterns; use CBC/CTR/GCM',
          'GCM adds authentication; choice depends on data shape',
        ],
      },
      {
        id: 'ct-bm-b3',
        unit: 3,
        marks: 4,
        question:
          'Explain how Proof of Stake works, what the nothing-at-stake attack is, and how slashing answers it.',
        modelAnswer: [
          'Validators lock capital (stake) as a bond; the right to propose the next block is given pseudo-randomly, weighted by stake, so holding more stake raises the chance of proposing and earning the block reward and fees.',
          'Nothing-at-stake: because signing a conflicting block costs the validator nothing in a naive design, an attacker can vote in several forks at once and have the fork it stakes on win without risking the stake.',
          'Slashing fixes this: evidence of equivocation or double-signing is provable on-chain, and the protocol burns a fraction of the stake and ejects the validator.',
          'Because the attack must then buy stake worth more than the protocol can confiscate, the cost of attacking rises with the value secured — the same economic guarantee PoW gets from electricity.',
        ],
        keyPoints: [
          'stake as a bond; proposer chosen weighted by stake',
          'attacker forks at no cost because signing is free',
          'equivocation is provable and slashable',
          'slashing raises the cost of attack to exceed the value at risk',
        ],
      },
      {
        id: 'ct-bm-b4',
        unit: 4,
        marks: 4,
        question:
          'Explain what a Merkle tree is, how it is built, and how a Merkle proof shows that a transaction is in a block.',
        modelAnswer: [
          'A Merkle tree is a binary hash tree whose leaves are the hashes of the transactions in a block and whose internal nodes are the hashes of their children.',
          'Build it by hashing each transaction, hashing pairs of those hashes into parents, and repeating until a single root hash is left; that root is stored in the block header.',
          'The root therefore commits to every transaction: change any transaction and the root changes, so a header that carries the root is a commitment to the whole transaction list.',
          'To prove inclusion, a light client is given the sibling hash at each of the log2(n) levels on the path from the leaf to the root; it recomputes the path hashes and checks that the result equals the root in the header — with no need for the full transaction list.',
        ],
        keyPoints: [
          'leaves are transaction hashes, internal nodes hash children',
          'single root stored in the block header',
          'root commits to the whole transaction set',
          'proof = sibling hashes up the path, verified against the root',
        ],
      },
      {
        id: 'ct-bm-b5',
        unit: 5,
        marks: 4,
        question:
          'Explain what Blockchain as a Service is, and how it differs from a Blockchain-Based Software Product and from Blockchain Professional Services.',
        modelAnswer: [
          'BaaS: a provider runs the infrastructure — nodes, consensus, key custody, monitoring, upgrades and SLA — and the customer buys the capability on a subscription.',
          'Blockchain-Based Software Products: the vendor sells a licence or subscription for software that reads from or writes to a chain, and never operates the chain itself; the customer runs the infrastructure or buys it separately.',
          'Blockchain Professional Services: the revenue comes from people — advisory, architecture, integration, training and managed operations — so the vendor sells expertise and time rather than a platform.',
          'The three differ in what is sold and what the vendor carries as risk: capacity and availability (BaaS), a product licence (software), or delivery capability (services).',
        ],
        keyPoints: [
          'BaaS sells operated infrastructure on subscription',
          'software product sells a licence, vendor runs no chain',
          'professional services sells advisory and integration effort',
          'difference is what is sold and who carries operational risk',
        ],
      },
    ],
    partC: [
      {
        id: 'ct-bm-c1',
        unit: 3,
        marks: 10,
        question:
          'Compare Proof of Work and Proof of Stake on energy use, security assumptions, finality and incentives, and state which you would recommend for a permissioned financial consortium of known banks.',
        modelAnswer: [
          'Energy and cost: PoW spends real electricity and requires ASIC hardware to propose a block; PoS spends almost no energy and needs only commodity servers, so its operating cost per transaction is negligible.',
          'Security assumption: PoW assumes nobody can assemble 51% of the global hash rate; PoS assumes nobody can control a third of the stake and that the slashing and governance rules are honestly enforced by the honest majority of stake.',
          'Incentives: PoW rewards early arrival with the block subsidy and fees, so rewards accrue to whoever hashes fastest; PoS rewards proportional stake and punishment (slashing) for equivocation, so the attack budget is denominated in the same asset the defender holds.',
          'Finality: PoW gives probabilistic finality with slow, difficulty-controlled block times; PoS with checkpoints and slashing can give deterministic finality in seconds, which matters when a settlement cut-off must be legally final.',
          'Weaknesses on each side: PoW is exposed to 51% attacks, pool centralisation and energy cost; PoS is exposed to nothing-at-stake, long-range and stake-concentration attacks plus the governance risk of a small set of validators.',
          'Recommendation: for a permissioned consortium of known banks, use neither public PoW nor public PoS — run a permissioned mechanism such as SBFT or PoET with a federated validator set of the banks, because membership is known, finality is deterministic and instant, and there is no energy cost or Sybil exposure.',
          'Caveat: that choice trades openness for a trusted membership roster, so the consortium must govern admission, rotation and dispute handling — and if public-chain anchoring is required for external auditability, add a hash-chain anchor over the permissioned ledger.',
        ],
        keyPoints: [
          'energy: PoW electricity and ASICs vs PoS negligible cost',
          'security assumption: 51% hash rate vs stake threshold plus slashing',
          'incentives: subsidy and fees vs stake-weighted rewards and penalties',
          'finality: probabilistic and slow vs deterministic and fast',
          'weakness on each side',
          'recommendation: permissioned SBFT/PoET with federated validators',
          'caveat: trusted membership needs governance and anchoring',
        ],
      },
      {
        id: 'ct-bm-c2',
        unit: 5,
        marks: 10,
        question:
          'A retail bank wants to launch a blockchain-based customer loyalty programme. Design the token economy and the business model you would propose, and justify each choice against the Unit 5 taxonomy.',
        modelAnswer: [
          'Business model type: a Blockchain-Based Software Products model on top of a permissioned BaaS chain — the bank owns the customer relationship and the loyalty rules, and buys the ledger as a managed service, so it carries no mining or node operations.',
          'Token design: issue a closed-loop utility token denominated in loyalty points, usable only for the bank\'s own catalogue — this keeps it outside securities treatment because it never promises a return on investment and never trades on an exchange.',
          'Avoid a security token and a fiat peg: a token that pays dividends or is marketed on expected appreciation is a security under most regimes, and a redeemable-for-fiat token is a stored-value instrument; if external investors must be allowed in, use a separate instrument and take the regulatory advice first.',
          'Supply and distribution: fixed or capped issuance issued on the customer\'s identity-verified account, with an emission schedule tied to programme revenue rather than to mining, so the token supply responds to business volume.',
          'Value accrual: demand for the token comes from redemption value in goods and from partner-merchant acceptance — this is the utility demand loop that makes the utility-token model work; without real redemption value the token becomes a worthless coupon.',
          'Ledger and data: a permissioned chain where the ledger holds points balances, issuance events and redemption events only, with identity and KYC data kept off-chain and referenced by hash, per the Unit 4 shared-data and Merkle-tree patterns.',
          'Economics and risks: the programme earns interchange and margin from partner sales, so the ledger is a cost centre — set the redemption burn rate so that the BaaS subscription and smart-contract execution stay a small share of customer value; the real bottleneck is partner onboarding, and a closed-loop token has no secondary demand so velocity must be engineered through expiry and promotions.',
          'Justification: name the taxonomy elements used — Blockchain-Based Software Products, BaaS, Utility Token Business Model and Token Economy — and note that no P2P model or professional-services revenue is needed because there is no multi-party marketplace.',
        ],
        keyPoints: [
          'model: software product on permissioned BaaS',
          'closed-loop utility token, no return promise',
          'avoid security-token classification',
          'capped issuance tied to revenue, distributed on verified identity',
          'utility demand loop through redemption and partners',
          'no fiat peg, to avoid stored-value regulation',
          'on-chain balances and events, off-chain identity',
          'economics: burn rate must cover ledger cost',
          'risks: partner onboarding, velocity, copying',
          'taxonomy mapping',
        ],
      },
    ],
  },
  resources: [
    {
      label: 'Official syllabus PDF — 21CSE433T Blockchain Business Models',
      url: 'https://srmrmp.edu.in/wp-content/uploads/2023/10/CSE-CS-2021.pdf',
      note: 'SRMIST B.Tech/M.Tech Integrated Programmes Regulations 2021, Volume 11 CSE Higher Semester Syllabi. Pages 390-391 carry 21CSE433T; all five units are reproduced there.',
    },
    {
      label: '"Blockchain for Business" (Addison-Wesley)',
      note: 'Core reference for Unit 5 business models and for Unit 1 enterprise framing.',
    },
    {
      label: 'Gerardus Blokdyk, "Blockchain Business Models: A Complete Guide" (Mar 2021)',
      note: 'Direct source for the Unit 5 taxonomy — BaaS, P2P, utility token, software product and professional-services models.',
    },
    {
      label: 'Ishan Roy, "Blockchain Development for Finance Projects" (Packt, Jan 2020)',
      note: 'Covers Unit 5 banking and financial-transaction models and Unit 3 permissioned consensus for financial networks.',
    },
    {
      label: 'Antonopoulos, "The Internet of Money" (May 2019)',
      note: 'Best short derivation of hashing, digital signatures, consensus, mining and why they combine the way they do (Units 1-3).',
    },
    {
      label: 'Elad Elrom, "The Blockchain Developer" (Apress, Jul 2019, ISBN 9781484248478)',
      note: 'Reference for Unit 4 Merkle trees, shared data and smart contracts, and for the Unit 4 identity-contract case study.',
    },
  ],
  pdf: {
    siteUrl: 'https://sem6-prep-for-me.vercel.app/master-pdfs/21CSE433T-Business-Models-Master-PDF.pdf',
    releaseUrl: 'https://github.com/aswathas/the-analyst/releases/download/sem7-master-pdfs/21CSE433T-Business-Models-Master-PDF.pdf',
    driveUrl: 'https://drive.google.com/file/d/1tXUVTKx_2wrB6cA0rjHQmU1bOYchfkJM/view',
    pages: 13,
  },
};
