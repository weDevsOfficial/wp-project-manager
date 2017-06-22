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
                    //"assets/css/admin.css": "assets/css/admin.less", // destination file and source file
                    "assets/css/admin.css": "assets/css/new-admin.less", // destination file and source file
                    "includes/pro/assets/css/pro-style.css": "includes/pro/assets/css/pro-style.less", // for my Task stylesheet
                    "includes/pro/frontend/css/frontend.css": "includes/pro/frontend/css/frontend.less", // frontend css
                }
            }
        },
         browserify: {
            dist: {
                options: {
                    transform: [['partialify']]
                },
                files: {
                    "./includes/pro/assets/js/build.js": ["./includes/pro/assets/js/files.js"], // For Files and Folder Tab
                    "./assets/js/cpm_common_js.js": ["./assets/js/cpm_common_js_raw.js"], // For Commons JS
                    //"./assets/js/task-vue.js": ["./assets/js/task-raw-vue.js"] // For Taks List and Task
                }
            }
        },
        watch: {
            styles: {
                files: ['assets/css/*.less', 'assets/html/task/*.html', 'includes/pro/assets/css/*.less', 'includes/pro/assets/html/**/*.html', 'includes/pro/assets/js/*.js', 'assets/js/*.js', 'includes/pro/frontend/css/*.less'], // which files to watch
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
                '<%= dirs.js %>/upload.js',
            ]
        },

        //Compress build directory into <name>.zip and <name>-<version>.zip
        compress: {
            main: {
                options: {
                    mode: 'zip',
                    archive: './build/wedevs-project-manager-pro-v' + pkg.version + '.zip'
                },
                expand: true,
                cwd: 'build/',
                src: ['**/*'],
                dest: 'wedevs-project-manager-pro'
            }
        },

        replace: {
            example: {
                src: ['build/cpm.php'],
                dest: 'build/cpm.php',
                replacements: [
                    {
                        from: 'WP Project Manager',
                        to: 'WP Project Manager PRO'
                    },
                    {
                        from: 'https://wordpress.org/plugins/wedevs-project-manager/',
                        to: 'https://wedevs.com/products/plugins/wp-project-manager-pro/'
                    }
                ]
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
        },

        secret: grunt.file.readJSON('secret.json'),
        sshconfig: {
            "myhost": {
                host: '<%= secret.host %>',
                username: '<%= secret.username %>',
                password : "vagrant",
                agent: process.env.SSH_AUTH_SOCK,
                agentForward: true
            }
        },
        sftp: {
            upload: {
                files: {
                    "./": 'build/wedevs-project-manager-pro-v' + pkg.version + '.zip'
                },
                options: {
                    path: '<%= secret.path %>',
                    config: 'myhost',
                    showProgress: true,
                    srcBasePath: "build/"
                }
            }
        },
        sshexec: {
            updateVersion: {
                command: '<%= secret.updateFiles %> ' + pkg.version + ' --allow-root',
                options: {
                    config: 'myhost'
                }
            },

            uptime: {
                command: 'uptime',
                options: {
                    config: 'myhost'
                }
            },

            updateLounge: {
                command: '<%= secret.updateLounge %>',
                options: {
                    config: 'myhost'
                }
            }
        }
    });

    grunt.loadNpmTasks( 'grunt-contrib-less' );
    grunt.loadNpmTasks( 'grunt-contrib-concat' );
    grunt.loadNpmTasks( 'grunt-contrib-jshint' );
    grunt.loadNpmTasks( 'grunt-wp-i18n' );
    // grunt.loadNpmTasks( 'grunt-contrib-uglify' );
    grunt.loadNpmTasks( 'grunt-contrib-watch' );
    grunt.loadNpmTasks( 'grunt-contrib-clean' );
    grunt.loadNpmTasks( 'grunt-contrib-copy' );
    grunt.loadNpmTasks( 'grunt-contrib-compress' );
    grunt.loadNpmTasks( 'grunt-text-replace' );
    grunt.loadNpmTasks( 'grunt-ssh' );
    grunt.loadNpmTasks( 'grunt-browserify' );
    grunt.registerTask('default', ['less', 'watch']);


    grunt.registerTask( 'build', [ 'browserify' ] );

    grunt.registerTask('release', [
        'makepot',
        'less',
        'concat',
        // 'clean',
        // 'copy',
        // 'compress'
        // 'uglify'
    ]);

    grunt.registerTask( 'zip', [
        'clean',
        'copy',
        'replace',
        'compress'
    ])

    grunt.registerTask( 'deploy', [
        'sftp:upload', 'sshexec:updateVersion'
    ]);
};