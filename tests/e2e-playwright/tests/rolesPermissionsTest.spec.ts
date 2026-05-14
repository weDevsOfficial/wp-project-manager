import { Browser, BrowserContext, Page, test, chromium, expect } from '@playwright/test';
import { BasicLoginPage } from '../pages/basicLogin';
import { PmDashboardPage } from '../pages/pmDashboard';
import { Users } from '../utils/testData';
import { configureSpecFailFast } from '../utils/specFailFast';

let browser: Browser;
let context: BrowserContext;
let page: Page;

test.beforeAll(async () => {
  browser = await chromium.launch();
  context = await browser.newContext();
  page = await context.newPage();
  const login = new BasicLoginPage(page);
  await login.basicLoginAndPmVisit(Users.adminUsername, Users.adminPassword);
});

test.afterAll(async () => {
  await context.close();
  await browser.close();
});

test.describe('Free Permissions', () => {
  configureSpecFailFast();

  test('RP0001 : Admin can reach Settings page', async () => {
    const dash = new PmDashboardPage(page);
    await dash.openSettings();
    await dash.assertAppMounted();
  });

  test('RP0002 : Admin can reach Categories page', async () => {
    const dash = new PmDashboardPage(page);
    await dash.openCategories();
    await dash.assertAppMounted();
  });

  test('RP0003 : Free REST projects endpoint returns 200 for admin', async () => {
    const res = await page.request.get('/wp-json/pm/v2/projects?per_page=1');
    expect(res.status()).toBeLessThan(400);
  });
});
