# Test Plan: Admin Opens the Contracting Process

> **Status:** Ready
> **Owner:** QA
> **Last Updated:** 2026-06-04
> **Estimated Duration:** 150s

## Metadata
| Field | Value |
|-------|-------|
| App URL | https://pd-hcm-adminportal-qa.shesha.app/ |
| Environment | QA |
| Login As | admin / P@ssw0rd |
| ADO Plan | [#101517](https://dev.azure.com/boxfusion/pd-Hcm/_testPlans/define?planId=101517&suiteId=101518) |
| ADO Suite | #101531 — Admin Opens the Contracting Process |

## Objective
> Validate that an Admin can navigate to the SL 1-12 Performance Agreement cycle, open the Contracting process by providing required details (submission date, closing date, comments, workflow initiation option), and confirm the process status changes to reflect it is open and available to end users.

## Preconditions
- [ ] App is reachable at https://pd-hcm-adminportal-qa.shesha.app/
- [ ] Admin credentials are valid (admin / P@ssw0rd)
- [ ] FY2026/27 exists with "SL 1-12 Performance Agreement" cycle
- [ ] Contracting stage status is "Not Started" (this test opens the process — it is a state-changing action)

> **Warning:** TC-02 opens the Contracting process. This changes system state and should not be run repeatedly without resetting the environment.

## Test Cases

### TC-01 — Login as Admin (ADO #101534)

- **Type:** Happy path
- **Steps:**
  1. NAVIGATE to https://pd-hcm-adminportal-qa.shesha.app/
  2. SNAPSHOT — confirm login page is visible
  3. TYPE Username field with `admin`
  4. TYPE Password field with `P@ssw0rd`
  5. CLICK the Sign In button
  6. WAIT for dashboard to load
- **Expected result:** User is logged in and sees the admin dashboard with SaGov PMDS menu visible
- **Assertions:**
  - [x] ASSERT (BLOCKING) URL no longer contains `/login` and SaGov PMDS menu is visible

---

### TC-02 — Open the process (ADO #101919)

- **Type:** Happy path
- **Steps:**
  1. NAVIGATE to https://pd-hcm-adminportal-qa.shesha.app/dynamic/SaGov.Pmds/sagov-cycle-views
  2. WAIT for Financial Years page to load
  3. SNAPSHOT — confirm FY2026/27 and "SL 1-12 Performance Agreement" link are visible
  4. CLICK the "SL 1-12 Performance Agreement" cycle link
  5. WAIT for cycle details page to load
  6. SNAPSHOT — confirm Contracting stage with "Open process" button is visible and status is "Not Started"
  7. CLICK the "Open process" button on the Contracting stage
  8. WAIT for the "Open Process" modal to appear
  9. SNAPSHOT — confirm Open Process dialog is visible with Submission Date, Closing Date, Supporting Document, Comments, and workflow initiation fields
  10. TYPE the "Submission Date to HR" field with `2026-06-30`
  11. TYPE the "Closing Date" field with `2026-07-31`
  12. TYPE the "Comments/Instructions" field with `Test automation - open contracting process`
  13. CLICK the "Initiate the workflows immediately" radio option
  14. SNAPSHOT — confirm all required fields are filled and "Initiate the workflows immediately" is selected
  15. CLICK the "Open Process" submit button inside the dialog
  16. WAIT for the modal to close and the page to reload
  17. SNAPSHOT — confirm Contracting stage status has updated on the cycle details page
  18. NAVIGATE to https://pd-hcm-adminportal-qa.shesha.app/dynamic/SaGov.Pmds/sagov-cycle-views and WAIT for page to reload
- **Expected result:** The Contracting process is successfully opened; status changes from "Not Started" to "In Progress" and is available to end users
- **Assertions:**
  - [x] ASSERT (BLOCKING) Contracting stage status shows "In Progress" after the process is opened

---

## Teardown
- Log out of the admin portal after test completion (optional for automated runs).
