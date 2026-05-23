# WP Project Manager

![License](https://img.shields.io/badge/license-GPL--2.0%2B-blue)
![PHP](https://img.shields.io/badge/PHP-%3E%3D7.2-777bb4)
![WordPress](https://img.shields.io/badge/WordPress-plugin-21759b)

WP Project Manager is a WordPress plugin for project, task, and team collaboration workflows. This repository contains the plugin source code, build tooling, API schema, and test setup used for local development.

## Table of Contents
- [Requirements](#requirements)
- [Local Setup](#local-setup)
- [Development Scripts](#development-scripts)
- [Project Structure](#project-structure)
- [Contributing Notes](#contributing-notes)

## Requirements
Before starting, make sure you have:
- PHP 7.2 or newer
- Composer
- Node.js and npm
- a local WordPress installation

## Local Setup
```bash
git clone https://github.com/weDevsOfficial/wp-project-manager.git <plugin-name>
cd <plugin-name>
composer install
composer dumpautoload -o
npm install
npm run dev
```

Then activate the plugin inside your local WordPress site.

## Development Scripts
- `npm run dev`: start the development build with `wp-scripts`
- `npm run build`: create a production build
- `npm run lint`: lint the TypeScript frontend files under `views/assets/src`
- `npm run makepot`: generate the translation template
- `npm run release`: run the release task via Grunt

## Project Structure
```text
.
├── core/                # core plugin logic
├── src/                 # namespaced application code
├── routes/              # REST and app routes
├── views/               # admin/app UI and frontend assets
├── db/                  # database-related classes and migrations
├── bootstrap/           # bootstrapping helpers
├── tests/               # automated tests
├── composer.json        # PHP dependencies and autoload rules
├── package.json         # frontend scripts and tooling
└── api-schema.json      # API reference schema
```

## Contributing Notes
- use the `develop` branch for ongoing work
- run both Composer and npm installs after cloning
- keep generated assets, localization files, and API changes in sync with the code they support
- check existing docs such as `CLAUDE.md`, `readme.txt`, and the test configuration when changing developer workflows
