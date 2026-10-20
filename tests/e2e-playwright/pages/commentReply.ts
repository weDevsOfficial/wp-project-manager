import { type Page, type Locator, type Response, expect } from '@playwright/test';
import { Base } from './base';

// Comment replies (one level), shared by the task sheet and the discussion page.
// A "thread" is the column holding a top-level comment's text and its
// `pm-comment-replies` block; the parent's own actions come before the replies
// in the DOM, so `.first()` on a button inside the thread is the parent's.
export class CommentReplyPage extends Base {
  constructor(page: Page) {
    super(page);
  }

  thread(parentText: string): Locator {
    return this.page
      .locator('div', { has: this.page.getByText(parentText, { exact: false }) })
      .filter({ has: this.page.locator('[data-testid="pm-comment-replies"]') })
      .last();
  }

  replies(parentText: string): Locator {
    return this.thread(parentText).locator('[data-testid="pm-comment-reply"]');
  }

  reply(parentText: string, replyText: string): Locator {
    return this.replies(parentText).filter({ hasText: replyText }).first();
  }

  composer(parentText: string): Locator {
    return this.thread(parentText).locator('[data-testid="pm-reply-composer"] .ProseMirror').first();
  }

  // Opens the composer from the parent's Reply link, or from a reply's.
  async openComposer(parentText: string, fromReplyText?: string) {
    const scope = fromReplyText ? this.reply(parentText, fromReplyText) : this.thread(parentText);
    await scope.locator('[data-testid="pm-reply-link"]').first().click();
    await this.composer(parentText).waitFor();
  }

  // Types after the pre-filled mention (the composer opens with the caret at the end).
  async send(parentText: string, text: string): Promise<Response> {
    await this.page.keyboard.type(text);
    const [response] = await Promise.all([
      this.page.waitForResponse(
        (r) => /\/comments$/.test(new URL(r.url()).pathname) && r.request().method() === 'POST',
      ),
      this.thread(parentText).locator('[data-testid="pm-reply-send"]').click(),
    ]);
    expect(response.ok()).toBeTruthy();
    await this.waitForLoading();
    return response;
  }

  // Pin a row by position: matching by text breaks once the editor clears it.
  private async pinnedReply(parentText: string, replyText: string): Promise<Locator> {
    const texts = await this.replies(parentText).allInnerTexts();
    const index = texts.findIndex((t) => t.includes(replyText));
    expect(index, `reply "${replyText}" in thread`).toBeGreaterThanOrEqual(0);
    return this.replies(parentText).nth(index);
  }

  async editReply(parentText: string, replyText: string, newText: string) {
    const row = await this.pinnedReply(parentText, replyText);
    await row.hover();
    await row.locator('button[title="Edit"]').first().click();
    const editor = row.locator('.ProseMirror').first();
    await editor.waitFor();
    await editor.click();
    await this.page.keyboard.press('ControlOrMeta+a');
    await this.page.keyboard.press('Backspace');
    await this.page.keyboard.type(newText);
    const [response] = await Promise.all([
      this.page.waitForResponse(
        (r) => r.url().includes('/comments/') && !r.url().includes('/delete') && r.request().method() === 'POST',
      ),
      row.locator('button:has-text("Save")').first().click(),
    ]);
    expect(response.ok()).toBeTruthy();
    await this.waitForLoading();
  }

  async deleteReply(parentText: string, replyText: string) {
    const row = this.reply(parentText, replyText);
    await row.hover();
    const [response] = await Promise.all([
      this.page.waitForResponse((r) => r.url().includes('/comments/') && r.url().includes('/delete')),
      row.locator('button[title="Delete"]').first().click(),
    ]);
    expect(response.ok()).toBeTruthy();
    await this.waitForLoading();
  }

  // Clicks the PARENT's delete; the in-app confirm opens because it has replies.
  async clickDeleteParent(parentText: string) {
    const thread = this.thread(parentText);
    await thread.hover();
    await thread.locator('button[title="Delete"], button[aria-label="Delete"]').first().click();
    await this.page.getByRole('alertdialog').waitFor();
  }

  async confirmDialogText(): Promise<string> {
    return this.page.getByRole('alertdialog').innerText();
  }

  async cancelDialog() {
    await this.page.getByRole('alertdialog').getByRole('button', { name: 'Cancel' }).click();
    await expect(this.page.getByRole('alertdialog')).toHaveCount(0);
  }

  async confirmDialog() {
    const [response] = await Promise.all([
      this.page.waitForResponse((r) => r.url().includes('/comments/') && r.url().includes('/delete')),
      this.page.getByRole('alertdialog').getByRole('button', { name: 'Confirm' }).click(),
    ]);
    expect(response.ok()).toBeTruthy();
    await this.waitForLoading();
  }
}
