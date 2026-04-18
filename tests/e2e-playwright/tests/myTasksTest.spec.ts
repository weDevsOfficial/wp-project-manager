import { Browser, BrowserContext, Page, test, chromium } from '@playwright/test';
import { BasicLoginPage } from '../pages/basicLogin';
import { ProjectPage } from '../pages/project';
import { TaskListPage } from '../pages/taskList';
import { TaskPage } from '../pages/task';
import { MyTasksPage } from '../pages/myTasks';
import { ProjectData, TaskListData, TaskData, Users } from '../utils/testData';
import { configureSpecFailFast } from '../utils/specFailFast';

let browser: Browser;
let context: BrowserContext;
let page: Page;

const proj = ProjectData.randomProject();
const list = TaskListData.random();
const task = TaskData.random();

test.beforeAll(async () => {
  browser = await chromium.launch();
  context = await browser.newContext();
  page = await context.newPage();
  const login = new BasicLoginPage(page);
  await login.basicLoginAndPmVisit(Users.adminUsername, Users.adminPassword);
  const pp = new ProjectPage(page);
  await pp.createProject(proj.title, proj.description);
  await pp.openProject(proj.title);
  const tl = new TaskListPage(page);
  await tl.createList(list.title, list.description);
  const tk = new TaskPage(page);
  await tk.quickAdd(task.title);
  await tk.openTask(task.title);
  await tk.assignUser(Users.adminUsername);
});

test.afterAll(async () => {
  await context.close();
  await browser.close();
});

test.describe('My Tasks Dashboard', () => {
  configureSpecFailFast();

  test('MT0001 : Open My Tasks view', async () => {
    const my = new MyTasksPage(page);
    await my.open();
  });

  test('MT0002 : Assigned task shows in My Tasks', async () => {
    const my = new MyTasksPage(page);
    await my.assertTaskRowVisible(task.title);
  });
});
