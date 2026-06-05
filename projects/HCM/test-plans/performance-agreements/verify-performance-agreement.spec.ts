// AUTO-RECORDED from test-plans/performance-agreements/verify-performance-agreement.md
// Source: Azure DevOps test plan #101517, suite #102051
// The .md plan is canonical. AI-repair will patch failing lines in this file.

import { test, expect, Page } from '@playwright/test';

const APP_URL = 'https://pd-hcm-adminportal-qa.shesha.app/';
const INBOX_URL = `${APP_URL}dynamic/Shesha.Workflow/workflows-inbox`;
const HR_VERIFIER = { user: 'MaletshaN', password: '123qwe' };

async function loginAsHRVerifier(page: Page) {
  await page.goto(APP_URL);
  await page.getByRole('textbox', { name: 'Username' }).fill(HR_VERIFIER.user);
  await page.locator('input[type="password"]').fill(HR_VERIFIER.password);
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.waitForURL(url => !url.href.includes('/login'), { timeout: 30000 });
  await page.waitForLoadState('networkidle');
}

test.describe('Verify Performance Agreement', () => {

  // ADO Test Case #102063: https://dev.azure.com/boxfusion/pd-Hcm/_workitems/edit/102063
  test('TC-01: Login as Verifier', async ({ page }) => {
    // STEP 1: NAVIGATE to app URL
    await page.goto(APP_URL);

    // STEP 2: SNAPSHOT — confirm login page is visible
    // SNAPSHOT: login page

    // STEP 3: TYPE Username field with MaletshaN
    await page.getByRole('textbox', { name: 'Username' }).fill(HR_VERIFIER.user);

    // STEP 4: ASSERT Username field gets populated without error
    await expect(page.getByRole('textbox', { name: 'Username' })).toHaveValue(HR_VERIFIER.user);

    // STEP 5: TYPE Password field
    await page.locator('input[type="password"]').fill(HR_VERIFIER.password);

    // STEP 6: ASSERT Password field populated and masked
    await expect(page.locator('input[type="password"]')).toHaveValue(HR_VERIFIER.password);

    // STEP 7: CLICK Sign In button
    await page.getByRole('button', { name: 'Sign In' }).click();

    // STEP 8: WAIT for dashboard to load
    await page.waitForLoadState('networkidle');

    // ASSERT (BLOCKING) URL no longer contains /login
    await expect(page).not.toHaveURL(/login/i);
  });

  // ADO Test Case #102064: https://dev.azure.com/boxfusion/pd-Hcm/_workitems/edit/102064
  test('TC-02: HR Verify the Performance Agreement', async ({ page }) => {
    await loginAsHRVerifier(page);

    // STEP 1: NAVIGATE to Workflows Inbox
    await page.goto(INBOX_URL);

    // STEP 2: WAIT for inbox to load
    await page.waitForLoadState('networkidle');

    // STEP 3: SNAPSHOT — confirm inbox page is displayed
    // SNAPSHOT: Workflows inbox showing Verify Performance Agreement row

    // STEP 4: ASSERT inbox shows a row with Action Required = "Verify Performance Agreement"
    const paRow = page.getByRole('row', { name: /Verify Performance Agreement/ });
    await expect(paRow).toBeVisible({ timeout: 15000 });

    // STEP 5: CLICK the open icon on the Verify Performance Agreement row
    await paRow.locator('a[href*="workflow-action"]').click();

    // STEP 6: WAIT for form to load
    await page.waitForLoadState('networkidle');

    // STEP 7: SNAPSHOT — confirm Verify PA form is open
    // SNAPSHOT: Verify Performance Agreement form with Employee/Supervisor/Mediator details

    // STEP 8: ASSERT (BLOCKING) Verify Performance Agreement heading is visible
    await expect(
      page.getByRole('heading', { name: /Verify Performance Agreement/ })
    ).toBeVisible({ timeout: 15000 });

    // STEP 9: ASSERT Employee, Supervisor and Mediator details are visible
    await expect(page.getByText('Employee Details')).toBeVisible();
    await expect(page.getByText('Supervisor Details')).toBeVisible();
    await expect(page.getByText('Mediator Details')).toBeVisible();

    // STEP 10: CLICK confirmation checkbox to enable Verify button
    // Ant Design: .ant-checkbox-input intercepts pointer events — use page.evaluate for direct JS click
    await page.evaluate(() => {
      const el = document.querySelector<HTMLElement>('.ant-checkbox-inner');
      if (el) el.click();
    });
    await page.waitForTimeout(500);

    // STEP 11: WAIT for Verify button to become enabled
    const verifyBtn = page.getByRole('button', { name: 'Verify' });
    await expect(verifyBtn).toBeEnabled({ timeout: 10000 });

    // STEP 12: CLICK the Verify button
    await verifyBtn.click();

    // STEP 13: WAIT for verification to complete
    await page.waitForLoadState('networkidle');

    // STEP 14: SNAPSHOT — confirm page redirected to inbox and PA row is gone
    // SNAPSHOT: Inbox after verification — Verify PA row no longer present

    // STEP 15: ASSERT (BLOCKING) Verify redirects to workflows inbox and removes the PA row
    await expect(page).toHaveURL(/workflows-inbox/, { timeout: 15000 });
    await expect(
      page.getByRole('row', { name: /Verify Performance Agreement/ })
    ).not.toBeVisible({ timeout: 10000 });
  });

});
