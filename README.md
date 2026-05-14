# WP Project Manager

[![WordPress Plugin](https://img.shields.io/badge/Type-WordPress%20Plugin-blue)](https://github.com/weDevsOfficial/wp-project-manager)
[![PHP](https://img.shields.io/badge/PHP-7.2%2B-777bb4)](./composer.json)
[![Node](https://img.shields.io/badge/Node-22%2B-339933)](./package.json)
[![License](https://img.shields.io/github/license/weDevsOfficial/wp-project-manager)](./LICENSE)

A project management plugin for WordPress.

This repository contains the source code for WP Project Manager, including the PHP plugin core, REST/API-oriented backend modules, and the modern front-end application used to power project views, tasks, discussions, calendars, files, and related workflows.

## Table of Contents

- [What is inside](#what-is-inside)
- [Key modules](#key-modules)
- [Requirements](#requirements)
- [Local installation](#local-installation)
- [Development workflow](#development-workflow)
- [Repository structure](#repository-structure)
- [Release notes and packaging](#release-notes-and-packaging)
- [Contributing](#contributing)

## What is inside

WP Project Manager combines several layers in one repository:

- WordPress plugin bootstrap and PHP business logic
- React-based admin and product UI assets
- API schema and integration points for tasks, calendar, files, users, discussions, and reporting
- Build and release tooling for packaging the plugin

## Key modules

A quick glance at the repository shows several major functional areas under `src/`, including:

- `Project/` and `Task/` for project and task flows
- `Calendar/`, `Milestone/`, and `My_Task/` for planning views
- `Discussion_Board/`, `Comment/`, and `File/` for collaboration
- `GitHub/`, `Notion/`, and `Pusher/` for integrations
- `Settings/`, `Role/`, and `User/` for workspace administration

## Requirements

- PHP 7.2+
- Composer
- Node.js 22+
- pnpm 9+ or npm
- A working WordPress local environment for plugin testing

## Local installation

Clone the repository into your WordPress plugins directory:

```bash
git clone https://github.com/weDevsOfficial/wp-project-manager.git <plugin-name>
cd <plugin-name>
composer install
composer dumpautoload -o
npm install
npm run start
```

Then activate the plugin from your WordPress admin panel.

## Development workflow

Common commands:

```bash
# start front-end development build
npm run start

# production assets
npm run build

# lint JS / TS assets
npm run lint

# generate translation template
npm run makepot
```

For PHP dependency setup or refresh:

```bash
composer install
composer update
```

## Repository structure

```text
.
├── bootstrap/
├── composer-scripts/
├── config/
├── core/
├── db/
├── languages/
├── src/
│   ├── Calendar/
│   ├── Discussion_Board/
│   ├── File/
│   ├── GitHub/
│   ├── Milestone/
│   ├── Project/
│   ├── Settings/
│   ├── Task/
│   └── User/
├── views/
├── composer.json
└── package.json
```

## Release notes and packaging

The repository includes build, release, and packaging helpers such as `Gruntfile.js`, `changelog.txt`, `.wordpress-org/`, and Composer scripts that patch deprecations after install/update.

## Contributing

If you want to contribute:

1. Fork the repository
2. Create a focused branch
3. Make your change
4. Verify the plugin builds and runs in a local WordPress setup
5. Open a pull request with notes about the affected area

Documentation improvements, installation clarifications, and module-level onboarding notes are especially valuable in a repository of this size.
