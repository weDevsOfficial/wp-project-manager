import { type Page, expect } from '@playwright/test';
import { Base } from './base';
import { Selectors } from './selectors';

export class PmDashboardPage extends Base {
  constructor(page: Page) {
    super(page);
  }

  async open() {
    await this.navigateToURL(this.pmHome);
    await this.waitForPmSpa();
  }

  async assertMenuVisible() {
    await this.assertionValidate(Selectors.wpAdmin.adminMenuPM);
  }

  async assertAppMounted() {
    await expect(this.page.locator(Selectors.pmRoot)).toBeVisible();
  }

  async openPremiumTeaser() {
    await this.navigateToURL(this.pmPremium);
    await this.waitForPmSpa();
  }

  async openCalendarTeaser() {
    await this.navigateToURL(this.pmCalendar);
    await this.waitForPmSpa();
  }

  async openReportsTeaser() {
    await this.navigateToURL(this.pmReports);
    await this.waitForPmSpa();
  }

  async openSettings() {
    await this.navigateToURL(this.pmSettings);
    await this.waitForPmSpa();
  }

  async openCategories() {
    await this.navigateToURL(this.pmCategories);
    await this.waitForPmSpa();
  }

  async openMyTasks() {
    await this.navigateToURL(this.pmMyTasks);
    await this.waitForPmSpa();
  }

  async openTools() {
    await this.navigateToURL(this.pmTools);
    await this.waitForPmSpa();
  }
}
