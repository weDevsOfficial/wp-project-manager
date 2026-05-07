import { type Page, expect } from '@playwright/test';
import { Base } from './base';
import { Selectors } from './selectors';

export class DiscussionPage extends Base {
  constructor(page: Page) {
    super(page);
  }

  async create(title: string, body: string) {
    await this.validateAndClick(Selectors.discussion.newButton);
    await this.validateAndFillStrings(Selectors.discussion.titleInput, title);
    const editor = this.page.locator(Selectors.discussion.bodyEditor).first();
    await editor.click();
    await editor.fill(body);
    const [response] = await Promise.all([
      this.page.waitForResponse(
        (r) => r.url().includes('/discussion-boards') && r.request().method() === 'POST',
      ),
      this.validateAndClick(Selectors.discussion.submitButton),
    ]);
    expect(response.ok()).toBeTruthy();
  }

  async assertVisible(title: string) {
    await expect(this.page.locator(Selectors.discussion.byTitle(title)).first()).toBeVisible();
  }

  async comment(body: string) {
    const editor = this.page.locator(Selectors.discussion.commentInput).first();
    await editor.click();
    await editor.fill(body);
    await this.validateAndClick(Selectors.discussion.commentSubmit);
    await this.waitForLoading();
  }

  async mention(username: string) {
    const editor = this.page.locator(Selectors.discussion.commentInput).first();
    await editor.click();
    await this.page.keyboard.type('@');
    await this.page.keyboard.type(username);
    await this.page.waitForTimeout(500);
    await this.page.keyboard.press('Enter');
  }
}
