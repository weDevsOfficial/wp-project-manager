import { Browser, BrowserContext, Page, test, chromium, expect } from '@playwright/test';
import { BasicLoginPage } from '../../pages/basicLogin';
import { CommentReplyPage } from '../../pages/commentReply';
import { ProjectData, DiscussionData, Users, Urls, AdminPaths } from '../../utils/testData';
import { configureSpecFailFast } from '../../utils/specFailFast';
import { pmContextOptions } from '../../utils/auth';

// Comment replies on a discussion: reply, edit the parent without losing the
// replies, delete the thread through the confirm.
let browser: Browser;
let context: BrowserContext;
let page: Page;

const proj = ProjectData.randomProject();
const disc = DiscussionData.random();
const stamp = Date.now().toString(36);
const parent = `Discussion parent ${stamp}`;
const parentEdited = `Reworded parent ${stamp}`;
const reply = `Discussion answer ${stamp}`;

// pm/v2 in-page fetch (nonce + is_admin), as useApi sends it.
async function pmApi(page: Page, method: string, path: string, body?: unknown) {
  return page.evaluate(
    async ({ method, path, body }) => {
      const v = window.PM_Vars;
      const base = v.rest_url.replace(/\/$/, '');
      const res = await fetch(`${base}/${path}`, {
        method,
        headers: { 'X-WP-Nonce': v.permission, 'content-type': 'application/json' },
        body: JSON.stringify({ ...((body as object) || {}), is_admin: v.is_admin }),
      });
      return { status: res.status, body: await res.json().catch(() => null) };
    },
    { method, path, body },
  );
}

async function created(res: { status: number; body: any }, what: string): Promise<number> {
  const id = Number(res.body?.data?.id ?? 0);
  if (!id) throw new Error(`seeding ${what} failed: ${res.status} ${JSON.stringify(res.body)}`);
  return id;
}

// Fixtures are seeded over REST and the discussion is opened by URL, so the
// spec runs the same with or without Pro.
test.beforeAll(async () => {
  browser = await chromium.launch();
  context = await browser.newContext(pmContextOptions());
  page = await context.newPage();
  await new BasicLoginPage(page).basicLoginAndPmVisit(Users.adminUsername, Users.adminPassword);

  const projectId = await created(await pmApi(page, 'POST', 'projects', { title: proj.title, status: 'incomplete' }), 'project');
  const discussionId = await created(
    await pmApi(page, 'POST', `projects/${projectId}/discussion-boards`, { title: disc.title, description: disc.body }),
    'discussion',
  );
  await created(
    await pmApi(page, 'POST', `projects/${projectId}/comments`, {
      content: parent, commentable_type: 'discussion_board', commentable_id: discussionId, project_id: projectId,
    }),
    'parent comment',
  );

  await page.goto(`${Urls.baseUrl}${AdminPaths.pm}#/projects/${projectId}/discussions/${discussionId}`);
  await page.getByText(parent).first().waitFor({ timeout: 30000 });
});

test.afterAll(async () => {
  await context.close();
  await browser.close();
});

test.describe('Discussion comment replies', () => {
  configureSpecFailFast();

  test('DR0001 : Reply to a discussion comment', async () => {
    const r = new CommentReplyPage(page);
    await r.openComposer(parent);
    await expect(r.composer(parent).locator('span[data-type="mention"]')).toHaveCount(1);
    const response = await r.send(parent, reply);
    expect((await response.json())?.data?.commentable_type).toBe('comment');
    await expect(r.replies(parent)).toHaveCount(1);
  });

  test('DR0002 : Editing the parent keeps its replies', async () => {
    // Pin the comment row by position: while it is being edited its replies
    // block is hidden and its text is replaced, so text matching breaks.
    const rows = page.locator('.group').filter({ has: page.locator('button[aria-label="Edit"]') });
    const texts = await rows.allInnerTexts();
    // Innermost match: ancestors come first in document order.
    let index = -1;
    texts.forEach((t, i) => { if (t.includes(parent)) index = i; });
    expect(index, 'parent comment row').toBeGreaterThanOrEqual(0);
    const thread = rows.nth(index);
    await thread.hover();
    await thread.locator('button[aria-label="Edit"]').first().click();
    // Edit mode swaps the row's actions for an editor, so the row locator no
    // longer matches; the inline editor is the first one on the page (the
    // comment composer is the last).
    const editor = page.locator('.ProseMirror').first();
    await expect(editor).toContainText(parent);
    await editor.click();
    await page.keyboard.press('ControlOrMeta+a');
    await page.keyboard.press('Backspace');
    await page.keyboard.type(parentEdited);
    const [response] = await Promise.all([
      page.waitForResponse((r) => r.url().includes('/comments/') && !r.url().includes('/delete') && r.request().method() === 'POST'),
      page.locator('button:has-text("Save")').first().click(),
    ]);
    expect(response.ok()).toBeTruthy();

    const r = new CommentReplyPage(page);
    await expect(r.reply(parentEdited, reply)).toBeVisible();
  });

  test('DR0003 : Replies survive a reload', async () => {
    await page.reload();
    const r = new CommentReplyPage(page);
    await expect(r.reply(parentEdited, reply)).toBeVisible({ timeout: 20000 });
  });

  test('DR0004 : Delete the thread through the confirm', async () => {
    const r = new CommentReplyPage(page);
    await r.clickDeleteParent(parentEdited);
    expect(await r.confirmDialogText()).toMatch(/1 reply/);
    await r.confirmDialog();
    await expect(page.getByText(parentEdited)).toHaveCount(0);
    await expect(page.getByText(reply)).toHaveCount(0);
  });
});
