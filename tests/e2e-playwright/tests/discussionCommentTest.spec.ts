import { Browser, BrowserContext, Page, test, chromium } from '@playwright/test';
import { BasicLoginPage } from '../pages/basicLogin';
import { ProjectPage } from '../pages/project';
import { DiscussionPage } from '../pages/discussion';
import { ProjectData, DiscussionData, Users } from '../utils/testData';
import { configureSpecFailFast } from '../utils/specFailFast';

let browser: Browser;
let context: BrowserContext;
let page: Page;

const proj = ProjectData.randomProject();
const disc = DiscussionData.random();

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

test.describe('Discussions & Comments', () => {
  configureSpecFailFast();

  test('DC0001 : Open Discussions tab', async () => {
    await page.locator('a:has-text("Discussions"), button:has-text("Discussions")').first().click();
  });

  test('DC0002 : Create discussion', async () => {
    const d = new DiscussionPage(page);
    await d.create(disc.title, disc.body);
    await d.assertVisible(disc.title);
  });

  test('DC0003 : Post comment on discussion', async () => {
    const d = new DiscussionPage(page);
    await d.comment('First reply from admin');
  });

  test('DC0004 : Mention admin in comment', async () => {
    const d = new DiscussionPage(page);
    await d.mention(Users.adminUsername);
    await d.comment(' — mention test');
  });
});
