---
stepsCompleted: ['step-01-init', 'step-02-discovery']
inputDocuments: 
  - '/Users/ishu.guptathoughtworks.com/.gemini/antigravity/brain/20b5cf3d-58ae-4e81-8f4c-49f9993beb71/implementation_plan.md'
workflowType: 'prd'
projectType: 'greenfield'
briefCount: 0
researchCount: 0
brainstormingCount: 0
projectDocsCount: 1
classification:
  projectType: 'web_app'
  domain: 'fintech'
  complexity: 'medium'
  projectContext: 'greenfield'
---

# Product Requirements Document - stock_picker

**Author:** Ishu.guptathoughtworks.com  
**Date:** 2026-01-23  
**Version:** 0.1.0 (Draft)

## Executive Summary

**Project Name:** Indian Stock Picker & Screener

**Project Type:** Personal Tool & Learning Project

**Target Users:** Retail investors interested in Indian equity markets

**Core Purpose:** Enable retail investors to discover and filter Indian stocks from NSE (National Stock Exchange) based on customizable financial criteria, providing an accurate, locally-runnable tool for investment research and learning.

**Key Success Metric:** User revisit frequency as an indicator of tool usefulness

## User Context

### Primary User Persona
**Retail Investor** - Individual investors exploring Indian equity markets who need:
- Ability to filter stocks by custom financial criteria
- Accurate, real-time data from NSE
- Simple, intuitive interface for stock screening
- Quick access to key financial metrics

### Key User Journey
1. User opens the stock picker application
2. User defines filtering criteria (market cap range, debt/equity ratio, ROE, returns, etc.)
3. System fetches live data from NSE via nselib
4. System applies filters and displays matching stocks
5. User views stock details, charts, and financial metrics
6. User exports or saves interesting stock discoveries

### User Pain Points (Current State)

**For Retail Investors:**
- **Manual screening is tedious** - Checking each stock individually across multiple criteria is time-consuming
- **Overwhelming data volume** - NSE has 2000+ listed stocks; finding good opportunities is like finding needles in a haystack
- **Lack of free, reliable tools** - Most stock screeners are paid subscriptions or have limited free tiers
- **Trust in data accuracy** - Free tools often have stale data or calculation errors
- **Complex interfaces** - Many tools assume professional-level knowledge, intimidating for retail investors

**Technical Pain Points (Current Implementation):**
- Existing prototype app is slow (browser-based Python/WASM overhead)
- Unreliable due to CORS proxy dependencies  
- Limited debugging capabilities

## Problem Statement

Retail investors need a reliable, accurate stock screening tool for Indian markets that:
- Provides real NSE data without artificial proxies or delays
- Allows flexible filtering on financial metrics
- Runs locally for privacy and performance
- Serves as both a practical tool and learning platform

**Current Solution Gap:** Browser-based Python (Pyodide) approach is fragile, slow, and difficult to maintain. Need native architecture.

## Product Goals

### Primary Goals
1. **Accuracy First** - Provide accurate, real-time stock data from NSE
2. **Reliable Performance** - Fast, stable local execution without external dependencies
3. **Learning Platform** - Help user understand stock analysis and Python/React development
4. **User Retention** - Create tool valuable enough that users return regularly

### Non-Goals (Out of Scope for MVP)
- Real-time trading or order execution
- Portfolio management or tracking
- Social features or collaboration
- Mobile native apps
- Historical backtesting (future consideration)

## Requirements

_[Following sections will be populated through BMAD workflow discovery steps]_

### Functional Requirements
_To be defined in upcoming steps_

### Non-Functional Requirements

**NFR1: Accuracy**  
- Stock data must accurately reflect NSE official data
- Market cap calculations must use real shares outstanding when available
- Financial metrics (P/E, ROE, Debt/Equity) must match NSE reported values

**NFR2: Performance**
- Stock screening should complete within 5 seconds for up to 500 stocks
- Application should start and be usable within 10 seconds

**NFR3: Reliability**
- Application should handle NSE API rate limits gracefully
- Clear error messages when data unavailable
- Fallback/caching for temporary connectivity issues

**NFR4: Usability**
- Intuitive filter controls for non-technical users
- Clear visualization of screening results
- Responsive design for different screen sizes

### Technical Architecture (from Implementation Plan)

**Backend:** Python Flask API using nselib for NSE data  
**Frontend:** React + TypeScript with visualization components  
**Key Services:**
- Stock screening and filtering
- Real-time NSE data fetching via nselib
- Data validation and transformation
- RESTful API endpoints

**API Endpoints:**
- `GET /api/health` - Health check
- `POST /api/stocks/screen` - Screen stocks based on criteria
- `GET /api/stocks/all` - Get all available stocks  
- `GET /api/stocks/{symbol}` - Get specific stock details

## MVP Scope

**Current Implementation Status:** Existing Google AI Studio app serves as MVP baseline

**MVP Features (In Scope):**
- Stock screening by market cap, debt/equity, ROE, returns
- Real NSE data via nselib integration
- Visual charts (market cap distribution, sector breakdown, scatter plots)  
- Export to CSV
- Dark mode UI with modern aesthetics

**Future Enhancements (Brainstorming Needed):**
- _To be defined through ideation session_
- Potential: Technical indicators, watchlists, alerts, fundamental analysis, comparison tools

## Success Metrics

**Primary Metric:**
- **User Revisit Frequency**: How often user returns to the tool (daily/weekly/monthly usage)

**Secondary Metrics:**
- Number of unique stock screenings performed
- Average time spent per session
- Number of stocks exported/saved
- Error rate and data accuracy validation

## Constraints & Dependencies

**Dependencies:**
- nselib Python library (GitHub source, not PyPI)
- NSE API availability and rate limits
- Python 3.8+ and Node.js 18+ runtime

**Constraints:**
- Must run locally (no cloud deployment required for MVP)
- Personal learning project budget (free/open-source tools only)
- NSE data Terms of Service compliance

## Open Questions

1. What specific future features would add most value? (needs brainstorming)
2. Should we add user authentication for saved preferences?
3. What historical data timeframes are most valuable?
4. Should we support multiple exchanges beyond NSE?

---

_This PRD will be iteratively refined through the BMAD workflow discovery process._
