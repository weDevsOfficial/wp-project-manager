import { Browser, BrowserContext, Page, test, chromium, expect } from '@playwright/test';
import { BasicLoginPage } from '../../pages/basicLogin';
import { CommentReplyPage } from '../../pages/commentReply';
import { ProjectData, TaskListData, TaskData, Users, Urls, AdminPaths } from '../../utils/testData';
import { configureSpecFailFast } from '../../utils/specFailFast';
import { pmContextOptions } from '../../utils/auth';

// Comment replies on the task sheet: one level deep. A reply to a reply joins
// the top comment's thread, the server rejects parents/items from another
// project, and deleting a comment asks first and removes its replies.
let browser: Browser;
let context: BrowserContext;
let page: Page;

const proj = ProjectData.randomProject();
const other = ProjectData.randomProject();
const list = TaskListData.random();
const task = TaskData.random();
const stamp = Date.now().toString(36);
const parent = `Reply parent ${stamp}`;
const reply1 = `First reply ${stamp}`;
const reply2 = `Second reply ${stamp}`;
const reply2Edited = `Changed answer ${stamp}`;

let projectId = '';
let otherProjectId = '';
let taskId = 0;
let parentId = 0;
let reply1Id = 0;

// pm/v2 in-page fetch (nonce + is_admin), as useApi sends it.
async function pmApi(page: Page, method: string, path: string, body?: unknown) {
  return page.evaluate(
    async ({ method, path, body }) => {
      const v = window.PM_Vars;
      const base = v.rest_url.replace(/\/$/, '');
      const sep = path.includes('?') ? '&' : '?';
      const url = method === 'GET' ? `${base}/${path}${sep}is_admin=${v.is_admin}` : `${base}/${path}`;
      const res = await fetch(url, {
        method,
        headers: { 'X-WP-Nonce': v.permission, 'content-type': 'application/json' },
        body: method === 'GET' ? undefined : JSON.stringify({ ...((body as object) || {}), is_admin: v.is_admin }),
      });
      return { status: res.status, body: await res.json().catch(() => null) };
    },
    { method, path, body },
  );
}

async function taskComments() {
  const res = await pmApi(page, 'GET', `projects/${projectId}/tasks/${taskId}`);
  return (res.body?.data?.comments?.data ?? []) as Array<{
    id: number;
    content: string;
    meta?: { total_replies?: number };
    replies?: { data: Array<{ id: number; content: string; commentable_id: number }> };
  }>;
}

async function created(res: { status: number; body: any }, what: string): Promise<number> {
  const id = Number(res.body?.data?.id ?? 0);
  if (!id) throw new Error(`seeding ${what} failed: ${res.status} ${JSON.stringify(res.body)}`);
  return id;
}

// Fixtures are seeded over REST and the sheet is opened by URL, so the spec
// runs the same with or without Pro (Pro changes the landing page and lists).
test.beforeAll(async () => {
  browser = await chromium.launch();
  context = await browser.newContext(pmContextOptions());
  page = await context.newPage();
  await new BasicLoginPage(page).basicLoginAndPmVisit(Users.adminUsername, Users.adminPassword);

  otherProjectId = String(await created(await pmApi(page, 'POST', 'projects', { title: other.title, status: 'incomplete' }), 'other project'));
  projectId = String(await created(await pmApi(page, 'POST', 'projects', { title: proj.title, status: 'incomplete' }), 'project'));
  const listId = await created(await pmApi(page, 'POST', `projects/${projectId}/task-lists`, { title: list.title }), 'task list');
  taskId = await created(
    await pmApi(page, 'POST', `projects/${projectId}/tasks`, { title: task.title, board_id: listId, project_id: projectId }),
    'task',
  );
  await created(
    await pmApi(page, 'POST', `projects/${projectId}/comments`, {
      content: parent, commentable_type: 'task', commentable_id: taskId, project_id: projectId,
    }),
    'parent comment',
  );

  await page.goto(`${Urls.baseUrl}${AdminPaths.pm}#/projects/${projectId}/task-lists/tasks/${taskId}`);
  await page.locator('[role="dialog"] .group\\/comment', { hasText: parent }).first().waitFor({ timeout: 30000 });
});

test.afterAll(async () => {
  await context.close();
  await browser.close();
});

test.describe('Task comment replies (one level)', () => {
  configureSpecFailFast();

  test('CR0001 : Reply opens with a mention of the comment author and nests under it', async () => {
    expect(taskId, 'task id from the sheet URL').toBeGreaterThan(0);
    const r = new CommentReplyPage(page);
    await r.openComposer(parent);
    await expect(r.composer(parent).locator('span[data-type="mention"]')).toHaveCount(1);

    const response = await r.send(parent, reply1);
    const body = await response.json();
    expect(body?.data?.commentable_type).toBe('comment');
    parentId = Number(body?.data?.commentable_id);
    reply1Id = Number(body?.data?.id);

    await expect(r.replies(parent)).toHaveCount(1);
    await expect(r.thread(parent).locator('[data-testid="pm-reply-count"]')).toHaveText(/1 reply/);
  });

  test('CR0002 : Replying to a reply stays in the same thread', async () => {
    const r = new CommentReplyPage(page);
    await r.openComposer(parent, reply1);
    await expect(r.composer(parent).locator('span[data-type="mention"]')).toHaveCount(1);

    const response = await r.send(parent, reply2);
    const body = await response.json();
    expect(Number(body?.data?.commentable_id), 'attached to the top comment, not the reply').toBe(parentId);

    await expect(r.replies(parent)).toHaveCount(2);
    await expect(r.thread(parent).locator('[data-testid="pm-reply-count"]')).toHaveText(/2 replies/);
  });

  test('CR0003 : Replies load nested and in order after a reload', async () => {
    const comments = await taskComments();
    const top = comments.find((c) => c.id === parentId);
    expect(top, 'parent comment in the task response').toBeTruthy();
    expect(top?.meta?.total_replies).toBe(2);
    expect(top?.replies?.data.map((x) => x.id)[0]).toBe(reply1Id);
    // Replies are not counted as top-level comments.
    expect(comments.filter((c) => c.id === reply1Id)).toHaveLength(0);
  });

  test('CR0004 : Edit a reply', async () => {
    const r = new CommentReplyPage(page);
    await r.editReply(parent, reply2, reply2Edited);
    await expect(r.reply(parent, reply2Edited)).toBeVisible();
  });

  test('CR0005 : Delete a reply leaves the rest of the thread', async () => {
    const r = new CommentReplyPage(page);
    await r.deleteReply(parent, reply2Edited);
    await expect(r.replies(parent)).toHaveCount(1);
    await expect(r.reply(parent, reply1)).toBeVisible();
  });

  test('CR0006 : Server keeps replies inside the project', async () => {
    // Parent comment from another project.
    const crossParent = await pmApi(page, 'POST', `projects/${otherProjectId}/comments`, {
      content: 'cross-project reply',
      commentable_type: 'comment',
      commentable_id: parentId,
      project_id: otherProjectId,
    });
    expect(crossParent.status).toBe(404);

    // Task from another project.
    const crossTask = await pmApi(page, 'POST', `projects/${otherProjectId}/comments`, {
      content: 'cross-project task comment',
      commentable_type: 'task',
      commentable_id: taskId,
      project_id: otherProjectId,
    });
    expect(crossTask.status).toBe(404);

    // A normal task comment still works.
    const normal = await pmApi(page, 'POST', `projects/${projectId}/comments`, {
      content: `Plain comment ${stamp}`,
      commentable_type: 'task',
      commentable_id: taskId,
      project_id: projectId,
    });
    expect(normal.status).toBe(200);
    await pmApi(page, 'POST', `projects/${projectId}/comments/${normal.body?.data?.id}/delete`);
  });

  test('CR0007 : Deleting a comment with replies asks first, then removes the thread', async () => {
    const r = new CommentReplyPage(page);
    await r.clickDeleteParent(parent);
    expect(await r.confirmDialogText()).toMatch(/1 reply/);

    await r.cancelDialog();
    await expect(r.replies(parent)).toHaveCount(1);

    await r.clickDeleteParent(parent);
    await r.confirmDialog();
    await expect(page.locator('[role="dialog"] .group\\/comment', { hasText: parent })).toHaveCount(0);

    const comments = await taskComments();
    expect(comments.find((c) => c.id === parentId)).toBeUndefined();
    const replyGone = await pmApi(page, 'GET', `projects/${projectId}/comments/${reply1Id}`);
    expect(replyGone.status).toBe(404);
  });
});
