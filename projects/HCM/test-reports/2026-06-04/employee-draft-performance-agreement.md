# Report: Test Plan: Employee Draft Performance Agreement
**Date:** 2026-06-04 12:15 UTC
**Plan:** test-plans/performance-agreements/employee-draft-performance-agreement.md
**Spec:** test-plans/performance-agreements/employee-draft-performance-agreement.spec.ts
**Execution Mode:** playwright-script (failures pending AI-repair)
**Result:** FAILED
**Duration:** 123.0s

## Summary
| Total Steps | Passed | Failed | Skipped |
|-------------|--------|--------|---------|
| 6 | 1 | 5 | 0 |

## Step Results
### TC-01: Login as Employee
**Mode:** playwright-script
**Duration:** 3.6s
- [PASS] TC-01: Login as Employee

### TC-02: Confirm Details Section
**Mode:** playwright-script
**Duration:** 22.7s
- [FAIL] TC-02: Confirm Details Section

**Error:**
```
TimeoutError: locator.click: Timeout 15000ms exceeded.
Call log:
[2m  - waiting for getByRole('row', { name: /Initiate Performance Agreement/ }).getByRole('link', { name: 'search' })[22m


  65 |     // STEP 4: CLICK the open icon on the Initiate Performance Agreement row
  66 |     const paRow = page.getByRole('row', { name: /Initiate Performance Agreement/ });
> 67 |     await paRow.getByRole('link', { name: 'search' }).click();
     |                                                       ^
  68 |
  69 |     // STEP 5: WAIT for workflow form to load
  70 |     await page.waitForLoadState('networkidle');
    at C:\Users\Boxfusion-New\Desktop\Repos\Test-ReportsHub\projects\HCM\test-plans\performance-agreements\employee-draft-performance-agreement.spec.ts:67:55
```
**Location:** C:\Users\Boxfusion-New\Desktop\Repos\Test-ReportsHub\projects\HCM\test-plans\performance-agreements\employee-draft-performance-agreement.spec.ts:67:55

### TC-03: Scoring Section - Capture KRAs
**Mode:** playwright-script
**Duration:** 22.3s
- [FAIL] TC-03: Scoring Section - Capture KRAs

**Error:**
```
TimeoutError: locator.click: Timeout 15000ms exceeded.
Call log:
[2m  - waiting for getByRole('row', { name: /Initiate Performance Agreement/ }).getByRole('link', { name: 'search' })[22m


  93 |     await page.waitForLoadState('networkidle');
  94 |     const paRow = page.getByRole('row', { name: /Initiate Performance Agreement/ });
> 95 |     await paRow.getByRole('link', { name: 'search' }).click();
     |                                                       ^
  96 |     await page.waitForLoadState('networkidle');
  97 |     // Navigate past Confirm Details to Scoring
  98 |     await page.getByRole('button', { name: 'Next' }).click();
    at C:\Users\Boxfusion-New\Desktop\Repos\Test-ReportsHub\projects\HCM\test-plans\performance-agreements\employee-draft-performance-agreement.spec.ts:95:55
```
**Location:** C:\Users\Boxfusion-New\Desktop\Repos\Test-ReportsHub\projects\HCM\test-plans\performance-agreements\employee-draft-performance-agreement.spec.ts:95:55

### TC-04: Workplan Agreement Section
**Mode:** playwright-script
**Duration:** 22.0s
- [FAIL] TC-04: Workplan Agreement Section

**Error:**
```
TimeoutError: locator.click: Timeout 15000ms exceeded.
Call log:
[2m  - waiting for getByRole('row', { name: /Initiate Performance Agreement/ }).getByRole('link', { name: 'search' })[22m


  202 |     await page.waitForLoadState('networkidle');
  203 |     const paRow = page.getByRole('row', { name: /Initiate Performance Agreement/ });
> 204 |     await paRow.getByRole('link', { name: 'search' }).click();
      |                                                       ^
  205 |     await page.waitForLoadState('networkidle');
  206 |
  207 |     // Navigate from Step 1 (Confirm Details) → Step 2 (Scoring)
    at C:\Users\Boxfusion-New\Desktop\Repos\Test-ReportsHub\projects\HCM\test-plans\performance-agreements\employee-draft-performance-agreement.spec.ts:204:55
```
**Location:** C:\Users\Boxfusion-New\Desktop\Repos\Test-ReportsHub\projects\HCM\test-plans\performance-agreements\employee-draft-performance-agreement.spec.ts:204:55

### TC-05: Personal Development Plan Section
**Mode:** playwright-script
**Duration:** 22.4s
- [FAIL] TC-05: Personal Development Plan Section

**Error:**
```
TimeoutError: locator.click: Timeout 15000ms exceeded.
Call log:
[2m  - waiting for getByRole('row', { name: /Initiate Performance Agreement/ }).getByRole('link', { name: 'search' })[22m


  288 |     await page.waitForLoadState('networkidle');
  289 |     const paRow = page.getByRole('row', { name: /Initiate Performance Agreement/ });
> 290 |     await paRow.getByRole('link', { name: 'search' }).click();
      |                                                       ^
  291 |     await page.waitForLoadState('networkidle');
  292 |
  293 |     // Navigate Step 1→2→3→4 (each step's data pre-filled by prior TCs)
    at C:\Users\Boxfusion-New\Desktop\Repos\Test-ReportsHub\projects\HCM\test-plans\performance-agreements\employee-draft-performance-agreement.spec.ts:290:55
```
**Location:** C:\Users\Boxfusion-New\Desktop\Repos\Test-ReportsHub\projects\HCM\test-plans\performance-agreements\employee-draft-performance-agreement.spec.ts:290:55

### TC-06: Completed Summary
**Mode:** playwright-script
**Duration:** 22.0s
- [FAIL] TC-06: Completed Summary

**Error:**
```
TimeoutError: locator.click: Timeout 15000ms exceeded.
Call log:
[2m  - waiting for getByRole('row', { name: /Initiate Performance Agreement/ }).getByRole('link', { name: 'search' })[22m


  357 |     await page.waitForLoadState('networkidle');
  358 |     const paRow = page.getByRole('row', { name: /Initiate Performance Agreement/ });
> 359 |     await paRow.getByRole('link', { name: 'search' }).click();
      |                                                       ^
  360 |     await page.waitForLoadState('networkidle');
  361 |
  362 |     // Navigate Step 1→2→3→4→5 (all prior steps filled by TC-03..05)
    at C:\Users\Boxfusion-New\Desktop\Repos\Test-ReportsHub\projects\HCM\test-plans\performance-agreements\employee-draft-performance-agreement.spec.ts:359:55
```
**Location:** C:\Users\Boxfusion-New\Desktop\Repos\Test-ReportsHub\projects\HCM\test-plans\performance-agreements\employee-draft-performance-agreement.spec.ts:359:55
