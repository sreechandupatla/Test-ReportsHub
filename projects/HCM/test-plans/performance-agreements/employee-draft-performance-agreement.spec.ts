// AUTO-RECORDED from test-plans/performance-agreements/employee-draft-performance-agreement.md
// Source: Azure DevOps test plan #101517, suite #101920
// The .md plan is canonical. AI-repair will patch failing lines in this file.
// NOTE: Employee credentials must be set in CLAUDE.md: | Employee | <username> | <password> |
//       Then set EMPLOYEE_USERNAME and EMPLOYEE_PASSWORD env vars before running.

import { test, expect, Page } from '@playwright/test';

const APP_URL = 'https://pd-hcm-adminportal-qa.shesha.app/';
const INBOX_URL = `${APP_URL}dynamic/Shesha.Workflow/workflows-inbox`;

const EMPLOYEE = {
  user: process.env.EMPLOYEE_USERNAME || '12345678',
  password: process.env.EMPLOYEE_PASSWORD || '123qwe',
};

async function loginAsEmployee(page: Page) {
  await page.goto(APP_URL);
  await page.getByRole('textbox', { name: 'Username' }).fill(EMPLOYEE.user);
  await page.getByRole('textbox', { name: 'Password' }).fill(EMPLOYEE.password);
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.waitForURL(url => !url.href.includes('/login'), { timeout: 30000 });
  await page.waitForLoadState('networkidle');
}

test.describe('Employee Draft Performance Agreement', () => {

  // ADO Test Case #101922: https://dev.azure.com/boxfusion/pd-Hcm/_workitems/edit/101922
  test('TC-01: Login as Employee', async ({ page }) => {
    // STEP 1: NAVIGATE to app URL
    await page.goto(APP_URL);

    // STEP 2: SNAPSHOT — confirm login page is visible
    // SNAPSHOT: login page

    // STEP 3: TYPE Username field with employee username
    await page.getByRole('textbox', { name: 'Username' }).fill(EMPLOYEE.user);

    // STEP 4: TYPE Password field with employee password
    await page.getByRole('textbox', { name: 'Password' }).fill(EMPLOYEE.password);

    // STEP 5: CLICK the Sign In button
    await page.getByRole('button', { name: 'Sign In' }).click();

    // STEP 6: WAIT for dashboard to load
    await page.waitForLoadState('networkidle');

    // ASSERT (BLOCKING) URL no longer contains /login
    await expect(page).not.toHaveURL(/login/i);
  });

  // ADO Test Case #102036: https://dev.azure.com/boxfusion/pd-Hcm/_workitems/edit/102036
  test('TC-02: Confirm Details Section', async ({ page }) => {
    await loginAsEmployee(page);

    // STEP 1: NAVIGATE to Workflows Inbox
    await page.goto(INBOX_URL);

    // STEP 2: WAIT for inbox to load
    await page.waitForLoadState('networkidle');

    // STEP 3: SNAPSHOT — confirm inbox table with Initiate Performance Agreement row
    // SNAPSHOT: Workflows inbox with Draft PA row

    // STEP 4: CLICK the open icon on the Initiate Performance Agreement row
    const paRow = page.getByRole('row', { name: /Initiate Performance Agreement/ });
    await paRow.getByRole('link', { name: 'search' }).click();

    // STEP 5: WAIT for workflow form to load
    await page.waitForLoadState('networkidle');

    // STEP 6: SNAPSHOT — confirm Confirm Details is active (step 1 of 5)
    // SNAPSHOT: Draft PA workflow form — Confirm Details step

    // STEP 7: ASSERT employee details visible
    await expect(page.getByText('Confirm Details', { exact: true }).first()).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('Name').first()).toBeVisible();

    // STEP 8: CLICK Next to proceed to Scoring section
    await page.getByRole('button', { name: 'Next' }).click();

    // STEP 9: WAIT for Scoring section to load
    await page.waitForLoadState('networkidle');

    // ASSERT (BLOCKING) Scoring section heading is visible
    await expect(page.getByText('Key Result Areas')).toBeVisible({ timeout: 15000 });
  });

  // ADO Test Case #102037: https://dev.azure.com/boxfusion/pd-Hcm/_workitems/edit/102037
  test('TC-03: Scoring Section - Capture KRAs', async ({ page }) => {
    await loginAsEmployee(page);
    await page.goto(INBOX_URL);
    await page.waitForLoadState('networkidle');
    const paRow = page.getByRole('row', { name: /Initiate Performance Agreement/ });
    await paRow.getByRole('link', { name: 'search' }).click();
    await page.waitForLoadState('networkidle');
    // Navigate past Confirm Details to Scoring
    await page.getByRole('button', { name: 'Next' }).click();
    await page.waitForLoadState('networkidle');

    // STEP 1: SNAPSHOT — confirm Scoring section active
    // SNAPSHOT: Scoring section — KRA table

    // DOM uses role="table" divs — use getByRole, not locator('table')
    const kraTable = page.getByRole('table').first();
    const kraNameInput = page.getByRole('textbox').first();
    const addKraBtn = kraTable.getByRole('button', { name: 'plus-circle' }).first();
    const kraWeightSelector = kraTable.locator('[class*="ant-select-selector"]').first();
    const bathoPeleSelector = kraTable.locator('[class*="ant-select-selector"]').nth(1);

    // Cleanup: delete all existing KRA rows — each delete triggers an Ant Design Popconfirm
    // Must click "OK" in the Popconfirm to confirm each deletion
    await page.waitForTimeout(1500);
    while (true) {
      const delBtn = page.locator('button[title="Delete"]').first();
      const visible = await delBtn.isVisible({ timeout: 2000 }).catch(() => false);
      if (!visible) break;
      await delBtn.click();
      await page.waitForTimeout(400);
      // Confirm the Ant Design Popconfirm by clicking "OK"
      const okBtn = page.getByRole('button', { name: 'OK' }).first();
      const okVisible = await okBtn.isVisible({ timeout: 2000 }).catch(() => false);
      if (okVisible) await okBtn.click();
      await page.waitForTimeout(800);
    }

    async function fillKra(name: string, weight: string) {
      // Fill KRA name
      await kraNameInput.fill(name);
      await page.waitForTimeout(200);

      // Select weight: click selector → type to filter → pick matching option
      await kraWeightSelector.click();
      await page.waitForTimeout(400);
      const weightInput = kraWeightSelector.locator('input[role="combobox"]');
      await weightInput.type(weight, { delay: 50 });
      await page.waitForTimeout(500);
      const weightOpt = page.locator(`.ant-select-item-option[title="${weight}%"]`).first();
      const wtVisible = await weightOpt.isVisible({ timeout: 2000 }).catch(() => false);
      if (wtVisible) {
        await weightOpt.click();
      } else {
        const firstOpt = page.locator('.ant-select-item-option').first();
        if (await firstOpt.isVisible({ timeout: 1000 }).catch(() => false)) await firstOpt.click();
        else await page.keyboard.press('Escape');
      }
      await page.waitForTimeout(300);

      // Click neutral area to close weight dropdown and reset focus
      await kraNameInput.click();
      await page.waitForTimeout(300);

      // Select Batho Pele: open with click, navigate with keyboard (options may load from API)
      await bathoPeleSelector.click();
      await page.waitForTimeout(1000);
      // Use ArrowDown to select first option regardless of load time
      await page.keyboard.press('ArrowDown');
      await page.waitForTimeout(300);
      await page.keyboard.press('Enter');
      await page.waitForTimeout(300);

      // Add KRA to grid
      await addKraBtn.click();
      await page.waitForTimeout(1000);
    }

    // STEP 2–17: Add 4 KRAs each with 25% weight (total = 100%)
    await fillKra('Deliver ICT Support Services', '25');
    await fillKra('System Maintenance and Upgrades', '25');
    await fillKra('User Training and Development', '25');
    await fillKra('Documentation and Reporting', '25');

    // STEP 18: SNAPSHOT — confirm 4 KRAs, total weight 100
    // SNAPSHOT: KRA grid with 4 entries, total = 100

    // STEP 19–22: Tick 4 GAF Development Required checkboxes
    // GAF table is the second role=table on the page (also a div, not <table>)
    const gafCheckboxes = page.getByRole('table').nth(1).getByRole('checkbox');
    await gafCheckboxes.nth(0).check();
    await gafCheckboxes.nth(1).check();
    await gafCheckboxes.nth(2).check();
    await gafCheckboxes.nth(3).check();

    // STEP 23: SNAPSHOT — confirm 4 GAFs checked
    // SNAPSHOT: GAF table with 4 checkboxes ticked

    // STEP 24: CLICK Next to Workplan Agreement
    await page.getByRole('button', { name: 'Next' }).click();

    // STEP 25: WAIT for Workplan Agreement section
    await page.waitForLoadState('networkidle');

    // ASSERT (BLOCKING) Workplan Agreement heading visible
    // TODO[assertion]: confirm exact heading text for Workplan Agreement section
    await expect(page.getByText('Workplan Agreement').first()).toBeVisible({ timeout: 15000 });
  });

  // ADO Test Case #102040: https://dev.azure.com/boxfusion/pd-Hcm/_workitems/edit/102040
  test('TC-04: Workplan Agreement Section', async ({ page }) => {
    await loginAsEmployee(page);
    await page.goto(INBOX_URL);
    await page.waitForLoadState('networkidle');
    const paRow = page.getByRole('row', { name: /Initiate Performance Agreement/ });
    await paRow.getByRole('link', { name: 'search' }).click();
    await page.waitForLoadState('networkidle');

    // Navigate from Step 1 (Confirm Details) → Step 2 (Scoring)
    await page.getByRole('button', { name: 'Next' }).click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    // Navigate from Step 2 (Scoring) → Step 3 (Workplan Agreement)
    // KRAs are pre-filled by TC-03
    await page.getByRole('button', { name: 'Next' }).click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    // STEP 1: SNAPSHOT — confirm Workplan Agreement section active (step 3)
    // SNAPSHOT: Workplan Agreement section with Add Key Activity buttons per KRA

    // Wait for KRA sections to fully render (they load async after step navigation)
    const firstAddBtn = page.getByRole('button', { name: 'Add Key Activity' }).first();
    await firstAddBtn.waitFor({ state: 'visible', timeout: 15000 });

    // Add 2 Key Activities for each KRA (validation requires min 2 per KRA)
    const addActivityBtns = page.getByRole('button', { name: 'Add Key Activity' });
    const kraCount = await addActivityBtns.count();

    async function addActivity(kraIndex: number, description: string) {
      await page.getByRole('button', { name: 'Add Key Activity' }).nth(kraIndex).click();
      await page.waitForTimeout(600);
      // "Add Key Activity" opens a dialog with required fields
      const dialog = page.getByRole('dialog', { name: 'Add Key Activity' });
      await dialog.waitFor({ state: 'visible', timeout: 10000 });

      // Fill required fields — Shesha custom labels, use role+index
      // Textbox order: 0=Key Activity, 1=Target, 2=TargetDate(datepicker), 3=Resource Required, 4=Enabling Condition, 5=Source of Evidence
      const textboxes = dialog.getByRole('textbox');
      await textboxes.nth(0).fill(description);
      await textboxes.nth(1).fill('Target for ' + description);
      // Skip nth(2) = Target Date input — filled separately below
      await textboxes.nth(3).fill('Standard resources');
      await textboxes.nth(4).fill('Management support');
      await textboxes.nth(5).fill('Progress reports');

      // Timeframe — Ant Design Select dropdown, keyboard navigate
      const timeframeSelector = dialog.locator('[class*="ant-select-selector"]').first();
      await timeframeSelector.click();
      await page.waitForTimeout(400);
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('Enter');
      await page.waitForTimeout(200);

      // Target Date — pressSequentially + Enter
      const dateInput = dialog.getByPlaceholder('Select date');
      await dateInput.click();
      await dateInput.pressSequentially('30/06/2026');
      await page.keyboard.press('Enter');
      await page.waitForTimeout(200);

      // Click Add to save the activity
      await dialog.getByRole('button', { name: 'Add' }).click();
      await dialog.waitFor({ state: 'hidden', timeout: 10000 });
      await page.waitForTimeout(500);
    }

    // Add 2 activities for each KRA
    for (let i = 0; i < kraCount; i++) {
      await addActivity(i, `Primary activity for KRA ${i + 1}`);
      await addActivity(i, `Secondary activity for KRA ${i + 1}`);
    }

    // SNAPSHOT: Workplan Agreement with activities filled
    // SNAPSHOT: Workplan Agreement section with activities

    // STEP 24: CLICK Next to PDP section
    await page.getByRole('button', { name: 'Next' }).click();
    await page.waitForLoadState('networkidle');

    // ASSERT (BLOCKING) Successfully on Step 4 — "Add PDP" button only exists on PDP section
    await expect(page.getByRole('button', { name: 'Add PDP' }).first()).toBeVisible({ timeout: 15000 });
  });

  // ADO Test Case #102041: https://dev.azure.com/boxfusion/pd-Hcm/_workitems/edit/102041
  test('TC-05: Personal Development Plan Section', async ({ page }) => {
    await loginAsEmployee(page);
    await page.goto(INBOX_URL);
    await page.waitForLoadState('networkidle');
    const paRow = page.getByRole('row', { name: /Initiate Performance Agreement/ });
    await paRow.getByRole('link', { name: 'search' }).click();
    await page.waitForLoadState('networkidle');

    // Navigate Step 1→2→3→4 (each step's data pre-filled by prior TCs)
    for (let step = 1; step <= 3; step++) {
      await page.getByRole('button', { name: 'Next' }).click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(500);
    }

    // STEP 1: SNAPSHOT — confirm PDP section active (step 4)
    // SNAPSHOT: Personal Development Plan section

    // STEP 2: CLICK Add PDP button (2 buttons exist on page — use first)
    await page.getByRole('button', { name: 'Add PDP' }).first().click();

    // STEP 3: WAIT for PDP dialog
    const pdpDialog = page.getByRole('dialog');
    await pdpDialog.waitFor({ state: 'visible', timeout: 15000 });

    // STEP 4: SNAPSHOT — confirm PDP dialog visible (title: "Add Development Area")
    // SNAPSHOT: Add Development Area dialog

    // STEP 5: SELECT Development Area (dropdown, not textbox)
    const devAreaSelector = pdpDialog.locator('[class*="ant-select-selector"]').first();
    await devAreaSelector.click();
    await page.waitForTimeout(400);
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(200);

    // STEP 6: SELECT Types of intervention (second dropdown)
    const interventionSelector = pdpDialog.locator('[class*="ant-select-selector"]').nth(1);
    await interventionSelector.click();
    await page.waitForTimeout(400);
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(200);

    // STEP 7: SELECT Commencement Date (the only textbox in the dialog)
    const pdpDate = pdpDialog.getByRole('textbox').first();
    await pdpDate.click();
    await pdpDate.pressSequentially('01/07/2026');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(200);

    // STEP 8: CLICK Add button
    await pdpDialog.getByRole('button', { name: 'Add' }).click();

    // STEP 9: WAIT for PDP to be added
    await page.waitForLoadState('networkidle');

    // STEP 10: SNAPSHOT — confirm PDP entry added
    // SNAPSHOT: PDP list with new entry

    // STEP 11: CLICK Next to Completed Summary
    await page.getByRole('button', { name: 'Next' }).click();
    await page.waitForLoadState('networkidle');

    // ASSERT (BLOCKING) Completed Summary section visible
    await expect(page.getByText('Completed Summary').first()).toBeVisible({ timeout: 15000 });
  });

  // ADO Test Case #102042: https://dev.azure.com/boxfusion/pd-Hcm/_workitems/edit/102042
  test('TC-06: Completed Summary', async ({ page }) => {
    await loginAsEmployee(page);
    await page.goto(INBOX_URL);
    await page.waitForLoadState('networkidle');
    const paRow = page.getByRole('row', { name: /Initiate Performance Agreement/ });
    await paRow.getByRole('link', { name: 'search' }).click();
    await page.waitForLoadState('networkidle');

    // Navigate Step 1→2→3→4→5 (all prior steps filled by TC-03..05)
    for (let step = 1; step <= 4; step++) {
      await page.getByRole('button', { name: 'Next' }).click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(500);
    }

    // STEP 1: SNAPSHOT — confirm Completed Summary is active (step 5)
    // SNAPSHOT: Completed Summary section with tick boxes and Submit button

    // STEP 2: CLICK the confirmation tick boxes at bottom of screen
    // Ant Design: .ant-checkbox-input intercepts pointer events, so use page.evaluate to call
    // .click() directly on .ant-checkbox-inner — same approach verified working via MCP session
    await page.evaluate(() => {
      document.querySelectorAll<HTMLElement>('.ant-checkbox-inner').forEach(el => el.click());
    });
    await page.waitForTimeout(500);

    // STEP 3: SNAPSHOT — confirm all boxes are ticked
    // SNAPSHOT: Completed Summary with all boxes ticked

    // STEP 4: CLICK Submit button (becomes enabled once both checkboxes are ticked)
    const submitBtn = page.getByRole('button', { name: 'Submit' });
    await expect(submitBtn).toBeEnabled({ timeout: 10000 });
    await submitBtn.click();

    // STEP 5: WAIT for submission to be processed
    await page.waitForLoadState('networkidle');

    // ASSERT (BLOCKING) Submission redirects back to workflows inbox
    await expect(page).toHaveURL(/workflows-inbox/, { timeout: 30000 });
  });

});
