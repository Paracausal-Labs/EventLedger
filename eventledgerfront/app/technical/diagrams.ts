// Mermaid diagram code constants for all 14 EventLedger architecture diagrams

export const DIAGRAM_3_MOVE_CONTRACT = `
%% DIAGRAM 3 - MOVE CONTRACT STRUCTURE (MODULES + OBJECTS)
%%{init: {"flowchart":{"defaultRenderer":"elk"},"theme":"base","themeVariables":{"background":"#0A0A0A","primaryColor":"#171717","secondaryColor":"#262626","primaryTextColor":"#FFFFFF","secondaryTextColor":"#A3A3A3","lineColor":"#333333","fontFamily":"Inter, ui-sans-serif, system-ui"}}}%%
flow

chart TB
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
AOBJ["Attendance NFT<br/>- attendance_id<br/>- event_id<br/>- attendee<br/>- timestamp<br/>(soul bound optional)"]:::muted
end

ER -->|"creates"| EOBJ
TN -->|"mints"| TOBJ
AT -->|"mints"| AOBJ

ROLES -->|"guards"| ER
ROLES -->|"guards"| AT
EVT -->|"observability hooks"| ER
EVT -->|"observability hooks"| TN
EVT -->|"observability hooks"| AT
`;
