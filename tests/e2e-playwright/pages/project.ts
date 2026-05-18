import { type Page, expect } from '@playwright/test';
import { Base } from './base';
import { Selectors } from './selectors';

export class ProjectPage extends Base {
  constructor(page: Page) {
    super(page);
  }

  async openProjectsList() {
    await this.navigateToURL(this.pmHome);
    await this.waitForPmSpa();
  }

  async createProject(title: string, description = '') {
    await this.openProjectsList();
    await this.validateAndClick(Selectors.pmDashboard.newProjectButton);
    await this.validateAndFillStrings(Selectors.project.titleInput, title);
    if (description) {
      await this.validateAndFillStrings(Selectors.project.descriptionInput, description);
    }
    const [response] = await Promise.all([
      this.page.waitForResponse(
        (r) => r.url().includes('/pm/v2/projects') && r.request().method() === 'POST',
      ),
      this.validateAndClick(Selectors.project.createSubmit),
    ]);
    expect(response.ok()).toBeTruthy();
    await this.waitForLoading();
  }

  async assertProjectVisible(title: string) {
    await expect(this.page.locator(Selectors.project.cardByTitle(title)).first()).toBeVisible();
  }

  async assertProjectNotVisible(title: string) {
    await expect(this.page.locator(Selectors.project.cardByTitle(title)).first()).toHaveCount(0);
  }

  async openProject(title: string) {
    await this.validateAndClick(Selectors.project.cardByTitle(title));
    await this.waitForLoading();
  }

  async searchProject(text: string) {
    await this.validateAndFillStrings(Selectors.project.searchInput, text);
    await this.page.waitForTimeout(500);
  }

  async starProject(title: string) {
    await this.openProject(title);
    await this.validateAndClick(Selectors.project.starButton);
  }

  async markComplete(title: string) {
    await this.openProject(title);
    await this.validateAndClick(Selectors.project.completeToggle);
  }

  async deleteProject(title: string) {
    await this.openProject(title);
    await this.validateAndClick(Selectors.project.deleteButton);
    await this.validateAndClick(Selectors.project.confirmDelete);
    await this.waitForLoading();
  }
}
