# Vidyoday CBSE K–12 School Management System & ERP 🎓🏫

An industry-grade, multi-tenant B2B SaaS School Management System (ERP) designed specifically for Indian CBSE K–12 schools (Nursery to Class 12). 

Vidyoday eliminates clerical duplication, portal fatigue, and fee defaults through automated CBSE statutory compliance, NEP 2020 360° Holistic Progress Cards, an immutable double-entry fee ledger, biometric teacher auto-substitution, and AIS-140 GPS fleet tracking.

---

## 🌟 Key Modules & High-Impact Features

### 1. Eliminating "Portal Fatigue" & Statutory Compliance
- **1-Click Government Bulk Export:** Pre-mapped validation and export templates (CSV/Excel/JSON) aligned directly with **UDISE+**, **CBSE OASIS**, and **SARAS** affiliation renewals.
- **APAAR ID & DigiLocker Integration:** Workflows for parental consent tracking, Aadhaar demographic verification, APAAR ("One Nation, One Student ID") generation, and Academic Bank of Credits (ABC) under NCrF.
- **Board LOC (List of Candidates) Pre-Validator:** Pre-checks for Classes 9–12 flagging spelling mismatches between school records, Aadhaar, and birth certificates, plus subject-combination verification and mandatory 75% attendance shortage alerts.

### 2. NEP 2020 & CBSE Academic Engine (5+3+3+4 Structure)
- **360-Degree Holistic Progress Card (HPC):** PARAKH-aligned progress cards combining teacher observation rubrics, competency milestones, peer assessments, student self-evaluations, and parent reflections.
- **Flexible Exam & Term Engine:** Automates CBSE weightage conversions (Periodic Tests, Best-of-N, Multiple Assessments, Portfolio, Subject Enrichment/Practicals, and Final Board splits).
- **7:30 AM Zero-Chaos Morning Substitution Engine:** Automatically connects with biometric attendance at 7:45 AM. If a teacher calls in sick, the engine instantly matches free qualified teachers by stage/subject, enforces weekly substitution caps, and alerts teachers.

### 3. Finance, Double-Entry Fee Ledger & Defaulter Recovery
- **Immutable Ledger Architecture:** Replaces editable spreadsheets with a double-entry ledger (`ledger_entries`) requiring Maker-Checker OTP approval for fee waivers or cancellations.
- **Indian Fee Structuring:** Out-of-the-box support for sibling discounts, staff-ward concessions, RTE (25% Right to Education) quota tracking, distance slab pricing, and stream fees.
- **WhatsApp UPI 1-Tap Recovery:** Automated fee reminders via WhatsApp Business API with embedded dynamic UPI payment links and instant T+1 reconciliation.
- **Split-Settlement Routing:** Automatically routes tuition fees to the Trust account and transport fees to the fleet management account.

### 4. Student Safety, Transport & Campus Operations
- **Hardware-Agnostic Bus Tracking (AIS-140):** Integrates with certified vehicle GPS units and RFID door-taps for real-time stop proximity alerts and boarding logs.
- **Offline-First Attendance:** Enables teachers to mark classroom attendance in under 15 seconds even in dead Wi-Fi zones, with automatic sync.
- **Gate Pass & Visitor OTP Verification:** Photo capture, guardian phone OTP verification, and digital approval from class teachers before any student is allowed early departure.

---

## 🏗️ System Architecture & Tech Stack

```text
school-management-system/
├── school-erp/                  # Next.js 15 Full-Stack Web Application
│   ├── src/
│   │   ├── app/                 # Next.js App Router & API routes
│   │   ├── components/
│   │   │   ├── views/           # Core ERP Modules & Portals
│   │   │   │   ├── ExecutiveDashboard.tsx      # School Owner command center
│   │   │   │   ├── FeeManagementView.tsx       # Fee ledger & defaulters
│   │   │   │   ├── CbseComplianceView.tsx      # UDISE+, OASIS, LOC engine
│   │   │   │   ├── NepProgressCardView.tsx     # 360° HPC card generator
│   │   │   │   ├── SubstitutionView.tsx        # 7:30 AM auto-substitution
│   │   │   │   ├── TransportSafetyView.tsx     # GPS & RFID fleet tracker
│   │   │   │   ├── DatabaseSchemaView.tsx      # Multi-tenant PostgreSQL schema
│   │   │   │   └── ApiMicroservicesView.tsx    # Microservice architecture
│   │   │   └── NavigationTabs.tsx
│   └── docs/                    # Architectural blueprints & PRD specifications
└── AGENT.md                     # Complete CBSE ERP requirements & feature matrix
```

### Technology Stack:
- **Framework:** Next.js 16 (App Router), React 19, TypeScript
- **Styling & UI:** Tailwind CSS, Lucide Icons, Canvas Confetti
- **Database / ORM:** PostgreSQL with multi-tenant Row-Level Security (RLS) & Prisma ORM
- **Compliance:** UDISE+, CBSE OASIS, SARAS, NEP 2020 PARAKH, AIS-140 GPS

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v20+ recommended)
- npm or pnpm

### Installation & Run

1. Navigate to the web application directory:
   ```bash
   cd school-erp
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Launch the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3005](http://localhost:3005) in your web browser.

---

## 📄 License
Private & Proprietary. All rights reserved.
