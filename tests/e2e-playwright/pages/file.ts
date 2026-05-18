import { type Page, expect } from '@playwright/test';
import { Base } from './base';

export class FilePage extends Base {
  constructor(page: Page) {
    super(page);
  }

  async upload(localPath: string) {
    const input = this.page.locator('input[type="file"]').first();
    await input.setInputFiles(localPath);
    const response = await this.page.waitForResponse(
      (r) => r.url().includes('/files') && r.request().method() === 'POST',
      { timeout: 30000 },
    );
    expect(response.ok()).toBeTruthy();
  }

  async assertFileVisible(name: string) {
    await expect(this.page.locator(`text=${name}`).first()).toBeVisible();
  }

  async deleteFile(name: string) {
    const row = this.page.locator(`text=${name}`).first();
    await row.hover();
    await this.validateAndClick('button:has-text("Delete"), a[aria-label*="delete" i]');
    await this.waitForLoading();
  }
}
