import { Browser, BrowserContext, Page, test, chromium } from '@playwright/test';
import { BasicLoginPage } from '../pages/basicLogin';
import { ProjectPage } from '../pages/project';
import { ProjectData, Users } from '../utils/testData';
import { configureSpecFailFast } from '../utils/specFailFast';

let browser: Browser;
let context: BrowserContext;
let page: Page;

const created = ProjectData.randomProject();
const temp = ProjectData.randomProject();

test.beforeAll(async () => {
  browser = await chromium.launch();
  context = await browser.newContext();
  page = await context.newPage();
  const login = new BasicLoginPage(page);
  await login.basicLoginAndPmVisit(Users.adminUsername, Users.adminPassword);
});

test.afterAll(async () => {
  await context.close();
  await browser.close();
});

test.describe('Projects CRUD', () => {
  configureSpecFailFast();

  test('PJ0001 : Admin creates new project', async () => {
    const proj = new ProjectPage(page);
    await proj.createProject(created.title, created.description);
    await proj.assertProjectVisible(created.title);
  });

  test('PJ0002 : Admin creates second project', async () => {
    const proj = new ProjectPage(page);
    await proj.createProject(temp.title, temp.description);
    await proj.assertProjectVisible(temp.title);
  });

  test('PJ0003 : Search filters project list', async () => {
    const proj = new ProjectPage(page);
    await proj.openProjectsList();
    await proj.searchProject(created.title);
    await proj.assertProjectVisible(created.title);
  });

  test('PJ0004 : Admin stars a project', async () => {
    const proj = new ProjectPage(page);
    await proj.openProjectsList();
    await proj.starProject(created.title);
  });

  test('PJ0005 : Admin marks project complete', async () => {
    const proj = new ProjectPage(page);
    await proj.openProjectsList();
    await proj.markComplete(created.title);
  });

  test('PJ0006 : Admin deletes temp project', async () => {
    const proj = new ProjectPage(page);
    await proj.openProjectsList();
    await proj.deleteProject(temp.title);
    await proj.openProjectsList();
    await proj.assertProjectNotVisible(temp.title);
  });
});
