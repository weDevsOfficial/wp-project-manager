import { type Page, expect } from '@playwright/test';
import { Base } from './base';

export class RolePage extends Base {
  constructor(page: Page) {
    super(page);
  }

  async assertRestForbidden(restPath: string) {
    const response = await this.page.request.get(restPath);
    expect([401, 403, 404]).toContain(response.status());
  }

  async assertProTeaserLoaded(locator: string) {
    await expect(this.page.locator(locator).first()).toBeVisible();
  }
}
