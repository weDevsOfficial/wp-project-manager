import * as dotenv from 'dotenv';
dotenv.config({ quiet: true });
import { test, type Page } from '@playwright/test';
import { Selectors } from './selectors';
import { Base } from './base';

export class BasicLoginPage extends Base {
  constructor(page: Page) {
    super(page);
  }

  async basicLogin(username: string, password: string) {
    await this.navigateToURL(this.wpAdminPage);
    const emailVisible = await this.page.isVisible(Selectors.login.basicLogin.loginEmailField);
    if (emailVisible) {
      await this.backendLogin(username, password);
    } else {
      await this.validateBasicLogin();
    }
  }

  async basicLoginAndPmVisit(username: string, password: string) {
    await test.step('Login and visit PM', async () => {
      await this.basicLogin(username, password);
      await this.navigateToURL(this.pmHome);
      await this.waitForPmSpa();
    });
  }

  async validateBasicLogin() {
    await this.assertionValidate(Selectors.login.validateBasicLogin.dashboardLoaded);
  }

  async backendLogin(username: string, password: string) {
    await this.validateAndFillStrings(Selectors.login.basicLogin.loginEmailField, username);
    await this.page.waitForTimeout(300);
    await this.validateAndFillStrings(Selectors.login.basicLogin.loginPasswordField, password);
    await this.page.waitForTimeout(300);
    await this.validateAndClick(Selectors.login.basicLogin.loginButton);
    await this.waitForLoading();
  }
}
