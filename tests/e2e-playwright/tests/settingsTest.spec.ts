import { Browser, BrowserContext, Page, test, chromium } from '@playwright/test';
import { BasicLoginPage } from '../pages/basicLogin';
import { SettingsPage } from '../pages/settings';
import { AiConfig, Users } from '../utils/testData';
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

test.describe('Settings', () => {
  configureSpecFailFast();

  test('ST0001 : Open Settings page', async () => {
    const s = new SettingsPage(page);
    await s.open();
  });

  test('ST0002 : Save general settings', async () => {
    const s = new SettingsPage(page);
    await s.open();
    await s.saveGeneral();
  });

  test('ST0003 : Save AI provider config', async () => {
    const s = new SettingsPage(page);
    await s.openAiTab();
    await s.saveAiConfig(AiConfig.provider, AiConfig.apiKey);
  });
});
