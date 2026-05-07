import { type Page, expect } from '@playwright/test';
import { Base } from './base';
import { Selectors } from './selectors';

export class MyTasksPage extends Base {
  constructor(page: Page) {
    super(page);
  }

  async open() {
    await this.navigateToURL(this.pmMyTasks);
    await this.waitForPmSpa();
  }

  async assertTaskRowVisible(title: string) {
    await expect(this.page.locator(`text=${title}`).first()).toBeVisible();
  }

  async assertEmpty() {
    const rows = this.page.locator(Selectors.myTasks.taskRow);
    await expect(rows).toHaveCount(0);
  }
}
