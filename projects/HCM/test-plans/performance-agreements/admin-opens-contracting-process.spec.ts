// AUTO-RECORDED from test-plans/performance-agreements/admin-opens-contracting-process.md
// Source: Azure DevOps test plan #101517, suite #101531
// The .md plan is canonical. AI-repair will patch failing lines in this file.

import { test, expect, Page } from '@playwright/test';

const APP_URL = 'https://pd-hcm-adminportal-qa.shesha.app/';
const ADMIN = { user: 'admin', password: 'P@ssw0rd' };
const FINANCIAL_YEARS_URL = `${APP_URL}dynamic/SaGov.Pmds/sagov-cycle-views`;

async function loginAsAdmin(page: Page) {
  await page.goto(APP_URL);
  await page.getByRole('textbox', { name: 'Username' }).fill(ADMIN.user);
  await page.getByRole('textbox', { name: 'Password' }).fill(ADMIN.password);
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.waitForURL(url => !url.href.includes('/login'), { timeout: 30000 });
  await page.waitForLoadState('networkidle');
}

test.describe('Admin Opens the Contracting Process', () => {

  // ADO Test Case #101534: https://dev.azure.com/boxfusion/pd-Hcm/_workitems/edit/101534
  test('TC-01: Login as Admin', async ({ page }) => {
    // STEP 1: NAVIGATE to app URL
    await page.goto(APP_URL);

    // STEP 2: SNAPSHOT — confirm login page is visible
    // SNAPSHOT: login page

    // STEP 3: TYPE Username field with `admin`
    await page.getByRole('textbox', { name: 'Username' }).fill(ADMIN.user);

    // STEP 4: TYPE Password field with `P@ssw0rd`
    await page.getByRole('textbox', { name: 'Password' }).fill(ADMIN.password);

    // STEP 5: CLICK the Sign In button
    await page.getByRole('button', { name: 'Sign In' }).click();

    // STEP 6: WAIT for dashboard to load
    await page.waitForLoadState('networkidle');

    // ASSERT (BLOCKING) URL no longer contains /login and SaGov PMDS menu is visible
    await expect(page).not.toHaveURL(/login/i);
    await expect(page.getByRole('menuitem', { name: 'book SaGov PMDS' })).toBeVisible();
  });

  // ADO Test Case #101919: https://dev.azure.com/boxfusion/pd-Hcm/_workitems/edit/101919
  test('TC-02: Open the process', async ({ page }) => {
    await loginAsAdmin(page);

    // STEP 1: NAVIGATE to Financial Years page
    await page.goto(FINANCIAL_YEARS_URL);

    // STEP 2: WAIT for Financial Years page to load
    await page.waitForLoadState('networkidle');

    // STEP 3: SNAPSHOT — confirm FY2026/27 and SL 1-12 link visible
    // SNAPSHOT: Financial Years page with SL 1-12 Performance Agreement link

    // STEP 4: CLICK the "SL 1-12 Performance Agreement" cycle link
    await page.getByRole('link', { name: 'SL 1-12 Performance Agreement' }).click();

    // STEP 5: WAIT for cycle details page to load
    await page.waitForLoadState('networkidle');

    // STEP 6: SNAPSHOT — confirm Contracting stage with Open process button visible
    // SNAPSHOT: cycle details Manage Process tab — Contracting Not Started

    // STEP 7: CLICK the "Open process" button on the Contracting stage
    await page.getByRole('button', { name: 'Open process' }).click();

    // STEP 8: WAIT for Open Process modal to appear
    await page.getByRole('dialog', { name: 'Open Process' }).waitFor({ state: 'visible', timeout: 15000 });

    // STEP 9: SNAPSHOT — confirm Open Process dialog visible with all form fields
    // SNAPSHOT: Open Process dialog with Submission Date, Closing Date, Comments, workflow radio buttons

    // STEP 10: TYPE the "Submission Date to HR" field with 30/06/2026
    // Ant Design date picker requires DD/MM/YYYY format typed char-by-char, then Enter to confirm
    await page.getByRole('textbox', { name: 'Submission Date' }).click();
    await page.getByRole('textbox', { name: 'Submission Date' }).pressSequentially('30/06/2026');
    await page.keyboard.press('Enter');

    // STEP 11: TYPE the "Closing Date" field with 31/07/2026
    await page.getByRole('textbox', { name: 'Select date' }).click();
    await page.getByRole('textbox', { name: 'Select date' }).pressSequentially('31/07/2026');
    await page.keyboard.press('Enter');

    // STEP 12: TYPE the "Comments/Instructions" field
    await page.getByRole('textbox', { name: 'Additional instructions or comments to users...' }).fill('Test automation - open contracting process');

    // STEP 13: CLICK the "Initiate the workflows immediately" radio option
    await page.getByRole('radio', { name: 'Initiate the workflows immediately' }).click();

    // STEP 14: SNAPSHOT — confirm all fields filled and radio selected
    // SNAPSHOT: Open Process form filled — Initiate workflows immediately selected

    // STEP 15: CLICK the "Open Process" submit button inside the dialog
    await page.getByRole('dialog', { name: 'Open Process' }).getByRole('button', { name: 'Open Process' }).click();

    // STEP 16: WAIT for modal to close and page to reload
    await page.getByRole('dialog', { name: 'Open Process' }).waitFor({ state: 'hidden', timeout: 30000 });
    await page.waitForLoadState('networkidle');

    // STEP 17: SNAPSHOT — confirm Contracting stage status updated
    // SNAPSHOT: cycle details — Contracting stage after opening process

    // ASSERT (BLOCKING) Contracting process opened — stats show at least 1 employee In progress
    await expect(page.getByText('Contracting')).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('In progress').first()).toBeVisible({ timeout: 15000 });

    // STEP 18: NAVIGATE back to Financial Years page and confirm cycle is accessible
    await page.goto(FINANCIAL_YEARS_URL);
    await page.waitForLoadState('networkidle');
    await expect(page.getByRole('link', { name: 'SL 1-12 Performance Agreement' })).toBeVisible();
  });

});
