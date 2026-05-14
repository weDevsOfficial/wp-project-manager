import * as dotenv from 'dotenv';
dotenv.config({ quiet: true });
import { expect, type Page } from '@playwright/test';
import { Urls, AdminPaths } from '../utils/testData';
import { faker } from '@faker-js/faker';

export class Base {
  readonly page: Page;
  readonly wpAdminPage: string = Urls.baseUrl + '/wp-admin/';
  readonly pluginsPage: string = Urls.baseUrl + '/wp-admin/plugins.php';
  readonly usersPage: string = Urls.baseUrl + '/wp-admin/users.php';
  readonly addUserPage: string = Urls.baseUrl + '/wp-admin/user-new.php';
  readonly profilePage: string = Urls.baseUrl + '/wp-admin/profile.php';
  readonly permalinkPage: string = Urls.baseUrl + '/wp-admin/options-permalink.php';
  readonly wpMailLogPage: string = Urls.baseUrl + '/wp-admin/admin.php?page=wp-mail-log';
  readonly wpResetPage: string = Urls.baseUrl + '/wp-admin/tools.php?page=wp-reset';

  // PM routes
  readonly pmHome: string = Urls.baseUrl + AdminPaths.pm;
  readonly pmMyTasks: string = Urls.baseUrl + AdminPaths.pmMyTasks;
  readonly pmPremium: string = Urls.baseUrl + AdminPaths.pmPremium;
  readonly pmCalendar: string = Urls.baseUrl + AdminPaths.pmCalendar;
  readonly pmReports: string = Urls.baseUrl + AdminPaths.pmReports;
  readonly pmProgress: string = Urls.baseUrl + AdminPaths.pmProgress;
  readonly pmModules: string = Urls.baseUrl + AdminPaths.pmModules;
  readonly pmCategories: string = Urls.baseUrl + AdminPaths.pmCategories;
  readonly pmSettings: string = Urls.baseUrl + AdminPaths.pmSettings;
  readonly pmTools: string = Urls.baseUrl + AdminPaths.pmTools;

  constructor(page: Page) {
    this.page = page;
  }

  async navigateToURL(url: string) {
    try {
      await this.waitForLoading();
      await this.page.goto(url);
      await this.waitForLoading();
      console.log('\x1b[34m%s\x1b[0m', `✅ Navigated to ${url}`);
      return true;
    } catch (error) {
      console.log('\x1b[31m%s\x1b[0m', `❌ Failed to navigate to ${url}: ${error}`);
      throw error;
    }
  }

  async assertionValidate(locator: string) {
    try {
      await this.waitForLoading();
      const element = this.page.locator(locator);
      await element.first().waitFor();
      console.log('\x1b[34m%s\x1b[0m', `✅ Asserted ${locator}`);
      await this.waitForLoading();
      return expect(this.page.locator(locator).first().isVisible()).toBeTruthy();
    } catch (error) {
      console.log('\x1b[31m%s\x1b[0m', `❌ Failed to assert ${locator}: ${error}`);
      throw error;
    }
  }

  async validateAndClick(locator: string) {
    try {
      await this.waitForLoading();
      const element = this.page.locator(locator).first();
      await element.waitFor();
      await element.click();
      await this.waitForLoading();
      console.log('\x1b[35m%s\x1b[0m', `✅ Clicked ${locator}`);
    } catch (error) {
      console.log('\x1b[31m%s\x1b[0m', `❌ Failed to click ${locator}: ${error}`);
      throw error;
    }
  }

  async validateAndClickAny(locator: string) {
    try {
      const elements = this.page.locator(locator);
      const count = await elements.count();
      for (let i = 0; i < count; i++) {
        const element = elements.nth(i);
        if (await element.isVisible()) {
          await element.click();
          console.log('\x1b[35m%s\x1b[0m', `✅ Clicked visible: ${locator}`);
          return;
        }
      }
      throw new Error(`No visible elements for locator: ${locator}`);
    } catch (error) {
      console.log('\x1b[31m%s\x1b[0m', `❌ Failed clickAny ${locator}: ${error}`);
      throw error;
    }
  }

  async validateAny(locator: string) {
    const elements = this.page.locator(locator);
    const count = await elements.count();
    for (let i = 0; i < count; i++) {
      if (await elements.nth(i).isVisible()) {
        console.log('\x1b[34m%s\x1b[0m', `✅ Found visible: ${locator}`);
        return;
      }
    }
    throw new Error(`No visible elements for locator: ${locator}`);
  }

  async validateAndFillStrings(locator: string, value: string) {
    try {
      await this.waitForLoading();
      const element = this.page.locator(locator).first();
      await element.waitFor();
      await element.fill(value);
      await this.waitForLoading();
      console.log('\x1b[35m%s\x1b[0m', `✅ Filled ${locator} with ${value}`);
    } catch (error) {
      console.log('\x1b[31m%s\x1b[0m', `❌ Failed to fill ${locator}: ${error}`);
      throw error;
    }
  }

  async validateAndCheckBox(locator: string) {
    const element = this.page.locator(locator).first();
    await element.waitFor();
    await element.check();
  }

  async selectOptionWithLabel(locator: string, label: string) {
    const element = this.page.locator(locator).first();
    await element.waitFor();
    await this.page.selectOption(locator, { label });
  }

  async selectOptionWithValue(locator: string, value: string) {
    const element = this.page.locator(locator).first();
    await element.waitFor();
    await this.page.selectOption(locator, { value });
  }

  async checkElementText(locator: string, expectedText: string) {
    try {
      await this.waitForLoading();
      const element = this.page.locator(locator).first();
      await element.waitFor();
      await expect(element).toContainText(expectedText);
      return true;
    } catch (error) {
      console.log('\x1b[31m%s\x1b[0m', `❌ Text check failed ${locator}: ${error}`);
      return false;
    }
  }

  async waitForLoading() {
    await this.page.waitForLoadState('domcontentloaded');
  }

  // Read PM_Vars.is_pro global exposed by the plugin SPA bootstrap
  async isProActive(): Promise<boolean> {
    try {
      await this.page.waitForSelector('#wedevs-project-manager', { timeout: 15000 });
      const result = await this.page.evaluate(() => {
        const pm = (window as unknown as { PM_Vars?: { is_pro?: unknown } }).PM_Vars;
        return Boolean(pm?.is_pro);
      });
      return result;
    } catch {
      return false;
    }
  }

  // Wait for PM SPA to hydrate and first /pm/v2/projects response to settle
  async waitForPmSpa() {
    try {
      await this.page.waitForSelector('#wedevs-project-manager', { timeout: 30000 });
      await this.page
        .waitForResponse(
          (r) => r.url().includes('/wp-json/pm/v2/projects') && r.status() < 500,
          { timeout: 20000 },
        )
        .catch(() => {
          /* first load may not trigger if cached */
        });
      await this.waitForLoading();
    } catch (error) {
      console.log('\x1b[31m%s\x1b[0m', `❌ PM SPA failed to hydrate: ${error}`);
      throw error;
    }
  }

  generateWordWithMinLength(minLength = 5): string {
    let word = faker.word.words(1);
    while (word.length < minLength) {
      word = faker.word.words(1);
    }
    return word;
  }
}
