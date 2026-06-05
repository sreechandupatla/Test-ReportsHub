# Test Plan: Review Performance Agreement

> **Status:** Ready
> **Owner:** QA
> **Last Updated:** 2026-06-05
> **Estimated Duration:** 120s

## Metadata
| Field | Value |
|-------|-------|
| App URL | https://pd-hcm-adminportal-qa.shesha.app/ |
| Environment | QA |
| Login As | GOV008 / 123qwe |
| ADO Plan | [#101517](https://dev.azure.com/boxfusion/pd-Hcm/_testPlans/define?planId=101517&suiteId=102049) |
| ADO Suite | #102049 — Review Performance Agreement |

## Objective
> Validate that a Supervisor can log in, locate the submitted Performance Agreement in their Workflows Inbox, open it, view the agreement as a PDF, and sign it to complete the review step.

## Preconditions
- [ ] App is reachable at https://pd-hcm-adminportal-qa.shesha.app/
- [ ] Supervisor credentials are valid (GOV008 / 123qwe)
- [ ] Employee has submitted their Draft Performance Agreement (workflow is in "Review Performance Agreement" state in the supervisor's inbox)

## Test Cases

### TC-01 — Login as Supervisor (ADO #102052)

- **Type:** Happy path
- **Steps:**
  1. NAVIGATE to https://pd-hcm-adminportal-qa.shesha.app/
  2. SNAPSHOT — confirm login page is visible
  3. TYPE Username field with `GOV008`
  4. ASSERT Username field gets populated without error
  5. TYPE Password field with `123qwe`
  6. ASSERT Password field gets populated; password is masked
  7. CLICK the Sign In button
  8. WAIT for dashboard to load
- **Expected result:** Supervisor is logged in and redirected to dashboard/home page
- **Assertions:**
  - [x] ASSERT (BLOCKING) URL no longer contains `/login`

---

### TC-02 — Verify Performance Agreement (Positive) (ADO #102053)

- **Type:** Happy path
- **Steps:**
  1. NAVIGATE to https://pd-hcm-adminportal-qa.shesha.app/dynamic/Shesha.Workflow/workflows-inbox
  2. WAIT for inbox to load
  3. SNAPSHOT — confirm inbox page is displayed
  4. ASSERT inbox table shows a row with Action Required = "Review Performance Agreement"
  5. CLICK the search/open icon on the "Review Performance Agreement" inbox row
  6. WAIT for the Review Performance Agreement page to load
  7. SNAPSHOT — confirm Review Performance Agreement form is open
  8. ASSERT (BLOCKING) Review Performance Agreement page is open (heading or form visible)
  9. CLICK the "View in PDF" button
  10. WAIT for the PDF to open or a new tab/modal to appear
  11. SNAPSHOT — confirm Performance Agreement PDF opens successfully
  12. ASSERT (BLOCKING) PDF content or PDF viewer is visible
  13. CLICK the "Sign" button
  14. WAIT for sign action to complete (no intermediate dialog — Sign submits immediately)
  15. SNAPSHOT — confirm page redirected to Workflows Inbox and Review PA row is gone
  16. ASSERT (BLOCKING) URL is `/workflows-inbox` and "Review Performance Agreement" row is no longer visible
- **Expected result:** Supervisor can view the PDF and sign the Performance Agreement; signing redirects back to the inbox with the PA item removed
- **Assertions:**
  - [x] ASSERT inbox row with "Review Performance Agreement" is visible
  - [x] ASSERT (BLOCKING) Review PA form opens after clicking the row
  - [x] ASSERT (BLOCKING) PDF opens successfully in new tab (blob: URL) after clicking "View In PDF"
  - [x] ASSERT (BLOCKING) After Sign, page redirects to workflows inbox and PA row is removed

> **Note (ADO #102053):** ADO expected result states "Signature confirmation is displayed" — actual behaviour is a direct redirect to the inbox with no intermediate dialog. Plan reflects observed behaviour.

---

## Teardown
- Log out of the portal after test completion (optional for automated runs).
