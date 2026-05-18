import { Browser, BrowserContext, Page, test, chromium } from '@playwright/test';
import { BasicLoginPage } from '../pages/basicLogin';
import { ProjectPage } from '../pages/project';
import { TaskListPage } from '../pages/taskList';
import { TaskPage } from '../pages/task';
import { ProjectData, TaskListData, TaskData, Users } from '../utils/testData';
import { configureSpecFailFast } from '../utils/specFailFast';

let browser: Browser;
let context: BrowserContext;
let page: Page;

const proj = ProjectData.randomProject();
const list = TaskListData.random();
const taskA = TaskData.random();
const taskB = TaskData.random();

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
});

test.afterAll(async () => {
  await context.close();
  await browser.close();
});

test.describe('Tasks CRUD & Actions', () => {
  configureSpecFailFast();

  test('TK0001 : Quick add first task', async () => {
    const tk = new TaskPage(page);
    await tk.quickAdd(taskA.title);
    await tk.assertTaskVisible(taskA.title);
  });

  test('TK0002 : Quick add second task', async () => {
    const tk = new TaskPage(page);
    await tk.quickAdd(taskB.title);
    await tk.assertTaskVisible(taskB.title);
  });

  test('TK0003 : Set due date on task', async () => {
    const tk = new TaskPage(page);
    await tk.openTask(taskA.title);
    await tk.setDueDate(TaskData.futureDueDate());
  });

  test('TK0004 : Assign admin to task', async () => {
    const tk = new TaskPage(page);
    await tk.assignUser(Users.adminUsername);
  });

  test('TK0005 : Edit task description (Tiptap)', async () => {
    const tk = new TaskPage(page);
    await tk.editDescription(taskA.description);
  });

  test('TK0006 : Duplicate task', async () => {
    const tk = new TaskPage(page);
    await tk.duplicate();
  });

  test('TK0007 : Toggle complete', async () => {
    const tk = new TaskPage(page);
    await tk.toggleComplete();
  });

  test('TK0008 : Delete second task', async () => {
    const tk = new TaskPage(page);
    await tk.openTask(taskB.title);
    await tk.deleteTask();
  });
});
