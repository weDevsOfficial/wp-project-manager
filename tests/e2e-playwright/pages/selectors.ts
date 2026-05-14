export const Selectors = {
  login: {
    basicLogin: {
      loginEmailField: '#user_login',
      loginPasswordField: '#user_pass',
      rememberMeField: '#rememberme',
      loginButton: '#wp-submit',
    },
    validateBasicLogin: {
      dashboardLoaded: '#wpadminbar',
    },
  },

  wpAdmin: {
    adminMenuPM: '#toplevel_page_pm_projects',
    adminMenuPMLabel: '#toplevel_page_pm_projects .wp-menu-name',
  },

  pmRoot: '#wedevs-project-manager',

  pmDashboard: {
    appReady: '#wedevs-project-manager',
    projectsPageTitle: 'text=Projects',
    newProjectButton: 'button:has-text("New Project"), [data-test="new-project"]',
    myTasksLink: 'a:has-text("My Tasks")',
  },

  project: {
    modalRoot: '[role="dialog"], .pm-modal',
    titleInput: 'input[name="title"], input[placeholder*="Project" i]',
    descriptionInput: 'textarea[name="description"], textarea[placeholder*="Description" i]',
    createSubmit: 'button:has-text("Create Project"), button:has-text("Save")',
    cardByTitle: (title: string) => `text=${title}`,
    starButton: '[data-test="favorite-project"], button[aria-label*="favorite" i]',
    deleteButton: 'button:has-text("Delete")',
    confirmDelete: 'button:has-text("Yes"), button:has-text("Confirm")',
    editButton: 'button:has-text("Edit")',
    archiveButton: 'button:has-text("Archive")',
    completeToggle: 'button:has-text("Mark Complete"), button:has-text("Mark as Complete")',
    searchInput: 'input[placeholder*="Search" i]',
  },

  taskList: {
    newButton: 'button:has-text("New Task List"), button:has-text("Add Task List")',
    titleInput: 'input[placeholder*="List Title" i], input[name="list_title"]',
    descriptionInput: 'textarea[placeholder*="Description" i]',
    saveButton: 'button:has-text("Save List"), button:has-text("Save")',
    byTitle: (title: string) => `text=${title}`,
    deleteMenu: 'button[aria-label*="more" i], button[aria-label*="options" i]',
    deleteAction: 'button:has-text("Delete List"), a:has-text("Delete List")',
  },

  task: {
    quickAddInput: 'input[placeholder*="Task" i]',
    quickAddSubmit: 'button:has-text("Add Task")',
    byTitle: (title: string) => `text=${title}`,
    checkbox: 'input[type="checkbox"]',
    detailModal: '[role="dialog"]',
    assigneeInput: 'input[placeholder*="Assign" i]',
    dueDateInput: 'input[type="date"], input[placeholder*="Due" i]',
    prioritySelect: 'select[name="priority"], button:has-text("Priority")',
    duplicateButton: 'button:has-text("Duplicate")',
    deleteButton: 'button:has-text("Delete Task")',
    descriptionEditor: '.ProseMirror, [contenteditable="true"]',
    saveButton: 'button:has-text("Save")',
    attachFileInput: 'input[type="file"]',
  },

  milestone: {
    newButton: 'button:has-text("New Milestone"), button:has-text("Add Milestone")',
    titleInput: 'input[placeholder*="Milestone" i], input[name="milestone_title"]',
    descriptionInput: 'textarea[placeholder*="Description" i]',
    saveButton: 'button:has-text("Save Milestone"), button:has-text("Save")',
    byTitle: (title: string) => `text=${title}`,
    completeToggle: 'button:has-text("Mark Complete")',
  },

  discussion: {
    newButton: 'button:has-text("New Discussion"), button:has-text("New Message")',
    titleInput: 'input[placeholder*="Title" i], input[name="discussion_title"]',
    bodyEditor: '.ProseMirror, [contenteditable="true"]',
    submitButton: 'button:has-text("Post"), button:has-text("Submit")',
    byTitle: (title: string) => `text=${title}`,
    commentInput: 'textarea[placeholder*="Comment" i], [contenteditable="true"]',
    commentSubmit: 'button:has-text("Comment"), button:has-text("Reply")',
    mentionTrigger: '@',
  },

  category: {
    newInput: 'input[placeholder*="Category" i], input[name="category"]',
    submit: 'button:has-text("Add"), button:has-text("Save")',
    byName: (name: string) => `text=${name}`,
  },

  settings: {
    emailTab: 'a:has-text("Email"), button:has-text("Email")',
    taskTypesTab: 'a:has-text("Task Types"), button:has-text("Task Types")',
    aiTab: 'a:has-text("AI"), button:has-text("AI Settings")',
    saveButton: 'button:has-text("Save Changes"), button:has-text("Save")',
    aiProviderSelect: 'select[name="ai_provider"]',
    aiApiKeyInput: 'input[name="ai_api_key"], input[placeholder*="API Key" i]',
  },

  myTasks: {
    badge: '.update-plugins, span.count',
    taskRow: '[data-test="my-task-row"], .pm-task-row',
  },

  proTeaser: {
    upgradeBanner: 'text=/Upgrade to Pro|Go Premium|Pro Version|Unlock Premium/i',
    upgradeModal: '[role="dialog"]:has-text("Pro"), .pm-upgrade-modal, [class*="premium" i][role="dialog"]',
    premiumMenuLink: 'a[href*="#/premium"]',
  },
};
