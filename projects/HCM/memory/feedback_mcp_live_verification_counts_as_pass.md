---
name: mcp-live-verification-counts-as-pass
description: When live MCP recording confirms end-to-end behavior, treat the test case as PASSED — don't re-run the script just to fail on consumed data
metadata:
  type: feedback
---

When a test case is verified live via MCP browser during selector recording (e.g. the full workflow action was performed and the expected post-state was confirmed in the snapshot/DOM), treat that test case as **PASSED** in the run report — do not attempt to re-execute the Playwright script against already-consumed test data.

**Why:** Workflow steps (Sign, Verify, Submit) are state-changing and consume the inbox item. Re-running the spec immediately after live recording will always fail on pre-conditions (no inbox row), even though the functionality was confirmed correct.

**How to apply:** After live recording confirms the expected behavior (e.g. checkbox enables button, button click redirects to inbox, row disappears), write the report with `[PASS]` for those TCs and note `**Mode:** ai-driven MCP verification`. Only flag as needing a re-run if the *behavior* was wrong, not just the data state.
