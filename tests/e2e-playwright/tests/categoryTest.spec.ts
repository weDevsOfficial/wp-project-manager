import { Browser, BrowserContext, Page, test, chromium } from '@playwright/test';
import { BasicLoginPage } from '../pages/basicLogin';
import { CategoryPage } from '../pages/category';
import { CategoryData, Users } from '../utils/testData';
import { configureSpecFailFast } from '../utils/specFailFast';

let browser: Browser;
let context: BrowserContext;
let page: Page;

const cat = CategoryData.random();

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

test.describe('Categories CRUD', () => {
  configureSpecFailFast();

  test('CT0001 : Admin creates category', async () => {
    const c = new CategoryPage(page);
    await c.create(cat.name);
    await c.assertVisible(cat.name);
  });
});
