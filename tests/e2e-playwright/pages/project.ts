import { type Page, expect } from '@playwright/test';
import { Base } from './base';
import { Selectors } from './selectors';

export class ProjectPage extends Base {
  constructor(page: Page) {
    super(page);
  }

  // PM opens on the Dashboard since 4.1.0, so go to the project list itself.
  async openProjectsList() {
    await this.navigateToURL(`${this.pmHome}#/projects`);
    await this.waitForPmSpa();
  }

  async createProject(title: string, description = '') {
    await this.openProjectsList();
    await this.validateAndClick(Selectors.pmProjectList.newProjectButton);
    await this.validateAndFillStrings(Selectors.project.titleInput, title);
    if (description) {
      const desc = this.page.locator(Selectors.project.descriptionInput).first();
      if (await desc.count()) await desc.fill(description);
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

  // Returns the numeric project id from the current URL (after openProject).
  currentProjectId(): string {
    const match = this.page.url().match(/projects\/(\d+)/);
    if (!match) throw new Error(`Could not extract project id from URL: ${this.page.url()}`);
    return match[1];
  }

  // Switch directly to a project by id via the hash router (no list re-click).
  async switchToProjectById(id: string) {
    await this.navigateToURL(`${this.pmHome}#/projects/${id}/task-lists`);
    await this.page.waitForSelector(Selectors.pmRoot, { timeout: 60000 });
    await this.waitForLoading();
    await this.page.waitForTimeout(1200);
  }

  async searchProject(text: string) {
    await this.validateAndFillStrings(Selectors.project.searchInput, text);
    await this.page.waitForTimeout(500);
  }

  // Open the per-card action dropdown (star/complete/delete live on the list card).
  async openProjectMenu(title: string) {
    const card = this.page.locator(Selectors.project.cardRoot(title)).first();
    await card.waitFor();
    await card.hover();
    await card.locator('button:has(svg.lucide-ellipsis)').first().click();
    await this.page.waitForTimeout(300);
  }

  async edit(oldTitle: string, newTitle: string) {
    await this.openProjectMenu(oldTitle);
    await this.page.locator(Selectors.project.menuItem('Edit')).first().click();
    const input = this.page.locator(Selectors.project.titleInput).first();
    await input.waitFor();
    await input.fill(newTitle);
    const [response] = await Promise.all([
      this.page.waitForResponse(
        (r) => /\/projects\/\d+\/update/.test(r.url()) && r.request().method() === 'POST',
      ),
      this.page.locator('[role="dialog"] button:has-text("Update Project")').first().click(),
    ]);
    expect(response.ok()).toBeTruthy();
    await this.waitForLoading();
  }

  async starProject(title: string) {
    const card = this.page.locator(Selectors.project.cardRoot(title)).first();
    await card.waitFor();
    await card.hover();
    const [response] = await Promise.all([
      this.page.waitForResponse(
        (r) => r.url().includes('/favourite') && r.request().method() === 'POST',
      ),
      this.page.locator(Selectors.project.starButton(title)).first().click(),
    ]);
    expect(response.ok()).toBeTruthy();
  }

  async markComplete(title: string) {
    await this.openProjectMenu(title);
    const [response] = await Promise.all([
      this.page.waitForResponse(
        (r) => r.url().includes('/update') && r.request().method() === 'POST',
      ),
      this.page.locator(Selectors.project.menuItem('Complete')).first().click(),
    ]);
    expect(response.ok()).toBeTruthy();
    await this.waitForLoading();
  }

  async deleteProject(title: string) {
    await this.openProjectMenu(title);
    await this.page.locator(Selectors.project.menuItem('Delete')).first().click();
    await this.page.waitForTimeout(400);
    const [response] = await Promise.all([
      this.page.waitForResponse(
        (r) => r.url().includes('/delete') && r.request().method() === 'POST',
      ),
      this.page.locator(Selectors.project.confirmDelete).last().click(),
    ]);
    expect(response.ok()).toBeTruthy();
    await this.waitForLoading();
  }
}
