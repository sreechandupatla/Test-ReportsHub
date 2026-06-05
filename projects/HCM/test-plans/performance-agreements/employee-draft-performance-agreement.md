# Test Plan: Employee Draft Performance Agreement

> **Status:** Ready
> **Owner:** QA
> **Last Updated:** 2026-06-04
> **Estimated Duration:** 360s

## Metadata
| Field | Value |
|-------|-------|
| App URL | https://pd-hcm-adminportal-qa.shesha.app/ |
| Environment | QA |
| Login As | 11223344 / 123qwe |
| ADO Plan | [#101517](https://dev.azure.com/boxfusion/pd-Hcm/_testPlans/define?planId=101517&suiteId=101518) |
| ADO Suite | #101920 — Employee Draft Performance Agreement |

> **Prerequisite:** Employee credentials must be added to `CLAUDE.md`:
> ```
> | Employee | <username> | <password> |
> ```
> The Contracting process for **SL 1-12 Performance Agreement (FY2026/27)** must be open (status: In Progress) before this test can run.

## Objective
> Validate that an employee can log in, open their Draft Performance Agreement workflow from the inbox, complete all sections (Confirm Details → Scoring → Workplan Agreement → Personal Development Plan → Completed Summary), and submit the agreement.

## Preconditions
- [ ] App is reachable at https://pd-hcm-adminportal-qa.shesha.app/
- [ ] Employee credentials are valid and employee is enrolled in SL 1-12 PA cycle
- [ ] Contracting process is "In Progress" (opened by admin)
- [ ] Employee has a "Draft Performance Agreement" item in their Workflows → Inbox

## Test Cases

### TC-01 — Login as Employee (ADO #101922)

- **Type:** Happy path
- **Steps:**
  1. NAVIGATE to https://pd-hcm-adminportal-qa.shesha.app/
  2. SNAPSHOT — confirm login page is visible
  3. TYPE Username field with employee username
  4. TYPE Password field with employee password
  5. CLICK the Sign In button
  6. WAIT for dashboard to load
- **Expected result:** Employee is logged in and sees the dashboard
- **Assertions:**
  - [x] ASSERT (BLOCKING) URL no longer contains `/login`

---

### TC-02 — Confirm Details Section (ADO #102036)

- **Type:** Happy path
- **Steps:**
  1. NAVIGATE to https://pd-hcm-adminportal-qa.shesha.app/dynamic/Shesha.Workflow/workflows-inbox
  2. WAIT for inbox to load
  3. SNAPSHOT — confirm inbox table is visible with "Initiate Performance Agreement" row
  4. CLICK the open/search icon on the "Initiate Performance Agreement" inbox row
  5. WAIT for the Draft Performance Agreement workflow form to load
  6. SNAPSHOT — confirm "Confirm Details" is the active step (Step 1 of 5)
  7. ASSERT employee details (Name, Position, Salary Level, PERSAL Number) are visible
  8. CLICK "Next" to proceed to the Scoring section
  9. WAIT for Scoring section to load
- **Expected result:** Employee details are displayed correctly; navigates to Scoring section
- **Assertions:**
  - [x] ASSERT employee Name is visible in the Confirm Details section
  - [x] ASSERT (BLOCKING) Scoring section heading "Key Result Areas" is visible after clicking Next

---

### TC-03 — Scoring Section - Capture KRAs (ADO #102037)

- **Type:** Happy path
- **Steps:**
  1. SNAPSHOT — confirm Scoring section is active (step 2 indicator highlighted)
  2. TYPE Named KRA #1 in the KRA row input with `Deliver ICT Support Services`
  3. SELECT Weight for KRA #1 as `25`
  4. SELECT Batho Pele Principles for KRA #1 (first available option)
  5. CLICK "plus-circle" Add button to save KRA #1 to the grid
  6. TYPE Named KRA #2 with `System Maintenance and Upgrades`
  7. SELECT Weight for KRA #2 as `25`
  8. SELECT Batho Pele Principles for KRA #2
  9. CLICK "plus-circle" Add button to save KRA #2
  10. TYPE Named KRA #3 with `User Training and Development`
  11. SELECT Weight for KRA #3 as `25`
  12. SELECT Batho Pele Principles for KRA #3
  13. CLICK "plus-circle" Add button to save KRA #3
  14. TYPE Named KRA #4 with `Documentation and Reporting`
  15. SELECT Weight for KRA #4 as `25`
  16. SELECT Batho Pele Principles for KRA #4
  17. CLICK "plus-circle" Add button to save KRA #4
  18. SNAPSHOT — confirm 4 KRAs in grid and total weight shows 100
  19. CLICK the Development Required checkbox for "Job Knowledge" in the GAF table
  20. CLICK the Development Required checkbox for "Quality Of Work"
  21. CLICK the Development Required checkbox for "Technical Skills"
  22. CLICK the Development Required checkbox for "Reliability"
  23. SNAPSHOT — confirm at least 4 GAF checkboxes are ticked
  24. CLICK "Next" to proceed to Workplan Agreement section
  25. WAIT for Workplan Agreement section to load
- **Expected result:** 4 KRAs with total weight of 100 are captured; 4 GAF items checked; navigates to Workplan Agreement
- **Assertions:**
  - [x] ASSERT KRA grid shows 4 rows with total weight = 100
  - [x] ASSERT (BLOCKING) Workplan Agreement section heading is visible after clicking Next

---

### TC-04 — Workplan Agreement Section (ADO #102040)

- **Type:** Happy path
- **Steps:**
  1. SNAPSHOT — confirm Workplan Agreement section is active (step 3)
  2. CLICK the "Key Activity" button for KRA #1 ("Deliver ICT Support Services")
  3. WAIT for the "Add Activity" popup to appear
  4. SNAPSHOT — confirm Add Activity popup is visible with all fields
  5. TYPE Key Activity description with `Resolve ICT support tickets`
  6. TYPE Target with `100% resolution rate`
  7. SELECT Timeframe (first available option)
  8. SELECT Target Date
  9. TYPE Resource Required with `Laptop, network access`
  10. TYPE Enabling Conditions with `Stable network infrastructure`
  11. TYPE Source of Evidence with `Ticket resolution reports`
  12. CLICK the "Add" button to save the activity
  13. WAIT for activity to appear in the Workplan Agreement grid
  14. CLICK the "Key Activity" button for KRA #1 again (add second activity)
  15. TYPE Key Activity with `Escalate complex issues`
  16. TYPE Target with `Escalate within 2 hours`
  17. SELECT Timeframe
  18. SELECT Target Date
  19. TYPE Resource Required with `Escalation process document`
  20. TYPE Enabling Conditions with `Clear escalation path`
  21. TYPE Source of Evidence with `Escalation logs`
  22. CLICK the "Add" button
  23. SNAPSHOT — confirm at least 2 activities added for KRA #1
  24. CLICK "Next" to proceed to Personal Development Plan section
  25. WAIT for PDP section to load
- **Expected result:** At least 2 key activities per KRA are captured; navigates to PDP section
- **Assertions:**
  - [x] ASSERT (BLOCKING) Personal Development Plan section heading is visible after clicking Next

---

### TC-05 — Personal Development Plan Section (ADO #102041)

- **Type:** Happy path
- **Steps:**
  1. SNAPSHOT — confirm Personal Development Plan section is active (step 4)
  2. CLICK the "Add PDP" button
  3. WAIT for the PDP popup to appear
  4. SNAPSHOT — confirm PDP popup is visible with Development Area, Type of Intervention, Commencement Date fields
  5. TYPE Development Area with `Advanced IT Support`
  6. TYPE Type of Intervention with `Online training course`
  7. SELECT Commencement Date (first available date)
  8. CLICK the Save/Add button to save the PDP entry
  9. WAIT for PDP record to appear in the PDP list
  10. SNAPSHOT — confirm PDP entry is added successfully
  11. CLICK "Next" to proceed to Completed Summary section
  12. WAIT for Completed Summary section to load
- **Expected result:** PDP entry is added; navigates to Completed Summary
- **Assertions:**
  - [x] ASSERT (BLOCKING) Completed Summary section heading is visible after clicking Next

---

### TC-06 — Completed Summary (ADO #102042)

- **Type:** Happy path
- **Steps:**
  1. SNAPSHOT — confirm Completed Summary is active (step 5 highlighted)
  2. CLICK the tick/confirmation boxes at the bottom of the screen
  3. SNAPSHOT — confirm all required boxes are ticked
  4. CLICK the "Submit" button
  5. WAIT for the submission to be processed
- **Expected result:** Performance Agreement is submitted; submission process is initiated
- **Assertions:**
  - [x] ASSERT (BLOCKING) Submission confirmation message or workflow status change is visible

---

## Teardown
- Log out of the portal after test completion (optional for automated runs).
