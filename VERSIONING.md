# OVERSCITE Versioning Policy

This document outlines the versioning strategy for the OVERSCITE / ScingOS platform.

## Current Version
**OVERSCITE / ScingOS Platform: `0.1.0-alpha.1`**

## Versioning Scheme

We follow [Semantic Versioning (SemVer)](https://semver.org/):

`MAJOR.MINOR.PATCH-TAG`

*   **MAJOR**: Incompatible API changes, architectural shifts.
*   **MINOR**: Functionality added in a backward-compatible manner.
*   **PATCH**: Backward-compatible bug fixes.
*   **TAG**: Pre-release identifier (e.g., `alpha`, `beta`, `rc`).

### Channel Tags

*   `alpha`: Early access, feature incomplete, potential instability.
*   `beta`: Feature complete, testing phase, potential bugs.
*   `rc`: Release Candidate, final testing before stable.
*   `stable` (no tag): Production-ready.

## Component Versioning

The platform consists of several components, which share the platform version for major milestones but may increment patch versions independently during development.

*   **Platform/App**: The user-facing application (Web, Desktop).
*   **Cloud Functions**: The backend serverless logic.
*   **Protocol/Canon**: The underlying data specifications and standards.

## Canon & Protocol Versions

Data schemas and communication protocols have their own versioning to ensure compatibility across different software versions.

*   **Canon Version**: Defines the version of the doctrinal/spec artifacts.
*   **Protocol Version**: Defines the version of the communication protocols (e.g., between drone and GCS).

## Release Process

1.  Update `CHANGELOG.md` with new features and fixes.
2.  Bump version numbers in `package.json` files for relevant components.
3.  Tag the commit in version control.
4.  Deploy/Release.
