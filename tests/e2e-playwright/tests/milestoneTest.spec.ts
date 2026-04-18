import { Browser, BrowserContext, Page, test, chromium } from '@playwright/test';
import { BasicLoginPage } from '../pages/basicLogin';
import { ProjectPage } from '../pages/project';
import { MilestonePage } from '../pages/milestone';
import { ProjectData, MilestoneData, Users } from '../utils/testData';
import { configureSpecFailFast } from '../utils/specFailFast';

let browser: Browser;
let context: BrowserContext;
let page: Page;

const proj = ProjectData.randomProject();
const ms = MilestoneData.random();

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

test.describe('Milestones CRUD', () => {
  configureSpecFailFast();

  test('MS0001 : Create milestone', async () => {
    const m = new MilestonePage(page);
    await page.locator('a:has-text("Milestones"), button:has-text("Milestones")').first().click();
    await m.create(ms.title, ms.description);
    await m.assertVisible(ms.title);
  });

  test('MS0002 : Toggle milestone complete', async () => {
    const m = new MilestonePage(page);
    await m.toggleComplete(ms.title);
  });
});
