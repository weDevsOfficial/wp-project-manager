import { type Page } from '@playwright/test';
import { Base } from './base';
import { Urls } from '../utils/testData';

export class BasicLogoutPage extends Base {
  constructor(page: Page) {
    super(page);
  }

  async logout() {
    await this.navigateToURL(Urls.baseUrl + '/wp-login.php?action=logout');
    const confirmLink = this.page.locator('a:has-text("log out")');
    if (await confirmLink.isVisible().catch(() => false)) {
      await confirmLink.click();
      await this.waitForLoading();
    }
  }
}
