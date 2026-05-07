import { type Page, expect } from '@playwright/test';
import { Base } from './base';
import { Selectors } from './selectors';

export class TaskPage extends Base {
  constructor(page: Page) {
    super(page);
  }

  async quickAdd(title: string) {
    await this.validateAndFillStrings(Selectors.task.quickAddInput, title);
    const [response] = await Promise.all([
      this.page.waitForResponse(
        (r) => r.url().includes('/tasks') && r.request().method() === 'POST',
      ),
      this.validateAndClick(Selectors.task.quickAddSubmit),
    ]);
    expect(response.ok()).toBeTruthy();
  }

  async openTask(title: string) {
    await this.validateAndClick(Selectors.task.byTitle(title));
    await this.waitForLoading();
  }

  async assignUser(username: string) {
    await this.validateAndFillStrings(Selectors.task.assigneeInput, username);
    await this.page.waitForTimeout(500);
    await this.validateAndClick(`text=${username}`);
  }

  async setDueDate(isoDate: string) {
    await this.validateAndFillStrings(Selectors.task.dueDateInput, isoDate);
    await this.page.keyboard.press('Tab');
  }

  async toggleComplete() {
    await this.validateAndClick(Selectors.task.checkbox);
  }

  async editDescription(text: string) {
    const editor = this.page.locator(Selectors.task.descriptionEditor).first();
    await editor.click();
    await editor.fill(text);
    await this.validateAndClick(Selectors.task.saveButton);
  }

  async duplicate() {
    const [response] = await Promise.all([
      this.page.waitForResponse(
        (r) => r.url().includes('/duplicate') && r.request().method() === 'POST',
      ),
      this.validateAndClick(Selectors.task.duplicateButton),
    ]);
    expect(response.ok()).toBeTruthy();
  }

  async deleteTask() {
    await this.validateAndClick(Selectors.task.deleteButton);
    await this.waitForLoading();
  }

  async assertTaskVisible(title: string) {
    await expect(this.page.locator(Selectors.task.byTitle(title)).first()).toBeVisible();
  }

  async attachFile(localPath: string) {
    const input = this.page.locator(Selectors.task.attachFileInput).first();
    await input.setInputFiles(localPath);
    await this.waitForLoading();
  }
}
