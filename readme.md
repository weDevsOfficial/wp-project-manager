# Local Installation Guide

Navigate to the plugin directory and run the following commands

1. `git clone https://github.com/weDevsOfficial/wp-project-manager.git <plugin-name>`
2. `cd <plugin-dir-name>`
3. `wp scaffold plugin-tests <plugin-name>` (wp-cli needs to be installed first)
4. `bash bin/install-wp-tests.sh wordpress_test <db-user-name> <db-password> <db-host> latest`
5. `vendor/bin/phpunit`.
6. If there is a warning like `Warning: require_once(/tmp/wordpress-tests-lib/includes/functions.php): failed to open stream:`,
   run `rm -rf /tmp/wordpress-tests-lib` and follow the steps `4 to 5`.
7. If there is a warning like `Warning: require_once(/tmp/wordpress//wp-includes/class-phpmailer.php): failed to open stream: No such file or directory in /tmp/wordpress-tests-lib/includes/mock-mailer.php`,
   run `rm -rf /tmp/wordpress` and follow the steps `4 to 5`.