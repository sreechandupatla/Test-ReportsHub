// AUTO-RECORDED from test-plans/performance-agreements/review-performance-agreement.md
// Source: Azure DevOps test plan #101517, suite #102049
// The .md plan is canonical. AI-repair will patch failing lines in this file.

import { test, expect, Page } from '@playwright/test';

const APP_URL = 'https://pd-hcm-adminportal-qa.shesha.app/';
const INBOX_URL = `${APP_URL}dynamic/Shesha.Workflow/workflows-inbox`;
const SUPERVISOR = { user: 'GOV012', password: '123qwe' };

async function loginAsSupervisor(page: Page) {
  await page.goto(APP_URL);
  await page.getByRole('textbox', { name: 'Username' }).fill(SUPERVISOR.user);
  await page.locator('input[type="password"]').fill(SUPERVISOR.password);
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.waitForURL(url => !url.href.includes('/login'), { timeout: 30000 });
  await page.waitForLoadState('networkidle');
}

test.describe('Review Performance Agreement', () => {

  // ADO Test Case #102052: https://dev.azure.com/boxfusion/pd-Hcm/_workitems/edit/102052
  test('TC-01: Login as Supervisor', async ({ page }) => {
    // STEP 1: NAVIGATE to app URL
    await page.goto(APP_URL);

    // STEP 2: SNAPSHOT — confirm login page is visible
    // SNAPSHOT: login page

    // STEP 3: TYPE Username field with GOV008
    await page.getByRole('textbox', { name: 'Username' }).fill(SUPERVISOR.user);

    // STEP 4: ASSERT Username field gets populated without error
    await expect(page.getByRole('textbox', { name: 'Username' })).toHaveValue(SUPERVISOR.user);

    // STEP 5: TYPE Password field with supervisor password
    await page.locator('input[type="password"]').fill(SUPERVISOR.password);

    // STEP 6: ASSERT Password field populated and masked
    await expect(page.locator('input[type="password"]')).toHaveValue(SUPERVISOR.password);

    // STEP 7: CLICK Sign In button
    await page.getByRole('button', { name: 'Sign In' }).click();

    // STEP 8: WAIT for dashboard to load
    await page.waitForLoadState('networkidle');

    // ASSERT (BLOCKING) URL no longer contains /login
    await expect(page).not.toHaveURL(/login/i);
  });

  // ADO Test Case #102053: https://dev.azure.com/boxfusion/pd-Hcm/_workitems/edit/102053
  test('TC-02: Verify Performance Agreement (Positive)', async ({ page }) => {
    await loginAsSupervisor(page);

    // STEP 1: NAVIGATE to Workflows Inbox
    await page.goto(INBOX_URL);

    // STEP 2: WAIT for inbox to load
    await page.waitForLoadState('networkidle');

    // STEP 3: SNAPSHOT — confirm inbox page is displayed
    // SNAPSHOT: Workflows inbox showing Review Performance Agreement row

    // STEP 4: ASSERT inbox shows a row with Action Required = "Review Performance Agreement"
    const paRow = page.getByRole('row', { name: /Review Performance Agreement/ });
    await expect(paRow).toBeVisible({ timeout: 15000 });

    // STEP 5: CLICK the open icon on the Review Performance Agreement inbox row
    await paRow.locator('a[href*="workflow-action"]').click();

    // STEP 6: WAIT for Review PA form to load
    await page.waitForLoadState('networkidle');

    // STEP 7: SNAPSHOT — confirm Review PA form is open
    // SNAPSHOT: Review Performance Agreement form with View In PDF and Sign buttons

    // STEP 8: ASSERT (BLOCKING) Review Performance Agreement heading is visible
    await expect(
      page.getByRole('heading', { name: /Review Performance Agreement/ })
    ).toBeVisible({ timeout: 15000 });

    // STEP 9: CLICK View In PDF button — opens PDF in a new browser tab (blob: URL)
    const [pdfPage] = await Promise.all([
      page.context().waitForEvent('page'),
      page.getByRole('button', { name: 'View In PDF' }).click(),
    ]);
    // blob: URL is generated asynchronously via JS — waitForURL does not fire for blob: navigations.
    // Use waitForFunction to poll until the URL changes from about:blank.
    await pdfPage.waitForFunction(() => window.location.href !== 'about:blank', { timeout: 15000 });

    // STEP 10-11: SNAPSHOT — confirm PDF opened successfully in new tab
    // SNAPSHOT: PDF opened as blob: URL in new tab

    // STEP 12: ASSERT (BLOCKING) PDF tab opened with a blob: URL
    expect(pdfPage.url()).toMatch(/blob:/);
    await pdfPage.close();

    // STEP 13: CLICK Sign button
    await page.getByRole('button', { name: 'Sign' }).click();

    // STEP 14-15: WAIT for Sign action to complete
    // NOTE: No intermediate dialog — Sign submits immediately and redirects to inbox
    await page.waitForLoadState('networkidle');

    // STEP 16: SNAPSHOT — confirm sign completed and inbox is shown
    // SNAPSHOT: Inbox after signing — Review PA row no longer present

    // ASSERT (BLOCKING) Sign redirects to workflows inbox and removes the PA row
    await expect(page).toHaveURL(/workflows-inbox/, { timeout: 15000 });
    await expect(
      page.getByRole('row', { name: /Review Performance Agreement/ })
    ).not.toBeVisible({ timeout: 10000 });
  });

});
