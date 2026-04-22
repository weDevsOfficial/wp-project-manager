import { Browser, BrowserContext, Page, test, chromium, expect } from '@playwright/test';
import { BasicLoginPage } from '../pages/basicLogin';
import { ProjectPage } from '../pages/project';
import { ProjectData, Users, RestPaths } from '../utils/testData';
import { configureSpecFailFast } from '../utils/specFailFast';

let browser: Browser;
let context: BrowserContext;
let page: Page;

const proj = ProjectData.randomProject();

test.beforeAll(async () => {
  browser = await chromium.launch();
  context = await browser.newContext();
  page = await context.newPage();
  const login = new BasicLoginPage(page);
  await login.basicLoginAndPmVisit(Users.adminUsername, Users.adminPassword);
  const pp = new ProjectPage(page);
  await pp.createProject(proj.title, proj.description);
  await pp.openProject(proj.title);
});

test.afterAll(async () => {
  await context.close();
  await browser.close();
});

test.describe('AI Task Generation', () => {
  configureSpecFailFast();

  test('AI0001 : Stub AI endpoint and trigger generate', async () => {
    await page.route(`**${RestPaths.aiGenerate}`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            task_lists: [
              {
                title: 'AI-Generated List',
                tasks: [
                  { title: 'AI task one' },
                  { title: 'AI task two' },
                  { title: 'AI task three' },
                ],
              },
            ],
          },
        }),
      });
    });

    const aiBtn = page
      .locator('button:has-text("Generate with AI"), button:has-text("AI Generate"), button:has-text("AI")')
      .first();
    await aiBtn.click();

    await page
      .locator('textarea[placeholder*="describe" i], textarea')
      .first()
      .fill('Build a QA plan for weekly regression runs');

    const [response] = await Promise.all([
      page.waitForResponse((r) => r.url().includes('/projects/ai/generate')),
      page.locator('button:has-text("Generate")').last().click(),
    ]);
    expect(response.ok()).toBeTruthy();
  });

  test('AI0002 : Generated list appears in project', async () => {
    await expect(page.locator('text=AI-Generated List').first()).toBeVisible();
    await expect(page.locator('text=AI task one').first()).toBeVisible();
  });
});
