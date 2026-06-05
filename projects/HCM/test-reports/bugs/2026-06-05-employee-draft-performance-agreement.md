# Bug: Test Data Consumed — PA No Longer in Draft Inbox

- **Plan**: `projects/HCM/test-plans/performance-agreements/employee-draft-performance-agreement.md`
- **Failing TCs**: TC-02, TC-03, TC-04, TC-05, TC-06
- **Step**: STEP 4 — CLICK the open icon on the "Initiate Performance Agreement" inbox row
- **Expected**: Employee inbox contains a row for "Initiate Performance Agreement" in Draft state
- **Actual**: No such row in the inbox — the PA was already submitted, so the workflow item is gone
- **Suspected category**: `data`
- **Playwright error**:
  ```
  TimeoutError: locator.click: Timeout 15000ms exceeded.
  - waiting for getByRole('row', { name: /Initiate Performance Agreement/ }).getByRole('link', { name: 'search' })
  ```
- **Snapshot / screenshot**: `projects/HCM/test-results/artifacts/projects-HCM-test-plans-pe-b51ad--02-Confirm-Details-Section-chromium/test-failed-1.png`
- **Suspected cause**: The Performance Agreement for Lerato Mokwena (PA2026/6127) was submitted during AI-repair verification of TC-06. The "Initiate Performance Agreement" workflow action item is removed from the employee inbox once submitted.

## Resolution

To re-run this plan, the environment must be reset:
1. Admin re-opens (or resets) the Contracting process for SL 1-12 Performance Agreement — FY2026/27, **OR**
2. A new PA workflow instance must be created for the test employee (11223344) by the admin.

> **Note on TC-06 spec fix**: The original TC-06 failure (Submit button disabled) was root-caused and repaired.  
> Root cause: Ant Design checkboxes render the `<input>` off-screen; `.check()` silently fails. Fix: `.ant-checkbox-inner` clicks, verified live via MCP.  
> The spec was patched at lines 373–394 before data was consumed. The fix is valid — re-run after data reset will confirm.
