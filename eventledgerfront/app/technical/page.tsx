"use client";

import { useState, useEffect, useRef } from "react";
import { MermaidDiagram } from "@/components/mermaid-diagram";
import { MermaidFullscreenViewer } from "@/components/mermaid-fullscreen-viewer";
import { PitchControls } from "@/components/sections/pitch-controls";
import { ClosingNextStepsQuestionsSection } from "@/components/sections/closing-next-steps-questions-section";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const architectureDiagrams = [
    {
        id: "system-context",
        title: "System Context (Who uses what)",
        description: "Shows the three personas (Organizer, Attendee, Scanner) and every major component they touch: Web app + Scanner PWA, Sui/Walrus/Seal/Walrus Sites, and the centralized \"acceleration\" layer (API, DB, indexer, cache, queue).",
        mermaidCode: `
%%{init: {"theme":"base","themeVariables":{"background":"#0A0A0A","primaryColor":"#171717","secondaryColor":"#262626","primaryTextColor":"#FFFFFF","secondaryTextColor":"#A3A3A3","lineColor":"#333333","fontFamily":"Inter, ui-sans-serif, system-ui"}}}%%
flowchart TB
classDef card fill:#171717,stroke:#333333,color:#FFFFFF,stroke-width:1px;
classDef muted fill:#262626,stroke:#333333,color:#A3A3A3,stroke-width:1px;
classDef accent fill:#171717,stroke:#06b6d4,color:#FFFFFF,stroke-width:2px;
classDef danger fill:#171717,stroke:#ef4444,color:#FFFFFF,stroke-width:2px;

A["DIAGRAM 1 — SYSTEM CONTEXT (WHO USES WHAT)"]:::muted
subgraph Personas["Personas"]
O["Organizer"]:::card
U["Attendee"]:::card
S["Scanner/Staff"]:::card
end

subgraph Core["EventLedger Core"]
WEB["Web App (Next.js)<br/>Organizer + Attendee"]:::accent
PWA["Scanner PWA<br/>(Offline-friendly)"]:::accent
API["Backend API (Express)<br/>Index/Export/Notify"]:::card
IDX["Indexer Workers<br/>(queue-driven)"]:::card
end

subgraph Infra["Centralized Infra (OK + explicit)"]
DB["Postgres (Cloud SQL)"]:::muted
REDIS["Redis Cache"]:::muted
Q["Queue (PubSub/Tasks)"]:::muted
end

subgraph Web3["Web3 Primitives"]
SUI["Sui (Move)<br/>Event/Ticket/Attendance"]:::muted
WAL["Walrus Blobs<br/>Public + Encrypted"]:::muted
SITE["Walrus Sites<br/>Event pages bundle"]:::muted
SEAL["Seal<br/>Encrypt/Decrypt by policy"]:::muted
end

subgraph SaaS["Integrations"]
EMAIL["Resend (Email)"]:::muted
WNOTIF["Push/Notifi (Wallet Notifs)<br/>Optional"]:::muted
AN["Mixpanel"]:::muted
end

O --> WEB
U --> WEB
S --> PWA

WEB --> SUI
WEB --> WAL
WEB --> SEAL
WEB --> SITE

PWA --> SUI
API --> DB
API --> REDIS
API --> EMAIL
API --> WNOTIF
WEB --> AN

SUI --> Q
WAL --> Q
Q --> IDX
IDX --> DB
IDX --> REDIS
`,
    },
    {
        id: "primitives",
        title: "Primitives (What lives where)",
        description: "Defines the core objects and where they live: minimal on‑chain Sui objects, rich Walrus blobs (public + encrypted), and a rebuildable Postgres index used only for search/UX.",
        mermaidCode: `
%%{init: {"theme":"base","themeVariables":{"background":"#0A0A0A","primaryColor":"#171717","secondaryColor":"#262626","primaryTextColor":"#FFFFFF","secondaryTextColor":"#A3A3A3","lineColor":"#333333","fontFamily":"Inter, ui-sans-serif, system-ui"}}}%%
flowchart TB
classDef card fill:#171717,stroke:#333333,color:#FFFFFF,stroke-width:1px;
classDef muted fill:#262626,stroke:#333333,color:#A3A3A3,stroke-width:1px;
classDef accent fill:#171717,stroke:#06b6d4,color:#FFFFFF,stroke-width:2px;

A["DIAGRAM 2 — PRIMITIVES (WHAT LIVES WHERE)"]:::muted

subgraph OnChain["On-chain (Sui) — minimal state only"]
EV["Event Object<br/>- event_id<br/>- organizer<br/>- metadata_blob_id<br/>- site_manifest_blob_id<br/>- params (price/capacity/flags)"]:::accent
TK["Ticket NFT<br/>- ticket_id<br/>- event_id<br/>- owner<br/>- encrypted_blob_id (optional)<br/>- status"]:::accent
AT["Attendance NFT<br/>- att_id<br/>- event_id<br/>- attendee<br/>- timestamp<br/>(soulbound optional)"]:::accent
end

subgraph Walrus["Walrus (off-chain blobs) — rich data"]
PUB["Public Blobs<br/>- event metadata JSON<br/>- agenda/speakers/media<br/>- exports/archives (optional)"]:::card
ENC["Encrypted Blobs (Seal)<br/>- ticket payload (QR/location/link)<br/>- gated page content (optional)"]:::card
end

subgraph Central["Centralized (explicitly non-trust-critical)"]
IDX["Indexer View (Postgres)<br/>- search/tags/categories<br/>- counters<br/>- export jobs"]:::muted
end

EV --> PUB
TK --> ENC
AT --> PUB
IDX -->|"rebuildable cache<br/>(not source of truth)"| EV
`,
    },
    {
        id: "create-event",
        title: "Create Event (Walrus‑first → on‑chain ref)",
        description: "Step‑by‑step flow for organizers: upload event metadata to Walrus → get blob ID → create the Sui Event object referencing that blob → publish the Walrus Site → async indexing for discovery.",
        mermaidCode: `
%%{init: {"theme":"base","themeVariables":{"background":"#0A0A0A","primaryColor":"#171717","secondaryColor":"#262626","primaryTextColor":"#FFFFFF","secondaryTextColor":"#A3A3A3","lineColor":"#333333","fontFamily":"Inter, ui-sans-serif, system-ui"}}}%%
sequenceDiagram
participant Org as Organizer
participant Web as Next.js UI
participant Wal as Walrus
participant Sui as Sui Move
participant Site as Walrus Sites
participant Idx as Indexer

Note over Org,Idx: DIAGRAM 3 — FLOW: CREATE EVENT (WALRUS-FIRST → ON-CHAIN REF)
Org->>Web: Fill event form
Web->>Wal: Upload metadata JSON (public)
Wal-->>Web: metadata_blob_id
Web->>Sui: create_event(metadata_blob_id, params)
Sui-->>Web: event_id + tx finality
Web->>Site: Publish site bundle + manifest
Site-->>Web: site_manifest_blob_id / site_id
Web->>Sui: update_event_site(event_id, site_manifest_blob_id)
Sui-->>Idx: EventCreated emitted (index later)
Idx-->>Web: Search/discovery updated async
`,
    },
    {
        id: "ticket-mint",
        title: "Ticket Mint + Encrypt (Two‑phase commit)",
        description: "Attendee flow: mint ticket NFT on Sui first → generate ticket payload → encrypt via Seal → upload encrypted blob to Walrus → finalize by writing encrypted blob ID into the ticket NFT (with \"ticket pending\" retry path).",
        mermaidCode: `
%%{init: {"theme":"base","themeVariables":{"background":"#0A0A0A","primaryColor":"#171717","secondaryColor":"#262626","primaryTextColor":"#FFFFFF","secondaryTextColor":"#A3A3A3","lineColor":"#333333","fontFamily":"Inter, ui-sans-serif, system-ui"}}}%%
sequenceDiagram
participant Att as Attendee
participant Web as Next.js UI
participant Sui as Sui Move
participant Seal as Seal SDK
participant Wal as Walrus

Note over Att,Wal: DIAGRAM 4 — FLOW: TICKET MINT + ENCRYPT (2-PHASE COMMIT)
Att->>Web: zkLogin / Wallet connect
Web->>Sui: mint_ticket(event_id) (encrypted_blob_id empty)
Sui-->>Web: ticket_id + tx finality
Web->>Web: Build payload (QR/location/access link)
Web->>Seal: Encrypt(payload) with policy tied to ticket ownership
Seal-->>Web: ciphertext
Web->>Wal: Upload ciphertext
Wal-->>Web: encrypted_blob_id
Web->>Sui: set_encrypted_blob(ticket_id, encrypted_blob_id)
Sui-->>Web: Ticket ready

alt Upload fails / low connectivity
Web-->>Att: Show "Ticket pending" + retry
Web->>Wal: Retry upload later
end
`,
    },
    {
        id: "check-in",
        title: "Check‑in + Attendance (Low connectivity + finality)",
        description: "Scanner flow: scan QR → get attendee proof/signature → submit attendance mint on Sui → handle offline mode (queue + sync later) and congestion (pending finality + retry‑safe UX).",
        mermaidCode: `
%%{init: {"theme":"base","themeVariables":{"background":"#0A0A0A","primaryColor":"#171717","secondaryColor":"#262626","primaryTextColor":"#FFFFFF","secondaryTextColor":"#A3A3A3","lineColor":"#333333","fontFamily":"Inter, ui-sans-serif, system-ui"}}}%%
sequenceDiagram
participant Sc as Scanner PWA
participant Att as Attendee Wallet
participant Sui as Sui Move

Note over Sc,Sui: DIAGRAM 5 — FLOW: CHECK-IN / LOW CONNECTIVITY / FINALITY
Sc->>Sc: Scan QR -> ticket_id
Sc->>Att: Request signature proof
Att-->>Sc: Signature
Sc->>Sui: mark_attendance(ticket_id, proof)
Sui-->>Sc: tx finalized (Attendance minted)
Sc-->>Att: Entry granted

alt No internet at venue
Sc->>Sc: Cache scan + proof locally (queued)
Sc-->>Att: Soft-allow (policy) or "pending"
Sc->>Sui: Sync queued check-ins when online
end

alt Congestion / tx delayed
Sc-->>Sc: Show "pending finality" UI + retry-safe submit
end
`,
    },
    {
        id: "seal-access",
        title: "Seal Access Control (Owner‑only decrypt, transfer‑safe)",
        description: "Explains how decrypt permission is enforced: Seal checks current Ticket NFT ownership on Sui, then allows decrypt only for the owner (transfer automatically changes who can decrypt).",
        mermaidCode: `
%%{init: {"theme":"base","themeVariables":{"background":"#0A0A0A","primaryColor":"#171717","secondaryColor":"#262626","primaryTextColor":"#FFFFFF","secondaryTextColor":"#A3A3A3","lineColor":"#333333","fontFamily":"Inter, ui-sans-serif, system-ui"}}}%%
flowchart TB
classDef card fill:#171717,stroke:#333333,color:#FFFFFF,stroke-width:1px;
classDef muted fill:#262626,stroke:#333333,color:#A3A3A3,stroke-width:1px;
classDef accent fill:#171717,stroke:#06b6d4,color:#FFFFFF,stroke-width:2px;
classDef danger fill:#171717,stroke:#ef4444,color:#FFFFFF,stroke-width:2px;

A["DIAGRAM 6 — SEAL ACCESS CONTROL (OWNER-ONLY DECRYPT, TRANSFER SAFE)"]:::muted

subgraph State["Source of truth"]
SUI["Sui: TicketNFT ownership<br/>(owner changes on transfer)"]:::muted
end

subgraph Data["Encrypted data"]
BLOB["Walrus encrypted blob<br/>(ticket payload / gated content)"]:::card
end

subgraph Policy["Seal policy evaluation"]
SEAL["Seal Key Server + SDK<br/>Verify policy, release decrypt shares"]:::accent
OK["Decrypt OK (current owner)"]:::accent
NO["Denied (not owner)"]:::danger
end

BLOB --> SEAL
SEAL -->|"check current owner"| SUI
SUI --> SEAL
SEAL -->|"owner=true"| OK
SEAL -->|"owner=false"| NO
`,
    },
    {
        id: "discoverability",
        title: "Discoverability + Exports (Centralized acceleration)",
        description: "Shows how the queue/indexer builds fast search + feeds + dashboards from Sui/Walrus signals, while keeping Sui/Walrus as truth. Also includes export/report generation for organizers.",
        mermaidCode: `
%%{init: {"theme":"base","themeVariables":{"background":"#0A0A0A","primaryColor":"#171717","secondaryColor":"#262626","primaryTextColor":"#FFFFFF","secondaryTextColor":"#A3A3A3","lineColor":"#333333","fontFamily":"Inter, ui-sans-serif, system-ui"}}}%%
flowchart TB
classDef card fill:#171717,stroke:#333333,color:#FFFFFF,stroke-width:1px;
classDef muted fill:#262626,stroke:#333333,color:#A3A3A3,stroke-width:1px;
classDef accent fill:#171717,stroke:#06b6d4,color:#FFFFFF,stroke-width:2px;

A["DIAGRAM 7 — DISCOVERABILITY + EXPORTS (WHY ORGANIZERS CHOOSE YOU)"]:::muted

subgraph Sources["Signals"]
SUI["Sui Events<br/>(EventCreated/TicketMinted/Attendance)"]:::muted
WAL["Walrus metadata blobs"]:::muted
end

subgraph Pipeline["Pipeline (centralized but non-trust-critical)"]
Q["Queue"]:::muted
IDX["Indexer workers<br/>parse + aggregate"]:::accent
DB["Postgres search index<br/>(tags/cats/time/host)<br/>exports metadata"]:::muted
C["Redis cache<br/>feeds/counters"]:::muted
end

subgraph Product["Product surfaces"]
API["Express API<br/>/search /feed /export"]:::card
WEB["Next.js Discovery<br/>trending, categories,<br/>organizer profiles"]:::accent
ORGEXP["Organizer Exports<br/>CSV/JSON + receipts"]:::card
end

Sources --> Q
Q --> IDX
IDX --> DB
IDX --> C
WEB --> API
API --> DB
API --> C
API --> ORGEXP
`,
    },
    {
        id: "scale-reliability",
        title: "Scale + Reliability + Lifecycle + Monetization",
        description: "A compact \"engineering + business\" view: caching/batching for scale, handling congestion/offline/expiry, blob renewal/archive strategy, and staged monetization (optional fee → Pro → white‑label/managed).",
        mermaidCode: `
%%{init: {"theme":"base","themeVariables":{"background":"#0A0A0A","primaryColor":"#171717","secondaryColor":"#262626","primaryTextColor":"#FFFFFF","secondaryTextColor":"#A3A3A3","lineColor":"#333333","fontFamily":"Inter, ui-sans-serif, system-ui"}}}%%
flowchart TB
classDef card fill:#171717,stroke:#333333,color:#FFFFFF,stroke-width:1px;
classDef muted fill:#262626,stroke:#333333,color:#A3A3A3,stroke-width:1px;
classDef accent fill:#171717,stroke:#06b6d4,color:#FFFFFF,stroke-width:2px;
classDef danger fill:#171717,stroke:#ef4444,color:#FFFFFF,stroke-width:2px;

A["DIAGRAM 8 — SCALE/RELIABILITY + LIFECYCLE + MONETIZATION (ONE PAGE)"]:::muted

subgraph Scale["Scale + cost controls"]
MIN["Min on-chain state<br/>IDs + refs only"]:::accent
CACHE["Cache hot reads<br/>Redis + CDN snapshot"]:::card
BATCH["Batch/index async<br/>Queue + workers"]:::card
end

subgraph Fail["Failure modes (explicit)"]
LOW["Low connectivity<br/>scanner queue + retries"]:::card
CONG["Network congestion<br/>pending-finality UI<br/>idempotent txs"]:::card
EXPIRE["Blob expiry<br/>renew/re-upload jobs<br/>archive mode"]:::card
end

subgraph Money["Monetization (staged)"]
V1["V1: optional fee on paid tickets<br/>transparent bps"]:::accent
V2["V2: Pro mode<br/>analytics/roles/exports"]:::accent
WL["White-label + managed pilots"]:::accent
end

MIN --> CACHE
MIN --> BATCH
LOW --> BATCH
CONG --> BATCH
EXPIRE --> BATCH

V1 --> V2
V2 --> WL
`,
    },
];

const designDecisions = [
    {
        title: "Source of truth vs acceleration",
        content: "Truth: Sui objects + Walrus blob IDs (+ Seal policies). Acceleration only: Postgres/Indexer/Cache for search, feeds, exports. Fully rebuildable from chain events + Walrus metadata."
    },
    {
        title: "Scanner authorization (MVP decision)",
        content: "MVP: scanner allowlist per event (organizer sets staff addresses). V2 option: scanner capability object for stronger auth + revocation semantics."
    },
    {
        title: "Check-in mode (venue connectivity)",
        content: "Strict mode: only allow entry after on-chain confirmation. Friendly mode: allow “soft entry” + offline queue + sync later (still prevents double-mint via on-chain checked_in flag)."
    },
    {
        title: "Ticket transferability (product policy)",
        content: "Option A (default): transferable tickets (Seal decrypt follows current owner). Option B: non-transferable / soulbound tickets for certain events."
    },
    {
        title: "Blob retention / expiry policy (Walrus reality)",
        content: "Retention is explicit per event (e.g., “keep site 6 months, archive metadata 2 years”). Renewal jobs run off-chain; degrade UX gracefully if a blob expires (“rehydrating”)."
    },
    {
        title: "Payment model scope (be honest)",
        content: "MVP: Sui-native paid tickets (simple). V2: escrow/prizes + deposits/no-show penalties + multi-rail settlement if demanded."
    },
    {
        title: "Privacy boundaries (what we never touch)",
        content: "Ticket payload plaintext (location/QR/access link) is never visible to our backend. Analytics are product-level (funnels) and organizer reports can be aggregated/anonymized."
    },
    {
        title: "Idempotency / safety guarantees",
        content: "Check-in is single-use enforced on-chain (checked_in_at / is_used). Clients are retry-safe: pending-finality UI + do-not-resubmit-if-tx-hash-known."
    }
];

const additionalDiagrams = [
    {
        id: "roles-access",
        title: "Roles & Access Control (who can call what)",
        description: "Clarifies on-chain authorization: who can create events, mint tickets, and mark attendance. Distinguishes between Owner checks, Role checks, and Invariants.",
        mermaidCode: `
%%{init: {"theme":"base","themeVariables":{"background":"#0A0A0A","primaryColor":"#171717","secondaryColor":"#262626","primaryTextColor":"#FFFFFF","secondaryTextColor":"#A3A3A3","lineColor":"#333333","fontFamily":"Inter, ui-sans-serif, system-ui"}}}%%
flowchart TB
classDef card fill:#171717,stroke:#333333,color:#FFFFFF,stroke-width:1px;
classDef muted fill:#262626,stroke:#333333,color:#A3A3A3,stroke-width:1px;
classDef accent fill:#171717,stroke:#06b6d4,color:#FFFFFF,stroke-width:2px;
classDef danger fill:#171717,stroke:#ef4444,color:#FFFFFF,stroke-width:2px;

A["DIAGRAM 9 — ROLES & ACCESS CONTROL (ON-CHAIN AUTHZ)"]:::muted

subgraph Personas["Personas"]
ORG["Organizer"]:::card
ATT["Attendee"]:::card
SCN["Scanner/Staff"]:::card
end

subgraph Contracts["Sui Move Modules"]
EV["EventRegistry\\n(create/update/cancel)\\n+ scanner registry"]:::muted
TK["TicketNFT\\n(mint/transfer/set_blob/status)"]:::muted
ATN["AttendanceNFT\\n(mark_attendance)"]:::muted
end

subgraph Auth["Auth Mechanisms"]
OWN["Owner checks\\n(owner == signer)"]:::accent
ROLE["Organizer checks\\n(event.organizer == signer)"]:::accent
SCAL["Scanner allowlist (MVP)\\n(scanner_addr ∈ event.scanners)"]:::accent
CAP["Scanner capability (V2)\\n(EventScannerCap)"]:::accent
INV["Invariants\\n(capacity, double-scan, replay)"]:::accent
end

ORG -->|"create_event(blob_id, params)"| EV
ORG -->|"update_event_site(...)\\nupdate_params(...)\\nset_scanners(...)"| EV
ATT -->|"mint_ticket(event_id)"| TK
ATT -->|"transfer_ticket() (if enabled)"| TK
SCN -->|"mark_attendance(ticket_id)"| ATN

EV --> ROLE
TK --> OWN
ATN --> SCAL
ATN --> CAP
EV --> INV
TK --> INV
ATN --> INV

subgraph Notes["Key Rules (say out loud)"]
N1["Only organizer can mutate event config/site refs"]:::card
N2["Only authorized scanners can mark attendance"]:::card
N3["Ticket has checked_in flag → prevents double scans"]:::card
end

ROLE -.-> N1
SCAL -.-> N2
INV -.-> N3
`,
    },
    {
        id: "payments-escrow",
        title: "Payments / Refunds / Escrow (MVP vs V2)",
        description: "Contrasts the MVP usage of direct Coin<SUI> transfers with V2 extensions for escrow vaults, refundable deposits, and programmatic disbursements.",
        mermaidCode: `
%%{init: {"theme":"base","themeVariables":{"background":"#0A0A0A","primaryColor":"#171717","secondaryColor":"#262626","primaryTextColor":"#FFFFFF","secondaryTextColor":"#A3A3A3","lineColor":"#333333","fontFamily":"Inter, ui-sans-serif, system-ui"}}}%%
flowchart TB
classDef card fill:#171717,stroke:#333333,color:#FFFFFF,stroke-width:1px;
classDef muted fill:#262626,stroke:#333333,color:#A3A3A3,stroke-width:1px;
classDef accent fill:#171717,stroke:#06b6d4,color:#FFFFFF,stroke-width:2px;
classDef danger fill:#171717,stroke:#ef4444,color:#FFFFFF,stroke-width:2px;

A["DIAGRAM 10 — PAYMENTS, REFUNDS, ESCROW (MVP → V2)"]:::muted

subgraph Personas["Personas"]
ORG["Organizer"]:::card
ATT["Attendee"]:::card
JDG["Judges/Admin (V2)"]:::card
end

subgraph OnChain["Sui On-chain"]
EV["Event Object\\nprice/capacity/flags"]:::muted
TK["TicketNFT\\nownership + status"]:::muted
PAY["Payment Flow (MVP)\\nCoin<SUI> transfer"]:::accent
VAULT["Escrow Vault (V2)\\nlock → settle → refund/slash"]:::accent
REC["Receipt Object (V2)\\nwinners+amounts+hash"]:::muted
end

subgraph Offchain["Optional Off-chain (non-trust-critical)"]
FIAT["Stripe / Fiat (V2)\\n(optional)"]:::card
BOOK["Accounting/Exports\\n(tax reports)"]:::card
end

ATT -->|"buy ticket"| PAY
PAY -->|"transfer to organizer\\n(or event vault if chosen)"| ORG
PAY --> TK
PAY --> EV

subgraph MVP["MVP Commitment"]
M1["MVP: Sui-native paid tickets\\n(simple, low risk)"]:::card
M2["Refunds (if needed):\\norganizer-controlled policy + tx"]:::card
end
PAY -.-> M1
PAY -.-> M2

subgraph V2["V2 Extensions"]
V1["Escrowed prize pools\\n+ programmatic disbursement"]:::card
V2B["Refundable deposits / no-show penalties\\n(optional)"]:::card
end

ORG -->|"lock funds (optional)"| VAULT
JDG -->|"finalize results"| REC
REC -->|"settle payouts"| VAULT
VAULT -->|"payout / refund / slash"| ORG
VAULT -->|"payout / refund"| ATT

FIAT -. "optional rail" .-> PAY
BOOK -. "reports" .-> ORG
`,
    },
    {
        id: "walrus-sites-gating",
        title: "Walrus Sites + Token‑Gating via Seal",
        description: "Demonstrates how public Walrus Sites (HTML/JS) interact with encrypted blobs. The site itself has no secrets; gating is enforcing by Seal decrypting blobs only for valid ticket owners.",
        mermaidCode: `
%%{init: {"theme":"base","themeVariables":{"background":"#0A0A0A","primaryColor":"#171717","secondaryColor":"#262626","primaryTextColor":"#FFFFFF","secondaryTextColor":"#A3A3A3","lineColor":"#333333","fontFamily":"Inter, ui-sans-serif, system-ui"}}}%%
flowchart TB
classDef card fill:#171717,stroke:#333333,color:#FFFFFF,stroke-width:1px;
classDef muted fill:#262626,stroke:#333333,color:#A3A3A3,stroke-width:1px;
classDef accent fill:#171717,stroke:#06b6d4,color:#FFFFFF,stroke-width:2px;
classDef danger fill:#171717,stroke:#ef4444,color:#FFFFFF,stroke-width:2px;

A["DIAGRAM 11 — WALRUS SITE + TOKEN-GATED CONTENT (SEAL DECRYPT CLIENT-SIDE)"]:::muted

subgraph Public["Public (Walrus Site)"]
SITE["Walrus Site\\nindex.html / css / js\\n(public)"]:::muted
PUBB["Public blobs\\nagenda/speakers/media refs"]:::card
end

subgraph Gated["Gated (Encrypted blobs)"]
ENC["Encrypted blob\\nlocation/QR/access link\\n(or private agenda)"]:::accent
end

subgraph Client["Client"]
BROW["Browser (Next.js)\\nstatic page + wallet UX"]:::accent
WALLET["Wallet / zkLogin\\nSui address"]:::muted
end

subgraph Policy["Policy + Truth"]
SUI["Sui: TicketNFT ownership\\n(source of truth)"]:::muted
SEAL["Seal SDK + key servers\\npolicy check → decrypt shares"]:::accent
end

SITE --> BROW
PUBB --> BROW
BROW -->|"connect"| WALLET
BROW -->|"check owns ticket?"| SUI

SUI -->|"owns ticket"| BROW
BROW -->|"fetch encrypted blob"| ENC
ENC --> SEAL
SEAL -->|"verify policy vs Sui"| SUI
SEAL -->|"decrypt OK"| BROW

SUI -->|"does not own"| BROW
BROW -->|"show CTA:\\nBuy ticket / Register"| SITE

subgraph Rule["Hard Rule"]
R1["No secrets in site files.\\nGating is Seal-encrypted blobs + on-chain checks."]:::card
end
SITE -.-> R1
`,
    }
];

export default function TechnicalPage() {
    const router = useRouter();
    const [fullscreenDiagram, setFullscreenDiagram] = useState<{
        id: string;
        title: string;
    } | null>(null);

    const [isSticky, setIsSticky] = useState(false);
    const indexRef = useRef<HTMLDivElement>(null);
    const [activeSection, setActiveSection] = useState<string>("");

    // Combine all sections for navigation purposes
    const navItems = [
        ...architectureDiagrams.map((d, i) => ({ ...d, index: i + 1 })),
        { id: "design-decisions", title: "Design Decisions", description: "Explicit assumptions & decision variables", isSection: true },
        ...additionalDiagrams.map((d, i) => ({ ...d, index: i + 9 }))
    ];

    // Scroll detection for sticky sidebar
    useEffect(() => {
        const handleScroll = () => {
            if (indexRef.current) {
                const indexBottom = indexRef.current.getBoundingClientRect().bottom;
                setIsSticky(indexBottom <= 0);
            }

            // Detect active section
            const sections = navItems.map(d => document.getElementById(d.id));
            const currentSection = sections.find(section => {
                if (section) {
                    const rect = section.getBoundingClientRect();
                    return rect.top <= 300 && rect.bottom >= 300;
                }
                return false;
            });

            if (currentSection) {
                setActiveSection(currentSection.id);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            const offset = 200;
            const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
            window.scrollTo({
                top: elementPosition - offset,
                behavior: "smooth",
            });
        }
    };

    return (
        <main className="min-h-screen bg-background text-foreground selection:bg-primary/20">
            {/* Use same header as homepage */}
            <PitchControls />

            {/* Hero Section with Back Button */}
            <section className="relative w-full min-h-[40vh] flex items-center justify-center bg-gradient-to-b from-background via-background to-card/30 border-b border-border overflow-hidden">
                {/* Back Button - Top Left */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="absolute top-8 left-6 z-10"
                >
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push("/")}
                        className="gap-2 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </Button>
                </motion.div>

                {/* Grid Background */}
                <div
                    className="absolute inset-0 opacity-20"
                    style={{
                        backgroundImage: `linear-gradient(to right, #333 1px, transparent 1px),
                                linear-gradient(to bottom, #333 1px, transparent 1px)`,
                        backgroundSize: "40px 40px",
                    }}
                />

                {/* Cyan Glow */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse delay-700" />

                {/* Content */}
                <div className="container mx-auto px-6 text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
                            Technical <span className="text-primary">Architecture</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                            Comprehensive system design and architecture diagrams for EventLedger
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Index / Table of Contents */}
            <div ref={indexRef} className="bg-card/95 backdrop-blur-md border-b border-border shadow-lg">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="container mx-auto px-6 py-4"
                >
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-1 h-6 bg-primary rounded-full" />
                        <h3 className="text-sm font-bold text-primary uppercase tracking-wider">
                            Architecture Index
                        </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 text-sm">
                        {navItems.map((item, index) => (
                            <button
                                key={item.id}
                                onClick={() => scrollToSection(item.id)}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-left hover:bg-primary/10 hover:text-primary transition-colors group border border-transparent hover:border-primary/30 ${(item as any).isSection ? "col-span-full md:col-span-2 lg:col-span-3 xl:col-span-4 bg-primary/5 border-primary/10" : ""
                                    }`}
                            >
                                <span className={`font-mono text-xs transition-colors ${(item as any).isSection ? "text-primary font-bold uppercase" : "text-primary/60 group-hover:text-primary"
                                    }`}>
                                    {(item as any).index ? String((item as any).index).padStart(2, "0") : "§"}
                                </span>
                                <span className={`text-muted-foreground group-hover:text-primary transition-colors truncate text-xs ${(item as any).isSection ? "font-bold text-primary" : ""
                                    }`}>
                                    {item.title}
                                </span>
                            </button>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Sticky Sidebar Navigation - Appears when scrolled past index */}
            <AnimatePresence>
                {isSticky && (
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="fixed left-0 top-20 h-[calc(100vh-5rem)] w-64 bg-card/95 backdrop-blur-md border-r border-border shadow-lg z-40 overflow-y-auto scrollbar-thin scrollbar-thumb-primary/30 scrollbar-track-transparent hover:scrollbar-thumb-primary/50"
                        style={{
                            scrollbarWidth: 'thin',
                            scrollbarColor: 'rgba(6, 182, 212, 0.3) transparent',
                        }}
                    >
                        <div className="p-4">
                            <div className="flex items-center gap-2 mb-4 sticky top-0 bg-card/95 pb-3">
                                <div className="w-1 h-6 bg-primary rounded-full" />
                                <h3 className="text-xs font-bold text-primary uppercase tracking-wider">
                                    Architecture
                                </h3>
                            </div>
                            <div className="space-y-1">
                                {navItems.map((item, index) => (
                                    <button
                                        key={item.id}
                                        onClick={() => scrollToSection(item.id)}
                                        className={`w-full flex items-start gap-3 px-3 py-2.5 rounded-lg text-left transition-all group border ${activeSection === item.id
                                            ? "bg-primary/20 border-primary/50 text-primary"
                                            : "border-transparent hover:bg-primary/10 hover:text-primary hover:border-primary/30"
                                            }`}
                                    >
                                        <span
                                            className={`font-mono text-xs font-bold mt-0.5 shrink-0 ${activeSection === item.id
                                                ? "text-primary"
                                                : "text-primary/60 group-hover:text-primary"
                                                }`}
                                        >
                                            {(item as any).index ? String((item as any).index).padStart(2, "0") : "§"}
                                        </span>
                                        <span
                                            className={`text-xs leading-relaxed ${activeSection === item.id
                                                ? "text-primary font-medium"
                                                : "text-muted-foreground group-hover:text-primary"
                                                }`}
                                        >
                                            {item.title}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <div className={`container mx-auto px-6 py-20 transition-all duration-300 ${isSticky ? "lg:ml-64" : ""}`}>
                <div className="space-y-20">
                    {/* Existing 8 Diagrams */}
                    {architectureDiagrams.map((diagram, index) => (
                        <motion.section
                            key={diagram.id}
                            id={diagram.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.5, delay: index * 0.05 }}
                            className="bg-card/50 border border-border rounded-2xl p-8 md:p-12 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all"
                        >
                            <div className="mb-8">
                                <div className="flex items-center gap-4 mb-4">
                                    <span className="text-primary font-mono text-lg font-bold bg-primary/10 px-4 py-2 rounded-lg border border-primary/20">
                                        {String(index + 1).padStart(2, "0")}
                                    </span>
                                    <h2 className="text-3xl md:text-4xl font-bold text-white">
                                        {diagram.title}
                                    </h2>
                                </div>
                                <p className="text-muted-foreground text-lg md:text-xl leading-relaxed">
                                    {diagram.description}
                                </p>
                            </div>

                            <div className="relative bg-background/80 border border-border rounded-xl p-8 overflow-x-auto backdrop-blur-sm">
                                <MermaidDiagram
                                    chart={diagram.mermaidCode}
                                    id={diagram.id}
                                    className="flex justify-center items-center min-h-[300px]"
                                />
                                <Button
                                    variant="secondary"
                                    size="icon"
                                    onClick={() => setFullscreenDiagram({ id: diagram.id, title: diagram.title })}
                                    className="absolute bottom-4 right-4 bg-card/90 backdrop-blur-sm hover:bg-primary/20 hover:text-primary border border-border shadow-lg transition-all"
                                    title="View Fullscreen"
                                >
                                    <Maximize2 className="w-5 h-5" />
                                </Button>
                            </div>
                        </motion.section>
                    ))}

                    {/* Design Decisions Section (New) */}
                    <motion.section
                        id="design-decisions"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        className="bg-primary/5 border border-primary/20 rounded-2xl p-8 md:p-12"
                    >
                        <div className="mb-8">
                            <div className="flex items-center gap-4 mb-4">
                                <span className="text-primary font-mono text-lg font-bold bg-primary/10 px-4 py-2 rounded-lg border border-primary/20">
                                    §
                                </span>
                                <h2 className="text-3xl md:text-4xl font-bold text-white">
                                    Design Decisions
                                </h2>
                            </div>
                            <p className="text-muted-foreground text-lg md:text-xl leading-relaxed">
                                Explicit assumptions & decision variables (to align early)
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {designDecisions.map((decision, i) => (
                                <div key={i} className="bg-card/40 border border-border/50 rounded-xl p-6 hover:border-primary/40 hover:bg-card/60 transition-all">
                                    <h3 className="text-primary font-bold mb-2 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                        {decision.title}
                                    </h3>
                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                        {decision.content}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </motion.section>

                    {/* Additional Diagrams Section Header */}
                    <div className="pt-8 pb-4 border-t border-border">
                        <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
                            <div className="w-1 h-8 bg-primary rounded-full" />
                            Additional Diagrams
                        </h2>
                    </div>

                    {/* Additional Diagrams (9-11) */}
                    {additionalDiagrams.map((diagram, index) => (
                        <motion.section
                            key={diagram.id}
                            id={diagram.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.5, delay: index * 0.05 }}
                            className="bg-card/50 border border-border rounded-2xl p-8 md:p-12 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all"
                        >
                            <div className="mb-8">
                                <div className="flex items-center gap-4 mb-4">
                                    <span className="text-primary font-mono text-lg font-bold bg-primary/10 px-4 py-2 rounded-lg border border-primary/20">
                                        {String(index + 9).padStart(2, "0")}
                                    </span>
                                    <h2 className="text-3xl md:text-4xl font-bold text-white">
                                        {diagram.title}
                                    </h2>
                                </div>
                                <p className="text-muted-foreground text-lg md:text-xl leading-relaxed">
                                    {diagram.description}
                                </p>
                            </div>

                            <div className="relative bg-background/80 border border-border rounded-xl p-8 overflow-x-auto backdrop-blur-sm">
                                <MermaidDiagram
                                    chart={diagram.mermaidCode}
                                    id={diagram.id}
                                    className="flex justify-center items-center min-h-[300px]"
                                />
                                <Button
                                    variant="secondary"
                                    size="icon"
                                    onClick={() => setFullscreenDiagram({ id: diagram.id, title: diagram.title })}
                                    className="absolute bottom-4 right-4 bg-card/90 backdrop-blur-sm hover:bg-primary/20 hover:text-primary border border-border shadow-lg transition-all"
                                    title="View Fullscreen"
                                >
                                    <Maximize2 className="w-5 h-5" />
                                </Button>
                            </div>
                        </motion.section>
                    ))}
                </div>
            </div>

            {/* Use same footer as homepage */}
            <ClosingNextStepsQuestionsSection />

            {/* Fullscreen Viewer */}
            <MermaidFullscreenViewer
                isOpen={fullscreenDiagram !== null}
                onClose={() => setFullscreenDiagram(null)}
                diagramId={fullscreenDiagram?.id || ""}
                title={fullscreenDiagram?.title || ""}
            />
        </main>
    );
}
