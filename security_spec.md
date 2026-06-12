# Phase 0: PhishGuard AI Firestore Security Specification

This specification defines the security rules, invariants, and threat vectors for the Firestore database of **PhishGuard AI**.

---

## 1. Data Invariants

Our database models must adhere to the following zero-trust invariants:

1. **Incidents Invariant**: 
   - An incident must have a non-empty `incidentTitle` (string, max 200 chars).
   - `incidentSeverity` must be one of `['Low', 'Medium', 'High', 'Critical']`.
   - `status` and `remediationStatus` must be one of `['Open', 'In Progress', 'Resolved', 'Closed']`.
   - `reportedBy` must be a valid string, identifying the reported user or system.
   - Initial timestamps (`createdAt`) must match the server-generated time `request.time`.
   
2. **Users Invariant**:
   - Every registered user profile must have a valid `fullName` (string, 1-100 chars).
   - A user profile is bound to their authenticated UID. No user can modify or write another user's profile.

3. **Threat Intelligence Feeds & Models (Read-Only / System Restructured)**:
   - Threat intelligence feeds (`/threatFeeds/{feedId}`) and detection models (`/models/{modelId}`) are system-managed. End-users are strictly forbidden from writing, modifying, or deleting these. Only read access is granted.

---

## 2. The "Dirty Dozen" (Pillars of Vulnerability Validation)

The following malicious JSON payloads must be rejected by the ruleset:

### Incidents Collection (`/incidents/{incidentId}`)

1. **Identity Spoofing**: Attempting to create an incident with a spoofed reporter.
   - *Payload*: `{ "incidentTitle": "Spam Incident", "incidentSeverity": "Medium", "status": "Open", "reportedBy": "some_other_analyst_uid" }`
   - *Target Violation*: Can't set `reportedBy` to an arbitrary UID.

2. **State Shortcutting**: Attempting to create a settled incident directly without analyst action.
   - *Payload*: `{ "incidentTitle": "Fake Phish", "incidentSeverity": "High", "status": "Resolved", "reportedBy": "guest-user" }`
   - *Target Violation*: Forbids starting in a terminal state without normal lifecycle triggers.

3. **Value Poisoning (Data Exhaustion)**: Supplying a massive, 1MB string to fields like `incidentSeverity` to bypass UI constraints.
   - *Payload*: `{ "incidentTitle": "Exploit", "incidentSeverity": "A".repeat(100000), "status": "Open", "reportedBy": "guest-user" }`
   - *Target Violation*: Denies invalid enum and size boundaries.

4. **Temporal Exploitation**: Specifying a client-provided future clock `createdAt` to mess with alert sequencing.
   - *Payload*: `{ "incidentTitle": "Alert", "incidentSeverity": "Medium", "status": "Open", "reportedBy": "guest-user", "createdAt": "2030-01-01T00:00:00Z" }`
   - *Target Violation*: Temporal integrity enforces that `createdAt` matches `request.time`.

5. **Terminal State Locking Bypass**: Attempting to edit or update an incident once it has been marked `Closed`.
   - *Existing Doc*: `{ "status": "Closed", "incidentTitle": "Closed Threat" }`
   - *Update Payload*: `{ "incidentTitle": "Reopened Hack", "status": "Open" }`
   - *Target Violation*: Terminal state stays immutable.

6. **Shadow Update / Ghost Field Injection**: Writing fields not covered by the schema.
   - *Payload*: `{ "incidentTitle": "Hack", "incidentSeverity": "Medium", "status": "Open", "reportedBy": "guest-user", "isAdminField": true }`
   - *Target Violation*: Rejects unauthorized schemas.

### User Profiles Collection (`/users/{userId}`)

7. **Profile Hijacking**: Attempting to write to another user's profile document.
   - *Target Path*: `/users/hacked_user_uid`
   - *Payload*: `{ "fullName": "Attacker Name", "email": "attacker@phishguard.ai" }`
   - *Target Violation*: User can only update their own uid.

8. **Role Escalation**: Attempting to promote oneself to `admin` or a privileged role.
   - *Payload*: `{ "fullName": "Guest User", "role": "admin" }`
   - *Target Violation*: Forbids editing privileges.

9. **Value Poisoning**: Specifying an empty `fullName` or massive size string.
   - *Payload*: `{ "fullName": "", "email": "analyst@phishguard.ai" }`
   - *Target Violation*: Denies name sizes out of `1..100`.

### System Collections (`/threatFeeds/*` and `/models/*`)

10. **Threat Feed Sabotage**: Unauthenticated or client-side writing to active feeds.
    - *Target Path*: `/threatFeeds/active-feed`
    - *Payload*: `{ "active": false, "feedName": "Compromised Feed" }`
    - *Target Violation*: Read-only for standard users or system only.

11. **Model Manipulation**: Bypassing trained models telemetry.
    - *Target Path*: `/models/deployed-model`
    - *Payload*: `{ "accuracy": 1.0, "version": "v99.0" }`
    - *Target Violation*: Client cannot write model parameters.

### Global Catch-All

12. **Recursive Traversal Attack**: Trying to query deeply nested paths or unmapped collections.
    - *Target Path*: `/unmapped_collection/leak_doc`
    - *Target Violation*: The Catch-All Rule rejects anything not explicitly allowlisted.

---

## 3. Test Runner Mock

The tests are conceptually validated by implementing the Fortress Rules inside `/firestore.rules` and verifying local and CI builds function correctly.
