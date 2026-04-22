import { Browser, BrowserContext, Page, test, chromium } from '@playwright/test';
import * as path from 'path';
import { BasicLoginPage } from '../pages/basicLogin';
import { ProjectPage } from '../pages/project';
import { TaskListPage } from '../pages/taskList';
import { TaskPage } from '../pages/task';
import { FilePage } from '../pages/file';
import { ProjectData, TaskListData, TaskData, Users } from '../utils/testData';
import { configureSpecFailFast } from '../utils/specFailFast';

let browser: Browser;
let context: BrowserContext;
let page: Page;

const proj = ProjectData.randomProject();
const list = TaskListData.random();
const task = TaskData.random();
const sampleFile = path.resolve(process.cwd(), 'uploadeditems/sample.jpg');

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
});

test.afterAll(async () => {
  await context.close();
  await browser.close();
});

test.describe('File Uploads', () => {
  configureSpecFailFast();

  test('FU0001 : Upload image to task', async () => {
    const f = new FilePage(page);
    await f.upload(sampleFile);
    await f.assertFileVisible('sample.jpg');
  });

  test('FU0002 : Delete uploaded file', async () => {
    const f = new FilePage(page);
    await f.deleteFile('sample.jpg');
  });
});
