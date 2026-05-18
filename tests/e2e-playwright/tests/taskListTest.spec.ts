import { Browser, BrowserContext, Page, test, chromium } from '@playwright/test';
import { BasicLoginPage } from '../pages/basicLogin';
import { ProjectPage } from '../pages/project';
import { TaskListPage } from '../pages/taskList';
import { ProjectData, TaskListData, Users } from '../utils/testData';
import { configureSpecFailFast } from '../utils/specFailFast';

let browser: Browser;
let context: BrowserContext;
let page: Page;

const proj = ProjectData.randomProject();
const listA = TaskListData.random();
const listB = TaskListData.random();

test.beforeAll(async () => {
  browser = await chromium.launch();
  context = await browser.newContext();
  page = await context.newPage();
  const login = new BasicLoginPage(page);
  await login.basicLoginAndPmVisit(Users.adminUsername, Users.adminPassword);
  const pp = new ProjectPage(page);
  await pp.createProject(proj.title, proj.description);
  await pp.openProject(proj.title);
});

test.afterAll(async () => {
  await context.close();
  await browser.close();
});

test.describe('Task Lists CRUD', () => {
  configureSpecFailFast();

  test('TL0001 : Create task list', async () => {
    const tl = new TaskListPage(page);
    await tl.createList(listA.title, listA.description);
    await tl.assertListVisible(listA.title);
  });

  test('TL0002 : Create second task list', async () => {
    const tl = new TaskListPage(page);
    await tl.createList(listB.title, listB.description);
    await tl.assertListVisible(listB.title);
  });

  test('TL0003 : Delete task list', async () => {
    const tl = new TaskListPage(page);
    await tl.deleteList(listB.title);
  });
});
