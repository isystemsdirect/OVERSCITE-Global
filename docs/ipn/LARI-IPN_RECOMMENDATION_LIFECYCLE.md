# LARI-IPN Recommendation Lifecycle

## Strict Linear Transition Matrix

1. **GENERATED**: LARI has surfaced logic.
2. **VISIBLE_IN_OVERHUD**: The recommendation has cleared basic sanity checks and is advising human operators in the Governance tab.
3. **UNDER_REVIEW**: A human operator has actively selected the trace for boundary examination.
4. **ACCEPTED_BY_HUMAN**: Operator confirms LARI's advisory logic. *Note: this does not equate to execution.*
5. **REJECTED_BY_HUMAN**: Operator discards logic. Trace archived.
6. **BLOCKED_BY_BANE**: During `ACCEPTANCE`, BANE prevents conversion to payload action due to secondary context boundaries (like low confidence logic vs safety core logic).
7. **EXECUTED_IF_SEPARATELY_AUTHORIZED**: Handed over to the substrate payload loop via a decoupled, explicitly authorized secondary transaction path.
8. **ESCALATED_TO_ARCHIVE**: Forwarded for core structural adjustments in ArcHive.
