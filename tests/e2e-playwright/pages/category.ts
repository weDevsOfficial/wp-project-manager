import { type Page, expect } from '@playwright/test';
import { Base } from './base';
import { Selectors } from './selectors';

export class CategoryPage extends Base {
  constructor(page: Page) {
    super(page);
  }

  async create(name: string) {
    await this.openCategoriesPage();
    await this.validateAndFillStrings(Selectors.category.newInput, name);
    const [response] = await Promise.all([
      this.page.waitForResponse(
        (r) => r.url().includes('/categories') && r.request().method() === 'POST',
      ),
      this.validateAndClick(Selectors.category.submit),
    ]);
    expect(response.ok()).toBeTruthy();
  }

  async openCategoriesPage() {
    await this.navigateToURL(this.pmCategories);
    await this.waitForPmSpa();
  }

  async assertVisible(name: string) {
    await expect(this.page.locator(Selectors.category.byName(name)).first()).toBeVisible();
  }
}
