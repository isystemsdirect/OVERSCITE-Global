# Inspection Methodology Stack

## Overview
The Inspection Methodology Stack is the standardized framework for conducting field operations within the OVERSCITE™ ecosystem.

## Core Components
### Inspection Methods
Discrete, well-defined procedures for evaluating a target. Each method has a contract specifying inputs, evidence requirements, and acceptance criteria.

### Method Packs
Bundled collections of related methods for specific inspection types (e.g., roofing, structural, environmental). Method packs are versioned and governed.

### Workflow Graph
The ordered sequence of methods, decision points, and evidence gates that constitute a complete inspection. The graph enforces that prerequisites are met before dependent methods execute.

### Evidence Rules
Each method defines what evidence is required (photos, measurements, sensor readings), acceptable formats, and minimum quality thresholds.

### Training Modules
Operators must complete training modules before using specific methods. Training completion is tracked and bound to ARC identity.

### Scing Guidance Hooks
Scing provides contextual guidance during method execution — suggesting evidence capture angles, flagging potential deficiencies, and alerting to environmental conditions.

### Template Bindings
Methods bind to DocuSCRIBE™ templates, ensuring that reports are pre-structured for the specific methodology used.

### QA Gates
Quality assurance checkpoints within the workflow graph that require human or Scing verification before proceeding.

## SCIMEGA™ Capability Binding
Methods are bound to SCIMEGA™ capabilities through the XSCITE™ Drone Builder. Only drone profiles with the required capability intelligence can execute specific inspection methods.

## SmartSCHEDULER™ Relationship
Scheduled inspections reference methodology contracts. SmartSCHEDULER™ validates that the scheduled resources (drones, operators) meet the capability requirements defined by the methodology.

## Observation vs. Identification vs. Human Assessment
- **Observation**: Raw data capture (SRT domain). No interpretation.
- **Identification**: Pattern recognition and classification (LARI domain). Machine-assisted.
- **Human Assessment**: Professional judgment and conclusion (Human/ARC domain). Always required for final findings.
