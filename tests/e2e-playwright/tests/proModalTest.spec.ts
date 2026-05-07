import { Browser, BrowserContext, Page, test, chromium, expect } from '@playwright/test';
import { BasicLoginPage } from '../pages/basicLogin';
import { PmDashboardPage } from '../pages/pmDashboard';
import { Users } from '../utils/testData';
import { Selectors } from '../pages/selectors';
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

test.describe('Pro Upsell (only when Pro plugin inactive)', () => {
  configureSpecFailFast();

  test('PU0001 : Premium menu link visible in free mode', async () => {
    const dash = new PmDashboardPage(page);
    await dash.open();
    const isPro = await dash.isProActive();
    test.skip(isPro, 'Pro plugin active — premium upsell link is hidden');
    await expect(page.locator(Selectors.proTeaser.premiumMenuLink).first()).toBeVisible();
  });

  test('PU0002 : Premium route shows upgrade view', async () => {
    const dash = new PmDashboardPage(page);
    const isPro = await dash.isProActive();
    test.skip(isPro, 'Pro plugin active — upgrade view is hidden');
    await dash.openPremiumTeaser();
    await expect(page.locator(Selectors.proTeaser.upgradeBanner).first()).toBeVisible();
  });

  test('PU0003 : Upgrade modal opens from CTA', async () => {
    const dash = new PmDashboardPage(page);
    const isPro = await dash.isProActive();
    test.skip(isPro, 'Pro plugin active — upgrade CTA modal not present');
    await dash.open();
    const cta = page
      .locator('button:has-text("Upgrade"), a:has-text("Upgrade"), button:has-text("Go Pro")')
      .first();
    await cta.click();
    await expect(page.locator(Selectors.proTeaser.upgradeModal).first()).toBeVisible();
  });
});
