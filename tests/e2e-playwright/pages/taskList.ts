import { type Page, expect } from '@playwright/test';
import { Base } from './base';
import { Selectors } from './selectors';

export class TaskListPage extends Base {
  constructor(page: Page) {
    super(page);
  }

  async createList(title: string, description = '') {
    await this.validateAndClick(Selectors.taskList.newButton);
    await this.validateAndFillStrings(Selectors.taskList.titleInput, title);
    if (description) {
      await this.validateAndFillStrings(Selectors.taskList.descriptionInput, description);
    }
    const [response] = await Promise.all([
      this.page.waitForResponse(
        (r) => r.url().includes('/task-lists') && r.request().method() === 'POST',
      ),
      this.validateAndClick(Selectors.taskList.saveButton),
    ]);
    expect(response.ok()).toBeTruthy();
  }

  async assertListVisible(title: string) {
    await expect(this.page.locator(Selectors.taskList.byTitle(title)).first()).toBeVisible();
  }

  async deleteList(title: string) {
    const listRow = this.page.locator(Selectors.taskList.byTitle(title)).first();
    await listRow.hover();
    await this.validateAndClick(Selectors.taskList.deleteMenu);
    await this.validateAndClick(Selectors.taskList.deleteAction);
    await this.waitForLoading();
  }
}
