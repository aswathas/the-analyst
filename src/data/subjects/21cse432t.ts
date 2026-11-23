import type { SubjectSpec } from './types';

/**
 * 21CSE432T — Blockchain Technology with Hyperledger
 * Professional Elective, SRMIST CSE-CS-2021 (syllabus pages 388-389).
 *
 * First-time-offered elective: there is no end-semester question paper to mine.
 * The question banks below are built from the official unit-wise syllabus and the
 * published 75-mark pattern (20 x 1 + 5 x 8 answer-any-5 + 2 x 15 answer-any-1).
 */
export const HYPERLEDGER_21CSE432T: SubjectSpec = {
  code: '21CSE432T',
  title: 'Blockchain Technology with Hyperledger',
  shortTitle: 'Hyperledger',
  category: 'professional-elective',
  semester: 7,
  examDate: '2026-12-01',
  examSession: 'FN',
  accent: '#0891b2',
  hours: 45,
  credits: 3,
  oneLiner:
    'How enterprises actually deploy Hyperledger Fabric — networks, CAP, business networks, chaincode and real use cases.',
  pyqStatus: 'none-first-offered',
  pyqNote:
    'First-time-offered elective: no end-semester paper exists for 21CSE432T, so this analysis is built from the official unit-wise syllabus (SRMIST CSE-CS-2021, pages 388-389) and the published 75-mark pattern (20 x 1, 5 x 8 answer-any-5, 2 x 15 answer-any-1). The five course learning outcomes — enterprise perspective, Fabric component design, business networks, ledger data structures and smart-contract development — map one-to-one onto the five units, so unit weight is taken from the syllabus order, not from a paper analysis.',
  units: [
    {
      unit: 1,
      name: 'Blockchain: An Enterprise and Industry Perspective',
      hours: 9,
      topics: [
        {
          name: 'Blockchain in the enterprise',
          priority: 'must',
          minutes: 30,
          why: 'A 15-marker asking you to argue why a business would move a shared record into a blockchain instead of a central database — the trigger is always multiple organisations, low mutual trust and a need for one agreed history.',
        },
        {
          name: 'Good fit applications',
          priority: 'must',
          minutes: 25,
          why: 'An 8-marker asking you to name two enterprise processes that are a good fit and two that are not, using the good-fit test: shared trust between organisations, multiple writers, and a need for a tamper-evident common history.',
        },
        {
          name: 'Enterprise blockchain business evaluation considerations',
          priority: 'should',
          minutes: 20,
          why: 'An 8-marker listing the criteria a business scores a blockchain project against — governance cost, data privacy, regulatory exposure, participant onboarding and whether a trusted central operator already exists.',
        },
        {
          name: 'Enterprise view blockchain',
          priority: 'should',
          minutes: 15,
          why: 'A 1-mark MCQ on what the enterprise actually sees: a permissioned network of known, certified organisations rather than an anonymous public chain.',
        },
        {
          name: 'Integrating a blockchain infrastructure for the whole enterprise',
          priority: 'should',
          minutes: 20,
          why: 'A 15-marker on where the ledger sits next to existing ERP and CRM systems, and what to keep on-chain versus off-chain with hashes on the ledger instead of the bulk data.',
        },
        {
          name: 'Enterprise design principles',
          priority: 'should',
          minutes: 20,
          why: 'An 8-marker asking you to list and then apply design principles — permissioned identities, privacy through channels and collections, minimal on-chain data, explicit governance.',
        },
        {
          name: 'Business considerations for choosing a blockchain framework',
          priority: 'must',
          minutes: 25,
          why: 'The core comparison question of the unit: a 15-marker contrasting a permissioned enterprise framework against a public permissionless chain on identity, privacy, throughput and governance.',
        },
        {
          name: 'Exploring Hyperledger Fabric',
          priority: 'must',
          minutes: 30,
          why: 'A 15-marker describing Fabric architecture — peers, channels, ordering service, MSP, world state — and arguing why it suits a multi-organisation enterprise consortium.',
        },
        {
          name: 'Building on the foundations of open computing',
          priority: 'should',
          minutes: 10,
          why: 'A 1-mark MCQ on why open, foundation-governed development matters to an enterprise buyer: no single vendor owns the ledger standard, so the consortium is not locked to one supplier.',
        },
        {
          name: 'Fundamentals of the Hyperledger project',
          priority: 'must',
          minutes: 25,
          why: 'A 5-marker distinguishing the Hyperledger umbrella project from the Fabric framework inside it, and placing sibling frameworks and tools such as Sawtooth, Iroha, Aries and Composer in the right bucket.',
        },
        {
          name: 'Hyperledger frameworks, tools, and building blocks',
          priority: 'should',
          minutes: 20,
          why: 'A 5- to 8-marker asking you to sort a list of names into framework (Fabric, Sawtooth, Iroha, Aries), tool (Composer, Grid) and building block (CA, MSP, chaincode, channels).',
        },
      ],
    },
    {
      unit: 2,
      name: 'Transactions and Business Networks',
      hours: 9,
      topics: [
        {
          name: 'Hyperledger Fabric component design',
          priority: 'must',
          minutes: 40,
          why: 'The biggest 15-marker in the paper: name and describe the ordering service, endorsing and committing peers, membership service (MSP), certificate authority, channels, world state and chaincode.',
        },
        {
          name: 'Hyperledger Fabric: the journey of a sample transaction',
          priority: 'must',
          minutes: 40,
          why: 'A 15-marker walking the proposal to endorsement to ordering to validation to commit flow, naming the actor that performs each step and what travels on the wire.',
        },
        {
          name: 'Actors and components in a Hyperledger Fabric network',
          priority: 'must',
          minutes: 35,
          why: 'An 8-marker pairing each actor — client, endorsing peer, ordering node, committing peer, CA — with the component it interacts with and the certificates it presents.',
        },
        {
          name: 'CAP theorem',
          priority: 'must',
          minutes: 20,
          why: 'An 8-marker applying CAP to Fabric: a partitioned network stops accepting writes instead of forking, so the system is CP — consistent and partition tolerant, at the cost of availability.',
        },
        {
          name: 'new features',
          priority: 'should',
          minutes: 15,
          why: 'A 5-marker on what modern Fabric adds over the original release — channels for privacy, private data collections, pluggable consensus and pluggable endorsement instead of baked-in choices.',
        },
        {
          name: 'Business Networks',
          priority: 'must',
          minutes: 25,
          why: 'The 15-marker that asks you to define a business network in Fabric and lay its participants, assets and transactions over the channel and chaincode structure.',
        },
        {
          name: 'A busy world of purposeful activity',
          priority: 'should',
          minutes: 10,
          why: 'Framing material: a 1-mark MCQ on the idea that a business network is an active marketplace of purposeful participants, not a passive database sitting still.',
        },
        {
          name: 'Language for business networks',
          priority: 'should',
          minutes: 15,
          why: 'A 5-marker asking you to explain the vocabulary of the model — business network, participant, asset, transaction — and to use it correctly about a Fabric solution.',
        },
        {
          name: 'Defining a business network',
          priority: 'must',
          minutes: 25,
          why: 'A 15-marker "define and diagram a business network for X" question: the definition, its participants, the assets they exchange and the transactions that move them.',
        },
        {
          name: 'Participants',
          priority: 'must',
          minutes: 15,
          why: 'A 5-marker distinguishing a participant organisation from its users, and how a participant is identified through an MSP and X.509 certificates.',
        },
        {
          name: 'Assets',
          priority: 'must',
          minutes: 15,
          why: 'A 5-marker asking what counts as an asset on a Fabric ledger — key-value pairs held in the world state — versus what must stay off-chain because it is bulky or confidential.',
        },
        {
          name: 'Transactions: Events',
          priority: 'must',
          minutes: 20,
          why: 'An 8-marker contrasting a transaction, a proposed change executed by chaincode that becomes part of a block, with an event, a notification emitted after commit for listeners outside the chaincode.',
        },
        {
          name: 'Business network technology',
          priority: 'should',
          minutes: 20,
          why: 'A 5-marker on the technology that realises a business network — channels, chaincode, endorsement policies and the MSP — mapped one-to-one onto the four elements of the model.',
        },
      ],
    },
    {
      unit: 3,
      name: 'Setting the Stage with a Business Scenario',
      hours: 9,
      topics: [
        {
          name: 'Trading and letters of credit',
          priority: 'should',
          minutes: 20,
          why: 'A 5-marker explaining what a letter of credit is — a bank promise to pay once it receives documents proving shipment of conforming goods — and why the paper process is slow and prone to fraud.',
        },
        {
          name: 'Business scenario and use case',
          priority: 'must',
          minutes: 25,
          why: 'A 15-marker "describe the business scenario and derive the use case" question: the actors, the pain in the current process, and the split between what goes on the ledger and what stays off it.',
        },
        {
          name: 'Designing and configuring a Hyperledger Fabric trade network',
          priority: 'must',
          minutes: 30,
          why: 'A 15-marker design question: name the organisations, channels, peers, ordering nodes, CAs, chaincode and endorsement policy needed for a trade network and say what each one is for.',
        },
        {
          name: 'Launching a sample trade network',
          priority: 'should',
          minutes: 20,
          why: 'An 8-marker on the operational sequence: start the network, create and join a channel, install and approve the chaincode, then invoke the trade contract.',
        },
        {
          name: 'Configuring our development environment for network operations',
          priority: 'should',
          minutes: 20,
          why: 'An 8-marker on the tooling — the peer and ordering-organisation configuration files, the chaincode lifecycle commands, and the sample-network scripts used to stand the network up.',
        },
      ],
    },
    {
      unit: 4,
      name: 'Designing Smart Contract Transactions and Ledger Data Structures',
      hours: 9,
      topics: [
        {
          name: 'Architecture of the trade solution',
          priority: 'must',
          minutes: 25,
          why: 'A 15-marker laying out the trade solution architecture: which contract holds the commercial agreement, which holds the asset state, and how they are invoked together on a channel.',
        },
        {
          name: 'Starting the contract development',
          priority: 'should',
          minutes: 20,
          why: 'A 5-marker on the scaffolding step — package the chaincode, install it, approve it for your organisation and commit the definition on the channel before writing a single function.',
        },
        {
          name: 'Creating a contract',
          priority: 'must',
          minutes: 25,
          why: 'An 8-marker on the contract skeleton: the transaction context, the state namespace and the create, read and update functions that make up a Fabric chaincode contract.',
        },
        {
          name: 'Access control',
          priority: 'must',
          minutes: 25,
          why: 'A 15-marker on who may call and who must endorse a transaction — attribute-based endorsement policies and channel ACLs evaluated against the endorser X.509 identities.',
        },
        {
          name: 'Implementing contract functions',
          priority: 'must',
          minutes: 35,
          why: 'The core coding 15-marker: implement a contract function with the shim API, deterministic reads and writes, validation of arguments and correct error handling.',
        },
        {
          name: 'Testing a contract',
          priority: 'should',
          minutes: 20,
          why: 'An 8-marker on unit-testing chaincode against the mock stub, and on what a meaningful negative test — input that must be rejected — looks like.',
        },
        {
          name: 'Advanced contract designs',
          priority: 'should',
          minutes: 25,
          why: 'A 15-marker on patterns beyond CRUD — cross-chaincode invocation, private data collections for confidential values, and events for notification.',
        },
        {
          name: 'Transaction mechanisms',
          priority: 'must',
          minutes: 30,
          why: 'A 15-marker on the commit path: read sets, write sets, version numbers, and the read-your-writes and write-your-reads rules that decide whether a transaction may commit.',
        },
        {
          name: 'Logging output',
          priority: 'should',
          minutes: 15,
          why: 'A 5-marker on chaincode output rules — data must be returned to the client through the shim, and cross-network listeners are notified through a Fabric event.',
        },
      ],
    },
    {
      unit: 5,
      name: 'Developing Smart Contracts and Use Cases',
      hours: 9,
      topics: [
        {
          name: 'Developing Smart Contracts',
          priority: 'must',
          minutes: 30,
          why: 'A 15-marker "develop a smart contract for this use case" question: model the asset, write the chaincode, choose the endorsement policy, test the negative cases and deploy.',
        },
        {
          name: 'Use case 1: Blockchain in trade/supply chain: provenance of goods, visibility, trade/supply chain finance, invoice management discounting',
          priority: 'skip',
          minutes: 20,
          why: 'Practical-only: this is the Unit-5 case study that the Practical Component "Building a Network and Deploying Smart Contract & Security" asks you to build, so the 75-mark written paper is unlikely to walk through it — study it only if you must submit the lab.',
        },
        {
          name: 'Use case 2: Blockchain for Government: digital identity, land records and other kinds of record keeping between government entities, public distribution system social welfare systems',
          priority: 'skip',
          minutes: 20,
          why: 'Practical-only: the second Unit-5 case study, assessed as part of the lab component rather than the written paper — revise only the general idea of multi-agency record keeping if time runs short.',
        },
        {
          name: 'Blockchain Cryptography, Privacy and Security on Blockchain',
          priority: 'must',
          minutes: 30,
          why: 'A 15-marker on what actually makes the ledger tamper-evident — block hashing, digital signatures and endorsement certificates — and why confidentiality still needs channels, private data and encryption rather than the ledger itself.',
        },
        {
          name: 'Building a Network and Deploying Smart Contract & Security',
          priority: 'skip',
          minutes: 15,
          why: 'Practical-only: this is the syllabus Practical Component line, assessed in the lab and not in the end-semester written paper, so it earns no written-paper minutes.',
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
        'Hyperledger Fabric component design',
        'Hyperledger Fabric: the journey of a sample transaction',
        'Actors and components in a Hyperledger Fabric network',
        'CAP theorem',
      ],
      marks: 30,
      claim:
        'Unit 2 alone clears 30 of 75: component design, the journey of a sample transaction, the actors and components, and CAP carry the architecture every 15-marker is built on.',
    },
    {
      unit: 4,
      topics: ['Access control', 'Implementing contract functions', 'Transaction mechanisms', 'Creating a contract'],
      marks: 25,
      claim:
        'Add Unit 4 smart-contract core for 25 of 75, taking you to 55: access control, implementing contract functions, transaction mechanisms and creating a contract.',
    },
    {
      unit: 1,
      topics: [
        'Business considerations for choosing a blockchain framework',
        'Exploring Hyperledger Fabric',
        'Good fit applications',
        'Fundamentals of the Hyperledger project',
      ],
      marks: 10,
      claim:
        'Add Unit 1 enterprise framing for 10 of 75, taking you to 65: choosing a blockchain framework, exploring Hyperledger Fabric, good fit applications and Hyperledger fundamentals.',
    },
    {
      unit: 5,
      topics: ['Developing Smart Contracts', 'Blockchain Cryptography, Privacy and Security on Blockchain'],
      marks: 5,
      claim:
        'Add the Unit 5 written-paper pair for the last 5 of 75, taking you to 70: developing smart contracts, and blockchain cryptography, privacy and security.',
    },
  ],
  mcqs: [
    {
      id: 'm1',
      unit: 1,
      topic: 'Fundamentals of the Hyperledger project',
      question:
        'Which statement best describes the Hyperledger project itself?',
      options: [
        'It is a single public blockchain, permissionless like Bitcoin, that any individual can join',
        'It is an umbrella project of enterprise-focused ledger frameworks and tools, hosted by the Linux Foundation, each with its own governance and roadmap',
        'It is a consortium of banks operating one shared public ledger with a single global throughput limit',
        'It is a fork of Ethereum that adds a higher block gas limit and faster finality',
      ],
      correct: 1,
      explanation:
        'Hyperledger is a Linux Foundation umbrella project, not a blockchain: Fabric, Sawtooth, Iroha, Aries and Cactus are separate frameworks under it, each independently governed. Bitcoin and Ethereum are single permissionless chains, and no bank consortium runs one shared global ledger.',
      source: 'archetype',
    },
    {
      id: 'm2',
      unit: 1,
      topic: 'Good fit applications',
      question:
        'A consortium of five suppliers needs one agreed, tamper-evident record of where a batch of goods came from. Which candidate is the classic good fit for blockchain?',
      options: [
        'The suppliers keep separate spreadsheets and email each other updates',
        'The suppliers share a single source of truth for provenance across organisational boundaries where no participant is fully trusted',
        'The consortium publishes its provenance database as a read-only PDF every quarter',
        'One large supplier keeps a proprietary database and the others request read-only access',
      ],
      correct: 1,
      explanation:
        'The good-fit test is: multiple organisations that do not fully trust each other, multiple writers, and a need for a shared common history. Options 1, 3 and 4 are solved by a central database or a document; only option 2 needs a shared trusted ledger.',
      source: 'archetype',
    },
    {
      id: 'm3',
      unit: 1,
      topic: 'Business considerations for choosing a blockchain framework',
      question:
        'A bank consortium needs shared KYC status that member banks can read but competitors outside the channel cannot. Which requirement most directly rules out a public permissionless chain such as Bitcoin?',
      options: [
        'The consortium needs a native cryptocurrency with a high market value to pay for transaction fees',
        'The consortium needs permissioned membership with known identities and private channels that restrict who can read and endorse',
        'The consortium needs transactions to be confirmed by a proof-of-work mining pool',
        'The consortium needs each participant to hold only pseudonymous wallet addresses',
      ],
      correct: 1,
      explanation:
        'Public chains give anonymity and open membership, so they cannot deliver confidential KYC inside a closed channel. Mining pools, pseudonymous wallets and a native coin are all properties of public chains, not requirements of the consortium use case.',
      source: 'archetype',
    },
    {
      id: 'm4',
      unit: 1,
      topic: 'Hyperledger frameworks, tools, and building blocks',
      question:
        'Which of these is a Hyperledger modelling tool rather than a ledger framework?',
      options: [
        'Hyperledger Fabric',
        'Hyperledger Composer',
        'Hyperledger Aries',
        'Hyperledger Sawtooth',
      ],
      correct: 1,
      explanation:
        'Composer was a high-level modelling tool and set of APIs for describing business networks; it has since been deprecated and archived. Fabric, Aries and Sawtooth are ledger frameworks, and Aries specifically targets decentralised identity and verifiable credentials.',
      source: 'archetype',
    },
    {
      id: 'm5',
      unit: 1,
      topic: 'Exploring Hyperledger Fabric',
      question:
        'In Hyperledger Fabric, participants are identified by X.509 certificates issued by a membership service provider. What does that give the network?',
      options: [
        'Transactions are anonymous, so a reader cannot tell which organisation submitted them',
        'A known member identity for every participant, so access and endorsement can be restricted per channel',
        'A proof-of-work mining requirement that secures each block against forgery',
        'Nakamoto-style finality where the longest chain always wins',
      ],
      correct: 1,
      explanation:
        'Fabric is permissioned: the MSP holds the CA roots and the identities behind every transaction, so peers can enforce endorsement policies and channel ACLs. Option 1 describes a public chain, and options 3 and 4 describe proof-of-work chains, not Fabric.',
      source: 'archetype',
    },
    {
      id: 'm6',
      unit: 2,
      topic: 'Hyperledger Fabric component design',
      question:
        'Which of the following is NOT a component of a Hyperledger Fabric network?',
      options: [
        'An ordering service with ordering nodes',
        'A membership service (MSP) with a certificate authority',
        'A proof-of-work mining pool competing to produce blocks',
        'Peers that act as endorsers and committers',
      ],
      correct: 2,
      explanation:
        'Fabric has no mining. Blocks are produced by ordering nodes running a BFT consensus, and certificates are issued by a CA under the MSP, so option 3 belongs to Bitcoin-style chains rather than Fabric.',
      source: 'archetype',
    },
    {
      id: 'm7',
      unit: 2,
      topic: 'Hyperledger Fabric: the journey of a sample transaction',
      question:
        'A client submits a transaction proposal to the network. Who responds, and what comes back?',
      options: [
        'The ordering nodes broadcast the proposal to every channel and return a signed block',
        'The endorsing peers simulate the chaincode against their own state and return signed endorsements to the client',
        'The committing peers execute the chaincode first and write the result to the world state',
        'The client signs the resulting block and submits it back to the endorsers for approval',
      ],
      correct: 1,
      explanation:
        'Endorsement is the only phase where chaincode is executed: each endorsing peer simulates it and returns a signed proposal response; the client then assembles those endorsements and submits the transaction to the ordering service. Committing peers validate and write state, they do not endorse.',
      source: 'archetype',
    },
    {
      id: 'm8',
      unit: 2,
      topic: 'CAP theorem',
      question:
        'Under the CAP reading used for enterprise ledgers, Fabric refuses to let a partitioned network produce two conflicting histories. Which CAP combination is Fabric?',
      options: [
        'CA — it stays consistent and available, so it must be fully connected to work',
        'AP — it always answers, even if that means two nodes disagree about the ledger',
        'CP — it prefers consistency and partition tolerance and gives up availability during a partition',
        'It is not a distributed system, so CAP does not apply to it',
      ],
      correct: 2,
      explanation:
        'During a partition Fabric stops accepting writes rather than forking the ledger, so consistency and partition tolerance are preserved at the cost of availability: it is CP. A system that keeps answering with split histories, as in option 2, is AP.',
      source: 'archetype',
    },
    {
      id: 'm9',
      unit: 2,
      topic: 'Actors and components in a Hyperledger Fabric network',
      question:
        'A transaction needs signatures from two of the three peer organisations before it can be ordered. What is enforcing this rule?',
      options: [
        'The endorsement policy attached to the chaincode definition on the channel',
        'The client, which is free to collect as many or as few signatures as it likes',
        'The ordering service, which checks the signature count before ordering the transaction',
        'The certificate authority, which refuses to issue certificates to a non-compliant organisation',
      ],
      correct: 0,
      explanation:
        'The chaincode endorsement policy names the peers or organisations whose signatures the ordering service requires before it will accept the transaction; without a matching endorsement the transaction is invalid and never reaches the ledger. The client cannot bypass the policy.',
      source: 'archetype',
    },
    {
      id: 'm10',
      unit: 3,
      topic: 'Trading and letters of credit',
      question:
        'In international trade, a letter of credit is:',
      options: [
        'An open-source licence that grants read access to the ledger data',
        'A bank undertaking to pay the exporter once it receives documents proving that conforming goods were shipped',
        'An insurance policy that covers the goods while they are in transit',
        'A consensus rule that decides which bank writes the next block',
      ],
      correct: 1,
      explanation:
        'A letter of credit is a bank promise conditional on presentation of shipping documents, which is why the trade process is document-heavy and slow. Options 3 and 4 are unrelated, and option 1 describes software licensing, not trade finance.',
      source: 'archetype',
    },
    {
      id: 'm11',
      unit: 3,
      topic: 'Business scenario and use case',
      question:
        'Which test best separates a genuine blockchain use case from a project that should stay on a central database?',
      options: [
        'Does the project need higher availability than the existing database provides?',
        'Do several organisations need to share one agreed, tamper-evident state without a trusted central operator?',
        'Does the project need queries to run faster than they do today?',
        'Does the project need the data to be encrypted at rest?',
      ],
      correct: 1,
      explanation:
        'Only option 1 involves the two things blockchain changes: trust between organisations and a shared agreed history. Availability, query speed and encryption at rest are all ordinary database problems that a permissioned ledger does not solve on its own.',
      source: 'archetype',
    },
    {
      id: 'm12',
      unit: 3,
      topic: 'Configuring our development environment for network operations',
      question:
        'Which sequence correctly installs and approves a chaincode definition on a Fabric channel?',
      options: [
        'peer lifecycle chaincode package, install, approveformyorg, commit',
        'peer chaincode deploy, peer chaincode instantiate, peer channel start',
        'peer chaincode install, peer channel join, peer chaincode deploy',
        'docker-compose up, then copy the chaincode into the ordering node container',
      ],
      correct: 0,
      explanation:
        'In Fabric v2 the lifecycle is split into discrete commands: package the chaincode, install it on the peers of your organisation, approve the definition for that organisation, and commit the definition on the channel once enough organisations approve. Options 2 and 3 use the deprecated v1 lifecycle, and option 4 confuses network startup with deployment.',
      source: 'archetype',
    },
    {
      id: 'm13',
      unit: 4,
      topic: 'Access control',
      question:
        'In Fabric, who decides whether a client may submit a transaction that invokes a chaincode function, and who decides which organisations must endorse it?',
      options: [
        'Both decisions are made by the endorsing peer at runtime, with no configuration involved',
        'Channel ACLs and the chaincode endorsement policy, evaluated against the certificate attributes carried by the client and the endorser identities',
        'The membership service provider decides, using the organisation membership lists only',
        'The ordering service decides, by inspecting the transaction payload before ordering it',
      ],
      correct: 1,
      explanation:
        'Access control is configuration, not runtime discretion: channel ACLs and endorsement policies reference certificate attributes such as role, organisational unit and organisation, and the MSP turns those attributes into identities. Endorsers apply the policy, they do not invent it.',
      source: 'archetype',
    },
    {
      id: 'm14',
      unit: 4,
      topic: 'Implementing contract functions',
      question:
        'A contract function must update a confidential value that only two of the five member organisations may read. What is the correct Fabric mechanism?',
      options: [
        'Encrypt the value with a key the client sends in the proposal, so only the client can decrypt it',
        'Use a private data collection with its own endorsement policy, and let the peers of the two permitted organisations gossip the value to each other',
        'Put the value on a separate channel that the other three organisations are not allowed to join',
        'Store the value in the world state under a key prefixed with private, so ordinary readers skip it',
      ],
      correct: 1,
      explanation:
        'Private data collections keep the value off the shared ledger: only the peers of the specified organisations hold it, gossiped among themselves, while the shared state records only a hash. A separate channel would also hide the value but requires separate membership and ordering infrastructure, and a key prefix offers no protection.',
      source: 'archetype',
    },
    {
      id: 'm15',
      unit: 4,
      topic: 'Transaction mechanisms',
      question:
        'Which node actually executes chaincode logic during endorsement, and what is checked at commit time?',
      options: [
        'The ordering nodes execute chaincode and write state; endorsers only sign the result',
        'Endorsing peers execute chaincode and return signed proposals, and committing peers re-check the read set and write set against the versioned world state before writing the block',
        'The client peers execute chaincode and submit the finished blocks to the ordering service',
        'Only the certificate authority executes chaincode, since it holds the organisational keys',
      ],
      correct: 1,
      explanation:
        'The ordering service never runs chaincode; it only orders. At commit, each committing peer validates the endorsements and re-checks that nothing in the read set changed since endorsement, which is what makes the transaction safe to write. The CA issues certificates and runs no contract code.',
      source: 'archetype',
    },
    {
      id: 'm16',
      unit: 4,
      topic: 'Advanced contract designs',
      question:
        'Chaincode A needs to invoke chaincode B. Which condition must hold?',
      options: [
        'A and B must live on the same channel, and the target must be installed on the same peer with permission to be invoked',
        'Any chaincode on any channel can invoke any other, because invocation happens inside the Fabric core',
        'A and B must be deployed on different channels so that the results stay independent',
        'B must be a system chaincode, since only system chaincode exposes an invocation interface',
      ],
      correct: 0,
      explanation:
        'Cross-chaincode invocation is a peer-level call: the target must be installed and approved on the same channel and the invoking identity must be permitted to call it, which is why cross-channel composition is not supported. Only system chaincode is invokable by any channel.',
      source: 'archetype',
    },
    {
      id: 'm17',
      unit: 5,
      topic: 'Developing Smart Contracts',
      question:
        'Where does the business logic of a smart contract live in Hyperledger Fabric?',
      options: [
        'In a JSON or JavaScript configuration file uploaded to the ordering service',
        'In chaincode — a packaged program implementing the transaction logic, deployed to the peers and run under an endorsement policy',
        'In the peer configuration file, which lists the functions each organisation is allowed to call',
        'In the channel genesis block, where the rules of the business network are encoded',
      ],
      correct: 1,
      explanation:
        'Chaincode is the Fabric smart contract model: the business rules are compiled into a package, installed on peers, and invoked there. Peer configuration and the genesis block carry configuration and channel membership, not business logic.',
      source: 'archetype',
    },
    {
      id: 'm18',
      unit: 5,
      topic: 'Developing Smart Contracts',
      question:
        'Why must chaincode avoid reading the wall clock, calling a random number generator, or calling an external API during execution?',
      options: [
        'Because those operations are not permitted by the Go compiler used for chaincode',
        'Because every endorsing peer must compute the same read set and write set, and the ordering and validation phase rejects endorsements that disagree',
        'Because they slow the transaction down and Fabric enforces a strict time limit per transaction',
        'Because the block interval is fixed at ten minutes and non-deterministic results would not fit into it',
      ],
      correct: 1,
      explanation:
        'Determinism is a consensus requirement: every endorser must reach the same result, otherwise the transaction cannot be validated and committed. Wall-clock time, randomness and external API calls are the classic sources of divergence, and the fix is to pass such values in as transaction arguments.',
      source: 'archetype',
    },
    {
      id: 'm19',
      unit: 5,
      topic: 'Blockchain Cryptography, Privacy and Security on Blockchain',
      question:
        'SHA-256 produces a 256-bit digest. Using the birthday-paradox estimate, how many hash evaluations are needed to find a collision with roughly 50% probability?',
      options: [
        'About 2^128, which is roughly 3.4 x 10^38 evaluations',
        'About 2^256, which is roughly 1.2 x 10^77 evaluations',
        'About 2^64, which is roughly 1.8 x 10^19 evaluations',
        'About 2^32, which is roughly 4.3 x 10^9 evaluations',
      ],
      correct: 0,
      explanation:
        'For an n-bit hash the collision effort is about 2^(n/2), so for n = 256 it is 2^128, approximately 3.4 x 10^38 evaluations. Preimage resistance still needs the full 2^256 work, which is why option 2 is the preimage figure, not the collision figure.',
      source: 'archetype',
    },
    {
      id: 'm20',
      unit: 5,
      topic: 'Blockchain Cryptography, Privacy and Security on Blockchain',
      question:
        'What does a Fabric ledger give you by default, and what does it not give you?',
      options: [
        'It gives integrity and non-repudiation; it does not give confidentiality, which must be added with channels, private data collections and encryption',
        'It gives confidentiality, because every transaction payload is encrypted before it reaches the ordering service',
        'It gives integrity and confidentiality automatically, but no audit trail',
        'It gives neither, because every peer can rewrite a committed block with the same hash',
      ],
      correct: 0,
      explanation:
        'A ledger is tamper-evident, not secret: hash linking, endorsements and certificates give integrity and non-repudiation, while privacy has to be engineered with channels, private data collections or application-level encryption. A committed block cannot be rewritten, because that would change its hash and break the chain.',
      source: 'archetype',
    },
  ],
  partB: [
    {
      id: 'b1',
      unit: 1,
      marks: 8,
      question:
        'A manufacturing company is evaluating blockchain for coordinating quality data with six tier-1 suppliers. Explain the business considerations for choosing a blockchain framework and the enterprise blockchain business evaluation considerations that should decide the outcome.',
      modelAnswer: [
        'Start from the good-fit test: multiple organisations (the manufacturer and six suppliers), multiple writers of shared quality data, and no party willing to be the trusted central operator — this is what makes a ledger worthwhile instead of a central database.',
        'Permissioning and identity: the consortium needs known, certified members and per-channel privacy for commercially sensitive quality data, which points to a permissioned framework such as Hyperledger Fabric rather than a public chain.',
        'Governance and onboarding: decide who writes the network configuration, how new members are admitted, who can change the chaincode endorsement policy, and what happens when a member leaves — this is the dominant cost of an enterprise blockchain.',
        'Regulatory and data-protection fit: a permissioned network can satisfy data-residency and privacy rules because access is restricted, but a ledger is permanent, so the design must keep personal data off-chain and hold only hashes and references.',
        'Integration, cost and openness: the quality data already lives in supplier portals and the manufacturer ERP, so only references and shared status go on-chain; compare the cost of running peers, ordering nodes and CAs against the coordination cost removed, and note that the open-source, foundation-governed route avoids a single vendor owning the ledger standard.',
        'Conclude with the framework choice and its conditions: a permissioned consortium framework, entered only if the governance, integration and legal checks pass.',
      ],
      keyPoints: [
        'Good-fit test: multiple organisations, multiple writers, shared history, no trusted central operator',
        'Permissioned identity and per-channel privacy beat a public chain',
        'Governance, onboarding and exit rules are the real cost drivers',
        'Ledger data is permanent, so personal data stays off-chain',
        'Co-existence with ERP and supplier portals is part of the evaluation',
        'Open-source governance avoids single-vendor lock-in',
      ],
    },
    {
      id: 'b2',
      unit: 2,
      marks: 8,
      question:
        'Explain the journey of a sample transaction in Hyperledger Fabric, naming the actors and components that take part in it, and state what each phase contributes to the ledger.',
      modelAnswer: [
        'The client submits a transaction proposal (the chaincode arguments and the identity of the caller) to an endorsing peer over the peer-to-peer gossip protocol.',
        'Endorsement: each endorsing peer simulates the chaincode against its own copy of the world state, verifies the read set, and returns a signed endorsement carrying the simulated read set and write set. Endorsement is the only phase where chaincode executes.',
        'The client collects the endorsements from the organisations required by the chaincode endorsement policy and assembles them into a transaction, then sends it to the ordering service, which reaches consensus among the ordering nodes (BFT in current Fabric) and cuts it into a block, preserving transaction order without executing any chaincode.',
        'Validation and commit: the block is broadcast to the committing peers, which re-execute the transaction read and write sets against the versioned world state to confirm that nothing changed since endorsement, and verify the endorsement policy and signatures.',
        'Notification and ledger structure: the committing peers update the world state and append the block to the ledger; each peer emits a chaincode event so that clients and external listeners can react. The ledger has two parts throughout: the blockchain, an append-only ordered chain of blocks, and the world state, the current value of every key.',
        'Note the CAP consequence: if ordering nodes are partitioned, the ordering service stops ordering rather than letting two conflicting orders exist, so the network favours consistency and partition tolerance over availability.',
      ],
      keyPoints: [
        'Proposal, endorsement, ordering, validation, commit',
        'Endorsers execute chaincode and return signed read and write sets',
        'The ordering service orders but never executes chaincode',
        'Committing peers re-check the read set against the versioned world state',
        'Block hash linking plus endorsement signatures give tamper-evidence',
        'Blockchain plus world state make up the ledger',
        'Partition handling stops writes instead of forking',
      ],
    },
    {
      id: 'b3',
      unit: 3,
      marks: 8,
      question:
        'A consortium of exporters, a freight forwarder and a customs authority wants to replace paper letters of credit. Using the syllabus business scenario, explain how you would design and configure a Hyperledger Fabric trade network for this use case.',
      modelAnswer: [
        'Business scenario and use case: today the letter of credit moves as paper documents between the applicant, the issuing bank, the advising bank, the forwarder and the customs authority, so every hand-off is slow, each party keeps its own record, and disputes need the original paper. The use case is a shared, tamper-evident record of the letter of credit and the shipment across all four parties.',
        'Participants and assets: the exporter, the freight forwarder and the customs authority, each admitted as a member organisation with its own MSP and CA, plus the issuing bank if it stays in the loop; their users act through the organisation peers. The letter of credit is the primary asset, with its state (issued, shipped, documents presented, paid), and the shipment and customs-clearance records are tied to it.',
        'Channels and privacy: one shared channel for the parties that need a common view of the trade, and a second private channel if the bank and the exporter alone must see the commercial terms, so each organisation sees only what it needs.',
        'Configuration: for each organisation define the peer configuration (including the ordering connection, gossip and MSP), the CA that issues its certificates, and the channel configuration that carries the endorsement policy for each chaincode.',
        'Chaincode and launching: a trade contract that creates and updates the letter-of-credit asset with the agreed rules, and an asset contract that records the goods and their shipment, with functions that enforce legal state transitions and permissions. Bring the network up with the sample-network tooling, create and join the channel, then run the chaincode lifecycle — package, install, approve for each organisation, and commit the definition on the channel.',
        'Development environment and test: configure the client, peers, ordering service and channel, then test the flow end to end by invoking the trade contract and querying the ledger for the updated asset.',
      ],
      keyPoints: [
        'Letters of credit are document-based, slow and dispute-prone',
        'Participants are organisations with their own MSP and CA',
        'Letter of credit and shipment are the assets, with an explicit state machine',
        'Channel layout decides who sees what; use a private channel for commercial terms',
        'Peer, ordering and channel configuration plus a CA per organisation',
        'Chaincode enforces the legal state transitions and permissions',
        'Lifecycle: package, install, approve per organisation, commit on the channel',
      ],
    },
    {
      id: 'b4',
      unit: 4,
      marks: 8,
      question:
        'Explain transaction mechanisms and access control in a Fabric smart contract: how a proposed transaction becomes a committed block, and how the network decides who may invoke and who must endorse it.',
      modelAnswer: [
        'Proposal: the client sends the transaction proposal to an endorsing peer; the peer simulates the chaincode function and produces the simulated read set and write set, but changes nothing yet.',
        'Endorsement and the policy: each endorsing peer signs its simulated result. The chaincode endorsement policy states which peers or organisations must endorse, and the transaction is valid only if the policy is satisfied — this is where access control over endorsement lives.',
        'Access control on invocation: channel ACLs, evaluated against the client certificate attributes such as role, organisational unit and organisation, decide whether the invoking identity is even allowed to invoke that chaincode function on that channel.',
        'Ordering and validation at commit: the client assembles the endorsements and submits the transaction to the ordering service, which orders it into a block without executing any chaincode; the committing peers then re-execute the read and write sets against the versioned world state, check that the versions read have not changed since endorsement, verify the endorsements and signatures, and only then update the world state and append the block.',
        'Read-your-writes and write-your-reads: a transaction that reads a key and writes it in the same transaction follows the write-your-reads rule, while a transaction that writes a key it has already read must satisfy read-your-writes, so that the committed result is the same for every peer.',
        'Confidentiality and result: values that only some organisations may read are placed in a private data collection with its own endorsement policy, where the shared ledger holds only a hash and the data is gossiped peer to peer among the permitted organisations. The client finally receives the ordered transaction status and can query the block for the status code and the payload the chaincode returned through the shim.',
      ],
      keyPoints: [
        'Proposal and endorsement produce the read set and write set',
        'Endorsement policy decides who must sign; channel ACLs decide who may invoke',
        'Ordering service orders without executing chaincode',
        'Commit-time validation re-checks versions, policy and signatures',
        'Read-your-writes and write-your-reads keep every peer in agreement',
        'Private data collections for confidential values, ledger keeps only a hash',
      ],
    },
    {
      id: 'b5',
      unit: 5,
      marks: 8,
      question:
        'Explain the cryptography, privacy and security that blockchain provides, and state clearly what blockchain does not provide for an enterprise.',
      modelAnswer: [
        'Hashing: each block header holds the hash of the previous block, a data hash over its transactions and a configuration hash; because the header is hashed, changing any earlier block changes every hash after it, which is what makes the ledger tamper-evident.',
        'Digital signatures and certificates: transactions are endorsed with the endorser private keys and every participant holds X.509 certificates from the MSP, so a transaction is attributable and cannot be forged or impersonated — this gives integrity and non-repudiation.',
        'Consensus and endorsement as security: the ordering service reaches BFT consensus among ordering nodes and the chaincode endorsement policy requires the agreed set of organisations to sign, so no single member can rewrite history or commit an unauthorised transaction.',
        'What blockchain does not provide, and how privacy is engineered: confidentiality. Every participant on a channel sees the same transactions, so the ledger gives integrity and auditability but no privacy by default; privacy must be built with separate channels for separate trust groups, private data collections for values shared only with named organisations, and application-level encryption for payloads that must stay secret even from the peers that hold them.',
        'Blockchain also does not remove the need for identity, governance, keys or validation: identity comes from the MSP and CA, authorisation from policies, key rotation and revocation remain operational responsibilities, and a well-implemented ledger faithfully records whatever the endorsers agree to, so contract validation and deterministic chaincode remain the real protection against fraudulent or malformed data.',
        'Privacy and security implication: keep personal and confidential data off-chain or in private data, use channels to bound who can read what, and treat the ledger as a shared, permanent audit record rather than a confidential database.',
      ],
      keyPoints: [
        'Hash linking of block headers makes history tamper-evident',
        'Endorser signatures and X.509 certificates give non-repudiation',
        'BFT ordering consensus plus endorsement policy prevent unilateral rewriting',
        'The ledger is not confidential: all channel members see all transactions',
        'Privacy via channels, private data collections and application encryption',
        'Identity, governance and key management still need to be solved',
        'Garbage in, garbage out: contract validation still matters',
      ],
    },
  ],
  partC: [
    {
      id: 'c1',
      unit: 2,
      marks: 15,
      question:
        'Critically evaluate the claim that Hyperledger Fabric is a CP system, and explain what that choice means in practice for a multi-organisation enterprise network during a network partition.',
      modelAnswer: [
        'Set up the CAP framing: under a partition a distributed system must choose between consistency, where every node agrees on the same history, and availability, where every request receives a response even if it might be stale or conflicting.',
        'State what Fabric does: the ordering service runs a BFT consensus among the ordering nodes; if it cannot reach consensus it stops ordering rather than issuing two different orders for the same transaction, and the ordering service becomes unavailable to new writes.',
        'Justify the CP label: because Fabric refuses to fork, it preserves a single consistent history through a partition — so it gives up availability. A transaction that cannot be ordered is rejected or left pending, and peers will not commit a history that conflicts with what they already hold.',
        'Note the counter-argument: in the Gaur and Desrosiers framing, Fabric as a permissioned consortium network is designed so that the member organisations are known and their infrastructure is operated by themselves, so the probability of a partition is lower than on a public network, and the cost of a stalled trade transaction is often lower than the cost of a forked ledger. A central database with a single primary also stops accepting writes during a partition to avoid split-brain, but it has no consensus layer and one operator carries the trust.',
        'Contrast with a public chain: Bitcoin and similar PoW chains stay available and simply extend whichever fork is longer, resolving the disagreement probabilistically; that is an AP choice and it tolerates partitions at the price of temporary inconsistency, which is acceptable when the participants do not trust each other anyway.',
        'Make the practical consequence explicit for an enterprise: during a partition the trade network goes read-only for new transactions — the ledger stays queryable and existing state is unaffected, but no new letter of credit can be issued or amended until the partition heals; the business must therefore tolerate latency in dispute handling rather than lose a consistent record.',
        'Assess the trade-off and conclude: the CP choice is right when a conflicting trade history would be worse than a delayed one, but the network inherits the availability limits of its ordering service, so resilience comes from running enough ordering nodes and from workflows where a stalled transaction can be retried. Fabric is CP and deliberately so; an enterprise must price that cost against the alternative — a fork that would have to be reconciled manually across independent institutions.',
      ],
      keyPoints: [
        'CAP: consistency versus availability under a partition',
        'Ordering service stops ordering instead of forking',
        'No split brain: one history, reduced availability',
        'Contrast with PoW chains that stay available and resolve by longest chain',
        'Enterprise expectation: known members and operated infrastructure lower partition risk',
        'Practical effect: network is read-only for new writes during a partition',
        'Mitigation: enough ordering nodes, retryable workflows',
        'Judgement: a stalled trade is cheaper than a forked ledger',
      ],
    },
    {
      id: 'c2',
      unit: 3,
      marks: 15,
      question:
        'A consortium of exporters, a freight forwarder and a customs authority wants to build a letters-of-credit network on Hyperledger Fabric, with an issuer bank joining only for the payment step. Design the network and the smart contract for this scenario.',
      modelAnswer: [
        'Business scenario: today the letter of credit is a paper instrument moving between applicant, issuing bank, advising bank, forwarder and customs, so each party holds a partial, unverifiable record and disputes turn on which document set is correct. The use case is a shared, tamper-evident record of the credit and the shipment across all parties.',
        'Participants and identities: exporter, freight forwarder and customs authority as full member organisations, plus the issuer bank as a member with restricted visibility. Each gets an MSP and a CA that issues its X.509 certificates, and each organisation runs its own peer so it keeps control of its own data.',
        'Channels: one shared trade channel carrying the common lifecycle of the letter of credit for exporter, forwarder and customs; a separate private channel between exporter and bank for the commercial terms and the payment instruction, so the forwarder and customs never see the pricing.',
        'Assets, state machine and chaincode: the letter of credit is the primary asset with an explicit state (requested, issued, shipped, documents presented, customs cleared, paid), plus a shipment asset carrying container, route and document references, and every function may move an asset only along legal edges of that machine. A trade contract creates the credit, records the shipment and the document set, and enforces that only the forwarder can mark shipped and only customs can mark cleared; an asset contract holds the shipment and inventory state.',
        'Access control and endorsement: channel ACLs restrict which roles may invoke which function, and the endorsement policy requires the forwarder and the exporter to endorse any shipment update, while the payment instruction must additionally carry the bank endorsement, with the bank alone able to invoke the pay function.',
        'Confidentiality and off-chain data: the commercial terms and the payment details go into a private data collection with its own endorsement policy so that only the exporter and the bank hold them, while the shared ledger records only a hash and the customs authority sees clearance status but not price. Bulk documents and invoice files stay in off-chain storage with their hashes and URIs on the ledger, so an auditor can prove the agreed version without the chain holding large binaries.',
        'Transaction flow: the exporter submits the credit request, the forwarder submits the shipment with the document references, the customs authority submits the clearance, and the bank submits the payment, each transaction carrying the endorsements the policy requires, then the ordering service orders it and the committing peers validate and append the block.',
        'Operational plan and deliverables: define the channel configuration, endorsement policies and the chaincode lifecycle steps to install and approve the contracts for every organisation, define how a new member is onboarded and how a member is removed, and plan for chaincode upgrades. Report the network topology and configuration, the business network diagram with participants, assets and transactions, the contract with its state machine and access rules, and a test showing the full credit lifecycle including a rejected illegal transition.',
      ],
      keyPoints: [
        'Scenario: paper credit, partial records, document disputes',
        'Each organisation is a member with its own MSP, CA and peers',
        'Shared trade channel plus private exporter-bank channel',
        'Letter of credit as an asset with an explicit legal state machine',
        'Two contracts: trade rules and asset state',
        'ACLs for invocation rights, endorsement policy for who must sign',
        'Private data collection for the confidential commercial terms, off-chain documents with on-chain hashes',
        'Transaction lifecycle, governance for onboarding and chaincode upgrades',
      ],
    },
  ],
  ct: {
    mcqs: [
      {
        id: 'cm1',
        unit: 1,
        topic: 'Blockchain in the enterprise',
        question:
          'Which of the following is the primary reason an enterprise moves a shared process onto a blockchain?',
        options: [
          'To obtain a faster database with lower query latency',
          'To let organisations that do not fully trust each other share one agreed, tamper-evident history',
          'To remove the need for identity management and access control',
          'To store large unstructured documents cheaply',
        ],
        correct: 1,
        explanation:
          'The driver is shared trust between organisations, not speed or storage. Identity management stays essential on a permissioned chain, and bulk documents belong off-chain with hashes on the ledger.',
        source: 'archetype',
      },
      {
        id: 'cm2',
        unit: 1,
        topic: 'Enterprise design principles',
        question:
          'Which is a sound enterprise blockchain design principle?',
        options: [
          'Store every enterprise record on-chain so the ledger is the single source of truth',
          'Keep the on-chain data minimal and hold confidential or bulky data off-chain with references on the ledger',
          'Give every peer read access to every channel so information flows freely',
          'Make the endorsement policy as loose as possible so transactions are never rejected',
        ],
        correct: 1,
        explanation:
          'Minimal on-chain data keeps the ledger auditable without becoming a costly, permanent data store, and channel-scoped access plus tight endorsement policies are what make the network usable by independent institutions.',
        source: 'archetype',
      },
      {
        id: 'cm3',
        unit: 2,
        topic: 'Hyperledger Fabric component design',
        question:
          'In a Fabric network, which component issues the certificates that establish participant identities?',
        options: [
          'The certificate authority (CA) operating under the membership service provider (MSP)',
          'The ordering service, when it validates a transaction',
          'The endorsing peer, at the moment it signs an endorsement',
          'The client application, using a self-signed certificate',
        ],
        correct: 0,
        explanation:
          'The CA issues the X.509 certificates; the MSP defines the identity rules and trust roots that the network enforces. Ordering nodes and endorsers only consume identities, they never issue them.',
        source: 'archetype',
      },
      {
        id: 'cm4',
        unit: 2,
        topic: 'Business Networks',
        question:
          'Which statement about a business network in Fabric is correct?',
        options: [
          'A business network is the same thing as a channel',
          'A business network is an active community of participants exchanging assets through transactions, realised on the technology of channels and chaincode',
          'A business network contains only smart contracts and no organisations',
          'A business network can only contain organisations from the same industry',
        ],
        correct: 1,
        explanation:
          'The business network is the model of who, what and what happens; the channel and the chaincode are the technology that realises it. A channel is one isolation mechanism inside the network, not the network itself.',
        source: 'archetype',
      },
      {
        id: 'cm5',
        unit: 3,
        topic: 'Business scenario and use case',
        question:
          'A business scenario differs from a use case in that:',
        options: [
          'The scenario is the current messy process and the pain it causes, while the use case is what the proposed system must let the participants do',
          'The scenario is technical and the use case is business',
          'The scenario lists the participants and the use case lists the hardware',
          'They are two names for the same thing',
        ],
        correct: 0,
        explanation:
          'The scenario describes the business problem and its actors; the use case describes the capability the solution delivers. This split is what lets you map scenario steps onto on-chain transactions and off-chain data.',
        source: 'archetype',
      },
      {
        id: 'cm6',
        unit: 3,
        topic: 'Launching a sample trade network',
        question:
          'After the Fabric network is running and the channel is created, what must happen before a client can invoke a chaincode function?',
        options: [
          'The chaincode must be installed on the peers, approved by the required organisations and committed on the channel',
          'The chaincode must be deployed and instantiated, then the ordering service restarts',
          'The peers must be rebooted so that they reload the channel configuration',
          'The client must mine the first block of the channel',
        ],
        correct: 0,
        explanation:
          'In the Fabric v2 lifecycle the definition is packaged, installed on the peers, approved by each organisation and only then committed on the channel; until the commit the definition is not active. There is no mining in Fabric.',
        source: 'archetype',
      },
      {
        id: 'cm7',
        unit: 4,
        topic: 'Creating a contract',
        question:
          'In a Fabric chaincode contract, where does the state written by a function live?',
        options: [
          'In a key-value namespace in the world state, created and updated through the transaction context',
          'In a local file inside the peer container that is shared by all peers',
          'In the chaincode package itself',
          'In the block payload, where every peer keeps a private copy',
        ],
        correct: 0,
        explanation:
          'Chaincode writes key-value pairs into a namespace in the world state, and the block payload holds the hashed versions that make the write auditable. Chaincode packages are read-only and local files are not shared state.',
        source: 'archetype',
      },
      {
        id: 'cm8',
        unit: 4,
        topic: 'Testing a contract',
        question:
          'Why unit-test chaincode against the mock stub rather than only on a running network?',
        options: [
          'Because the mock stub executes the chaincode faster than a real peer and lets you test invalid input deterministically',
          'Because chaincode cannot be executed on a running network',
          'Because the network test only checks that the transaction is accepted, never that the state is correct',
          'Because mock stubs are the only way to check the endorsement policy',
        ],
        correct: 0,
        explanation:
          'The mock stub lets you assert on both the returned payload and the resulting key-value writes, including rejected inputs, with no network setup. A network test still matters for the policy and endorsement path, which the stub does not cover.',
        source: 'archetype',
      },
      {
        id: 'cm9',
        unit: 5,
        topic: 'Blockchain Cryptography, Privacy and Security on Blockchain',
        question:
          'What is the practical effect of chaining each block header to the previous block hash?',
        options: [
          'It compresses the ledger so it stores more transactions',
          'Any change to an earlier block changes every later block hash, so tampering is detectable and cannot be hidden',
          'It makes the transactions confidential to other participants',
          'It guarantees that no two participants ever write conflicting data',
        ],
        correct: 1,
        explanation:
          'Hash linking gives tamper-evidence, not compression and not confidentiality. It also does not prevent two parties writing conflicting transactions — that is settled by consensus and endorsement, not by hashing.',
        source: 'archetype',
      },
      {
        id: 'cm10',
        unit: 5,
        topic: 'Developing Smart Contracts',
        question:
          'A contract function must compute a running total of every invoice seen so far. Which design satisfies Fabric determinism rules?',
        options: [
          'Read the current total from the world state, add the new invoice and write the updated total back',
          'Keep the running total in a global variable inside the chaincode process',
          'Re-scan all previous blocks at invocation time and sum them',
          'Ask a peer for the total over the gossip protocol and trust the reply',
        ],
        correct: 0,
        explanation:
          'Reading and writing the total through the world state is deterministic because every endorsing peer sees the same starting value. Global variables are per-process and differ between peers, and block scans or gossip replies are not guaranteed to give the same answer everywhere.',
        source: 'archetype',
      },
    ],
    partB: [
      {
        id: 'cb1',
        unit: 1,
        marks: 4,
        question: 'Distinguish between a public permissionless blockchain and a permissioned enterprise blockchain, and give two enterprise reasons for preferring the permissioned model.',
        modelAnswer: [
          'Public permissionless: anyone can join, read and submit, identities are pseudonymous, and consensus is reached by proof of work or stake with a shared economic incentive.',
          'Permissioned enterprise: membership is admission-based and certified, identities are known through an MSP, and consensus and endorsement policies are configured by the member organisations.',
          'Reason 1: privacy and confidentiality — channels and private data collections keep commercial data visible only to the parties that need it, which a public chain cannot offer.',
          'Reason 2: governance and performance — no token economics, no mining, pluggable BFT consensus, and the member organisations control the endorsement rules and the upgrade path.',
        ],
        keyPoints: [
          'Public: open membership, pseudonymous, economic incentive consensus',
          'Permissioned: admitted members, certified identities, configured policies',
          'Privacy via channels and private data',
          'Governance and predictable performance without mining or tokens',
        ],
      },
      {
        id: 'cb2',
        unit: 2,
        marks: 4,
        question: 'Explain the roles of the ordering service and the membership service provider in a Fabric network.',
        modelAnswer: [
          'The ordering service runs consensus among the ordering nodes, cuts the endorsed transactions into blocks and broadcasts them, without executing any chaincode.',
          'The ordering service is what guarantees a single agreed order of transactions, and it stops ordering rather than forking if it cannot reach consensus.',
          'The MSP defines the identity rules of the network, holds the trust roots and maps the roles and organisational units carried in the certificates.',
          'The MSP is what lets endorsement policies and channel ACLs say "an exporter in the ABC organisation may do this", and it is the source of the CA that issues certificates.',
        ],
        keyPoints: [
          'Ordering service: consensus, block formation, broadcast, no chaincode execution',
          'Stops ordering rather than forking',
          'MSP: identity rules, roles, organisational units, trust roots',
          'MSP enables policy expressions and issues certificates through the CA',
        ],
      },
      {
        id: 'cb3',
        unit: 3,
        marks: 4,
        question: 'Outline the steps to launch a sample Hyperledger Fabric trade network and confirm it is working.',
        modelAnswer: [
          'Create the network configuration for each organisation: peer configuration, ordering organisation configuration, channel configuration with its endorsement policy, and the connection profiles.',
          'Bring the network up with the sample-network tooling and check that the ordering service and the peers of every organisation are running.',
          'Create the channel, then have the peers of each member organisation join it.',
          'Run the chaincode lifecycle: package, install on the peers, approve the definition for each organisation, and commit on the channel.',
          'Invoke the contract with a client and query the block and the world state to confirm the asset was created and updated as expected.',
        ],
        keyPoints: [
          'Configuration per organisation and channel',
          'Start the network and check the nodes are running',
          'Create and join the channel',
          'Package, install, approve, commit the chaincode',
          'Invoke and verify the resulting state',
        ],
      },
      {
        id: 'cb4',
        unit: 4,
        marks: 4,
        question: 'Explain how a Fabric transaction is validated at commit time and why the read and write sets matter.',
        modelAnswer: [
          'The committing peers receive the ordered block and, for each transaction, re-execute the simulated read set and write set against the versioned world state.',
          'The read set records every key the transaction read and the version it read; the write set records every key the transaction will update.',
          'If any key read has changed version since the endorsement phase, the transaction is invalid and the block is not committed — this is what stops a stale endorsement from corrupting the state.',
          'The peer also verifies that the endorsements satisfy the chaincode endorsement policy and that the signatures are valid, and only then updates the world state and appends the block to the ledger.',
        ],
        keyPoints: [
          'Committing peers re-execute read and write sets against versioned state',
          'Read set captures keys and versions read; write set captures updates',
          'Version mismatch invalidates the transaction',
          'Endorsement policy and signatures are verified before the block is written',
        ],
      },
      {
        id: 'cb5',
        unit: 5,
        marks: 4,
        question: 'State what blockchain guarantees about data, and what it does not guarantee.',
        modelAnswer: [
          'It guarantees integrity and tamper-evidence: hash-linked blocks and signed endorsements make any change to recorded history detectable.',
          'It gives non-repudiation, since a committed transaction is attributable to the organisations whose certificates endorsed it.',
          'It does not guarantee confidentiality; every participant on a channel sees the same transactions.',
          'It does not guarantee correctness of the input, and it does not remove the need for identity, access control and governance.',
        ],
        keyPoints: [
          'Integrity, tamper-evidence and non-repudiation are provided',
          'Confidentiality is not provided by the ledger',
          'Input correctness is not guaranteed by the ledger',
          'Identity, authorisation and governance remain the operator responsibility',
        ],
      },
    ],
    partC: [
      {
        id: 'cc1',
        unit: 2,
        marks: 10,
        question:
          'A member organisation claims that its peer rejected a valid transaction. Analyse, step by step, where a Fabric transaction can fail between the client proposal and the committed block.',
        modelAnswer: [
          'Proposal and endorsement: the endorsing peer simulates the chaincode; if the function returns an error, or the read set cannot be obtained, the peer returns an unsuccessful response and no endorsement is produced.',
          'Policy check at endorsement: if the endorsement policy on the chaincode definition requires peers or organisations that did not endorse, the transaction is invalid and the ordering service will reject it.',
          'Client assembly: the client collects endorsements from the required peers; if it submits an incomplete or wrongly ordered set, the transaction is rejected at ordering.',
          'Ordering: the ordering service must reach consensus among the ordering nodes; if it cannot, it does not order the transaction, which leaves it pending rather than failing.',
          'Validation at commit: the committing peers re-check the read set versions; a key whose version changed since endorsement invalidates the transaction, which is the classic cause of a stale endorsement being rejected.',
          'Endorsement signature and identity checks: the signatures must match the endorsing certificates, and the invoking identity must be allowed by the channel ACL and the function-level policy.',
          'World state and versioned ledger: a write to a key that does not exist where the contract requires it, or a transaction that violates a business rule in the chaincode, fails during the simulation and therefore during validation.',
          'Conclusion: separate the two failure classes — a policy or simulation failure means the transaction is invalid and must be rebuilt, while an ordering failure means it is pending and will commit once consensus recovers.',
        ],
        keyPoints: [
          'Simulation error or missing endorsement at the endorser',
          'Endorsement policy not satisfied',
          'Incomplete endorsement set from the client',
          'Ordering service consensus failure leaves the transaction pending',
          'Read set version mismatch invalidates at commit',
          'Signature, ACL and identity checks',
          'Contract business rules fail during simulation',
          'Distinguish invalid transaction from pending transaction',
        ],
      },
      {
        id: 'cc2',
        unit: 4,
        marks: 10,
        question:
          'Design the access control and data layout for a chaincode that records a letter of credit, where the commercial terms are visible only to the exporter and the issuing bank but the shipment status must be visible to the forwarder and the customs authority.',
        modelAnswer: [
          'State the confidentiality requirement as a design input: two different audiences, two different visibility rules, on the same business process.',
          'Separate the data into two classes: confidential commercial terms (price, margins, payment details) and operational status (shipment, container, route, clearance), and never put both in the same namespace.',
          'Put the confidential terms in a private data collection with its own endorsement policy naming the exporter and the bank; the value is gossiped only between the peers of those two organisations and the shared ledger records only its hash.',
          'Keep the operational status in the ordinary world state so that the forwarder and the customs authority can read it directly, and reference the confidential collection key from the status record. Define the chaincode functions so that only the exporter can write the terms and only the issuing bank can write the payment instruction, while any member organisation can append a shipment or clearance status update.',
          'Set the endorsement policies: terms updates require the exporter and the bank; shipment updates require the exporter and the forwarder; clearance updates require the customs authority; and the pay function requires the bank.',
          'Use channel ACLs to enforce who may invoke each function by role and organisational unit, so a forwarder peer cannot invoke the terms function even if it could reach it.',
          'Model the credit as a state machine so that the enforcement lives in the contract as well as in the policy, and every invalid transition is rejected at simulation before it reaches the ledger. Test the design: verify that a forwarder peer sees the status but not the terms, that a terms read by an unauthorised peer returns only the hash, and that an illegal state transition is rejected.',
          'State the operational consequence: the collection policies and the endorsement policies must be agreed at consortium level, because a change to either is a change to who trusts what.',
        ],
        keyPoints: [
          'Two visibility classes: confidential terms versus operational status',
          'Private data collection with its own endorsement policy for the terms',
          'Ordinary world state for the shipment and clearance status',
          'Function-level write permissions matching the trust relationships',
          'Per-action endorsement policies, not one policy for everything',
          'Channel ACLs enforce invocation rights by role',
          'State machine in the contract plus policies in the configuration',
          'Test both visibility and rejection of illegal transitions; policy changes are consortium governance decisions',
        ],
      },
    ],
  },
  resources: [
    {
      label: 'Official SRMIST syllabus PDF (CSE-CS-2021)',
      url: 'https://srmrmp.edu.in/wp-content/uploads/2023/10/CSE-CS-2021.pdf',
      note: 'Course 21CSE432T appears on pages 388-389: course outcomes CLR-1 to CLR-5, the five unit-wise topic lists, the Practical Component, and the Learning Resources.',
    },
    {
      label: 'Nitin Gaur, Anthony O’Dowd, Petr Novotny, Luc Desrosiers, Salman A. Baset — Blockchain with Hyperledger Fabric, 2nd ed. (Packt, Nov 2020, ISBN 9781839218750)',
      note: 'The primary text. Unit 1 is its enterprise chapter, Unit 2 its Fabric components and business-network model, Unit 3 its trade scenario walkthrough, and Unit 4 its contract development chapters.',
    },
    {
      label: 'Ashwani Kumar — Hyperledger Fabric In-Depth',
      note: 'Deeper treatment of Fabric internals: peers, ordering service, MSP, chaincode internals and the transaction lifecycle.',
    },
    {
      label: 'Nakul Shah — Blockchain for Business with Hyperledger Fabric',
      note: 'Business-network framing: participants, assets and transactions, and the enterprise decision cases.',
    },
    {
      label: 'Brian Wu, Chuanfeng Zhang, Andrew Zhang — Hyperledger Cookbook',
      note: 'Recipes and worked configurations for standing up networks, channels and chaincode.',
    },
    {
      label: 'Matt Zand — Hands-On Smart Contract Development with Hyperledger Fabric V2',
      note: 'Code-level companion for chaincode development, the v2 lifecycle commands and testing.',
    },
    {
      label: 'Hyperledger Fabric documentation and tutorials',
      url: 'https://hyperledger-fabric.readthedocs.io/en/latest/',
      note: 'The reference for peer and ordering configuration, the chaincode lifecycle, endorsement policies, private data collections and CAP behaviour.',
    },
  ],
};
