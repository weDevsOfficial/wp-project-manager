'use strict';
module.exports = function(grunt) {
    var pkg = grunt.file.readJSON('package.json');
    var stringReplace = {
        download_link: {
            src: ['config/app.php'],             // source files array (supports minimatch)
            dest: 'config/app.php',             // destination directory or file
            replacements: [
                {
                    from: '{github-download-version}',                   // string replacement
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
                    '!bin/**',
                    '!.git/**',
                    '!Gruntfile.js',
                    '!package.json',
                    '!package-lock.json',
                    '!phpcs.ruleset.xml',
                    '!phpunit.xml.dist',
                    '!webpack.config.js',
                    '!tmp/**',
                    '!views/assets/src/**',
                    '!debug.log',
                    '!phpunit.xml',
                    '!export.sh',
                    '!.gitignore',
                    '!.gitmodules',
                    '!npm-debug.log',
                    '!plugin-deploy.sh',
                    '!readme.md',
                    '!composer.json',
                    '!composer.lock',
                    '!composer.phar',
                    '!secret.json',
                    '!assets/less/**',
                    '!tests/**',
                    '!**/Gruntfile.js',
                    '!**/package.json',
                    '!**/README.md',
                    '!**/customs.json',
                    '!nbproject',
                    '!phpcs-report.txt',
                    '!phpcs.xml.dist',
                    '!phpcs.xml.dist',
                    '!pm.sublime-project',
                    '!pm.sublime-workspace',
                    '!views/assets/css/Single Task Page.json',
                    '!views/assets/vendor/wp-hooks/wp-hooks.js',
                    '!**/*~'
                ],
                dest: 'build/'
            }
        },

        //Compress build directory into <name>.zip and <name>-<version>.zip
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

            reset:{
                cmd: 'npm',
                args: ['run', 'build']
            },

            makepot:{
                cmd: 'npm',
                args: ['run', 'makepot']
            },

            dumpautoload:{
                cmd: 'composer',
                args: ['dumpautoload', '-o']
            },

        }
    });


    // Load NPM tasks to be used here
    grunt.loadNpmTasks( 'grunt-contrib-less' );
    grunt.loadNpmTasks( 'grunt-contrib-concat' );
    grunt.loadNpmTasks( 'grunt-contrib-jshint' );
    grunt.loadNpmTasks( 'grunt-wp-i18n' );
    grunt.loadNpmTasks( 'grunt-text-replace' );
    //grunt.loadNpmTasks( 'grunt-contrib-uglify' );
    grunt.loadNpmTasks( 'grunt-contrib-watch' );
    grunt.loadNpmTasks( 'grunt-contrib-clean' );
    grunt.loadNpmTasks( 'grunt-contrib-copy' );
    grunt.loadNpmTasks( 'grunt-contrib-compress' );
    grunt.loadNpmTasks( 'grunt-run' );


    grunt.registerTask( 'release', [
        'run',
    ]);

    grunt.registerTask( 'release', [
        'clean',
        'run',
        'replace',
        'copy',
        'compress'
    ]);
};
