---
stepsCompleted: ['step-01-validate-prerequisites', 'step-02-design-epics', 'step-03-create-stories', 'step-04-final-validation']
inputDocuments: 
  - '/Users/ishu.guptathoughtworks.com/IdeaProjects/stock_picker/_bmad-output/planning-artifacts/prd.md'
  - '/Users/ishu.guptathoughtworks.com/.gemini/antigravity/brain/20b5cf3d-58ae-4e81-8f4c-49f9993beb71/implementation_plan.md'
---

# stock_picker - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for stock_picker, decomposing the requirements from the PRD and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

FR1: Fetch official stock price list and volume data from NSE using nselib.
FR2: Screen and filter stocks based on market cap, debt-to-equity ratio, ROE, and 1-year returns.
FR3: Calculate market cap accurately using current price multiplied by actual shares outstanding.
FR4: Provide interactive visualizations including market cap distribution and sector breakdown using Recharts.
FR5: Enable exporting filtered stock lists to CSV format.
FR6: Implement a modern, responsive dark-mode UI for stock discovery.

### NonFunctional Requirements

NFR1: Accuracy - Data metrics must match NSE-reported values precisely; no simulated multipliers.
NFR2: Performance - Stock screening must complete in under 5 seconds for up to 500 stocks.
NFR3: Reliability - Implement graceful error handling for NSE API limits and network issues.
NFR4: Usability - UI must be intuitive for retail investors with clear filtering controls.

### Additional Requirements

- **Backend Stack**: Python Flask API.
- **Frontend Stack**: React + TypeScript with Vite.
- **Library Source**: Integrate `nselib` library directly from `git+https://github.com/RuchiTanmay/nselib.git`.
- **Deployment**: Must be fully operational in a local development environment.
- **Environment**: Use `.env` files for configuration.

### FR Coverage Map (MVP)

FR1: Epic 1 - Fetching official price list and volume from NSE.
FR2: Epic 2 - Implementing screening logic based on custom criteria.
FR3: Epic 1 - Accurate market cap calculation (Price * Shares).
FR6: Epic 2 - Creating the interactive screening interface.

### FR Coverage Map (Deferred)

FR4: Epic 3 - Visual representations (Market Cap, Sector distribution).
FR5: Epic 4 - CSV export capability.

## Epic List (MVP)

### Epic 1: Accurate NSE Stock Discovery Engine

Build the foundational engine that fetches real-time data from NSE and ensures data integrity.

### Story 1.1: Integrated Data Acquisition Service
As a retail investor,
I want the system to fetch the latest NSE stock price lists using a native Python backend,
So that I can access reliable, real-time market data without browser-based performance bottlenecks.

**Acceptance Criteria:**

**Given** the Flask backend is initialized with `nselib` dependency from GitHub
**When** the `/api/stocks/all` endpoint is called
**Then** it returns the latest list of NSE equity stocks including symbols, prices, and volumes
**And** the data is fetched directly using native Python without CORS proxies.

### Story 1.2: Precision Metric Validation & Calculation
As a retail investor,
I want the system to use official NSE market cap data when available, and calculate it (Price * Shares) only if missing or inaccurate,
So that I can trust the results of my stock screening.

**Acceptance Criteria:**

**Given** a list of stocks fetched from NSE
**When** the system processes the data
**Then** it prioritizes the use of official 'Market Cap' values provided by the API
**And** it applies a manual calculation fallback (Price * Shares Outstanding) ONLY if the provided figure is absent, zero, or clearly incorrect
**And** the resulting metrics are validated for consistency.

---

## Epic 2: Intelligent Stock Screener & UI

Empower users to filter the market and view results in a modern interface.

### Story 2.1: Advanced Screening Engine
As a retail investor,
I want to filter the stock list by custom metrics like ROE, Debt-to-Equity, and Returns,
So that I can isolate high-potential investment opportunities.

**Acceptance Criteria:**

**Given** a criteria object with min/max values for ROE and Debt-to-Equity
**When** the `/api/stocks/screen` endpoint is called
**Then** the backend filters the cached NSE dataset
**And** returns only the stocks that satisfy all conditions within 5 seconds.

### Story 2.2: Modern Dark-Mode Screening UI
As a retail investor,
I want a responsive, terminal-inspired interface to input parameters and view results,
So that I have a premium and efficient research experience.

**Acceptance Criteria:**

**Given** the React frontend is running
**When** a user adjusts the filter sliders or inputs
**Then** the UI triggers an API call to the backend
**And** the results are displayed in a sortable, sort-oriented grid system
**And** the app follows the modern dark-mode aesthetic.

---

## Epic List (Deferred / Future Scope)

### Epic 3: Market & Sector Visualizer
Enable users to see the "big picture" of the market through interactive charts, understanding sector distribution and market cap clusters.
**FRs covered:** FR4

### Epic 4: Research Export & Persistence
Allow users to take their research with them. Support for exporting screened results to CSV for external analysis.
**FRs covered:** FR5
