import { type Page, expect } from '@playwright/test';
import { Base } from './base';
import { Selectors } from './selectors';

export class MilestonePage extends Base {
  constructor(page: Page) {
    super(page);
  }

  async create(title: string, description = '') {
    await this.validateAndClick(Selectors.milestone.newButton);
    await this.validateAndFillStrings(Selectors.milestone.titleInput, title);
    if (description) {
      await this.validateAndFillStrings(Selectors.milestone.descriptionInput, description);
    }
    const [response] = await Promise.all([
      this.page.waitForResponse(
        (r) => r.url().includes('/milestones') && r.request().method() === 'POST',
      ),
      this.validateAndClick(Selectors.milestone.saveButton),
    ]);
    expect(response.ok()).toBeTruthy();
  }

  async assertVisible(title: string) {
    await expect(this.page.locator(Selectors.milestone.byTitle(title)).first()).toBeVisible();
  }

  async toggleComplete(title: string) {
    await this.validateAndClick(Selectors.milestone.byTitle(title));
    await this.validateAndClick(Selectors.milestone.completeToggle);
  }
}
