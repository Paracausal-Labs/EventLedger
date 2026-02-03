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

// TODO: Paste your Mermaid flowchart TB code for each diagram below
const architectureDiagrams = [
    {
        id: "c4-context",
        title: "EventLedger C4 Context (Level 1)",
        description: "Big-picture map: who uses the platform (organizer, attendee, scanner) and which external systems it depends on (Sui for on-chain objects, Walrus for blobs, Seal for gated decryption, Sites for pages, plus email/analytics/notifications). It shows the main interactions and integrations, not implementation detail.",
        mermaidCode: `
%% DIAGRAM 1 - EVENTLEDGER C4 CONTEXT (LEVEL 1)
%%{init: {"flowchart":{"defaultRenderer":"elk"},"theme":"base","themeVariables":{"background":"#0A0A0A","primaryColor":"#171717","secondaryColor":"#262626","primaryTextColor":"#FFFFFF","secondaryTextColor":"#A3A3A3","lineColor":"#333333","fontFamily":"Inter, ui-sans-serif, system-ui"}}}%%
flowchart TB
classDef card fill:#171717,stroke:#333333,color:#FFFFFF,stroke-width:1px;
classDef muted fill:#262626,stroke:#333333,color:#A3A3A3,stroke-width:1px;
classDef accent fill:#171717,stroke:#06b6d4,color:#FFFFFF,stroke-width:2px;
classDef danger fill:#171717,stroke:#ef4444,color:#FFFFFF,stroke-width:2px;
classDef ghost fill:#0A0A0A,stroke:#333333,color:#A3A3A3,stroke-width:1px,stroke-dasharray: 4 3;

subgraph U["Users"]
O["Organizer"]:::card
A["Attendee"]:::card
S["Scanner / Staff"]:::card
end

subgraph P["EventLedger Platform"]
EL["EventLedger<br/>(Walrus-first event platform)"]:::accent
end

subgraph E["External Systems"]
SUI["Sui Network<br/>(Move objects, NFTs)"]:::muted
WAL["Walrus Storage<br/>(blobs)"]:::muted
SITE["Walrus Sites<br/>(static site publishing)"]:::muted
SEAL["Seal<br/>(policy-based decryption)"]:::muted
MIX["Mixpanel<br/>(product analytics)"]:::muted
RES["Resend<br/>(email automation)"]:::muted
PUSH["Push Protocol / Notifi<br/>(wallet notifications - optional)"]:::muted
end

O -->|"Create events, manage attendees"| EL
A -->|"Register, hold tickets, decrypt details"| EL
S -->|"Check-in + attendance minting"| EL

EL -->|"Create/update objects"| SUI
EL -->|"Upload/read blobs"| WAL
EL -->|"Publish event pages"| SITE
EL -->|"Encrypt/decrypt payloads with policy"| SEAL
EL -->|"Track funnels + sessions"| MIX
EL -->|"Send confirmations/reminders"| RES
EL -->|"Optional wallet notifications"| PUSH
`,
    },
    {
        id: "c4-containers",
        title: "EventLedger Containers (C4 Level 2)",
        description: "System breakdown by \"deployable pieces\": web app + scanner PWA on the client side, backend API + queue + indexers + DB/cache for off-chain services, and Sui/Walrus/Sites/Seal for chain + storage. It shows which component talks to what (REST vs direct wallet tx, indexing pipeline, caching).",
        mermaidCode: `
%% DIAGRAM 2 - EVENTLEDGER CONTAINERS (C4 LEVEL 2)
%%{init: {"flowchart":{"defaultRenderer":"elk"},"theme":"base","themeVariables":{"background":"#0A0A0A","primaryColor":"#171717","secondaryColor":"#262626","primaryTextColor":"#FFFFFF","secondaryTextColor":"#A3A3A3","lineColor":"#333333","fontFamily":"Inter, ui-sans-serif, system-ui"}}}%%
flowchart TB
classDef card fill:#171717,stroke:#333333,color:#FFFFFF,stroke-width:1px;
classDef muted fill:#262626,stroke:#333333,color:#A3A3A3,stroke-width:1px;
classDef accent fill:#171717,stroke:#06b6d4,color:#FFFFFF,stroke-width:2px;
classDef danger fill:#171717,stroke:#ef4444,color:#FFFFFF,stroke-width:2px;
classDef ghost fill:#0A0A0A,stroke:#333333,color:#A3A3A3,stroke-width:1px,stroke-dasharray: 4 3;

subgraph Clients["Client Apps"]
WEB["Web App<br/>Next.js + TS<br/>(Organizer + Attendee UI)"]:::accent
PWA["Scanner PWA<br/>(React)<br/>Offline-friendly check-in"]:::accent
end

subgraph Platform["Platform Services (GCP)"]
API["API Service<br/>Node.js + Express<br/>OpenAPI"]:::card
IDX["Indexer Workers<br/>(queue-driven)"]:::card
Q["Job Queue<br/>(GCP Pub/Sub / Cloud Tasks)"]:::muted
DB["PostgreSQL<br/>(Cloud SQL)"]:::muted
RDS["Redis Cache<br/>(Memorystore)"]:::muted
OBS["Observability<br/>(Sentry + GCP Monitoring)"]:::muted
end

subgraph Chain["On-chain + Storage"]
SUI["Sui<br/>Move Contracts + Objects"]:::muted
WAL["Walrus Blobs<br/>(public + encrypted)"]:::muted
SITE["Walrus Sites<br/>(event pages)"]:::muted
SEAL["Seal<br/>(encryption + policy decrypt)"]:::muted
end

subgraph Integrations["Integrations"]
RES["Resend<br/>(email)"]:::muted
MIX["Mixpanel<br/>(analytics)"]:::muted
PUSH["Push Protocol / Notifi<br/>(wallet notifications)"]:::muted
end

WEB -->|"REST/JSON"| API
PWA -->|"REST/JSON (scanner endpoints) / direct Sui tx"| API

API -->|"read/write objects"| SUI
WEB -->|"direct wallet tx + reads"| SUI
PWA -->|"direct wallet tx (attendance)"| SUI

WEB -->|"upload/read blobs"| WAL
API -->|"upload/read blobs (server helpers)"| WAL
API -->|"publish static site bundle"| SITE

WEB -->|"encrypt/decrypt via SDK"| SEAL
API -->|"optional helper endpoints"| SEAL

API --> Q
Q --> IDX
IDX -->|"materialize searchable views"| DB
API -->|"search, dashboards, exports"| DB
API -->|"hot cache"| RDS

API --> RES
API --> MIX
API --> PUSH
WEB --> MIX

API --> OBS
IDX --> OBS
`,
    },
    {
        id: "move-contract",
        title: "Move Contract Structure (Modules + Objects)",
        description: "On-chain design: which Move modules exist (event registry, ticket NFT, attendance NFT, roles, events) and what minimal objects live on-chain (Event object, Ticket NFT, Attendance NFT). It shows which module creates/mints which object and where authorization/guards sit.",
        mermaidCode: `
%% DIAGRAM 3 - MOVE CONTRACT STRUCTURE
%%{init: {"flowchart":{"defaultRenderer":"elk"},"theme":"base","themeVariables":{"background":"#0A0A0A","primaryColor":"#171717","secondaryColor":"#262626","primaryTextColor":"#FFFFFF","secondaryTextColor":"#A3A3A3","lineColor":"#333333","fontFamily":"Inter, ui-sans-serif, system-ui"}}}%%
flowchart TB
classDef card fill:#171717,stroke:#333333,color:#FFFFFF,stroke-width:1px;
classDef muted fill:#262626,stroke:#333333,color:#A3A3A3,stroke-width:1px;
classDef accent fill:#171717,stroke:#06b6d4,color:#FFFFFF,stroke-width:2px;
classDef danger fill:#171717,stroke:#ef4444,color:#FFFFFF,stroke-width:2px;

subgraph Packages["Sui Package: eventledger::*"]
ER["module eventledger::event_registry<br/>- create_event(metadata_blob_id, params)<br/>- update_site(site_manifest_blob_id)<br/>- set_rules(price/capacity/approval)"]:::accent
TN["module eventledger::ticket_nft<br/>- mint_ticket(event_id)<br/>- set_encrypted_blob(ticket_id, enc_blob_id)<br/>- transfer hooks (native)"]:::accent
AT["module eventledger::attendance_nft<br/>- mark_attendance(ticket_id)<br/>- optional soulbound attendance"]:::accent
ROLES["module eventledger::roles<br/>- organizer/admin/scanner auth<br/>- allowlist scanners per event"]:::card
EVT["module eventledger::events<br/>- emit events: EventCreated/TicketMinted/AttendanceMarked"]:::card
end

subgraph Objects["On-chain Objects (minimal state)"]
EOBJ["Event Object<br/>- event_id<br/>- organizer<br/>- metadata_blob_id<br/>- site_manifest_blob_id<br/>- price/capacity<br/>- params flags"]:::muted
TOBJ["Ticket NFT<br/>- ticket_id<br/>- event_id<br/>- owner<br/>- encrypted_blob_id<br/>- status"]:::muted
AOBJ["Attendance NFT<br/>- attendance_id<br/>- event_id<br/>- attendee<br/>- timestamp<br/>(soulbound optional)"]:::muted
end

ER -->|"creates"| EOBJ
TN -->|"mints"| TOBJ
AT -->|"mints"| AOBJ

ROLES -->|"guards"| ER
ROLES -->|"guards"| AT
EVT -->|"observability hooks"| ER
EVT -->|"observability hooks"| TN
EVT -->|"observability hooks"| AT
`,
    },
    {
        id: "walrus-seal",
        title: "Walrus + Seal Data Model (Public vs Encrypted Blobs)",
        description: "Privacy model: public blobs hold event metadata and site assets, while encrypted blobs hold ticket payloads (QR/location/access links). Seal policy checks current Ticket NFT ownership on Sui; owners can decrypt, others get denied. Main idea: no server-side secret distribution.",
        mermaidCode: `
%% DIAGRAM 4 - WALRUS + SEAL DATA MODEL
%%{init: {"flowchart":{"defaultRenderer":"elk"},"theme":"base","themeVariables":{"background":"#0A0A0A","primaryColor":"#171717","secondaryColor":"#262626","primaryTextColor":"#FFFFFF","secondaryTextColor":"#A3A3A3","lineColor":"#333333","fontFamily":"Inter, ui-sans-serif, system-ui"}}}%%
flowchart TB
classDef card fill:#171717,stroke:#333333,color:#FFFFFF,stroke-width:1px;
classDef muted fill:#262626,stroke:#333333,color:#A3A3A3,stroke-width:1px;
classDef accent fill:#171717,stroke:#06b6d4,color:#FFFFFF,stroke-width:2px;
classDef danger fill:#171717,stroke:#ef4444,color:#FFFFFF,stroke-width:2px;

subgraph Walrus["Walrus Storage"]
PUB["Public Blobs<br/>- event metadata (JSON)<br/>- agenda/speakers/media<br/>- site assets/manifests<br/>- post-event archive (optional)"]:::card
ENC["Encrypted Blobs (Seal)<br/>- ticket payload JSON<br/>(qr, exact location, access link)<br/>- gated site content (optional)"]:::accent
end

subgraph Seal["Seal Policy Layer"]
POL["Seal Policy<br/>- binds decrypt rights to current Ticket NFT ownership<br/>- no app key management"]:::accent
DENY["Access Denied<br/>(non-owner)"]:::danger
OK["Plaintext Payload<br/>(owner)"]:::card
end

subgraph Sui["Sui State (source of truth)"]
T["Ticket NFT ownership<br/>(owner address)"]:::muted
end

ENC -->|"decrypt request"| POL
POL -->|"checks ownership"| T
T -->|"owner? yes"| POL
POL -->|"decrypt"| OK
T -->|"owner? no"| DENY
`,
    },
    {
        id: "create-event",
        title: "Create Event Flow (Walrus-first)",
        description: "Step-by-step create event journey: organizer builds metadata, uploads it to Walrus to get a blob id, then calls Sui create_event referencing that id; a site bundle is published to Walrus Sites; indexers ingest the on-chain event to make it discoverable/searchable in Postgres.",
        mermaidCode: `
%% DIAGRAM 5 - END-TO-END FLOW: CREATE EVENT (WALRUS-FIRST)
%%{init: {"flowchart":{"defaultRenderer":"elk"},"theme":"base","themeVariables":{"background":"#0A0A0A","primaryColor":"#171717","secondaryColor":"#262626","primaryTextColor":"#FFFFFF","secondaryTextColor":"#A3A3A3","lineColor":"#333333","fontFamily":"Inter, ui-sans-serif, system-ui"}}}%%
flowchart TB
classDef card fill:#171717,stroke:#333333,color:#FFFFFF,stroke-width:1px;
classDef muted fill:#262626,stroke:#333333,color:#A3A3A3,stroke-width:1px;
classDef accent fill:#171717,stroke:#06b6d4,color:#FFFFFF,stroke-width:2px;
classDef danger fill:#171717,stroke:#ef4444,color:#FFFFFF,stroke-width:2px;

O["Organizer (browser)"]:::card
WEB["Next.js UI"]:::accent
WAL["Walrus<br/>Upload public metadata blob"]:::muted
SUI["Sui<br/>create_event(metadata_blob_id, params)"]:::muted
SITE["Walrus Sites<br/>Publish site bundle + manifest"]:::muted
IDX["Indexer<br/>materialize discovery view"]:::card
DB["Postgres<br/>searchable events"]:::muted

O --> WEB
WEB -->|"1) Build JSON metadata"| WEB
WEB -->|"2) Upload metadata"| WAL
WAL -->|"3) returns metadata_blob_id"| WEB
WEB -->|"4) Sui tx: create_event(blob_id, params)"| SUI
SUI -->|"5) emits EventCreated(event_id, blob_id)"| IDX
WEB -->|"6) Generate site bundle from template"| SITE
SITE -->|"7) returns site_manifest_blob_id / site_id"| WEB
WEB -->|"8) optional tx: update_site(site_manifest_blob_id)"| SUI
IDX -->|"9) upsert event index"| DB
`,
    },
    {
        id: "ticket-mint",
        title: "Ticket Mint + Seal Encryption (Two-phase commit)",
        description: "Two-step ticket provisioning: first mint the Ticket NFT on Sui (ticket exists but has no encrypted blob yet), then generate payload JSON, encrypt it with Seal, store encrypted blob on Walrus, and finally set the blob id back into the Ticket NFT. If upload fails, UI stays in \"pending\" and can retry safely.",
        mermaidCode: `
%% DIAGRAM 6 - END-TO-END FLOW: TICKET MINT + SEAL ENCRYPTION (2-PHASE COMMIT)
%%{init: {"flowchart":{"defaultRenderer":"elk"},"theme":"base","themeVariables":{"background":"#0A0A0A","primaryColor":"#171717","secondaryColor":"#262626","primaryTextColor":"#FFFFFF","secondaryTextColor":"#A3A3A3","lineColor":"#333333","fontFamily":"Inter, ui-sans-serif, system-ui"}}}%%
flowchart TB
classDef card fill:#171717,stroke:#333333,color:#FFFFFF,stroke-width:1px;
classDef muted fill:#262626,stroke:#333333,color:#A3A3A3,stroke-width:1px;
classDef accent fill:#171717,stroke:#06b6d4,color:#FFFFFF,stroke-width:2px;
classDef danger fill:#171717,stroke:#ef4444,color:#FFFFFF,stroke-width:2px;

A["Attendee"]:::card
WEB["Next.js UI<br/>+ zkLogin/wallet"]:::accent
SUI1["Sui<br/>mint_ticket(event_id)<br/>TicketNFT.encrypted_blob_id = empty"]:::muted
PAYLOAD["Generate payload JSON<br/>(qr, location, access_link)"]:::card
SEAL["Seal SDK<br/>Encrypt(payload) with policy tied to NFT ownership"]:::accent
WAL["Walrus<br/>Store encrypted blob"]:::muted
SUI2["Sui<br/>set_encrypted_blob(ticket_id, blob_id)"]:::muted
PEND["UI state: Ticket Pending<br/>(retry-safe)"]:::danger
OK["UI state: Ticket Ready<br/>(owner can decrypt)"]:::card

A --> WEB
WEB -->|"1) auth via zkLogin"| WEB
WEB -->|"2) tx: mint_ticket"| SUI1
SUI1 -->|"ticket minted (no blob yet)"| WEB
WEB -->|"3) build ticket payload"| PAYLOAD
PAYLOAD -->|"4) encrypt"| SEAL
SEAL -->|"5) encrypted bytes"| WAL
WAL -->|"6) blob_id"| WEB
WEB -->|"7) tx: set_encrypted_blob"| SUI2
SUI2 -->|"8) confirmed"| OK

WAL -. "if upload fails" .-> PEND
PEND -. "retry upload + set_encrypted_blob" .-> WAL
`,
    },
    {
        id: "check-in",
        title: "Check-in / Attendance Mint (Scalable + Offline-ready)",
        description: "Venue flow: scanner PWA scans ticket id/QR, optionally requests attendee signature, then submits mark_attendance tx on Sui. If offline, it queues locally and syncs later. If duplicate/invalid, it goes to a fail-safe state for staff handling.",
        mermaidCode: `
%% DIAGRAM 7 - CHECK-IN / ATTENDANCE MINT (SCALABLE + OFFLINE-READY)
%%{init: {"flowchart":{"defaultRenderer":"elk"},"theme":"base","themeVariables":{"background":"#0A0A0A","primaryColor":"#171717","secondaryColor":"#262626","primaryTextColor":"#FFFFFF","secondaryTextColor":"#A3A3A3","lineColor":"#333333","fontFamily":"Inter, ui-sans-serif, system-ui"}}}%%
flowchart TB
classDef card fill:#171717,stroke:#333333,color:#FFFFFF,stroke-width:1px;
classDef muted fill:#262626,stroke:#333333,color:#A3A3A3,stroke-width:1px;
classDef accent fill:#171717,stroke:#06b6d4,color:#FFFFFF,stroke-width:2px;
classDef danger fill:#171717,stroke:#ef4444,color:#FFFFFF,stroke-width:2px;

SC["Scanner PWA"]:::accent
ATT["Attendee Wallet"]:::card
SUI["Sui<br/>mark_attendance(ticket_id)<br/>(scanner authorized)"]:::muted
CACHE["Local cache<br/>(ticket_id -> seen)<br/>+ retry queue"]:::card
OFF["Offline mode"]:::muted
OK["Attendance NFT minted<br/>+ entry granted"]:::card
FAIL["Fail-safe<br/>conflict/duplicate scan"]:::danger

SC -->|"1) scan QR / ticket_id"| SC
SC -->|"2) request proof signature"| ATT
ATT -->|"3) signature"| SC
SC -->|"4) submit tx"| SUI
SUI -->|"5) minted attendance"| OK

SC -. "if no internet" .-> OFF
OFF --> CACHE
CACHE -. "sync when online" .-> SUI

SUI -. "duplicate / invalid" .-> FAIL
FAIL -->|"show reason + allow manual override policy"| SC
`,
    },
    {
        id: "indexing",
        title: "Discoverability + Indexing",
        description: "Data plumbing for search/feeds: Sui events + Walrus blob updates go into a queue; indexer workers parse metadata and compute aggregates; outputs go to Postgres for queries and Redis for hot feeds/counters; API serves discovery pages; Mixpanel tracks funnel behavior.",
        mermaidCode: `
%% DIAGRAM 8 - DISCOVERABILITY + INDEXING
%%{init: {"flowchart":{"defaultRenderer":"elk"},"theme":"base","themeVariables":{"background":"#0A0A0A","primaryColor":"#171717","secondaryColor":"#262626","primaryTextColor":"#FFFFFF","secondaryTextColor":"#A3A3A3","lineColor":"#333333","fontFamily":"Inter, ui-sans-serif, system-ui"}}}%%
flowchart TB
classDef card fill:#171717,stroke:#333333,color:#FFFFFF,stroke-width:1px;
classDef muted fill:#262626,stroke:#333333,color:#A3A3A3,stroke-width:1px;
classDef accent fill:#171717,stroke:#06b6d4,color:#FFFFFF,stroke-width:2px;

SUI["Sui Events<br/>(EventCreated/TicketMinted/Attendance)"]:::muted
WAL["Walrus Blobs<br/>(metadata + site assets)"]:::muted
Q["Queue<br/>(Pub/Sub or Cloud Tasks)"]:::muted
IDX["Indexer Workers<br/>- parse metadata<br/>- compute aggregates<br/>- tag/category<br/>- build feeds"]:::accent
DB["Postgres<br/>- search index<br/>- dashboards<br/>- exports metadata"]:::muted
REDIS["Redis<br/>hot feeds + counters"]:::muted
API["Express API<br/>/search /event/:id /feeds /exports"]:::card
WEB["Next.js Discovery<br/>- categories<br/>- featured<br/>- trending<br/>- organizer pages"]:::accent
MIX["Mixpanel<br/>funnels + cohorts"]:::muted

SUI --> Q
WAL --> Q
Q --> IDX
IDX --> DB
IDX --> REDIS
API --> DB
API --> REDIS
WEB --> API
WEB --> MIX
`,
    },
    {
        id: "monetization",
        title: "Monetization",
        description: "Revenue options over time: V1 optional on-chain platform fee split on ticket purchases; V2 \"Pro\" subscription for advanced features; white-label deployments for universities/ecosystems; plus managed pilots/integration fees. Backend services handle billing and entitlements.",
        mermaidCode: `
%% DIAGRAM 9 - MONETIZATION (V1 OPTIONAL -> V2 PRO -> WHITE-LABEL)
%%{init: {"flowchart":{"defaultRenderer":"elk"},"theme":"base","themeVariables":{"background":"#0A0A0A","primaryColor":"#171717","secondaryColor":"#262626","primaryTextColor":"#FFFFFF","secondaryTextColor":"#A3A3A3","lineColor":"#333333","fontFamily":"Inter, ui-sans-serif, system-ui"}}}%%
flowchart TB
classDef card fill:#171717,stroke:#333333,color:#FFFFFF,stroke-width:1px;
classDef muted fill:#262626,stroke:#333333,color:#A3A3A3,stroke-width:1px;
classDef accent fill:#171717,stroke:#06b6d4,color:#FFFFFF,stroke-width:2px;

ORG["Organizer"]:::card
ATT["Attendee"]:::card
SUI["Sui Payments<br/>(ticket purchases in SUI/token)"]:::muted
FEE["V1 Optional Platform Fee<br/>(configurable bps)<br/>- transparent fee split"]:::accent
PRO["V2 Pro Mode<br/>(subscription)<br/>- advanced analytics<br/>- team roles<br/>- richer exports"]:::accent
WL["White-label Deployments<br/>(universities/ecosystems)<br/>- custom branding<br/>- SLA/support"]:::accent
SERV["Managed pilots / integration fees<br/>(per-event or retainer)"]:::accent
API["Backend Services<br/>billing + entitlements"]:::card

ATT -->|"buy ticket"| SUI
SUI -->|"fee split"| FEE
ORG -->|"enable fee (optional)"| FEE

ORG -->|"upgrade"| PRO
ORG -->|"white-label request"| WL
ORG -->|"needs setup/support"| SERV

PRO --> API
WL --> API
SERV --> API
`,
    },
    {
        id: "scalability",
        title: "Scalability + Load Handling",
        description: "Performance strategy under spikes: hot reads served via API + Redis cache; peak check-in bursts go directly to Sui for writes; rate limits protect API; Walrus reads can be cached; Seal decryption stays client-side to avoid server load; graceful degradation shows cached pages and retry states.",
        mermaidCode: `
%% DIAGRAM 10 - SCALABILITY + LOAD HANDLING
%%{init: {"flowchart":{"defaultRenderer":"elk"},"theme":"base","themeVariables":{"background":"#0A0A0A","primaryColor":"#171717","secondaryColor":"#262626","primaryTextColor":"#FFFFFF","secondaryTextColor":"#A3A3A3","lineColor":"#333333","fontFamily":"Inter, ui-sans-serif, system-ui"}}}%%
flowchart TB
classDef card fill:#171717,stroke:#333333,color:#FFFFFF,stroke-width:1px;
classDef muted fill:#262626,stroke:#333333,color:#A3A3A3,stroke-width:1px;
classDef accent fill:#171717,stroke:#06b6d4,color:#FFFFFF,stroke-width:2px;
classDef danger fill:#171717,stroke:#ef4444,color:#FFFFFF,stroke-width:2px;

subgraph HotPaths["Hot Paths"]
READS["Hot reads<br/>- event list<br/>- event details<br/>- attendee counts"]:::card
CHECKIN["Peak check-in<br/>scanner bursts"]:::card
end

subgraph Caching["Caching + Rate Control"]
REDIS["Redis cache<br/>- feeds<br/>- counters<br/>- event snapshots"]:::muted
RLS["Rate limits<br/>per IP/event/scanner"]:::muted
end

subgraph Services["Services"]
API["Express API<br/>Cloud Run autoscale"]:::accent
IDX["Indexer workers<br/>queued + autoscale"]:::accent
DB["Postgres<br/>Cloud SQL"]:::muted
Q["Queue<br/>Pub/Sub / Tasks"]:::muted
end

subgraph ChainStorage["Chain + Storage"]
SUI["Sui<br/>write path for mints/attendance"]:::muted
WAL["Walrus<br/>blob reads/writes"]:::muted
SEAL["Seal decrypt<br/>(client-side)"]:::muted
end

READS --> API
API --> REDIS
REDIS --> API
API --> DB

CHECKIN -->|"scanner tx bursts"| SUI
CHECKIN -->|"optional API validation endpoints"| API
API --> RLS

WAL -->|"public metadata reads cached"| REDIS
SEAL -->|"decrypt is client-side; reduces server load"| API

SUI --> Q
WAL --> Q
Q --> IDX
IDX --> DB

FAILSAFE["Degrade gracefully<br/>- show cached event pages<br/>- ticket pending states<br/>- retry queues for scanners"]:::danger
API -.-> FAILSAFE
CHECKIN -.-> FAILSAFE
`,
    },
    {
        id: "cicd-ops",
        title: "Ops: CI/CD, Secrets, Observability",
        description: "How you run it reliably: GitHub Actions does lint/typecheck/tests/E2E, builds artifacts, pushes images to a registry, deploys to Cloud Run/workers, pulls secrets from Secret Manager, and reports to Sentry/logs/metrics. Release gates enforce rollback and readiness.",
        mermaidCode: `
%% DIAGRAM 11 - OPS: CI/CD, SECRETS, OBSERVABILITY
%%{init: {"flowchart":{"defaultRenderer":"elk"},"theme":"base","themeVariables":{"background":"#0A0A0A","primaryColor":"#171717","secondaryColor":"#262626","primaryTextColor":"#FFFFFF","secondaryTextColor":"#A3A3A3","lineColor":"#333333","fontFamily":"Inter, ui-sans-serif, system-ui"}}}%%
flowchart TB
classDef card fill:#171717,stroke:#333333,color:#FFFFFF,stroke-width:1px;
classDef muted fill:#262626,stroke:#333333,color:#A3A3A3,stroke-width:1px;
classDef accent fill:#171717,stroke:#06b6d4,color:#FFFFFF,stroke-width:2px;
classDef danger fill:#171717,stroke:#ef4444,color:#FFFFFF,stroke-width:2px;

DEV["GitHub Repo<br/>(frontend + contracts + services)"]:::card
CI["GitHub Actions<br/>- lint<br/>- typecheck<br/>- Move tests<br/>- Playwright E2E<br/>- build artifacts"]:::accent
REG["Artifact Registry<br/>(container images)"]:::muted
DEP["Deploy<br/>Cloud Run + Workers<br/>(envs: dev/staging/prod)"]:::accent
SECRETS["GCP Secret Manager<br/>API keys, signing config"]:::muted
OBS["Observability<br/>Sentry + GCP Logs/Metrics<br/>alerts + dashboards"]:::muted
ROLL["Release gates<br/>- MVP demo checklist<br/>- pilot readiness<br/>- rollback plan"]:::card

DEV --> CI
CI --> REG
REG --> DEP
DEP --> SECRETS
DEP --> OBS
CI --> ROLL
`,
    },
    {
        id: "no-show-penalties",
        title: "No-show Penalties / Refundable Deposits (On-chain + UX states)",
        description: "Policy + enforcement for attendance: organizer configures deposit/no-show window and penalty mode; attendee buys a ticket and locks a deposit into an escrow/vault module; scanner marks attendance. If attendance is confirmed in time, deposit refunds; otherwise it gets slashed or triggers reputation penalty; UI shows pending/attended/no-show states.",
        mermaidCode: `
%% DIAGRAM 12 - NO-SHOW PENALTIES / REFUNDABLE DEPOSITS
%%{init: {"flowchart":{"defaultRenderer":"elk"},"theme":"base","themeVariables":{"background":"#0A0A0A","primaryColor":"#171717","secondaryColor":"#262626","primaryTextColor":"#FFFFFF","secondaryTextColor":"#A3A3A3","lineColor":"#333333","fontFamily":"Inter, ui-sans-serif, system-ui"}}}%%
flowchart TB
classDef card fill:#171717,stroke:#333333,color:#FFFFFF,stroke-width:1px;
classDef muted fill:#262626,stroke:#333333,color:#A3A3A3,stroke-width:1px;
classDef accent fill:#171717,stroke:#06b6d4,color:#FFFFFF,stroke-width:2px;
classDef danger fill:#171717,stroke:#ef4444,color:#FFFFFF,stroke-width:2px;

subgraph Actors["Actors"]
ORG["Organizer"]:::card
ATT["Attendee"]:::card
SCN["Scanner / Staff"]:::card
end

subgraph UI["Clients"]
WEB["Next.js App<br/>Registration + Ticket UI"]:::accent
PWA["Scanner PWA<br/>Check-in"]:::accent
end

subgraph SUI["Sui Move Modules"]
EV["EventRegistry<br/>- policy flags<br/>- no_show_window<br/>- deposit_amount<br/>- penalty_mode"]:::muted
TK["TicketNFT<br/>- ticket_id<br/>- event_id<br/>- owner<br/>- status"]:::muted
ES["Escrow / Deposit Vault (V2)<br/>- lock_deposit()<br/>- refund()<br/>- slash()<br/>- settle()"]:::muted
ATN["AttendanceNFT<br/>- mark_attendance()"]:::muted
end

subgraph Offchain["Offchain Helpers (Optional)"]
IDX["Indexer / Jobs<br/>- reminders<br/>- status sync"]:::card
RES["Resend<br/>Email reminders"]:::muted
PUSH["Push / Notifi<br/>Wallet reminders"]:::muted
end

ORG -->|"configures policy (deposit / penalty / window)"| WEB
WEB -->|"tx: set_event_policy(...)"| EV

ATT -->|"register / buy ticket"| WEB
WEB -->|"tx: mint_ticket(event_id)"| TK
WEB -->|"tx: lock_deposit(deposit_amount)"| ES

IDX -->|"schedule reminders"| RES
IDX -->|"optional wallet reminders"| PUSH

SCN -->|"check-in scan"| PWA
PWA -->|"tx: mark_attendance(ticket_id)"| ATN
ATN -->|"attendance confirmed"| ES
ES -->|"refund_deposit(owner)"| ATT

subgraph Outcomes["Outcomes"]
OK["Attended<br/>Deposit refunded<br/>+ Attendance minted"]:::accent
NS["No-show<br/>Deposit slashed OR<br/>reputation penalty applied"]:::danger
PEND["Pending<br/>Within no-show window<br/>(user can still check-in)"]:::card
end

ES -->|"if attended before window ends"| OK
ES -->|"if window expires without attendance"| NS
ES -->|"if within window"| PEND
`,
    },
    {
        id: "walrus-lifecycle",
        title: "Walrus Blob Lifecycle / Retention / Renewal (Durability)",
        description: "Storage durability model: different blob types (metadata, site bundle, encrypted ticket payload, post-event archive) are governed by a retention policy. Renewal jobs keep blobs alive before expiry; indexer monitors age/health; if renewal is missed, UX falls back to cached snapshots and \"pending\" states until rehydrated.",
        mermaidCode: `
%% DIAGRAM 13 - WALRUS BLOB LIFECYCLE
%%{init: {"flowchart":{"defaultRenderer":"elk"},"theme":"base","themeVariables":{"background":"#0A0A0A","primaryColor":"#171717","secondaryColor":"#262626","primaryTextColor":"#FFFFFF","secondaryTextColor":"#A3A3A3","lineColor":"#333333","fontFamily":"Inter, ui-sans-serif, system-ui"}}}%%
flowchart TB
classDef card fill:#171717,stroke:#333333,color:#FFFFFF,stroke-width:1px;
classDef muted fill:#262626,stroke:#333333,color:#A3A3A3,stroke-width:1px;
classDef accent fill:#171717,stroke:#06b6d4,color:#FFFFFF,stroke-width:2px;
classDef danger fill:#171717,stroke:#ef4444,color:#FFFFFF,stroke-width:2px;

subgraph Blobs["Blob Types"]
M["Metadata Blob (public)<br/>- title/time/desc<br/>- image refs<br/>- agenda json"]:::card
S["Site Bundle Blobs (public)<br/>- index.html/css/js<br/>- manifest"]:::card
T["Ticket Payload Blob (encrypted)<br/>- qr<br/>- location<br/>- access link"]:::accent
A["Post-event Archive Blob (optional)<br/>- anonymized stats<br/>- receipts<br/>- media pack"]:::card
end

subgraph ControlPlane["Control Plane"]
POL["Retention Policy<br/>per event<br/>- TTL/epochs<br/>- archive rules<br/>- size budgets"]:::accent
JOBS["Renewal Jobs<br/>(GCP Scheduler + Worker)"]:::card
IDX["Indexer<br/>tracks blob refs + status"]:::muted
end

subgraph SuiRefs["Sui References (Minimal)"]
EOBJ["Event Object<br/>metadata_blob_id<br/>site_manifest_blob_id<br/>policy flags"]:::muted
TOBJ["Ticket NFT<br/>encrypted_blob_id"]:::muted
end

subgraph Walrus["Walrus Storage"]
WAL["Walrus<br/>blobs with epochs / renewals"]:::muted
end

subgraph Failure["Failure / Degrade Modes"]
EX["Blob expired / unavailable"]:::danger
FALL["Fallback UX<br/>- cached public snapshot<br/>- rehydrate on renew<br/>- ticket pending / retry"]:::card
end

POL -->|"configures renewal schedule"| JOBS
JOBS -->|"renew / re-upload blobs before expiry"| WAL

M --> WAL
S --> WAL
T --> WAL
A --> WAL

WAL -->|"blob_id referenced"| EOBJ
WAL -->|"blob_id referenced"| TOBJ

IDX -->|"monitors age/expiry/size"| JOBS
IDX -->|"updates discovery index + health badges"| EOBJ

WAL -. "if renewal missed" .-> EX
EX --> FALL

subgraph Strategies["Durability Strategies"]
STR1["Keep payloads compact<br/>(JSON + minimal media)<br/>reduce renewal cost"]:::card
STR2["Separate public vs encrypted<br/>public cached broadly<br/>encrypted decrypted client-side"]:::card
STR3["Archive mode after event<br/>freeze public site<br/>optional archive blob<br/>(cheap durable reference)"]:::card
end

POL -. "enforces" .-> STR1
POL -. "enforces" .-> STR3
T -. "supports" .-> STR2
`,
    },
    {
        id: "multi-chain-payout",
        title: "Multi-chain Payout Adapter (Sui-first receipts → optional settlement rails)",
        description: "Prize payout architecture: results finalize on Sui and produce an immutable on-chain receipt (winners, amounts, criteria hash). Then payouts can be done (A) fully on Sui, (B) off-chain treasury executes payouts on another chain based on the public receipt, or (C) future bridge adapter moves funds to destination chain.",
        mermaidCode: `
%% DIAGRAM 14 - MULTI-CHAIN PAYOUT ADAPTER (SUI-FIRST RECEIPTS -> OPTIONAL SETTLEMENT RAILS)
%%{init: {"flowchart":{"defaultRenderer":"elk"},"theme":"base","themeVariables":{"background":"#0A0A0A","primaryColor":"#171717","secondaryColor":"#262626","primaryTextColor":"#FFFFFF","secondaryTextColor":"#A3A3A3","lineColor":"#333333","fontFamily":"Inter, ui-sans-serif, system-ui"}}}%%
flowchart TB
classDef card fill:#171717,stroke:#333333,color:#FFFFFF,stroke-width:1px;
classDef muted fill:#262626,stroke:#333333,color:#A3A3A3,stroke-width:1px;
classDef accent fill:#171717,stroke:#06b6d4,color:#FFFFFF,stroke-width:2px;
classDef danger fill:#171717,stroke:#ef4444,color:#FFFFFF,stroke-width:2px;

subgraph Title["MULTI-CHAIN PAYOUT ADAPTER (SUI-FIRST RECEIPTS -> OPTIONAL SETTLEMENT RAILS)"]
direction TB
end

subgraph Parties["Parties"]
ORG["Organizer"]:::card
JDG["Judges / Admin"]:::card
WIN["Winner(s)"]:::card
end

subgraph Core["Core (Always)"]
SUI["Sui<br/>Event + Prize Objects"]:::muted
ESC["Escrow / PrizeVault (V2)<br/>- lock_prize()<br/>- finalize_winners()<br/>- generate_receipt()"]:::muted
REC["On-chain Receipt<br/>(winners, amounts,<br/>criteria hash, timestamp)"]:::accent
end

subgraph RailA["Rail A: Sui-native payout (MVP/V2)"]
SUIPAY["Sui payout<br/>transfer Coin<SUI> / token"]:::accent
end

subgraph RailB["Rail B: Proof + offchain payout (EVM/Solana)"]
SAFE["Offchain Multisig / Treasury<br/>(Safe / custodian / DAO ops)"]:::card
PROOF["Receipt Verifier<br/>- reads Sui receipt<br/>- displays winners + amounts"]:::muted
end

subgraph RailC["Rail C: Bridge-based adapter (Future, optional)"]
BR["Bridge Adapter<br/>(lock/bridge funds)"]:::muted
DST["Destination chain payout<br/>(EVM/Solana token transfer)"]:::muted
end

ORG -->|"lock prize funds (optional)"| ESC
JDG -->|"submit final results (commit hash / criteria)"| ESC
ESC -->|"finalize_winners()"| REC

REC -->|"Path 1: pay on Sui"| SUIPAY
SUIPAY -->|"winner receives"| WIN

REC -->|"Path 2: public verifiable receipt"| PROOF
PROOF -->|"ops executes payout based on receipt"| SAFE
SAFE -->|"payout on chosen chain"| WIN

REC -->|"Path 3: bridge adapter (optional)"| BR
BR -->|"bridge to target chain"| DST
DST -->|"winner receives"| WIN

subgraph Notes["Key Guarantees"]
G1["Honest scope:<br/>MVP = Sui-first settlement<br/>Non-Sui = receipt + offchain payout"]:::card
G2["Composable audit trail:<br/>anyone can verify winners + amounts<br/>without trusting EventLedger backend"]:::card
end

REC -. "publishes" .-> G2
G1 -. "sets expectation" .-> SUI
`,
    },
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

    // Scroll detection for sticky sidebar
    useEffect(() => {
        const handleScroll = () => {
            if (indexRef.current) {
                const indexBottom = indexRef.current.getBoundingClientRect().bottom;
                setIsSticky(indexBottom <= 0);
            }

            // Detect active section
            const sections = architectureDiagrams.map(d => document.getElementById(d.id));
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
                        {architectureDiagrams.map((diagram, index) => (
                            <button
                                key={diagram.id}
                                onClick={() => scrollToSection(diagram.id)}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg text-left hover:bg-primary/10 hover:text-primary transition-colors group border border-transparent hover:border-primary/30"
                            >
                                <span className="text-primary/60 font-mono text-xs group-hover:text-primary transition-colors">
                                    {String(index + 1).padStart(2, "0")}
                                </span>
                                <span className="text-muted-foreground group-hover:text-primary transition-colors truncate text-xs">
                                    {diagram.title}
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
                                {architectureDiagrams.map((diagram, index) => (
                                    <button
                                        key={diagram.id}
                                        onClick={() => scrollToSection(diagram.id)}
                                        className={`w-full flex items-start gap-3 px-3 py-2.5 rounded-lg text-left transition-all group border ${activeSection === diagram.id
                                            ? "bg-primary/20 border-primary/50 text-primary"
                                            : "border-transparent hover:bg-primary/10 hover:text-primary hover:border-primary/30"
                                            }`}
                                    >
                                        <span
                                            className={`font-mono text-xs font-bold mt-0.5 shrink-0 ${activeSection === diagram.id
                                                ? "text-primary"
                                                : "text-primary/60 group-hover:text-primary"
                                                }`}
                                        >
                                            {String(index + 1).padStart(2, "0")}
                                        </span>
                                        <span
                                            className={`text-xs leading-relaxed ${activeSection === diagram.id
                                                ? "text-primary font-medium"
                                                : "text-muted-foreground group-hover:text-primary"
                                                }`}
                                        >
                                            {diagram.title}
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
                            {/* Diagram Header */}
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

                            {/* Diagram Container */}
                            <div className="relative bg-background/80 border border-border rounded-xl p-8 overflow-x-auto backdrop-blur-sm">
                                <MermaidDiagram
                                    chart={diagram.mermaidCode}
                                    id={diagram.id}
                                    className="flex justify-center items-center min-h-[300px]"
                                />

                                {/* Fullscreen Button */}
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
