'use strict';

module.exports = function(grunt) {
    var pkg = grunt.file.readJSON('package.json');

    var stringReplace = {
        download_link: {
            src: ['config/app.php'],
            dest: 'config/app.php',
            replacements: [
                {
                    from: '{github-download-version}',
                    to:'v' + pkg.version
                },
            ]
        }
    };

    grunt.initConfig({
        // Clean up build directory
        clean: {
            main: ['build/']
        },

        // Copy the plugin into the build directory
        copy: {
            main: {
                src: [
                    '**',
                    '!node_modules/**',
                    '!build/**',
                    '!tests/**',
                    '!bin/**',
                    '!.git/**',
                    '!Gruntfile.js',
                    '!package.json',
                    '!package-lock.json',
                    '!pnpm-lock.yaml',
                    '!.npmrc',
                    '!phpcs.ruleset.xml',
                    '!phpunit.xml.dist',
                    '!webpack.config.js',
                    '!tailwind.config.js',
                    '!postcss.config.js',
                    '!jsconfig.json',
                    '!components.json',
                    '!tmp/**',
                    '!views/assets/src/**',
                    '!src/Pusher/webpack.config.js',
                    '!src/Pusher/views/assets/src/**',
                    '!debug.log',
                    '!phpunit.xml',
                    '!export.sh',
                    '!.gitignore',
                    '!.gitmodules',
                    '!.env',
                    '!npm-debug.log',
                    '!plugin-deploy.sh',
                    '!readme.md',
                    '!composer.phar',
                    '!secret.json',
                    '!codeception.yml',
                    '!assets/less/**',
                    '!**/Gruntfile.js',
                    '!**/package.json',
                    '!**/README.md',
                    '!**/customs.json',
                    '!nbproject',
                    '!phpcs-report.txt',
                    '!phpcs.xml.dist',
                    '!pm.sublime-project',
                    '!pm.sublime-workspace',
                    '!postman_collection.json',
                    '!views/assets/css/Single Task Page.json',
                    '!views/assets/vendor/wp-hooks/wp-hooks.js',
                    '!**/*~',
                    '!*.bak',
                    '!/vendor/doctrine/deprecations/src/PHPUnit'
                ],
                dest: 'build/'
            }
        },

        // Compress build directory into zip
        compress: {
            main: {
                options: {
                    mode: 'zip',
                    archive: './build/wedevs-project-manager-v' + pkg.version + '.zip'
                },
                expand: true,
                cwd: 'build/',
                src: ['**/*'],
                dest: 'wedevs-project-manager'
            }
        },

        addtextdomain: {
            options: {
                textdomain: 'wedevs-project-manager',
            },
            update_all_domains: {
                options: {
                    updateDomains: true
                },
                src: [ '*.php', '**/*.php', '!node_modules/**', '!php-tests/**', '!bin/**', '!build/**', '!vendor/**', '!assets/**', '!views/src/**' ]
            }
        },

        replace: stringReplace,

        run: {
            options: {},

            build: {
                cmd: 'pnpm',
                args: ['run', 'build']
            },

            removeDev: {
                cmd: 'composer',
                args: ['install', '--no-dev']
            },

            dumpautoload: {
                cmd: 'composer',
                args: ['dumpautoload', '-o']
            },

            composerInstall: {
                cmd: 'composer',
                args: ['install']
            },

            makepot: {
                cmd: 'wp',
                args: ['i18n', 'make-pot', '.', 'languages/wedevs-project-manager.pot', '--exclude=node_modules,build,views/assets/src']
            },
        }
    });

    // Load NPM tasks
    grunt.loadNpmTasks( 'grunt-wp-i18n' );
    grunt.loadNpmTasks( 'grunt-text-replace' );
    grunt.loadNpmTasks( 'grunt-contrib-clean' );
    grunt.loadNpmTasks( 'grunt-contrib-copy' );
    grunt.loadNpmTasks( 'grunt-contrib-compress' );
    grunt.loadNpmTasks( 'grunt-run' );

    grunt.registerTask( 'release', [
        'clean',
        'run:build',
        'run:makepot',
        'run:removeDev',
        'run:dumpautoload',
        'replace',
        'copy',
        'compress',
        'run:composerInstall',
        'run:dumpautoload',
    ]);
};
