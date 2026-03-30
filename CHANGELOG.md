# Changelog

All notable changes to the OVERSCITE / ScingOS project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added — 0.1.0-alpha.2 (2026-03-29)
- Scing conversational presence restoration — live assistant with natural language dialogue
- Scing dual-mode routing: conversational (default) + operational (BANE-gated)
- Scing conversation engine with session-scoped context and LLM-ready interface
- OverHUD two-zone partition: Security & Governance (top) / Operational Intelligence (bottom)
- BANE-Watcher Phase 1: security event contracts, signal normalization, live panel
- M-UCB protocol family for security monitoring
- Scing panel state V2: conversation history, mode switching, thinking indicators
- Shell discipline enforcement: Scing = conversation, OverHUD = monitoring, Workspace = primary
- Cloud Functions: marketplace, monitor, notification, BANE engine, ISDC protocol surfaces
- Scing command intent router and BANE execution gate
- Security event types, audit log types, truth-state types, workspace types

### Changed
- Shell architecture refactored: Scing Panel Singularity (unified bar + drop panel)
- OverHUD moved to flex-sibling push layout (full viewport height)
- TopCommandBar V2 with Scing center slot
- Active trim signalization (gold → green → blue cycle) on Scing panel

### Fixed
- OverHUD vertical fill restored to full viewport height
- Scing panel drop positioning fixed (absolute below command bar)

## [0.1.0-alpha.1] - 2025-02-14

### Added
- Initial consolidated release of OVERSCITE platform
- ScingOS Client (v0.1.0-alpha.1)
- ScingOS Cloud Functions (v0.1.0-alpha.1)
- ScingOS AI Drone Control (v0.1.0-alpha.1)

### Changed
- Standardized all package versions to `0.1.0-alpha.1` to establish a baseline.

### Fixed
- Inconsistent versioning across different project modules.

---

*Powered by SCINGULAR AI | Built with Bona Fide Intelligence*
