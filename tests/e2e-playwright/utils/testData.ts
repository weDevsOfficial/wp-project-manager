import { faker } from '@faker-js/faker';

export const Urls = {
  baseUrl: process.env.QA_BASE_URL ? process.env.QA_BASE_URL : 'http://localhost:8889',
};

export const Users = {
  adminUsername: process.env.QA_ADMIN_USERNAME ? process.env.QA_ADMIN_USERNAME : 'admin',
  adminPassword: process.env.QA_ADMIN_PASSWORD ? process.env.QA_ADMIN_PASSWORD : 'password',

  managerUsername: process.env.QA_MANAGER_USERNAME ? process.env.QA_MANAGER_USERNAME : 'pm_manager_user',
  managerEmail: process.env.QA_MANAGER_EMAIL ? process.env.QA_MANAGER_EMAIL : 'pm_manager@example.com',
  managerPassword: process.env.QA_MANAGER_PASSWORD ? process.env.QA_MANAGER_PASSWORD : 'password',

  memberUsername: process.env.QA_MEMBER_USERNAME ? process.env.QA_MEMBER_USERNAME : 'pm_member_user',
  memberEmail: process.env.QA_MEMBER_EMAIL ? process.env.QA_MEMBER_EMAIL : 'pm_member@example.com',
  memberPassword: process.env.QA_MEMBER_PASSWORD ? process.env.QA_MEMBER_PASSWORD : 'password',

  newUsername: process.env.QA_NEW_USERNAME ? process.env.QA_NEW_USERNAME : 'pm_new_user',
  newUserEmail: process.env.QA_NEW_USEREMAIL ? process.env.QA_NEW_USEREMAIL : 'pm_new_user@example.com',
  newUserFirstName: process.env.QA_NEW_FIRSTNAME ? process.env.QA_NEW_FIRSTNAME : 'NewUserFirstName',
  newUserLastName: process.env.QA_NEW_LASTNAME ? process.env.QA_NEW_LASTNAME : 'NewUserLastName',
  newUserPassword: process.env.QA_NEW_PASSWORD ? process.env.QA_NEW_PASSWORD : 'NewUserPassword@123',
};

export const AiConfig = {
  provider: process.env.PM_AI_PROVIDER ? process.env.PM_AI_PROVIDER : 'openai',
  apiKey: process.env.PM_AI_API_KEY ? process.env.PM_AI_API_KEY : 'sk-stub-key',
};

export const ProjectData = {
  baselineProject: {
    title: 'Baseline QA Project',
    description: 'Seeded by alphaSetupTest. Do not delete during a run.',
  },
  randomProject(): { title: string; description: string } {
    return {
      title: `QA Project ${faker.string.alphanumeric(6)}`,
      description: faker.lorem.sentence(),
    };
  },
};

export const TaskListData = {
  random(): { title: string; description: string } {
    return {
      title: `Task List ${faker.string.alphanumeric(5)}`,
      description: faker.lorem.sentence(),
    };
  },
};

export const TaskData = {
  random(): { title: string; description: string } {
    return {
      title: `Task ${faker.string.alphanumeric(5)}`,
      description: faker.lorem.sentences(2),
    };
  },
  futureDueDate(): string {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().slice(0, 10);
  },
};

export const MilestoneData = {
  random(): { title: string; description: string } {
    return {
      title: `Milestone ${faker.string.alphanumeric(5)}`,
      description: faker.lorem.sentence(),
    };
  },
};

export const DiscussionData = {
  random(): { title: string; body: string } {
    return {
      title: `Discussion ${faker.string.alphanumeric(5)}`,
      body: faker.lorem.paragraph(),
    };
  },
};

export const CategoryData = {
  random(): { name: string } {
    return { name: `Cat ${faker.string.alphanumeric(5)}` };
  },
};

export const RestPaths = {
  projects: '/wp-json/pm/v2/projects',
  tasksGlobal: '/wp-json/pm/v2/tasks',
  usersSearch: '/wp-json/pm/v2/users/search',
  settings: '/wp-json/pm/v2/settings',
  settingsAi: '/wp-json/pm/v2/settings/ai',
  aiGenerate: '/wp-json/pm/v2/projects/ai/generate',
};

export const AdminPaths = {
  pm: '/wp-admin/admin.php?page=pm_projects',
  pmMyTasks: '/wp-admin/admin.php?page=pm_projects#/my-tasks',
  pmPremium: '/wp-admin/admin.php?page=pm_projects#/premium',
  pmCalendar: '/wp-admin/admin.php?page=pm_projects#/calendar',
  pmReports: '/wp-admin/admin.php?page=pm_projects#/reports',
  pmProgress: '/wp-admin/admin.php?page=pm_projects#/progress',
  pmModules: '/wp-admin/admin.php?page=pm_projects#/modules',
  pmCategories: '/wp-admin/admin.php?page=pm_projects#/categories',
  pmSettings: '/wp-admin/admin.php?page=pm_projects#/settings',
  pmTools: '/wp-admin/admin.php?page=pm_projects#/importtools',
};
