module.exports = function(grunt) {
    var pkg = grunt.file.readJSON('package.json');

    grunt.initConfig({
        // setting folder templates
        dirs: {
            css: 'assets/css',
            images: 'assets/images',
            js: 'assets/js'
        },

        less: {
            development: {
                options: {
                    compress: false,
                    yuicompress: false,
                    optimization: 2
                },
                files: {
                    '<%= dirs.css %>/admin.css': '<%= dirs.css %>/new-admin.less' // destination file and source file
                }
            }
        },
        browserify: {
            dist: {
                options: {
                    transform: [['partialify']]
                },
                files: {
                    '<%= dirs.js %>/cpm_common_js.js': ['<%= dirs.js %>/cpm_common_js_raw.js'] // For Commons JS
                }
            }
        },
        watch: {
            styles: {
                files: ['<%= dirs.css %>/*.less', '<%= dirs.js %>/*.js' ], // which files to watch
                tasks: ['less'],
                options: {
                    nospawn: true
                }
            }
        },

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
                    '!debug.log',
                    '!phpunit.xml',
                    '!export.sh',
                    '!.gitignore',
                    '!.gitmodules',
                    '!npm-debug.log',
                    '!plugin-deploy.sh',
                    '!readme.md',
                    '!composer.json',
                    '!secret.json',
                    '!assets/less/**',
                    '!tests/**',
                    '!**/Gruntfile.js',
                    '!**/package.json',
                    '!**/README.md',
                    '!**/customs.json',
                    '!nbproject',
                    '!**/*~'
                ],
                dest: 'build/'
            }
        },

        concat: {
            '<%= dirs.js %>/cpm-all.js': [
                '<%= dirs.js %>/admin.js',
                '<%= dirs.js %>/mytask.js',
                '<%= dirs.js %>/task.js',
                '<%= dirs.js %>/upload.js'
            ]
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

        // Generate POT files.
        makepot: {
            target: {
                options: {
                    exclude: ['build/.*'],
                    domainPath: '/languages/', // Where to save the POT file.
                    potFilename: 'cpm.pot', // Name of the POT file.
                    type: 'wp-plugin', // Type of project (wp-plugin or wp-theme).
                    potHeaders: {
                        'report-msgid-bugs-to': 'http://wedevs.com/support/forum/plugin-support/wp-project-manager/',
                        'language-team': 'LANGUAGE <EMAIL@ADDRESS>'
                    }
                }
            }
        }

    });

    grunt.loadNpmTasks( 'grunt-contrib-less' );
    grunt.loadNpmTasks( 'grunt-contrib-concat' );
    grunt.loadNpmTasks( 'grunt-contrib-jshint' );
    grunt.loadNpmTasks( 'grunt-wp-i18n' );
    grunt.loadNpmTasks( 'grunt-contrib-watch' );
    grunt.loadNpmTasks( 'grunt-contrib-clean' );
    grunt.loadNpmTasks( 'grunt-contrib-copy' );
    grunt.loadNpmTasks( 'grunt-contrib-compress' );
    grunt.loadNpmTasks( 'grunt-ssh' );
    grunt.loadNpmTasks( 'grunt-browserify' );

    grunt.registerTask('default', ['less', 'watch'] );


    grunt.registerTask( 'build', [ 'browserify' ] );

    grunt.registerTask('release', [
        'makepot',
        'less',
        'concat'
    ]);

    grunt.registerTask( 'zip', [
        'clean',
        'copy',
        'compress'
    ])

    grunt.registerTask( 'deploy', [
        'sftp:upload', 'sshexec:updateVersion'
    ]);
};