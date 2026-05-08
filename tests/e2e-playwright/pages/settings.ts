import { type Page, expect } from '@playwright/test';
import { Base } from './base';
import { Selectors } from './selectors';

export class SettingsPage extends Base {
  constructor(page: Page) {
    super(page);
  }

  async open() {
    await this.navigateToURL(this.pmSettings);
    await this.waitForPmSpa();
  }

  async openAiTab() {
    await this.open();
    await this.validateAndClick(Selectors.settings.aiTab);
  }

  async saveAiConfig(provider: string, apiKey: string) {
    await this.selectOptionWithValue(Selectors.settings.aiProviderSelect, provider);
    await this.validateAndFillStrings(Selectors.settings.aiApiKeyInput, apiKey);
    const [response] = await Promise.all([
      this.page.waitForResponse(
        (r) => r.url().includes('/settings/ai') && r.request().method() === 'POST',
      ),
      this.validateAndClick(Selectors.settings.saveButton),
    ]);
    expect(response.ok()).toBeTruthy();
  }

  async saveGeneral() {
    const [response] = await Promise.all([
      this.page.waitForResponse(
        (r) =>
          r.url().includes('/pm/v2/settings') &&
          !r.url().includes('/ai') &&
          r.request().method() === 'POST',
      ),
      this.validateAndClick(Selectors.settings.saveButton),
    ]);
    expect(response.ok()).toBeTruthy();
  }
}
