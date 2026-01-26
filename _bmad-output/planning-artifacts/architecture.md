---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
inputDocuments: 
  - '/Users/ishu.guptathoughtworks.com/IdeaProjects/stock_picker/_bmad-output/planning-artifacts/prd.md'
  - '/Users/ishu.guptathoughtworks.com/.gemini/antigravity/brain/20b5cf3d-58ae-4e81-8f4c-49f9993beb71/implementation_plan.md'
  - '/Users/ishu.guptathoughtworks.com/IdeaProjects/stock_picker/_bmad-output/planning-artifacts/epics.md'
workflowType: 'architecture'
project_name: 'stock_picker'
user_name: 'Ishu.guptathoughtworks.com'
date: '2026-01-25'
status: 'complete'
completedAt: '2026-01-25'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**
Architecture must support high-integrity data fetching (FR1), precise metric validation (FR3), and a highly responsive filtering interface (FR2, FR6). The system needs a robust bridge between the native Python environment and the React UI.

**Non-Functional Requirements:**
- **Accuracy (NFR1)**: Architectural decisions must facilitate data validation and fallback math without artificial simulation.
- **Performance (NFR2)**: Backend processing and data transfer must be optimized for <5s response times.
- **Reliability (NFR3)**: Graceful degradation if NSE API is slow or unavailable.

**Scale & Complexity:**
- Primary domain: Fintech / Retail Investment
- Complexity level: Medium
- Estimated architectural components: 4 (Data Service, Filtering Engine, API Bridge, Reactive UI)

### Technical Constraints & Dependencies
- Dependency on `nselib` (GitHub version).
- Local-only execution (No cloud infrastructure required).
- Flask (Python) and React (TypeScript) stack.

## Starter Template Evaluation

### Primary Technology Domain
**Full-stack** (Python Flask Backend + React/TypeScript Frontend)

### Starter Options Considered
1. **Manual setup (Flask + Vite)**: Best for clean separation and direct control over Python dependencies.
2. **Flask-React integrated boilerplates**: Often use outdated build tools (Webpack) or heavy proxies.

### Selected Starter: Dual-Foundation (Flask/Vite)

**Rationale for Selection:**
Maximizes development speed with Vite while ensuring the backend stays lightweight and focused on data integrity.

**Reuse Strategy:** 
We will decompose the existing `App.tsx` and `types.ts` from the Google AI Studio prototype into reusable components (Header, Sidebar, Dashboard) and shared types within the new Vite structure. The existing `pythonService.ts` logic will be migrated to the Flask `stock_service.py`.

**Initialization Commands:**

**Backend (Python 3.12+):**
```bash
mkdir backend && cd backend
python -m venv venv
source venv/bin/activate
pip install flask flask-cors python-dotenv pydantic nselib
```

**Frontend (Vite 6+):**
```bash
npm create vite@latest frontend -- --template react-ts
cd frontend
npm install lucide-react clsx tailwind-merge
```

**Architectural Decisions Provided:**
- **Language**: Python 3.12+ (Backend) / TypeScript 5+ (Frontend)
- **Styling**: Tailwind CSS for premium aesthetics.
- **Validation**: Pydantic V2 for type-safe data transfer.
## Core Architectural Decisions

### Data Architecture
- **Decision**: In-Memory Caching with Pydantic Validation & Accuracy Pivot.
- **Rationale**: No persistence layer (DB) required for MVP. Pydantic ensures data integrity (Accuracy) from the `nselib` source.
- **Accuracy Pivot**: Focus exclusively on verifiable metrics (P/E, Market Cap, Returns) to avoid misleading simulations found in initial prototypes.
- **Caching**: 5-minute cache timeout to mitigate NSE API rate limits.

### API & Communication Patterns
- **Decision**: RESTful API via Flask.
- **Patterns**: `POST /api/stocks/screen` for filtering, `GET /api/stocks/all` for discovery.
- **Error Handling**: Standardized JSON error responses (e.g., `VALIDATION_ERROR`).

### Frontend Architecture
- **Decision**: Component-Based State (Zustand) & Logic Migration.
- **Reuse Strategy**: Header/Sidebar ported from existing prototype; logic from `pythonService.ts` moved to Flask backend.
## Implementation Patterns & Consistency Rules

### Naming Conventions
- **Backend (Python)**: `snake_case` for variables/functions/files (e.g., `stock_service.py`).
- **Frontend (TS/React)**: `camelCase` for logic, `PascalCase` for Components/Types.
- **API**: `/api/plural-noun` (kebab-case).

### Structure Patterns
- **Backend**: Service-oriented (`app.py` -> `services/` -> `models/`).
- **Frontend**: Feature-based organization:
    - `src/features/screening/`: Analytics and filtering logic.
    - `src/features/shared/`: Layout and basic UI components.
- **Co-location**: Frontend tests co-located (`*.test.tsx`).

### Format Patterns
- **API Response Wrapper**: `{ "data": ..., "error": null }`.
## Project Structure & Boundaries

### Complete Project Directory Structure

```
stock_picker/
├── backend/
│   ├── app.py                 # Flask Entry Point
│   ├── services/
│   │   └── stock_service.py   # nselib logic & calculation
│   ├── models/
│   │   └── stock.py           # Pydantic schemas
│   ├── tests/                 # Backend Unit Tests
│   ├── requirements.txt
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── features/
│   │   │   ├── screening/     # Screener Table & Control
│   │   │   └── shared/        # Layout, Header, Sidebar
│   │   ├── services/
│   │   │   └── api.ts         # Axios/Fetch client
│   │   ├── store/
│   │   │   └── useStockStore.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── tailwind.config.ts
│   └── .env.local
└── README.md
```

### Requirements to Structure Mapping

**Epic 1: Discovery Engine**
- Backend: `backend/services/stock_service.py`
- Models: `backend/models/stock.py` (Pydantic)

**Epic 2: Intelligent Screener & UI**
- UI Features: `frontend/src/features/screening/`
- State Management: `frontend/src/store/useStockStore.ts` (Zustand)
- **Pivot Note**: Following discovery, Epic 2 will focus on **Real P/E Ratio** and **calculated Price Returns** (1M, 6M, 1Y) instead of simulated ROE/Debt-to-Equity, ensuring 100% data integrity.

### Architectural Boundaries
## Architecture Validation Results

### Coherence Validation ✅
- **Decision Compatibility**: Flask (Backend) + Vite (Frontend) is a high-performance modern standard.
- **Pattern Consistency**: `snake_case` (Python) vs `camelCase` (TS) prevents cross-language confusion.
- **Structure Alignment**: Feature-based frontend architecture supports clean scaling for future epics.

### Requirements Coverage Validation ✅
- **Functional Requirements**: 100% coverage for MVP. High-integrity fetching (FR1) and precise calculation (FR3) are handled by the Pydantic-service layer.
- **Non-Functional Requirements**: Accuracy (NFR1) is prioritized via validation fallbacks. Performance (NFR2) is addressed by backend caching and Vite's fast HMR.

### Implementation Readiness Validation ✅
- **Confidence Level**: High.
- **Key Strengths**: Clean separation of concerns, robust data validation, and clear roadmap for UI component reuse.

### Implementation Handoff
**First Implementation Priority:** 
Epic 1: Story 1.1 - Initialize Backend environment and `nselib` integration.

