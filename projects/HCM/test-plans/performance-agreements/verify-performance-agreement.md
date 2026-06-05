# Test Plan: Verify Performance Agreement

> **Status:** Ready
> **Owner:** QA
> **Last Updated:** 2026-06-05
> **Estimated Duration:** 90s

## Metadata
| Field | Value |
|-------|-------|
| App URL | https://pd-hcm-adminportal-qa.shesha.app/ |
| Environment | QA |
| Login As | MaletshaN / 123qwe |
| ADO Plan | [#101517](https://dev.azure.com/boxfusion/pd-Hcm/_testPlans/define?planId=101517&suiteId=102051) |
| ADO Suite | #102051 — Verify Performance Agreement |

## Objective
> Validate that an HR Verifier can log in, locate the submitted Performance Agreement in their Workflows Inbox with action "Verify Performance Agreement", open it, confirm Employee/Supervisor/Mediator details are visible, and click the Verify button to complete the verification step.

## Preconditions
- [ ] App is reachable at https://pd-hcm-adminportal-qa.shesha.app/
- [ ] HR Verifier credentials are valid (MaletshaN / 123qwe)
- [ ] Supervisor has signed the Performance Agreement (workflow is in "Verify Performance Agreement" state in the HR Verifier's inbox)

## Test Cases

### TC-01 — Login as Verifier (ADO #102063)

- **Type:** Happy path
- **Steps:**
  1. NAVIGATE to https://pd-hcm-adminportal-qa.shesha.app/
  2. SNAPSHOT — confirm login page is visible
  3. TYPE Username field with `MaletshaN`
  4. ASSERT Username field gets populated without error
  5. TYPE Password field with `123qwe`
  6. ASSERT Password field gets populated; password is masked
  7. CLICK the Sign In button
  8. WAIT for dashboard to load
- **Expected result:** HR Verifier is logged in and redirected to dashboard/home page
- **Assertions:**
  - [x] ASSERT (BLOCKING) URL no longer contains `/login`

---

### TC-02 — HR Verify the Performance Agreement (ADO #102064)

- **Type:** Happy path
- **Steps:**
  1. NAVIGATE to https://pd-hcm-adminportal-qa.shesha.app/dynamic/Shesha.Workflow/workflows-inbox
  2. WAIT for inbox to load
  3. SNAPSHOT — confirm inbox page is displayed
  4. ASSERT inbox shows a row with Action Required = "Verify Performance Agreement"
  5. CLICK the open/search icon on the "Verify Performance Agreement" inbox row
  6. WAIT for the Performance Agreement review page to load
  7. SNAPSHOT — confirm Performance Agreement review page is open
  8. ASSERT (BLOCKING) Performance Agreement review page is open (heading visible)
  9. ASSERT Employee, Supervisor and Mediator details are visible on the page
  10. CLICK the confirmation checkbox "I confirm that the Performance Agreement details have been reviewed and are accurate" (Ant Design checkbox — click `.ant-checkbox-inner`)
  11. WAIT for Verify button to become enabled
  12. CLICK the "Verify" button
  13. WAIT for the verification action to complete
  14. SNAPSHOT — confirm page redirected to Workflows Inbox and Verify PA row is gone
  15. ASSERT (BLOCKING) URL is `/workflows-inbox` and "Verify Performance Agreement" row is no longer visible
- **Expected result:** HR Verifier ticks the confirmation checkbox, clicks Verify; verification is processed and the PA item is removed from the inbox
- **Assertions:**
  - [x] ASSERT inbox row with "Verify Performance Agreement" is visible
  - [x] ASSERT (BLOCKING) PA review page opens after clicking the row
  - [x] ASSERT Employee, Supervisor and Mediator details are visible
  - [x] ASSERT (BLOCKING) After Verify, page redirects to workflows inbox and PA row is removed

---

## Teardown
- Log out of the portal after test completion (optional for automated runs).
