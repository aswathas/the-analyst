import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Play, Pause, SkipForward } from 'lucide-react';
import { useNavigate } from 'react-router';

/* =======================================================
   TOPIC DATA - 20 Cryptography Concepts
   Each has: 6 slides = title, whatIs, diagram, howItWorks, whyItMatters, examTip
======================================================== */
const TOPICS = [
  {
    id: 1,
    unit: 1,
    title: 'Confusion vs Diffusion',
    color: '#ef4444',
    slides: {
      title: { badge: 'UNIT 1 ? CLASSIC CIPHERS', heading: 'CONFUSION & DIFFUSION', sub: "Shannon's Foundation" },
      whatIs: "Confusion obscures the relationship between the encryption key and the ciphertext - making it impossible to deduce the key even if you know how plaintext changes affect ciphertext. Diffusion spreads plaintext influence across the ciphertext - so that changing one plaintext bit flips many ciphertext bits. Together they make statistical attacks useless.",
      diagram: 'confusionDiffusion',
      howItWorks: [
        { n: '1', label: 'Confusion', desc: 'Achieved via complex substitution S-boxes. Each output bit depends on multiple input bits in non-linear ways.' },
        { n: '2', label: 'Diffusion', desc: 'Achieved via permutation P-boxes. One plaintext bit influences many ciphertext bits across rounds.' },
        { n: '3', label: 'Combined', desc: 'AES uses SubBytes (confusion) + ShiftRows/MixColumns (diffusion) in every round.' },
      ],
      whyItMatters: 'Without confusion, key patterns leak into ciphertext. Without diffusion, changing one bit only affects nearby bits - attackers can isolate patterns. Modern ciphers need BOTH. AES excels because its SPN structure maximizes both properties across 10-14 rounds.',
      examTip: 'KEYWORD: "S-box provides confusion, P-box provides diffusion" - Draw a simple diagram showing how input bit changes cascade through the cipher to produce scattered output changes.',
    },
  },
  {
    id: 2,
    unit: 1,
    title: 'Avalanche Effect',
    color: '#f97316',
    slides: {
      title: { badge: 'UNIT 1 ? BLOCK CIPHERS', heading: 'AVALANCHE EFFECT', sub: '50% Bit Flip Guarantee' },
      whatIs: "Claude Webster Feistel's 1973 principle: flipping ONE bit of input (key or plaintext) should flip ~50% of output bits. This means every output bit depends on every input bit. The cipher exhibits an 'avalanche' where small changes cascade into massive output changes. Measured using Strict Avalanche Criterion (SAC) - each output bit changes with probability 0.5.",
      diagram: 'avalanche',
      howItWorks: [
        { n: '1', label: 'Seed Change', desc: 'Flip a single bit in either the key or plaintext block.' },
        { n: '2', label: 'Round Cascade', desc: 'DES: one bit change affects both halves through Feistel XOR. AES: SubBytes + ShiftRows + MixColumns amplify diffusion.' },
        { n: '3', label: '50% Threshold', desc: 'After sufficient rounds, approximately half of all output bits are flipped - statistically independent of what changed.' },
      ],
      whyItMatters: 'The avalanche effect ensures that no shortcut exists - attackers cannot find correlations between plaintext and ciphertext without trying every possible key. Without it, ciphertexts from similar plaintexts would look similar, leaking structure. It is the mathematical backbone of cipher security.',
      examTip: 'EXAM FACT: DES achieves full avalanche after 5 rounds. AES achieves it by round 2-3. Know that 50% is the target - not 100%. A perfect cipher flips exactly 50% for every single-bit change.',
    },
  },
  {
    id: 3,
    unit: 1,
    title: 'Stream vs Block Ciphers',
    color: '#eab308',
    slides: {
      title: { badge: 'UNIT 1 ? CIPHER TYPES', heading: 'STREAM vs BLOCK', sub: 'Encryption Mode Comparison' },
      whatIs: 'Stream ciphers encrypt ONE byte/bit at a time using a keystream generator - XOR each plaintext unit with the keystream. Block ciphers process fixed-size blocks (64/128 bits) using modes like CBC, CTR, GCM. Stream is faster for continuous data but less parallelizable; Block is more versatile and can encrypt any size data with proper padding.',
      diagram: 'streamBlock',
      howItWorks: [
        { n: '1', label: 'Stream Cipher', desc: 'Keystream generator produces pseudo-random sequence. Plaintext XOR keystream = ciphertext. Decryption: same keystream XOR ciphertext.' },
        { n: '2', label: 'Block Cipher', desc: 'Fixed block (e.g., 128-bit AES). Modes: CBC chains blocks using XOR; CTR uses per-block counter; GCM adds authentication.' },
        { n: '3', label: 'Practical Use', desc: 'Stream: VPN (ChaCha20), Wi-Fi (RC4/ChaCha). Block: TLS AES-GCM, File encryption, Database fields.' },
      ],
      whyItMatters: 'Stream ciphers are vulnerable to keystream reuse - if the same keystream is used twice, XOR of two ciphertexts cancels the keystream, revealing plaintext. Block ciphers with proper modes (GCM) provide both confidentiality AND authenticity - catching tampering before decryption.',
      examTip: 'KEY DIFFERENCE: Stream = symmetric key + keystream (stateful, bit-by-bit). Block = block transform + mode of operation (stateless, fixed chunks). CBC requires IV (Initialization Vector); CTR requires counter; GCM adds GMAC auth tag.',
    },
  },
  {
    id: 4,
    unit: 2,
    title: 'Feistel Network (DES)',
    color: '#84cc16',
    slides: {
      title: { badge: 'UNIT 2 ? SYMMETRIC', heading: 'FEISTEL NETWORK', sub: 'DES Architecture' },
      whatIs: 'Invented by Horst Feistel at IBM (1973), the Feistel structure splits a block into two halves (L,R) and repeatedly applies: Li = Ri-1; Ri = Li-1 XOR F(Ri-1, Ki). The beauty: encryption and decryption use the SAME structure - just reverse the key schedule! The F-function contains expansion, S-box substitution, and permutation. DES uses 16 rounds, 56-bit key, 64-bit block.',
      diagram: 'feistel',
      howItWorks: [
        { n: '1', label: 'Split', desc: '64-bit block divided into 32-bit Left (L0) and Right (R0).' },
        { n: '2', label: 'Round Function F', desc: 'R expanded to 48-bit -> XOR with round key -> 8 S-boxes (6-to-4 bit) -> 32-bit P-permutation.' },
        { n: '3', label: 'Swap & Repeat', desc: 'Compute new R = L XOR F(R,Ki). Swap halves. After 16 rounds: ciphertext = L16||R16 (note: final swap makes it elegant).' },
      ],
      whyItMatters: 'Feistel networks allow hardware to implement only one circuit - it decrypts by running the encryption circuit in reverse with reversed key schedule. DES, the most-deployed cipher in history, proved this structure for 40 years. Its only weaknesses: 56-bit key (too short for 1977!), and 3DES needed EDE to prevent meet-in-the-middle.',
      examTip: 'DECRYPTION PROOF: If Ci = Li-1 XOR F(Ri-1,Ki), then Li-1 = Ci XOR F(Ri-1,Ki). Since Ri-1 = Li XOR F(Ri-1,Ki), we recover Li-1 from Ci and Ri-1. Running rounds in reverse recovers all plaintext - SAME CIRCUIT for encrypt and decrypt!',
    },
  },
  {
    id: 5,
    unit: 2,
    title: 'DES -> 3DES Evolution',
    color: '#22c55e',
    slides: {
      title: { badge: 'UNIT 2 ? SYMMETRIC', heading: 'DES TO 3DES', sub: 'EDE Keying Modes' },
      whatIs: 'Double DES (2DES) uses two keys: encrypt with K1, decrypt with K2 -> gives effective 57-bit security. BUT meet-in-the-middle attack reduces it to 57 bits with only 256 encryption operations (impossible without the technique). 3DES fixes this with EDE (Encrypt-Decrypt-Encrypt) using two or three keys: C = EK3[DK2[EK1[P]]]. Key sizes: 112-bit (K1=K3) or 168-bit (K1?K2?K3).',
      diagram: 'des3des',
      howItWorks: [
        { n: '1', label: 'Meet-in-Middle', desc: 'Attack: encrypt plaintext with all 256 K1 values, store. Decrypt ciphertext with all 256 K2, match. Only 2^56 work, not 2^112. Space-time trade-off.' },
        { n: '2', label: '3DES EDE', desc: 'C = EK3[DK2[EK1[P]]] where D is same as E (Feistel symmetric). With K1=K3: 2^56 effective security. With K1?K3: 2^112.' },
        { n: '3', label: 'Why E not D?', desc: "If you used E-E-E, you'd get a weaker cipher (not a group). EDE gives proper keyspace expansion. CBC, CFB, OFB modes all work with 3DES." },
      ],
      whyItMatters: '3DES is the patch that kept DES viable while AES was being standardized. Still used in legacy finance (ATM PIN encryption, some TLS cipher suites) but deprecated - AES is 5? faster and has no known practical attacks. 3DES EDE mode matters because it was the bridge between 1970s DES and 2000s AES.',
      examTip: 'MEET-IN-THE-MIDDLE FORMULA: 2DES security = 2^56 (not 2^112). Attack: encrypt P with all K1 (2^56), decrypt C with all K2 (2^56), match in 2^56 memory. For 3DES: encrypt plaintext forward with K1, decrypt backward with K2, match intermediate value -> 2^56 work per key pair.',
    },
  },
  {
    id: 6,
    unit: 2,
    title: 'AES Round Operations',
    color: '#14b8a6',
    slides: {
      title: { badge: 'UNIT 2 ? SYMMETRIC', heading: 'AES ROUND OPS', sub: 'SubBytes ? ShiftRows ? MixColumns ? AddRoundKey' },
      whatIs: "AES (Rijndael, 2001) is a substitution-permutation network (SPN) - NOT Feistel. It operates on a 4?4 state matrix. Four operations per round (10/12/14 rounds for 128/192/256-bit keys): SubBytes (S-box non-linear substitution), ShiftRows (row-wise byte permutation), MixColumns (GF(2^8) column mixing), AddRoundKey (XOR round key). The linear algebra in MixColumns makes it provably resistant to differential/linear cryptanalysis.",
      diagram: 'aesRounds',
      howItWorks: [
        { n: '1', label: 'SubBytes', desc: '16 bytes each replaced via 8?8 invertible S-box (GF(2^8) inversion + affine transform). Provides NON-LINEAR confusion. Self-invertible - decryption uses inverse S-box.' },
        { n: '2', label: 'ShiftRows + MixColumns', desc: 'ShiftRows: cyclic left-shift rows 0-3 by 0,1,2,3. MixColumns: each column multiplied by fixed 4?4 MDS matrix over GF(2^8). Provides diffusion across columns.' },
        { n: '3', label: 'AddRoundKey', desc: 'State XOR with 128-bit round key (derived from key schedule). Each round key is different - derived via key expansion algorithm with Rijndael key schedule.' },
      ],
      whyItMatters: 'AES replaced DES because DES was vulnerable to differential and linear cryptanalysis. AES provably resists these because its MixColumns operation (column-wise MDS matrix) ensures maximum diffusion - any non-trivial plaintext difference propagates through all columns within 2 rounds. 10 rounds for AES-128 is proven to be beyond current attack capability.',
      examTip: 'S-Box property: SubBytes is the ONLY non-linear component. If you removed MixColumns, AES would become a linear cipher - trivially broken. The GF(2^8) inversion (x -> x^-1) in the S-box is the algebraic heart - it ensures each output bit depends on ALL input bits.',
    },
  },
  {
    id: 7,
    unit: 3,
    title: 'RSA Trapdoor Function',
    color: '#06b6d4',
    slides: {
      title: { badge: 'UNIT 3 ? ASYMMETRIC', heading: 'RSA TRAPDOOR', sub: 'Integer Factorization' },
      whatIs: "RSA security rests on the gap between easy multiplication and hard factorization. Pick two large primes p,q. Compute N=pq (public modulus) and ?(N)=(p-1)(q-1). Choose e (public exponent, usually 65537) where gcd(e,?(N))=1. Compute d = e^-1 mod ?(N) (private exponent). The TRAPDOOR: given (e,N) you can encrypt (m^e mod N) but recovering m requires d, which requires factoring N. Nobody has found a shortcut.",
      diagram: 'rsaTrapdoor',
      howItWorks: [
        { n: '1', label: 'Key Gen', desc: 'p,q primes (~1024 bits). N=pq (2048-bit modulus). ?(N)=(p-1)(q-1). Pick e=65537 (fast). d = e^-1 mod ?(N). Public: (e,N). Private: d.' },
        { n: '2', label: 'Encrypt', desc: 'C = M^e mod N. Anyone with public key can encrypt. This is fast (modular exponentiation).' },
        { n: '3', label: 'Decrypt', desc: 'M = C^d mod N. Only owner of private key d can decrypt. Factoring N into p,q is the ONLY known way to compute d.' },
      ],
      whyItMatters: 'RSA enables the internet: HTTPS certificates, PGP email, SSH keys, code signing. The factorization gap is why - 1024-bit multiplication takes nanoseconds, but best known factoring (GNFS) takes thousands of CPU-years. Asymmetric encryption lets strangers establish symmetric session keys (hybrid crypto) without pre-sharing secrets.',
      examTip: "CRITICAL: You MUST know why RSA works mathematically. If C = M^e mod N and M = C^d mod N, then M = (M^e)^d = M^(ed) mod N. Since ed = 1 mod phi(N), by Euler's theorem M^ed = M^1 mod N. For M that is not a multiple of p or q (which is almost always true). Show this in your answer.",
    },
  },
  {
    id: 8,
    unit: 3,
    title: 'RSA 5-Step Math',
    color: '#3b82f6',
    slides: {
      title: { badge: 'UNIT 3 ? ASYMMETRIC', heading: 'RSA FIVE STEPS', sub: 'Key Gen -> Encrypt -> Decrypt' },
      whatIs: 'The RSA algorithm has exactly 5 formal steps that examiners expect you to diagram and compute: Step 1 - Select primes p,q. Step 2 - Compute N=pq and ?(N)=(p-1)(q-1). Step 3 - Choose public exponent e (usually 3 or 65537). Step 4 - Compute private exponent d using extended Euclidean algorithm: d ? e^-1 (mod ?(N)). Step 5 - Encrypt: C ? M^e mod N; Decrypt: M ? C^d mod N.',
      diagram: 'rsaSteps',
      howItWorks: [
        { n: '1', label: 'Primes', desc: 'p=61, q=53 (example). In practice: 1024+ bit primes. Use probabilistic primality tests (Miller-Rabin).' },
        { n: '2', label: 'Modulus & Phi', desc: 'N = 61?53 = 3233. ?(N) = (61-1)(53-1) = 60?52 = 3120. This is the private value - NOT revealed.' },
        { n: '3', label: 'Exponents', desc: 'e=17 (public, must be coprime to 3120). d = e^-1 mod 3120 = 2753 (private). Verify: 17?2753 = 46801 = 1 + 15?3120 = 1 mod 3120 ?' },
        { n: '4', label: 'Encrypt/Decrypt', desc: 'M=42 -> C=42^17 mod 3233 = 2557. Decrypt: 2557^2753 mod 3233 = 42 ?' },
      ],
      whyItMatters: 'This 5-step sequence appears in EVERY RSA exam question. You must be able to compute ?(N) correctly, apply the extended Euclidean algorithm to find d, and verify that e?d ? 1 mod ?(N). This is fundamental mathematics for both the theory exam and the practical implementation exam.',
      examTip: 'EXTENDED EUCLIDEAN ALGORITHM: Find d where ed + ?(N)y = 1 (B?zout identity). Use: gcd(e,?)=1. Example: 17d + 3120y = 1. Working: 3120 = 183?17 + 9, 17 = 1?9 + 8... back-substitute to get d=2753. PRACTICE this - it appears in 8-marks questions.',
    },
  },
  {
    id: 9,
    unit: 3,
    title: 'Hybrid Cryptography',
    color: '#8b5cf6',
    slides: {
      title: { badge: 'UNIT 3 ? PRACTICAL', heading: 'HYBRID CRYPTO', sub: 'RSA/AES Combined' },
      whatIs: 'Hybrid cryptography combines the BEST of both worlds: asymmetric encryption (RSA/ECC) for key exchange + symmetric encryption (AES) for bulk data. Why? Asymmetric math is slow (milliseconds per operation) but lets strangers agree on a key. Symmetric math is fast (microseconds) but requires pre-shared keys. Practical protocol: RSA encrypts a random 256-bit AES key -> AES encrypts the actual data at gigabytes/second.',
      diagram: 'hybrid',
      howItWorks: [
        { n: '1', label: 'Key Exchange', desc: "Alice: generate random AES-256 session key K. Encrypt K with Bob's RSA public key (e,N): C = K^e mod N. Send C." },
        { n: '2', label: 'Bulk Encryption', desc: 'Both Alice and Bob now share K. Use AES-GCM or AES-CBC to encrypt all data at high speed. RSA only used for the tiny K, not the big message.' },
        { n: '3', label: 'Why GCM?', desc: 'AES-GCM adds authenticated encryption - detects tampering. RSA alone cannot detect modified ciphertexts. Hybrid + GCM = IND-CCA2 security.' },
      ],
      whyItMatters: 'Every HTTPS connection, every Signal message, every PGP email uses hybrid crypto. RSA encrypts 256 bits; AES encrypts everything else. This is how the internet achieves both security (asymmetric key exchange) and speed (symmetric bulk encryption). Without hybrid crypto,?? would be 1000? slower.',
      examTip: 'EXAM QUESTION FORM: "Why not use RSA for everything?" -> Answer: RSA-2048 encryption is ~1000? slower than AES-256 and can only handle messages shorter than the modulus (245 bytes for 2048-bit). "Why not use AES for key exchange?" -> Answer: AES requires pre-shared key - how do strangers agree without meeting? Asymmetric solves this.',
    },
  },
  {
    id: 10,
    unit: 3,
    title: 'ECC vs RSA Key Size',
    color: '#a855f7',
    slides: {
      title: { badge: 'UNIT 3 ? ASYMMETRIC', heading: 'ECC vs RSA', sub: 'Key Size Comparison' },
      whatIs: "Elliptic Curve Cryptography (ECC) achieves equivalent security to RSA with MUCH smaller keys. Reason: Integer Factorization (RSA) vs Discrete Logarithm (ECC). The best known attack on ECC (Pollard's Rho) is sub-exponential, while GNFS for RSA is quasi-exponential. Equivalences: 256-bit ECC = 3072-bit RSA = 128-bit symmetric. This makes ECC ideal for mobile, IoT, and constrained devices.",
      diagram: 'eccVsRsa',
      howItWorks: [
        { n: '1', label: 'Security Level', desc: '80-bit security: ECC 160-bit = RSA 1024-bit. 128-bit: ECC 256-bit = RSA 3072-bit. 256-bit: ECC 512-bit = RSA 15360-bit.' },
        { n: '2', label: 'Performance', desc: 'ECC-256 key generation: ~0.5ms. RSA-2048: ~50ms. ECC-256 sign: ~0.3ms. RSA-2048 sign: ~10ms. 20-50? speed advantage.' },
        { n: '3', label: 'Curve Choices', desc: 'NIST P-256, Curve25519 (Daniel Bernstein), secp256k1 (Bitcoin). Each has different properties - Curve25519 is designed to be resistant to implementation errors.' },
      ],
      whyItMatters: 'For mobile devices, smartcards, and IoT sensors, smaller keys mean: (1) lower computation cost, (2) smaller certificates (less bandwidth), (3) less battery drain. 5G networks use ECC for this reason. ECDSA (Elliptic Curve DSA) replaced DSA; ECDH replaced DH. This is why government standards (NIST, FIPS) now recommend ECC over RSA for equivalent security.',
      examTip: 'KEY SIZE TABLE (EXAM memorize): 80-bit sec = ECC 160-bit / RSA 1024-bit. 128-bit sec = ECC 256-bit / RSA 3072-bit. 256-bit sec = ECC 512-bit / RSA 15360-bit. The 12? ratio means ECC is 12? more efficient at equivalent security.',
    },
  },
  {
    id: 11,
    unit: 3,
    title: "Diffie-Hellman Key Exchange",
    color: '#ec4899',
    slides: {
      title: { badge: 'UNIT 3 ? KEY EXCHANGE', heading: 'DIFFIE-HELLMAN', sub: 'Public Channel Agreement' },
      whatIs: "DH (1976, Whitfield Diffie + Martin Hellman) lets two parties establish a shared secret over a public channel WITHOUT pre-shared keys. It works because modular exponentiation is easy but the discrete logarithm is hard. Both parties pick private values a,b, exchange public values g^a mod p and g^b mod p, then both compute g^(ab) mod p - the shared secret. Anyone watching sees only g, p, A, B - not a,b or the shared secret.",
      diagram: 'diffieHellman',
      howItWorks: [
        { n: '1', label: 'Parameters', desc: 'Public: prime p, generator g (primitive root mod p). Example: p=23, g=5 (both public, standard choices).' },
        { n: '2', label: 'Exchange', desc: 'Alice: private a=6 -> A = g^a mod p = 5^6 mod 23 = 8. Bob: private b=15 -> B = g^b mod p = 5^15 mod 23 = 19. Send A,B publicly.' },
        { n: '3', label: 'Shared Secret', desc: 'Alice: K = B^a mod p = 19^6 mod 23 = 2. Bob: K = A^b mod p = 8^15 mod 23 = 2. Both computed SAME value without sending it!' },
      ],
      whyItMatters: "DH enables the entire modern internet key exchange. Without it, you cannot have secure communication with any server you've never contacted before. TLS, Signal, WireGuard all use DH (or ECDH) to establish session keys. It solved the key distribution problem that made symmetric encryption impractical for open networks.",
      examTip: "DH is not authentication - Eve can perform a man-in-the-middle attack. Alice thinks she's talking to Bob, but Eve relays everything, establishing K1 (with Alice) and K2 (with Bob). Mitigations: authenticated DH ( ECDH with certificates), or use the signed DSA/DH algorithm (DSS).",
    },
  },
  {
    id: 12,
    unit: 3,
    title: 'DH MITM Vulnerability',
    color: '#f43f5e',
    slides: {
      title: { badge: 'UNIT 3 ? ATTACKS', heading: 'DH MITM ATTACK', sub: 'Authenticated vs Unauthenticated' },
      whatIs: "Plain Diffie-Hellman is vulnerable to a man-in-the-middle (MITM) attack because it provides no authentication. Eve intercepts the DH exchange, generates her own key pairs, and sits between Alice and Bob. Alice thinks she's sharing a key with Bob (but it is with Eve); Bob thinks he's sharing with Alice (but also with Eve). Eve can read, modify, re-encrypt all messages transparently. This attack is undetectable without authentication.",
      diagram: 'mitm',
      howItWorks: [
        { n: '1', label: 'Eve Intercepts', desc: "When Alice sends A = g^a mod p, Eve catches it. She generates her own private e. Sends B = g^e to Bob pretending it is from Alice." },
        { n: '2', label: 'Two Keys', desc: 'Alice computes K1 = B^a = g^(eb). Eve computes K1 = A^e = g^(ae). Bob computes K2 = A^b = g^(ab). Eve computes K2 = B^e = g^(eb). Eve now has both keys.' },
        { n: '3', label: 'Relay Everything', desc: "Eve decrypts Alice's message with K1, reads/modifies, re-encrypts with K2, sends to Bob. Undetectable because encryption/decryption is symmetric - Eve IS the session from each perspective." },
      ],
      whyItMatters: 'This is a fundamental exam question: DH without authentication is NOT secure. The fix is ECDHE (Elliptic Curve Diffie-Hellman Ephemeral) with TLS certificates - the server signs its DH public key, proving identity. Always look for "Ephemeral" in cipher suite names: TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384.',
      examTip: "QUESTION PATTERN: 'Is Diffie-Hellman secure?' Answer: UNATHENTICATED DH = not secure against active attackers. AUTHENTICATED DH (with certificates, or ECDHE in TLS) = secure. The vulnerability is NOT in the math - it is in the lack of identity verification. Draw MITM diagram showing Eve in the middle.",
    },
  },
  {
    id: 13,
    unit: 4,
    title: 'Hash Functions (SHA Family)',
    color: '#e879f9',
    slides: {
      title: { badge: 'UNIT 4 ? INTEGRITY', heading: 'SHA FAMILY', sub: 'SHA-1 ? SHA-2 ? SHA-3' },
      whatIs: 'A cryptographic hash function H maps arbitrary-length input to fixed-length digest (hash). Required properties: (1) Pre-image resistance: given h, infeasible to find m where H(m)=h. (2) Second pre-image: given m1, infeasible to find m2?m1 with H(m1)=H(m2). (3) Collision resistance: infeasible to find any m1,m2 with H(m1)=H(m2). SHA-1 (160-bit, broken), SHA-2 (224/256/384/512-bit, secure), SHA-3 (sponge construction, independently designed).',
      diagram: 'shaFamily',
      howItWorks: [
        { n: '1', label: 'SHA-1', desc: 'Merkle-Damgard construction, 160-bit output, 80 rounds. Collision found by SHAttered (2017) - two PDFs with same SHA-1. Deprecated for signatures.' },
        { n: '2', label: 'SHA-2 (SHA-256/384/512)', desc: 'Same Merkle-Damgard structure, 256/384/512-bit outputs. Merkle-Damgard length-extension attack: given H(m), attacker can compute H(m||padding||extension) without knowing m. Use HMAC or SHA-3 to prevent.' },
        { n: '3', label: 'SHA-3 (Keccak)', desc: 'Sponge construction: absorb input into state, squeeze output. Different mathematical foundation from SHA-2 - independently designed by Guido Bertoni et al. Not vulnerable to length-extension attack. Standardized 2015.' },
      ],
      whyItMatters: 'Hash functions are the WORKHORSES of cryptography - used in digital signatures, MACs, commitment schemes, proof-of-work, blockchain. SHA-2 is everywhere: TLS certificates, file integrity, password storage. SHA-3 is the backup plan if SHA-2 is broken. The competition (2007-2012) that produced SHA-3 is one of the best-reviewed cryptographic processes in history.',
      examTip: "SHA-2 weaknesses: Merkle-Damgard construction is susceptible to length-extension attack. If you store H(secret||message), attacker can compute H(secret||message||padding||attackerMessage) without knowing secret. Fix: HMAC or SHA-3. SHA-3 sponge construction has NO length-extension vulnerability.",
    },
  },
  {
    id: 14,
    unit: 4,
    title: 'HMAC vs Hash(Key||Msg)',
    color: '#c084fc',
    slides: {
      title: { badge: 'UNIT 4 ? AUTHENTICATION', heading: 'HMAC vs HASH', sub: 'Keyed MAC Comparison' },
      whatIs: 'HMAC (RFC 2104) = Hash((K ? opad) || Hash((K ? ipad) || m)). A keyed Hash(Key||Msg) is trivial to break: attacker computes H(Key||Msg) directly if they know Key. HMAC is specifically designed to resist length-extension attacks on Merkle-Damgard hashes (MD5/SHA-1/SHA-256). It re-hashes the inner result with a key-dependent outer transformation - the resulting tag cannot be computed without the full key.',
      diagram: 'hmac',
      howItWorks: [
        { n: '1', label: 'Hash(Key||Msg) Vulnerability', desc: 'Given valid (Key, Msg, Tag=H(Key||Msg)), attacker computes H(Key||Msg||padding||X) without knowing Key - length-extension property of Merkle-Damgard hashes.' },
        { n: '2', label: 'HMAC Structure', desc: 'K padded to B bytes. Inner: H(K xor ipad || m). Outer: H(K xor opad || inner_result). ipad=0x36, opad=0x5C (repeating). Double hashing with different key masks prevents length-extension.' },
        { n: '3', label: 'Why It Works', desc: 'Even if attacker re-uses inner hash, the outer H(K xor opad || inner) cannot be computed without K. The two different key masks (ipad vs opad) ensure inner and outer are different functions of K.' },
      ],
      whyItMatters: 'HMAC is the standard for message authentication in TLS, SSH, IPsec. It is proven secure under the assumption that the underlying hash function is a pseudo-random function (PRF). Using plain Hash(Key||Msg) for authentication is a CRITICAL security flaw - exactly what broke MD5 in multiple protocols. HMAC has replaced ad-hoc constructions everywhere.',
      examTip: 'DRAW the HMAC diagram: K -> (K xor ipad) -> inner hash -> (K xor opad) -> outer hash = Tag. Compare with Hash(Key||Msg): K -> Key||Msg -> hash = Tag. Show how length-extension attack works on the second but not the first. This is a VERY common exam question.',
    },
  },
  {
    id: 15,
    unit: 4,
    title: 'Length Extension Attack',
    color: '#a78bfa',
    slides: {
      title: { badge: 'UNIT 4 ? ATTACKS', heading: 'LENGTH EXTENSION', sub: 'Merkle-Damgard Vulnerability' },
      whatIs: 'Length extension attacks exploit a structural flaw in Merkle-Damgard hashes (MD5, SHA-1, SHA-256). Given H(m) and len(m), an attacker can compute H(m || padding || extension) WITHOUT knowing m. The hash state (internal variables a,b,c,d) is revealed in the output, allowing the attacker to continue the compression function from that state. This is why Hash(key||msg) is insecure for authentication.',
      diagram: 'lengthExtension',
      howItWorks: [
        { n: '1', label: 'State Exposure', desc: 'MD/MD5/SHA-1/SHA-256 output = internal state (IV). The compression function: state = F(state, block). Knowing state allows you to continue computation on new blocks.' },
        { n: '2', label: 'Compute Extension', desc: 'Given H(m), find the padding needed to reach a block boundary. Compute: H(m||pad||ext) by initializing state to H(m) and processing ext block.' },
        { n: '3', label: 'Real Attack', desc: 'Server: tag = SHA256(secret||message). Attacker intercepts (message, tag). Can compute tag2 = SHA256(secret||message||pad||newMessage) - same secret tag works for modified message.' },
      ],
      examTip: "PREVENTION: (1) Use HMAC - it is specifically designed to prevent this. (2) Use SHA-3 (sponge - no length extension). (3) Use construction: H(message||key) not H(key||message) - though HMAC is still preferred. Never use raw Merkle-Damgard hash with a secret for authentication.",
    },
    id: 16,
    unit: 4,
    title: 'CBC-MAC Splicing Attack',
    color: '#818cf8',
    slides: {
      title: { badge: 'UNIT 4 ? ATTACKS', heading: 'CBC-MAC SPLICE', sub: 'Forge Valid MACs' },
      whatIs: "CBC-MAC (Cipher Block Chaining Message Authentication Code) is NOT safe for variable-length messages. The splicing attack: if you have MACs for single-block messages, you can forge MACs for multi-block messages. Given T1 = MAC(M1), T2 = MAC(M2), you can compute MAC(M1||M2 XOR T1) = T2. The root cause: CBC-MAC uses the SAME key for encryption and for final tag generation - which is insecure for variable lengths.",
      diagram: 'cbcMac',
      howItWorks: [
        { n: '1', label: 'CBC-MAC Basic', desc: 'CBC encryption with IV=0. Each block: Ci = E(K, Pi?Ci-1). Final ciphertext Cn is the MAC tag. No secret IV - the tag IS the last block.' },
        { n: '2', label: 'Splicing Attack', desc: 'Want: forge MAC for P1||P2. Have: T1=MAC(P1), T2=MAC(P2). Compute P2-prime = P2 XOR T1. Then MAC(P1||P2-prime) = CBC(P1||P2-prime) = E(K, P2-prime XOR T1) = E(K, P2 XOR T1 XOR T1) = E(K, P2) = T2.' },
        { n: '3', label: 'Fix: CMAC', desc: 'CMAC (RFC 4493) uses two subkeys K1,K2 derived from the cipher. Final block XORed with K1/K2 depending on padding. This breaks the algebraic relation exploited in splicing.' },
      ],
      whyItMatters: 'CBC-MAC is a classic exam example of how cryptographic primitives must be carefully combined. CBC-MAC is secure for FIXED-LENGTH messages (with unique tags per message). For variable-length messages, you MUST use CMAC or HMAC. This distinction appears in both theory and practical system design questions.',
      examTip: 'VARIABLE-LENGTH FIX: (1) Length-prepend: H(len||message) - but complex. (2) Encrypt-last-block-CBC (ECBC) - used in AES-CMAC. (3) HMAC - recommended. The key insight: CBC-MAC with IV=0 is deterministic - same message always produces same tag. For variable lengths, randomness (nonce) or key variation is essential.',
    },
  },
  {
    id: 17,
    unit: 5,
    title: "Shor's vs Grover's",
    color: '#6366f1',
    slides: {
      title: { badge: 'UNIT 5 QUANTUM', heading: 'SHORS vs GROVERS', sub: 'Cryptanalysis on Quantum Computers' },
      whatIs: 'Two quantum algorithms threaten modern cryptography. Shors Algorithm (1994) solves integer factorization AND discrete logarithms in polynomial time (on a quantum computer with ~4000 logical qubits). This BREAKS RSA, DH, ECC. Grovers Algorithm (1996) provides quadratic speedup for unstructured search - AES-128 effectively becomes AES-64 security. The response: post-quantum cryptography (PQC) based on problems believed to be hard for BOTH classical and quantum computers.',
      diagram: 'quantum',
      howItWorks: [
        { n: '1', label: 'Shors Algorithm', desc: 'Quantum Fourier Transform (QFT) finds period of modular exponentiation. Period (factors) -> RSA broken. 2048-bit RSA needs ~4096 logical qubits (not yet achievable). Estimated: needs ~1 million physical qubits with error correction.' },
        { n: '2', label: 'Grovers Algorithm', desc: 'Quantum search of N items in sqrt(N) steps. 2^128 brute force becomes 2^64 effective. To maintain 128-bit security, use AES-256 (2^128 minus 2^64 -> still 2^64 feasible but borderline).' },
        { n: '3', label: 'The Asymmetric Threat', desc: 'Asymmetric crypto (RSA/DH/ECC) faces EXPONENTIAL quantum speedup (Shor). Symmetric faces only QUADRATIC speedup (Grover). This is why PQC focuses on lattice/Hash/Multivariate problems for key exchange and signatures.' },
      ],
      whyItMatters: 'Quantum computing threatens to break the mathematical foundations of internet security. Timeline is uncertain (10-20+ years for cryptographically relevant QC) but the threat is serious enough that NIST finalized PQC standards in 2024. Harvest now, decrypt later attacks already target data that needs long-term confidentiality.',
      examTip: 'EXAM FACT: AES-256 vs RSA-2048 quantum security: AES-256 -> 2^128 quantum steps (Grover) -> still secure. RSA-2048 -> polynomial time (Shor) -> BROKEN. So: use AES-256 for long-term confidentiality; migrate to PQC (CRYSTALS-Kyber/Libreswan) for key exchange. Doubling symmetric key size is the immediate fix.',
    },
    id: 18,
    unit: 5,
    title: 'PQC 4 Families',
    color: '#4f46e5',
    slides: {
      title: { badge: 'UNIT 5 ? POST-QUANTUM', heading: 'PQC FAMILIES', sub: 'NIST Standardized Algorithms' },
      whatIs: 'Post-Quantum Cryptography (PQC) uses mathematical problems that resist both classical and quantum attacks. NIST standardized 4 algorithms in 2024: (1) CRYSTALS-Kyber (ML-KEM) - lattice-based KEX, 128-bit quantum security. (2) CRYSTALS-Dilithium (ML-DSA) - lattice-based signatures. (3) FALCON - lattice-based signatures (NTRU lattice). (4) SPHINCS+ - hash-based signatures (most conservative, based on minimal assumptions).',
      diagram: 'pqc',
      howItWorks: [
        { n: '1', label: 'Lattice-Based (Kyber/Dilithium/Falcon)', desc: "Based on Learning With Errors (LWE): given (A, b=As+e) mod q, find s. The LWE problem is exponentially hard even for quantum computers. The basis of the Learning With Errors problem can be short or noisy - hence 'short integer solution' (SIS) variant." },
        { n: '2', label: 'Hash-Based (SPHINCS+)', desc: 'Based ONLY on the security of the hash function. Stateless signatures - no need for state management like HMAC. Trade-off: large signatures (~40KB) but maximal confidence. No algebraic structure to attack.' },
        { n: '3', label: 'Why These Families?', desc: 'Lattice problems: fastest, smallest keys/signatures. Hash-based: most conservative, largest signatures. Code-based: oldest PQ research (McEliece 1978), large keys but well-studied. Multivariate: fast verification, large signatures. Each family has different size/performance trade-offs.' },
      ],
      whyItMatters: 'NIST PQC standardization means enterprises must begin migrating now. "Harvest now, decrypt later" attacks mean data encrypted today with RSA could be decrypted in 10-15 years when quantum computers exist. TLS 1.3 has hybrid key exchange (classical + PQC) already deployed by Chrome/Firefox. Migration is already starting.',
      examTip: 'NIST STANDARDIZED: ML-KEM (CRYSTALS-Kyber) for key exchange. ML-DSA (CRYSTALS-Dilithium) for signatures. FALCON for compact signatures. SPHINCS+ for conservative stateless signatures. CLASSICAL + PQC hybrid is used TODAY in TLS 1.3 to ensure forward secrecy against quantum attackers.',
    },
  },
  {
    id: 19,
    unit: 5,
    title: 'TLS Handshake',
    color: '#4338ca',
    slides: {
      title: { badge: 'UNIT 5 ? INTERNET', heading: 'TLS HANDSHAKE', sub: '1-RTT ? 0-RTT ? Resumption' },
      whatIs: 'TLS (Transport Layer Security) establishes encrypted channels. TLS 1.2 full handshake: 2 RTTs + certificate-based authentication. TLS 1.3 reduces to 1 RTT: client sends key share (ECDHE) immediately, server responds with its key share and finishes. Both derive session keys using HKDF. TLS 1.3 also supports 0-RTT resumption (early data with PSK) but with replay risks. TLS 1.3 removes legacy cipher suites (CBC, RC4, 3DES, MD5).',
      diagram: 'tls',
      howItWorks: [
        { n: '1', label: 'TLS 1.2 (2-RTT)', desc: 'RTT1: ClientHello -> ServerHello + Certificate + ServerKeyExchange + ServerHelloDone. RTT2: ClientKeyExchange (premaster) -> ChangeCipherSpec -> Finished. Each subsequent message authenticated via HMAC.' },
        { n: '2', label: 'TLS 1.3 (1-RTT)', desc: 'ClientHello + key_share (ECDHE pubkey). Server: key_share + Finished in same flight. Derive keys immediately - no round trip for key exchange. 0-RTT: client sends encrypted data with PSK (pre-shared key), but susceptible to replay attacks.' },
        { n: '3', label: 'Key Derivation (HKDF)', desc: 'ECDHE shared secret -> HKDF-Extract -> master secret -> HKDF-Expand-Label -> session keys (traffic keys). Provides forward secrecy: compromising session key does NOT reveal past sessions if ECDHE is used.' },
      ],
      whyItMatters: 'TLS is the protocol that secures the entire internet. Every HTTPS connection goes through a TLS handshake. Understanding TLS means understanding confidentiality (AES-GCM), authentication (certificates/X.509), integrity (HMAC/AEAD), and forward secrecy (ECDHE). It is the practical application of nearly every cryptographic primitive.',
      examTip: 'TLS 1.3 vs 1.2 COMPARISON: 1-RTT vs 2-RTT, 0-RTT resumption, removes CBC ciphers (POODLE/BEAST resistant), removes RC4/MD5/SHA-1, mandates forward secrecy (no RSA key exchange), uses AEAD (AES-GCM/ChaCha20-Poly1305). DRAW the handshake diagrams for both versions.',
    },
  },
  {
    id: 20,
    unit: 5,
    title: 'WPA3 vs WPA2',
    color: '#3730a3',
    slides: {
      title: { badge: 'UNIT 5 ? WIRELESS', heading: 'WPA3 vs WPA2', sub: 'Dragonfly ? SAE ? Opportunistic Wireless Encryption' },
      whatIs: 'WPA2 (2004) uses 4-way handshake with PSK (Pre-Shared Key): nonce-based challenge-response to prove both sides know the password. Vulnerabilities: offline dictionary attacks (if weak password) - Hashcat can try billions of passwords against a captured handshake. KRACK attack (2017): replay of message 3 allows decryption. WPA3 (2018) fixes these with SAE (Simultaneous Authentication of Humans) - a password-authenticated key exchange (PAKE) that is resistant to offline dictionary attacks.',
      diagram: 'wpa',
      howItWorks: [
        { n: '1', label: 'WPA2 4-Way Handshake', desc: 'AP sends ANonce, client sends SNonce, both derive PTK (Pairwise Transient Key). Vulnerability: if password is weak, captured handshake allows offline brute force - attacker computes PMK from dictionary words and checks.' },
        { n: '2', label: 'WPA3 SAE (PAKE)', desc: 'Dragonfly protocol (RFC 7664): password committed before any data. Each side proves knowledge of password WITHOUT sending it. Even with captured handshake, offline dictionary attack is computationally infeasible - attacker must do online-guessing only.' },
        { n: '3', label: 'Enhanced Open', desc: 'WPA3-Enterprise uses 192-bit security suite with 256-bit hash. WPA3-Personal has mandatory SAE. Enhanced Open ( Opportunistic Wireless Encryption) for open networks: uses OWE ( Diffie-Hellman on open networks ) - provides forward secrecy without authentication.' },
      ],
      whyItMatters: 'Wi-Fi security affects billions of devices. The KRACK attack (2017) against WPA2 affected every Wi-Fi device. WPA3 with SAE is the answer - it makes Wi-Fi passwords genuinely secure against offline attacks. Even if a WPA3 handshake is captured, the attacker cannot compute the key offline from a dictionary. This is particularly important for enterprise and IoT networks.',
      examTip: "KEY DIFFERENCE: WPA2 = offline dictionary attack possible (if weak password). WPA3 = SAE requires ONLINE guessing - attacker can only try one password at a time directly against the AP. WPA2-PSK vulnerability: capture handshake -> compute PMK offline (no network interaction). SAE vulnerability: must interact with AP for each guess.",
    },
  },
];

/* =======================================================
   SVG DIAGRAMS - inline animated diagrams
======================================================== */
function ConfusionDiffusionDiagram() {
  return (
    <svg viewBox="0 0 400 200" style={{ width: '100%', maxWidth: 500 }}>
      <rect width="400" height="200" fill="#1c1c1e" rx="8" />
      {/* Confusion side */}
      <text x="200" y="20" fill="#ef4444" fontSize="12" textAnchor="middle" fontFamily="monospace">CONFUSION</text>
      <rect x="20" y="35" width="80" height="30" fill="#ef4444" rx="4" />
      <text x="60" y="53" fill="#000" fontSize="10" textAnchor="middle" fontFamily="monospace">KEY</text>
      <rect x="120" y="35" width="80" height="30" fill="#ef4444" rx="4" opacity="0.5" />
      <text x="160" y="53" fill="#fff" fontSize="10" textAnchor="middle" fontFamily="monospace">INPUT</text>
      <path d="M200 50 L240 50" stroke="#ef4444" strokeWidth="2" fill="none" />
      <rect x="240" y="35" width="80" height="30" fill="#ef4444" opacity="0.3" />
      <text x="280" y="53" fill="#fff" fontSize="10" textAnchor="middle" fontFamily="monospace">OUTPUT</text>
      {/* Arrow showing S-box */}
      <text x="200" y="100" fill="#ef4444" fontSize="10" textAnchor="middle" fontFamily="monospace">S-Box (Non-Linear)</text>
      {/* Diffusion side */}
      <text x="200" y="120" fill="#84cc16" fontSize="12" textAnchor="middle" fontFamily="monospace">DIFFUSION</text>
      <rect x="20" y="135" width="20" height="20" fill="#84cc16" rx="2" />
      <rect x="50" y="135" width="20" height="20" fill="#84cc16" rx="2" />
      <rect x="80" y="135" width="20" height="20" fill="#84cc16" rx="2" />
      <path d="M115 145 L170 145" stroke="#84cc16" strokeWidth="2" fill="none" />
      <text x="143" y="138" fill="#fff" fontSize="8" textAnchor="middle" fontFamily="monospace">P-Box</text>
      <rect x="170" y="135" width="20" height="20" fill="#84cc16" opacity="0.4" rx="2" />
      <rect x="200" y="135" width="20" height="20" fill="#84cc16" opacity="0.6" rx="2" />
      <rect x="230" y="135" width="20" height="20" fill="#84cc16" opacity="0.8" rx="2" />
      <rect x="260" y="135" width="20" height="20" fill="#84cc16" opacity="0.3" rx="2" />
      <text x="310" y="145" fill="#84cc16" fontSize="8" textAnchor="middle" fontFamily="monospace">Spread!</text>
    </svg>
  );
}

function AvalancheDiagram() {
  return (
    <svg viewBox="0 0 400 160" style={{ width: '100%', maxWidth: 500 }}>
      <rect width="400" height="160" fill="#1c1c1e" rx="8" />
      {/* Single bit flip */}
      <text x="200" y="18" fill="#f97316" fontSize="11" textAnchor="middle" fontFamily="monospace">AVALANCHE EFFECT</text>
      <rect x="10" y="35" width="60" height="24" fill="#f97316" rx="2" />
      <text x="40" y="51" fill="#000" fontSize="8" textAnchor="middle" fontFamily="monospace">FLIP 1 BIT</text>
      <path d="M75 47 L100 47" stroke="#f97316" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
      <text x="90" y="43" fill="#fff" fontSize="8" fontFamily="monospace">Cipher</text>
      {/* Output bits */}
      {/* Output bits with fixed display */}
      <rect x="105" y="40" width="28" height="16" fill="#f97316" rx="2" />
      <rect x="140" y="40" width="28" height="16" fill="#f97316" rx="2" />
      <rect x="175" y="40" width="28" height="16" fill="#f97316" rx="2" />
      <rect x="210" y="40" width="28" height="16" fill="#f97316" rx="2" />
      <rect x="245" y="40" width="28" height="16" fill="#f97316" rx="2" />
      <rect x="280" y="40" width="28" height="16" fill="#f97316" rx="2" />
      <rect x="315" y="40" width="28" height="16" fill="#f97316" rx="2" />
      <rect x="350" y="40" width="28" height="16" fill="#f97316" rx="2" />

function FeistelDiagram() {
  return (
    <svg viewBox="0 0 400 220" style={{ width: '100%', maxWidth: 500 }}>
      <rect width="400" height="220" fill="#1c1c1e" rx="8" />
      <text x="200" y="18" fill="#84cc16" fontSize="11" textAnchor="middle" fontFamily="monospace">FEISTEL NETWORK (DES)</text>
      {/* Plaintext block */}
      <rect x="10" y="50" width="70" height="60" fill="#84cc16" rx="4" />
      <text x="45" y="75" fill="#000" fontSize="9" textAnchor="middle" fontFamily="monospace">64-bit</text>
      <text x="45" y="90" fill="#000" fontSize="9" textAnchor="middle" fontFamily="monospace">BLOCK</text>
      {/* Split arrow */}
      <path d="M85 80 L105 80" stroke="#84cc16" strokeWidth="2" fill="none" />
      {/* L and R boxes */}
      <rect x="105" y="40" width="55" height="35" fill="#84cc16" rx="4" />
      <text x="132" y="62" fill="#000" fontSize="10" textAnchor="middle" fontFamily="monospace">L?</text>
      <rect x="105" y="85" width="55" height="35" fill="#84cc16" rx="4" />
      <text x="132" y="107" fill="#000" fontSize="10" textAnchor="middle" fontFamily="monospace">R?</text>
      {/* F box */}
      <rect x="180" y="50" width="60" height="60" fill="#84cc16" opacity="0.5" rx="4" />
      <text x="210" y="75" fill="#fff" fontSize="9" textAnchor="middle" fontFamily="monospace">F(R,Ki)</text>
      <text x="210" y="88" fill="#7D7D7D" fontSize="8" textAnchor="middle" fontFamily="monospace">Exp+S+P</text>
      {/* Round arrows */}
      <path d="M160 62 L180 80" stroke="#84cc16" strokeWidth="1.5" fill="none" />
      <text x="200" y="45" fill="#84cc16" fontSize="8" textAnchor="middle" fontFamily="monospace">ROUND i</text>
      {/* Output */}
      <path d="M240 80 L260 80" stroke="#84cc16" strokeWidth="2" fill="none" />
      <rect x="260" y="40" width="55" height="35" fill="#84cc16" rx="4" />
      <text x="287" y="62" fill="#000" fontSize="10" textAnchor="middle" fontFamily="monospace">Li</text>
      <rect x="260" y="85" width="55" height="35" fill="#84cc16" rx="4" />
      <text x="287" y="107" fill="#000" fontSize="10" textAnchor="middle" fontFamily="monospace">Ri</text>
      {/* 16 rounds */}
      <text x="200" y="155" fill="#fff" fontSize="9" textAnchor="middle" fontFamily="monospace">Repeat for 16 rounds</text>
      <text x="200" y="170" fill="#7D7D7D" fontSize="8" textAnchor="middle" fontFamily="monospace">Decrypt: just reverse key schedule - same circuit!</text>
      <text x="200" y="200" fill="#84cc16" fontSize="8" textAnchor="middle" fontFamily="monospace">Li+1 = Ri  |  Ri+1 = Li ? F(Ri, Ki)</text>
    </svg>
  );
}

function RSATrapdoorDiagram() {
  return (
    <svg viewBox="0 0 400 200" style={{ width: '100%', maxWidth: 500 }}>
      <rect width="400" height="200" fill="#1c1c1e" rx="8" />
      <text x="200" y="18" fill="#3b82f6" fontSize="11" textAnchor="middle" fontFamily="monospace">RSA TRAPDOOR</text>
      {/* Easy direction */}
      <text x="80" y="45" fill="#30d158" fontSize="9" textAnchor="middle" fontFamily="monospace">EASY (Forward)</text>
      <rect x="20" y="55" width="60" height="30" fill="#3b82f6" rx="4" />
      <text x="50" y="75" fill="#fff" fontSize="9" textAnchor="middle" fontFamily="monospace">p,q</text>
      <path d="M85 70 L115 70" stroke="#30d158" strokeWidth="2" fill="none" />
      <text x="100" y="65" fill="#7D7D7D" fontSize="7" textAnchor="middle" fontFamily="monospace">multiply</text>
      <rect x="115" y="55" width="60" height="30" fill="#3b82f6" rx="4" />
      <text x="145" y="75" fill="#fff" fontSize="9" textAnchor="middle" fontFamily="monospace">N=pq</text>
      <path d="M180 70 L210 70" stroke="#30d158" strokeWidth="2" fill="none" />
      <text x="195" y="65" fill="#7D7D7D" fontSize="7" textAnchor="middle" fontFamily="monospace">phi</text>
      <rect x="210" y="55" width="60" height="30" fill="#3b82f6" rx="4" />
      <text x="240" y="75" fill="#fff" fontSize="9" textAnchor="middle" fontFamily="monospace">d,e</text>
      <text x="80" y="120" fill="#30d158" fontSize="8" textAnchor="middle" fontFamily="monospace">Key Generation</text>
      {/* Hard direction */}
      <text x="320" y="45" fill="#ef4444" fontSize="9" textAnchor="middle" fontFamily="monospace">HARD (Reverse)</text>
      <rect x="280" y="55" width="70" height="30" fill="#ef4444" opacity="0.3" rx="4" />
      <text x="315" y="75" fill="#ef4444" fontSize="9" textAnchor="middle" fontFamily="monospace">N=pq (pub)</text>
      <text x="315" y="130" fill="#ef4444" fontSize="8" textAnchor="middle" fontFamily="monospace">No known shortcut</text>
      <text x="315" y="145" fill="#ef4444" fontSize="8" textAnchor="middle" fontFamily="monospace">to find p,q from N</text>
      {/* Divider */}
      <line x1="200" y1="35" x2="200" y2="165" stroke="#202020" strokeWidth="1" />
      <text x="200" y="180" fill="#7D7D7D" fontSize="8" textAnchor="middle" fontFamily="monospace">Factoring N -&gt; breaks RSA | Best: GNFS (quasi-exponential)</text>
    </svg>
  );
}

function GenericDiagram({ topic }: { topic: string }) {
  const diagrams: Record<string, JSX.Element> = {
    streamBlock: (
      <svg viewBox="0 0 400 180" style={{ width: '100%', maxWidth: 500 }}>
        <rect width="400" height="180" fill="#1c1c1e" rx="8" />
        <text x="200" y="18" fill="#eab308" fontSize="11" textAnchor="middle" fontFamily="monospace">STREAM vs BLOCK</text>
        <text x="80" y="45" fill="#30d158" fontSize="9" textAnchor="middle" fontFamily="monospace">STREAM</text>
        <rect x="10" y="55" width="50" height="20" fill="#eab308" rx="2" />
        <text x="35" y="68" fill="#000" fontSize="8" textAnchor="middle" fontFamily="monospace">Keystream</text>
        <path d="M65 65 L95 65" stroke="#30d158" strokeWidth="2" fill="none" />
        <rect x="95" y="55" width="30" height="20" fill="#30d158" rx="2" />
        <text x="110" y="68" fill="#000" fontSize="8" textAnchor="middle" fontFamily="monospace">?</text>
        <text x="140" y="68" fill="#fff" fontSize="8" fontFamily="monospace">C</text>
        <text x="80" y="115" fill="#7D7D7D" fontSize="8" textAnchor="middle" fontFamily="monospace">Bit-by-bit ? Stateful</text>
        <text x="320" y="45" fill="#ef4444" fontSize="9" textAnchor="middle" fontFamily="monospace">BLOCK</text>
        <rect x="230" y="55" width="60" height="20" fill="#ef4444" rx="2" />
        <text x="260" y="68" fill="#000" fontSize="8" textAnchor="middle" fontFamily="monospace">Block 128b</text>
        <rect x="310" y="55" width="60" height="20" fill="#ef4444" rx="2" />
        <text x="340" y="68" fill="#000" fontSize="8" textAnchor="middle" fontFamily="monospace">CBC/CTR</text>
        <text x="320" y="115" fill="#7D7D7D" fontSize="8" textAnchor="middle" fontFamily="monospace">Fixed chunks ? Stateless</text>
        <text x="200" y="155" fill="#fff" fontSize="8" textAnchor="middle" fontFamily="monospace">Stream: RC4, ChaCha20 ? Block: AES-CBC, AES-GCM</text>
      </svg>
    ),
    des3des: (
      <svg viewBox="0 0 400 160" style={{ width: '100%', maxWidth: 500 }}>
        <rect width="400" height="160" fill="#1c1c1e" rx="8" />
        <text x="200" y="18" fill="#22c55e" fontSize="11" textAnchor="middle" fontFamily="monospace">DOUBLE DES -&gt; MEET-IN-THE-MIDDLE</text>
        <rect x="10" y="55" width="40" height="30" fill="#22c55e" rx="2" />
        <text x="30" y="75" fill="#000" fontSize="8" textAnchor="middle" fontFamily="monospace">P</text>
        <path d="M55 70 L75 70" stroke="#22c55e" strokeWidth="2" fill="none" />
        <rect x="75" y="50" width="50" height="40" fill="#22c55e" rx="2" />
        <text x="100" y="65" fill="#000" fontSize="8" textAnchor="middle" fontFamily="monospace">DES</text>
        <text x="100" y="77" fill="#000" fontSize="8" textAnchor="middle" fontFamily="monospace">K1</text>
        <path d="M130 70 L150 70" stroke="#ef4444" strokeWidth="2" fill="none" />
        <text x="155" y="55" fill="#ef4444" fontSize="7" textAnchor="middle" fontFamily="monospace">MITM</text>
        <text x="155" y="65" fill="#ef4444" fontSize="7" textAnchor="middle" fontFamily="monospace">match!</text>
        <path d="M155 70 L175 70" stroke="#ef4444" strokeWidth="2" fill="none" />
        <rect x="175" y="50" width="50" height="40" fill="#22c55e" rx="2" />
        <text x="200" y="65" fill="#000" fontSize="8" textAnchor="middle" fontFamily="monospace">DES??</text>
        <text x="200" y="77" fill="#000" fontSize="8" textAnchor="middle" fontFamily="monospace">K2</text>
        <path d="M230 70 L250 70" stroke="#22c55e" strokeWidth="2" fill="none" />
        <rect x="250" y="55" width="40" height="30" fill="#22c55e" rx="2" />
        <text x="270" y="75" fill="#000" fontSize="8" textAnchor="middle" fontFamily="monospace">C</text>
        <text x="200" y="120" fill="#ef4444" fontSize="9" textAnchor="middle" fontFamily="monospace">2^56 work -&gt; effective 57-bit security (NOT 112!)</text>
        <text x="200" y="140" fill="#7D7D7D" fontSize="8" textAnchor="middle" fontFamily="monospace">3DES EDE with K1=K3 -&gt; 2^56 ? K1?K3 -&gt; 2^112</text>
      </svg>
    ),
    aesRounds: (
      <svg viewBox="0 0 400 180" style={{ width: '100%', maxWidth: 500 }}>
        <rect width="400" height="180" fill="#1c1c1e" rx="8" />
        <text x="200" y="18" fill="#14b8a6" fontSize="11" textAnchor="middle" fontFamily="monospace">AES ROUND (SPN)</text>
        {['SubBytes', 'ShiftRows', 'MixColumns', 'AddRoundKey'].map((op, i) => (
          <g key={op}>
            <rect x={15 + i * 95} y="55" width="85" height="50" fill="#14b8a6" rx="4" opacity={0.3 + i * 0.15} />
            <text x={57 + i * 95} y="75" fill="#fff" fontSize="8" textAnchor="middle" fontFamily="monospace">{op}</text>
            <text x={57 + i * 95} y="90" fill="#7D7D7D" fontSize="7" textAnchor="middle" fontFamily="monospace">
              {['S-box', 'Row shift', 'GF mul', 'XOR key'][i]}
            </text>
            {i < 3 && <path d={`${105 + i * 95} 80 L${115 + i * 95} 80`} stroke="#14b8a6" strokeWidth="2" fill="none" />}
          </g>
        ))}
        <text x="200" y="130" fill="#14b8a6" fontSize="9" textAnchor="middle" fontFamily="monospace">10 rounds (AES-128) ? 12 (192) ? 14 (256)</text>
        <text x="200" y="150" fill="#7D7D7D" fontSize="8" textAnchor="middle" fontFamily="monospace">SubBytes = ONLY non-linear component ? GF(2^8) inversion</text>
      </svg>
    ),
    rsaSteps: (
      <svg viewBox="0 0 400 200" style={{ width: '100%', maxWidth: 500 }}>
        <rect width="400" height="200" fill="#1c1c1e" rx="8" />
        <text x="200" y="18" fill="#3b82f6" fontSize="11" textAnchor="middle" fontFamily="monospace">RSA FIVE STEPS</text>
        {[1,2,3,4,5].map(i => (
          <g key={i}>
            <circle cx={30 + (i-1)*80} cy="70" r="22" fill="#3b82f6" opacity={0.3 + i*0.1} />
            <text x={30 + (i-1)*80} y="75" fill="#fff" fontSize="14" textAnchor="middle" fontFamily="monospace" fontWeight="bold">{i}</text>
          </g>
        ))}
        {['Primes\np,q', 'N= pq\n?(N)', 'e\npublic', 'd=e??\nmod ?', 'Encrypt\nDecrypt'].map((t, i) => (
          <text key={i} x={30 + i*80} y="110" fill="#7D7D7D" fontSize="8" textAnchor="middle" fontFamily="monospace">{t}</text>
        ))}
        <path d="M55 70 L85 70" stroke="#3b82f6" strokeWidth="2" fill="none" />
        <path d="M135 70 L165 70" stroke="#3b82f6" strokeWidth="2" fill="none" />
        <path d="M215 70 L245 70" stroke="#3b82f6" strokeWidth="2" fill="none" />
        <path d="M295 70 L325 70" stroke="#3b82f6" strokeWidth="2" fill="none" />
        <text x="200" y="145" fill="#3b82f6" fontSize="9" textAnchor="middle" fontFamily="monospace">Extended Euclidean: ed + ?(N)y = 1</text>
        <text x="200" y="165" fill="#7D7D7D" fontSize="8" textAnchor="middle" fontFamily="monospace">Verify: e?d ? 1 (mod ?(N)) before deployment</text>
        <text x="200" y="185" fill="#30d158" fontSize="8" textAnchor="middle" fontFamily="monospace">C = M^e mod N  |  M = C^d mod N</text>
      </svg>
    ),
    hybrid: (
      <svg viewBox="0 0 400 180" style={{ width: '100%', maxWidth: 500 }}>
        <rect width="400" height="180" fill="#1c1c1e" rx="8" />
        <text x="200" y="18" fill="#8b5cf6" fontSize="11" textAnchor="middle" fontFamily="monospace">HYBRID CRYPTOGRAPHY</text>
        <rect x="20" y="55" width="80" height="30" fill="#8b5cf6" rx="4" />
        <text x="60" y="75" fill="#000" fontSize="8" textAnchor="middle" fontFamily="monospace">AES Session Key K</text>
        <rect x="20" y="95" width="80" height="30" fill="#8b5cf6" rx="4" />
        <text x="60" y="115" fill="#000" fontSize="8" textAnchor="middle" fontFamily="monospace">Large Data (GBs)</text>
        <path d="M105 70 L145 70" stroke="#30d158" strokeWidth="2" fill="none" />
        <text x="125" y="63" fill="#7D7D7D" fontSize="7" textAnchor="middle" fontFamily="monospace">RSA encrypt</text>
        <rect x="145" y="55" width="80" height="30" fill="#ef4444" rx="4" opacity="0.5" />
        <text x="185" y="75" fill="#fff" fontSize="8" textAnchor="middle" fontFamily="monospace">Encrypted K</text>
        <path d="M230 70 L270 70" stroke="#3b82f6" strokeWidth="2" fill="none" />
        <text x="250" y="63" fill="#7D7D7D" fontSize="7" textAnchor="middle" fontFamily="monospace">fast symmetric</text>
        <rect x="270" y="55" width="80" height="30" fill="#3b82f6" rx="4" opacity="0.5" />
        <text x="310" y="75" fill="#fff" fontSize="8" textAnchor="middle" fontFamily="monospace">AES-GCM Data</text>
        <text x="200" y="150" fill="#7D7D7D" fontSize="8" textAnchor="middle" fontFamily="monospace">RSA encrypts 256 bits -&gt; AES encrypts everything else ? TLS uses this</text>
      </svg>
    ),
    eccVsRsa: (
      <svg viewBox="0 0 400 180" style={{ width: '100%', maxWidth: 500 }}>
        <rect width="400" height="180" fill="#1c1c1e" rx="8" />
        <text x="200" y="18" fill="#a855f7" fontSize="11" textAnchor="middle" fontFamily="monospace">ECC vs RSA KEY SIZE</text>
        <rect x="20" y="45" width="100" height="50" fill="#a855f7" rx="4" />
        <text x="70" y="65" fill="#000" fontSize="10" textAnchor="middle" fontFamily="monospace">ECC 256-bit</text>
        <text x="70" y="80" fill="#000" fontSize="10" textAnchor="middle" fontFamily="monospace">~</text>
        <rect x="130" y="45" width="100" height="50" fill="#ef4444" rx="4" />
        <text x="180" y="65" fill="#000" fontSize="10" textAnchor="middle" fontFamily="monospace">RSA 3072-bit</text>
        <text x="180" y="80" fill="#000" fontSize="10" textAnchor="middle" fontFamily="monospace">~ 128-bit</text>
        <text x="200" y="115" fill="#a855f7" fontSize="9" textAnchor="middle" fontFamily="monospace">12? smaller keys at equivalent security</text>
        <text x="200" y="135" fill="#7D7D7D" fontSize="8" textAnchor="middle" fontFamily="monospace">80-bit: ECC 160 / RSA 1024</text>
        <text x="200" y="152" fill="#7D7D7D" fontSize="8" textAnchor="middle" fontFamily="monospace">256-bit: ECC 512 / RSA 15360</text>
        <text x="200" y="168" fill="#30d158" fontSize="8" textAnchor="middle" fontFamily="monospace">ECC = ECDLP ? RSA = Integer Factorization</text>
      </svg>
    ),
    diffieHellman: (
      <svg viewBox="0 0 400 200" style={{ width: '100%', maxWidth: 500 }}>
        <rect width="400" height="200" fill="#1c1c1e" rx="8" />
        <text x="200" y="18" fill="#ec4899" fontSize="11" textAnchor="middle" fontFamily="monospace">DIFFIE-HELLMAN KEY EXCHANGE</text>
        <text x="80" y="50" fill="#30d158" fontSize="9" textAnchor="middle" fontFamily="monospace">Alice</text>
        <text x="320" y="50" fill="#3b82f6" fontSize="9" textAnchor="middle" fontFamily="monospace">Bob</text>
        <rect x="20" y="65" width="50" height="25" fill="#ec4899" rx="2" />
        <text x="45" y="82" fill="#000" fontSize="8" textAnchor="middle" fontFamily="monospace">a=6</text>
        <rect x="330" y="65" width="50" height="25" fill="#3b82f6" rx="2" />
        <text x="355" y="82" fill="#000" fontSize="8" textAnchor="middle" fontFamily="monospace">b=15</text>
        <rect x="100" y="65" width="50" height="25" fill="#ec4899" rx="2" />
        <text x="125" y="82" fill="#000" fontSize="7" textAnchor="middle" fontFamily="monospace">A=5^6</text>
        <text x="125" y="92" fill="#000" fontSize="7" textAnchor="middle" fontFamily="monospace">mod 23=8</text>
        <rect x="250" y="65" width="50" height="25" fill="#3b82f6" rx="2" />
        <text x="275" y="82" fill="#000" fontSize="7" textAnchor="middle" fontFamily="monospace">B=5^15</text>
        <text x="275" y="92" fill="#000" fontSize="7" textAnchor="middle" fontFamily="monospace">mod 23=19</text>
        <path d="M175 78 L225 78" stroke="#7D7D7D" strokeWidth="1" strokeDasharray="4" fill="none" />
        <text x="200" y="73" fill="#7D7D7D" fontSize="7" textAnchor="middle" fontFamily="monospace">A,B public</text>
        <text x="200" y="130" fill="#ec4899" fontSize="9" textAnchor="middle" fontFamily="monospace">Alice: K = B^a mod p = 19^6 mod 23 = 2</text>
        <text x="200" y="150" fill="#3b82f6" fontSize="9" textAnchor="middle" fontFamily="monospace">Bob: K = A^b mod p = 8^15 mod 23 = 2</text>
        <text x="200" y="175" fill="#30d158" fontSize="9" textAnchor="middle" fontFamily="monospace">Shared secret K=2 ? No key sent in clear!</text>
      </svg>
    ),
    mitm: (
      <svg viewBox="0 0 400 180" style={{ width: '100%', maxWidth: 500 }}>
        <rect width="400" height="180" fill="#1c1c1e" rx="8" />
        <text x="200" y="18" fill="#f43f5e" fontSize="11" textAnchor="middle" fontFamily="monospace">DH MITM ATTACK</text>
        <text x="60" y="50" fill="#30d158" fontSize="9" textAnchor="middle" fontFamily="monospace">Alice</text>
        <text x="200" y="50" fill="#ef4444" fontSize="9" textAnchor="middle" fontFamily="monospace">Eve</text>
        <text x="340" y="50" fill="#3b82f6" fontSize="9" textAnchor="middle" fontFamily="monospace">Bob</text>
        <path d="M60 65 L200 65" stroke="#7D7D7D" strokeWidth="1" fill="none" />
        <path d="M200 65 L340 65" stroke="#7D7D7D" strokeWidth="1" fill="none" />
        <text x="200" y="90" fill="#f43f5e" fontSize="8" textAnchor="middle" fontFamily="monospace">Alice thinks she talks to Bob ? Bob thinks he talks to Alice</text>
        <text x="200" y="110" fill="#7D7D7D" fontSize="8" textAnchor="middle" fontFamily="monospace">Eve: intercepts A -&gt; generates e -&gt; sends B=g^e to Bob</text>
        <text x="200" y="130" fill="#7D7D7D" fontSize="8" textAnchor="middle" fontFamily="monospace">Eve has K1=g^(ae) with Alice ? K2=g^(eb) with Bob</text>
        <text x="200" y="155" fill="#ef4444" fontSize="9" textAnchor="middle" fontFamily="monospace">Fix: Authenticated DH (ECDHE with certificates)</text>
      </svg>
    ),
    shaFamily: (
      <svg viewBox="0 0 400 180" style={{ width: '100%', maxWidth: 500 }}>
        <rect width="400" height="180" fill="#1c1c1e" rx="8" />
        <text x="200" y="18" fill="#e879f9" fontSize="11" textAnchor="middle" fontFamily="monospace">SHA FAMILY</text>
        {[
          { label: 'SHA-1', color: '#ef4444', out: '160-bit', note: 'BROKEN', y: 50 },
          { label: 'SHA-256', color: '#30d158', out: '256-bit', note: 'Secure', y: 85 },
          { label: 'SHA-3', color: '#3b82f6', out: 'Variable', note: 'Sponge', y: 120 },
        ].map(({ label, color, out, note, y }) => (
          <g key={label}>
            <rect x="30" y={y} width="120" height="28" fill={color} rx="4" />
            <text x="90" y={y + 18} fill={color === '#ef4444' ? '#000' : '#000'} fontSize="10" textAnchor="middle" fontFamily="monospace">{label}</text>
            <text x="170" y={y + 18} fill="#7D7D7D" fontSize="8" textAnchor="middle" fontFamily="monospace">{out}</text>
            <text x="250" y={y + 18} fill={color === '#ef4444' ? '#ef4444' : '#30d158'} fontSize="8" textAnchor="middle" fontFamily="monospace">{note}</text>
            <text x="350" y={y + 18} fill="#7D7D7D" fontSize="7" textAnchor="middle" fontFamily="monospace">
              {label === 'SHA-1' ? 'MD+Merkle' : label === 'SHA-256' ? 'MD+Merkle' : 'Sponge'}
            </text>
          </g>
        ))}
        <text x="200" y="160" fill="#7D7D7D" fontSize="8" textAnchor="middle" fontFamily="monospace">MD = Merkle-Damg?rd (len-ext) ? Sponge = absorption + squeezing</text>
      </svg>
    ),
    hmac: (
      <svg viewBox="0 0 400 180" style={{ width: '100%', maxWidth: 500 }}>
        <rect width="400" height="180" fill="#1c1c1e" rx="8" />
        <text x="200" y="18" fill="#c084fc" fontSize="11" textAnchor="middle" fontFamily="monospace">HMAC vs HASH(Key||Msg)</text>
        <rect x="20" y="45" width="160" height="50" fill="#c084fc" rx="4" />
        <text x="100" y="62" fill="#000" fontSize="9" textAnchor="middle" fontFamily="monospace">H(K ? ipad || m)</text>
        <text x="100" y="78" fill="#000" fontSize="9" textAnchor="middle" fontFamily="monospace">-&gt; H(K ? opad || inner)</text>
        <text x="100" y="105" fill="#30d158" fontSize="8" textAnchor="middle" fontFamily="monospace">HMAC (SECURE)</text>
        <rect x="220" y="45" width="160" height="50" fill="#ef4444" opacity="0.4" rx="4" />
        <text x="300" y="65" fill="#ef4444" fontSize="9" textAnchor="middle" fontFamily="monospace">H(K || m)</text>
        <text x="300" y="90" fill="#ef4444" fontSize="8" textAnchor="middle" fontFamily="monospace">Vulnerable to len-ext!</text>
        <text x="200" y="140" fill="#7D7D7D" fontSize="8" textAnchor="middle" fontFamily="monospace">ipad=0x36, opad=0x5C (different masks prevent length extension)</text>
        <text x="200" y="165" fill="#c084fc" fontSize="8" textAnchor="middle" fontFamily="monospace">HMAC = H((K xor opad) || H((K xor ipad) || m))</text>
      </svg>
    ),
    lengthExtension: (
      <svg viewBox="0 0 400 180" style={{ width: '100%', maxWidth: 500 }}>
        <rect width="400" height="180" fill="#1c1c1e" rx="8" />
        <text x="200" y="18" fill="#a78bfa" fontSize="11" textAnchor="middle" fontFamily="monospace">LENGTH EXTENSION ATTACK</text>
        <text x="200" y="45" fill="#7D7D7D" fontSize="9" textAnchor="middle" fontFamily="monospace">Merkle-Damg?rd hash output = internal state (IV)</text>
        <rect x="30" y="65" width="100" height="30" fill="#a78bfa" rx="4" />
        <text x="80" y="85" fill="#000" fontSize="9" textAnchor="middle" fontFamily="monospace">M (secret||msg)</text>
        <path d="M135 80 L165 80" stroke="#a78bfa" strokeWidth="2" fill="none" />
        <rect x="165" y="65" width="60" height="30" fill="#a78bfa" rx="4" />
        <text x="195" y="85" fill="#000" fontSize="9" textAnchor="middle" fontFamily="monospace">H(M)=T</text>
        <path d="M230 80 L260 80" stroke="#ef4444" strokeWidth="2" fill="none" />
        <rect x="260" y="65" width="120" height="30" fill="#ef4444" opacity="0.4" rx="4" />
        <text x="320" y="85" fill="#ef4444" fontSize="8" textAnchor="middle" fontFamily="monospace">H(M||pad||X)</text>
        <text x="320" y="95" fill="#ef4444" fontSize="7" textAnchor="middle" fontFamily="monospace">computed without K!</text>
        <text x="200" y="130" fill="#a78bfa" fontSize="8" textAnchor="middle" fontFamily="monospace">Attacker knows internal state from output -&gt; continues compression</text>
        <text x="200" y="155" fill="#30d158" fontSize="8" textAnchor="middle" fontFamily="monospace">Fix: HMAC (double hashing) or SHA-3 (sponge - no state exposure)</text>
      </svg>
    ),
    cbcMac: (
      <svg viewBox="0 0 400 180" style={{ width: '100%', maxWidth: 500 }}>
        <rect width="400" height="180" fill="#1c1c1e" rx="8" />
        <text x="200" y="18" fill="#818cf8" fontSize="11" textAnchor="middle" fontFamily="monospace">CBC-MAC SPLICING ATTACK</text>
        <text x="200" y="45" fill="#7D7D7D" fontSize="8" textAnchor="middle" fontFamily="monospace">CBC-MAC: last ciphertext block = MAC tag (IV=0, deterministic)</text>
        <rect x="30" y="65" width="80" height="25" fill="#818cf8" rx="2" />
        <text x="70" y="82" fill="#000" fontSize="8" textAnchor="middle" fontFamily="monospace">T1 = MAC(P1)</text>
        <rect x="130" y="65" width="80" height="25" fill="#818cf8" rx="2" />
        <text x="170" y="82" fill="#000" fontSize="8" textAnchor="middle" fontFamily="monospace">T2 = MAC(P2)</text>
        <text x="200" y="110" fill="#ef4444" fontSize="8" textAnchor="middle" fontFamily="monospace">Forge: MAC(P1 || P2?T1) = T2</text>
        <path d="M215 95 L215 105" stroke="#ef4444" strokeWidth="1" fill="none" />
        <text x="200" y="135" fill="#7D7D7D" fontSize="8" textAnchor="middle" fontFamily="monospace">P2' = P2 ? T1 ? CBC(P1||P2-prime) = E(K, P2-prime XOR T1) = E(K,P2) = T2</text>
        <text x="200" y="160" fill="#30d158" fontSize="8" textAnchor="middle" fontFamily="monospace">Fix: CMAC (two subkeys K1,K2) - algebraic relation broken</text>
      </svg>
    ),
    quantum: (
      <svg viewBox="0 0 400 200" style={{ width: '100%', maxWidth: 500 }}>
        <rect width="400" height="200" fill="#1c1c1e" rx="8" />
        <text x="200" y="18" fill="#6366f1" fontSize="11" textAnchor="middle" fontFamily="monospace">QUANTUM THREAT</text>
        <rect x="20" y="45" width="170" height="70" fill="#ef4444" opacity="0.3" rx="4" />
        <text x="105" y="65" fill="#ef4444" fontSize="11" textAnchor="middle" fontFamily="monospace">SHOR'S</text>
        <text x="105" y="82" fill="#ef4444" fontSize="9" textAnchor="middle" fontFamily="monospace">Integer Factorization</text>
        <text x="105" y="98" fill="#ef4444" fontSize="8" textAnchor="middle" fontFamily="monospace">RSA-2048: BROKEN</text>
        <rect x="210" y="45" width="170" height="70" fill="#f97316" opacity="0.3" rx="4" />
        <text x="295" y="65" fill="#f97316" fontSize="11" textAnchor="middle" fontFamily="monospace">GROVER'S</text>
        <text x="295" y="82" fill="#f97316" fontSize="9" textAnchor="middle" fontFamily="monospace">Unstructured Search</text>
        <text x="295" y="98" fill="#f97316" fontSize="8" textAnchor="middle" fontFamily="monospace">AES-128 - (2^64) (not broken)</text>
        <text x="200" y="135" fill="#6366f1" fontSize="9" textAnchor="middle" fontFamily="monospace">Asymmetric: EXPONENTIAL speedup (Shor) ? Symmetric: QUADRATIC (Grover)</text>
        <text x="200" y="155" fill="#7D7D7D" fontSize="8" textAnchor="middle" fontFamily="monospace">Fix: AES-256 (Grover-&amp;gt;2^128), PQC lattice-based (no known quantum speedup)</text>
        <text x="200" y="180" fill="#30d158" fontSize="8" textAnchor="middle" fontFamily="monospace">NIST PQC: ML-KEM (CRYSTALS-Kyber), ML-DSA, FALCON, SPHINCS+</text>
      </svg>
    ),
    pqc: (
      <svg viewBox="0 0 400 180" style={{ width: '100%', maxWidth: 500 }}>
        <rect width="400" height="180" fill="#1c1c1e" rx="8" />
        <text x="200" y="18" fill="#4f46e5" fontSize="11" textAnchor="middle" fontFamily="monospace">NIST PQC FAMILIES</text>
        {[
          { label: 'Lattice', sub: 'Kyber/Dilithium', color: '#4f46e5', y: 45 },
          { label: 'Hash-Based', sub: 'SPHINCS+', color: '#6366f1', y: 80 },
          { label: 'Code-Based', sub: 'McEliece', color: '#818cf8', y: 115 },
          { label: 'Multivariate', sub: 'Signatures', color: '#a78bfa', y: 150 },
        ].map(({ label, sub, color, y }) => (
          <g key={label}>
            <rect x="20" y={y} width="90" height="28" fill={color} rx="2" />
            <text x="65" y={y + 12} fill="#fff" fontSize="8" textAnchor="middle" fontFamily="monospace">{label}</text>
            <text x="65" y={y + 23} fill={color} fontSize="7" textAnchor="middle" fontFamily="monospace">{sub}</text>
          </g>
        ))}
        <text x="200" y="60" fill="#4f46e5" fontSize="8" textAnchor="middle" fontFamily="monospace">LWE: (A,b=As+e) -&gt; find s</text>
        <text x="200" y="95" fill="#6366f1" fontSize="8" textAnchor="middle" fontFamily="monospace">Based on hash only - most conservative</text>
        <text x="200" y="130" fill="#818cf8" fontSize="8" textAnchor="middle" fontFamily="monospace">Based on syndrome decoding - large keys</text>
        <text x="200" y="165" fill="#7D7D7D" fontSize="8" textAnchor="middle" fontFamily="monospace">Lattice = best size/performance ? Hash = maximal confidence</text>
      </svg>
    ),
    tls: (
      <svg viewBox="0 0 400 200" style={{ width: '100%', maxWidth: 500 }}>
        <rect width="400" height="200" fill="#1c1c1e" rx="8" />
        <text x="200" y="18" fill="#4338ca" fontSize="11" textAnchor="middle" fontFamily="monospace">TLS 1.3 vs 1.2 HANDSHAKE</text>
        <text x="80" y="45" fill="#30d158" fontSize="9" textAnchor="middle" fontFamily="monospace">TLS 1.2</text>
        <text x="300" y="45" fill="#3b82f6" fontSize="9" textAnchor="middle" fontFamily="monospace">TLS 1.3</text>
        <rect x="20" y="60" width="130" height="20" fill="#30d158" opacity="0.3" rx="2" />
        <text x="85" y="74" fill="#30d158" fontSize="7" textAnchor="middle" fontFamily="monospace">ClientHello</text>
        <rect x="20" y="85" width="130" height="20" fill="#30d158" opacity="0.3" rx="2" />
        <text x="85" y="99" fill="#30d158" fontSize="7" textAnchor="middle" fontFamily="monospace">ServerHello+Cert</text>
        <rect x="20" y="110" width="130" height="20" fill="#30d158" opacity="0.3" rx="2" />
        <text x="85" y="124" fill="#30d158" fontSize="7" textAnchor="middle" fontFamily="monospace">ClientKeyExchange</text>
        <text x="80" y="155" fill="#ef4444" fontSize="9" textAnchor="middle" fontFamily="monospace">2 RTTs</text>
        <rect x="200" y="60" width="180" height="20" fill="#3b82f6" opacity="0.3" rx="2" />
        <text x="290" y="74" fill="#3b82f6" fontSize="7" textAnchor="middle" fontFamily="monospace">ClientHello + key_share (ECDHE)</text>
        <rect x="200" y="85" width="180" height="20" fill="#3b82f6" opacity="0.3" rx="2" />
        <text x="290" y="99" fill="#3b82f6" fontSize="7" textAnchor="middle" fontFamily="monospace">ServerHello + key_share + Finished</text>
        <text x="300" y="155" fill="#30d158" fontSize="9" textAnchor="middle" fontFamily="monospace">1 RTT ? 0-RTT resumption</text>
        <text x="200" y="175" fill="#7D7D7D" fontSize="8" textAnchor="middle" fontFamily="monospace">TLS 1.3: AEAD (AES-GCM/ChaCha20) ? HKDF key derivation ? Forward secrecy mandatory</text>
      </svg>
    ),
    wpa: (
      <svg viewBox="0 0 400 180" style={{ width: '100%', maxWidth: 500 }}>
        <rect width="400" height="180" fill="#1c1c1e" rx="8" />
        <text x="200" y="18" fill="#3730a3" fontSize="11" textAnchor="middle" fontFamily="monospace">WPA2 vs WPA3</text>
        <rect x="20" y="45" width="160" height="60" fill="#ef4444" opacity="0.3" rx="4" />
        <text x="100" y="62" fill="#ef4444" fontSize="10" textAnchor="middle" fontFamily="monospace">WPA2 (PSK)</text>
        <text x="100" y="78" fill="#ef4444" fontSize="8" textAnchor="middle" fontFamily="monospace">4-way handshake</text>
        <text x="100" y="93" fill="#ef4444" fontSize="7" textAnchor="middle" fontFamily="monospace">Offline dict attack if weak pw</text>
        <rect x="210" y="45" width="160" height="60" fill="#30d158" opacity="0.3" rx="4" />
        <text x="290" y="62" fill="#30d158" fontSize="10" textAnchor="middle" fontFamily="monospace">WPA3 (SAE)</text>
        <text x="290" y="78" fill="#30d158" fontSize="8" textAnchor="middle" fontFamily="monospace">PAKE (Dragonfly)</text>
        <text x="290" y="93" fill="#30d158" fontSize="7" textAnchor="middle" fontFamily="monospace">Online guess only ? No offline</text>
        <text x="200" y="130" fill="#7D7D7D" fontSize="8" textAnchor="middle" fontFamily="monospace">WPA2: capture handshake -&gt; compute PMK from dictionary offline</text>
        <text x="200" y="150" fill="#7D7D7D" fontSize="8" textAnchor="middle" fontFamily="monospace">WPA3 SAE: commit before data ? must interact for each guess</text>
        <text x="200" y="168" fill="#3730a3" fontSize="8" textAnchor="middle" fontFamily="monospace">KRACK (2017): replay msg-3 breaks WPA2 ? SAE resistant</text>
      </svg>
    ),
  };
  return diagrams[topic] || <div style={{ padding: 20, color: '#7D7D7D' }}>Diagram: {topic}</div>;
}

/* =======================================================
   SLIDE COMPONENTS - each slide type with animations
======================================================== */
function TitleSlide({ data, topicIndex }: { data: TOPICS[0]['slides']['title']; topicIndex: number }) {
  return (
    <motion.div key={`title-${topicIndex}`} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 24, textAlign: 'center' }}>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }} style={{ padding: '6px 16px', borderRadius: 2, background: 'rgba(255,192,0,0.1)', border: '1px solid rgba(255,192,0,0.3)', fontSize: '11px', fontFamily: "'JetBrains Mono', monospace", color: '#FFC000', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
        {data.badge}
      </motion.div>
      <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.7 }} style={{ fontSize: 'clamp(40px, 8vw, 80px)', fontWeight: 700, color: '#fff', letterSpacing: '-0.04em', lineHeight: 0.95, margin: 0 }}>
        {data.heading}
      </motion.h1>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55, duration: 0.5 }} style={{ fontSize: '16px', color: '#7D7D7D', margin: 0 }}>
        {data.sub}
      </motion.p>
    </motion.div>
  );
}

function WhatIsSlide({ data, topicIndex }: { data: string; topicIndex: number }) {
  const words = data.split(' ');
  return (
    <motion.div key={`what-${topicIndex}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', gap: 20 }}>
      <motion.h2 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1, duration: 0.4 }} style={{ fontSize: 'clamp(20px, 4vw, 32px)', color: '#fff', fontWeight: 600, letterSpacing: '-0.02em', margin: 0 }}>
        WHAT IS IT?
      </motion.h2>
      <p style={{ fontSize: 'clamp(14px, 2vw, 17px)', color: '#E1E0CC', lineHeight: 1.7, margin: 0 }}>
        {words.map((word, i) => (
          <motion.span key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 * i, duration: 0.02 }} style={{ display: 'inline-block', marginRight: '0.28em' }}>
            {word}
          </motion.span>
        ))}
      </p>
    </motion.div>
  );
}

function DiagramSlide({ diagram, topicIndex, color }: { diagram: string; topicIndex: number; color: string }) {
  return (
    <motion.div key={`diag-${topicIndex}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', gap: 20, alignItems: 'center' }}>
      <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} style={{ fontSize: 'clamp(20px, 4vw, 32px)', color: '#fff', fontWeight: 600, letterSpacing: '-0.02em', margin: 0 }}>
        VISUAL STRUCTURE
      </motion.h2>
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3, duration: 0.5 }} style={{ width: '100%', maxWidth: 520 }}>
        <GenericDiagram topic={diagram} />
      </motion.div>
    </motion.div>
  );
}

function HowItWorksSlide({ data, topicIndex }: { data: { n: string; label: string; desc: string }[]; topicIndex: number }) {
  return (
    <motion.div key={`how-${topicIndex}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', gap: 16 }}>
      <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ fontSize: 'clamp(20px, 4vw, 32px)', color: '#fff', fontWeight: 600, letterSpacing: '-0.02em', margin: 0 }}>
        HOW IT WORKS
      </motion.h2>
      {data.map((step, i) => (
        <motion.div key={step.n} initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 * i, duration: 0.4 }} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,192,0,0.15)', border: '1px solid rgba(255,192,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#FFC000', fontFamily: "'JetBrains Mono', monospace" }}>{step.n}</span>
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#FFC000', marginBottom: 2 }}>{step.label}</div>
            <div style={{ fontSize: '13px', color: '#7D7D7D', lineHeight: 1.5 }}>{step.desc}</div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

function WhyItMattersSlide({ data, topicIndex }: { data: string; topicIndex: number }) {
  return (
    <motion.div key={`why-${topicIndex}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', gap: 20 }}>
      <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ fontSize: 'clamp(20px, 4vw, 32px)', color: '#fff', fontWeight: 600, letterSpacing: '-0.02em', margin: 0 }}>
        WHY IT MATTERS
      </motion.h2>
      <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.5 }} style={{ background: 'rgba(48,209,88,0.06)', border: '1px solid rgba(48,209,88,0.15)', borderRadius: 8, padding: '20px 24px' }}>
        <p style={{ fontSize: 'clamp(14px, 2vw, 16px)', color: '#E1E0CC', lineHeight: 1.7, margin: 0 }}>{data}</p>
      </motion.div>
    </motion.div>
  );
}

function ExamTipSlide({ data, topicIndex }: { data: string; topicIndex: number }) {
  const keywords = data.match(/[A-Z]{2,}/g) || [];
  return (
    <motion.div key={`exam-${topicIndex}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', gap: 20 }}>
      <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ fontSize: 'clamp(20px, 4vw, 32px)', color: '#fff', fontWeight: 600, letterSpacing: '-0.02em', margin: 0 }}>
        EXAM TIP
      </motion.h2>
      <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} style={{ fontSize: 'clamp(14px, 2vw, 16px)', color: '#FFC000', lineHeight: 1.6, margin: 0 }}>
        {data}
      </motion.p>
      {keywords.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
          {keywords.slice(0, 8).map(kw => (
            <span key={kw} style={{ padding: '4px 10px', background: 'rgba(255,192,0,0.1)', border: '1px solid rgba(255,192,0,0.3)', borderRadius: 2, fontSize: '11px', fontFamily: "'JetBrains Mono', monospace", color: '#FFC000', letterSpacing: '0.05em' }}>
              {kw}
            </span>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}

/* =======================================================
   PROGRESS BAR + SLIDE COUNTER
======================================================== */
function ProgressBar({ topicIndex, slideIndex, totalTopics }: { topicIndex: number; slideIndex: number; totalTopics: number }) {
  const progress = ((topicIndex * 6 + slideIndex) / (totalTopics * 6)) * 100;
  return (
    <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderTop: '1px solid rgba(255,255,255,0.08)', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 16, zIndex: 50 }}>
      <div style={{ fontSize: '11px', color: '#7D7D7D', fontFamily: "'JetBrains Mono', monospace", minWidth: 60 }}>
        {topicIndex + 1}/{totalTopics}
      </div>
      <div style={{ flex: 1, height: 3, background: 'rgba(255,255,255,0.08)', borderRadius: 2, overflow: 'hidden' }}>
        <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.3 }} style={{ height: '100%', background: '#FFC000', borderRadius: 2 }} />
      </div>
      <div style={{ fontSize: '11px', color: '#7D7D7D', fontFamily: "'JetBrains Mono', monospace" }}>
        {slideIndex + 1}/6
      </div>
    </div>
  );
}

/* =======================================================
   NAVIGATION ARROWS
======================================================== */
function NavArrow({ direction, onClick, disabled }: { direction: 'left' | 'right'; onClick: () => void; disabled: boolean }) {
  return (
    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onClick={onClick} disabled={disabled} style={{ position: 'fixed', top: '50%', [direction]: 20, transform: 'translateY(-50%)', zIndex: 50, width: 48, height: 48, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)', cursor: disabled ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: disabled ? 0.2 : 1, transition: 'opacity 0.2s' }}>
      {direction === 'left' ? <ArrowLeft size={18} color="#fff" /> : <ArrowRight size={18} color="#fff" />}
    </motion.button>
  );
}

/* =======================================================
   MAIN COMPONENT
======================================================== */
interface CryptoLearnModeProps {
  onBack: () => void;
}

export function CryptoLearnMode({ onBack }: CryptoLearnModeProps) {
  const navigate = useNavigate();
  const [topicIndex, setTopicIndex] = useState(0);
  const [slideIndex, setSlideIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);
  const autoPlayRef = useRef<ReturnType<typeof setTimeoutGT | null>(null);

  const topic = TOPICS[topicIndex];
  const slides = topic.slides;
  const SLIDE_COMPONENTS = [
    <TitleSlide data={slides.title} topicIndex={topicIndex} />,
    <WhatIsSlide data={slides.whatIs} topicIndex={topicIndex} />,
    <DiagramSlide diagram={slides.diagram} topicIndex={topicIndex} color={topic.color} />,
    <HowItWorksSlide data={slides.howItWorks} topicIndex={topicIndex} />,
    <WhyItMattersSlide data={slides.whyItMatters} topicIndex={topicIndex} />,
    <ExamTipSlide data={slides.examTip} topicIndex={topicIndex} />,
  ];

  const goNext = useCallback(() => {
    if (slideIndex < 5) {
      setSlideIndex(s => s + 1);
    } else if (topicIndex < TOPICS.length - 1) {
      setTopicIndex(t => t + 1);
      setSlideIndex(0);
    }
  }, [slideIndex, topicIndex]);

  const goPrev = useCallback(() => {
    if (slideIndex > 0) {
      setSlideIndex(s => s - 1);
    } else if (topicIndex > 0) {
      setTopicIndex(t => t - 1);
      setSlideIndex(5);
    }
  }, [slideIndex, topicIndex]);

  const goNextTopic = useCallback(() => {
    if (topicIndex < TOPICS.length - 1) {
      setTopicIndex(t => t + 1);
      setSlideIndex(0);
    }
  }, [topicIndex]);

  const goPrevTopic = useCallback(() => {
    if (topicIndex > 0) {
      setTopicIndex(t => t - 1);
      setSlideIndex(0);
    }
  }, [topicIndex]);

  // Auto-play
  useEffect(() => {
    if (autoPlayRef.current) clearTimeout(autoPlayRef.current);
    if (autoPlay) {
      autoPlayRef.current = setTimeout(() => {
        goNext();
        autoPlayRef.current = null;
      }, 4000);
    }
    return () => { if (autoPlayRef.current) clearTimeout(autoPlayRef.current); };
  }, [autoPlay, topicIndex, slideIndex, goNext]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); goNext(); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); goPrev(); }
      else if (e.key === 'Escape') onBack();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [goNext, goPrev, onBack]);

  // Touch/swipe support
  const touchStartX = useRef<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { diff > 0 ? goNext() : goPrev(); }
    touchStartX.current = null;
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#000', zIndex: 1000 }} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      {/* Top bar */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 60, display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '6px 14px', fontSize: '12px', fontWeight: 500, color: '#fff', cursor: 'pointer' }}>
          <ArrowLeft size={13} /> Back
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#FFC000' }} />
          <span style={{ fontSize: '14px', fontWeight: 600, color: '#fff' }}>Crypto Learn Mode</span>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          {/* Auto-play */}
          <button onClick={() => setAutoPlay(a => !a)} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 14px', borderRadius: 8, background: autoPlay ? 'rgba(255,192,0,0.2)' : 'rgba(255,255,255,0.06)', border: autoPlay ? '1px solid rgba(255,192,0,0.4)' : '1px solid rgba(255,255,255,0.1)', color: autoPlay ? '#FFC000' : '#fff', fontSize: '12px', fontWeight: 500, cursor: 'pointer' }}>
            {autoPlay ? <Pause size={12} /> : <Play size={12} />} Auto
          </button>
          {/* Skip */}
          <button onClick={goNextTopic} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '12px', cursor: 'pointer' }}>
            <SkipForward size={11} /> Next Topic
          </button>
        </div>
      </div>

      {/* Main content - swipeable area */}
      <div style={{ position: 'absolute', top: 60, bottom: 60, left: 0, right: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(20px, 5vw, 60px)' }}>
        <AnimatePresence mode="wait">
          <motion.div key={`${topicIndex}-${slideIndex}`} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }} style={{ width: '100%', maxWidth: 800 }}>
            {SLIDE_COMPONENTS[slideIndex]}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Nav arrows */}
      <NavArrow direction="left" onClick={goPrev} disabled={topicIndex === 0 && slideIndex === 0} />
      <NavArrow direction="right" onClick={goNext} disabled={topicIndex === TOPICS.length - 1 && slideIndex === 5} />

      {/* Progress bar + counter */}
      <ProgressBar topicIndex={topicIndex} slideIndex={slideIndex} totalTopics={TOPICS.length} />

      {/* Slide type indicator */}
      <div style={{ position: 'fixed', bottom: 72, right: 20, display: 'flex', gap: 6, zIndex: 50 }}>
        {[0,1,2,3,4,5].map(i => (
          <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: i === slideIndex ? '#FFC000' : 'rgba(255,255,255,0.2)' }} />
        ))}
      </div>
    </div>
  );
}

export default CryptoLearnMode;
