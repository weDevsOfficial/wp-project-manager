# PHPCS Ruleset Documentation

This directory contains modular PHPCS (PHP_CodeSniffer) rulesets based on the WordPress Plugin Check plugin standards.

## Directory Structure

```
phpcs-xml/
├── plugin-check-security.xml       # Security-focused rules
├── plugin-check-performance.xml    # Performance optimization rules
├── plugin-check-general.xml        # General WordPress coding standards
├── plugin-check-accessibility.xml  # Accessibility compliance rules
└── plugin-check-plugin-repo.xml    # WordPress.org plugin repository requirements
```

## Ruleset Categories

### 1. Security (`plugin-check-security.xml`)
Comprehensive security checks including:
- **Database Security**: SQL injection prevention, prepared statements
- **Input Validation**: Nonce verification, sanitization
- **Output Escaping**: XSS prevention
- **Dangerous Functions**: eval, passthru, create_function, etc.
- **PHP Security**: Short tags, alternative tags prevention
- **WordPress Security**: Deprecated functions, safe redirects

### 2. Performance (`plugin-check-performance.xml`)
Performance optimization checks:
- Alternative WordPress functions for better performance
- Slow database query detection
- Transient and cron usage optimization

### 3. General (`plugin-check-general.xml`)
WordPress coding best practices:
- WordPress coding standards compliance
- Proper resource enqueuing
- Global variable handling
- Internationalization (i18n)
- PHP best practices

### 4. Accessibility (`plugin-check-accessibility.xml`)
Accessibility compliance checks:
- Image alt attributes
- Form label associations
- Heading structure
- HTML semantic structure

### 5. Plugin Repository (`plugin-check-plugin-repo.xml`)
WordPress.org plugin repository requirements:
- Includes all security rules
- PHP compatibility (5.6+)
- Third-party library exclusions
- GPL compatibility (manual check)

## Usage

### Run All Checks
```bash
vendor/bin/phpcs --standard=phpcs.xml.dist
```

### Run Specific Category
```bash
# Security only
vendor/bin/phpcs --standard=phpcs-xml/plugin-check-security.xml .

# Performance only
vendor/bin/phpcs --standard=phpcs-xml/plugin-check-performance.xml .

# General only
vendor/bin/phpcs --standard=phpcs-xml/plugin-check-general.xml .
```

### Run Multiple Categories
```bash
vendor/bin/phpcs --standard=phpcs-xml/plugin-check-security.xml,phpcs-xml/plugin-check-performance.xml .
```

### Auto-fix Issues (where possible)
```bash
vendor/bin/phpcbf --standard=phpcs.xml.dist
```

## Customization

To enable/disable specific rulesets, edit the main `phpcs.xml.dist` file:

```xml
<!-- Enable security rules -->
<rule ref="./phpcs-xml/plugin-check-security.xml"/>

<!-- Disable performance rules (comment out) -->
<!-- <rule ref="./phpcs-xml/plugin-check-performance.xml"/> -->
```

## Severity Levels

- **Error (severity 7)**: Must be fixed (security critical issues)
- **Error (default)**: Should be fixed (important issues)
- **Warning**: Should be reviewed (potential issues)

## Excluded Patterns

The following directories are excluded from all checks:
- `assets/` - Frontend assets
- `src/` - Source files (if using build process)
- `lib/` - Third-party libraries
- `build/` - Build artifacts
- `node_modules/` - NPM dependencies
- `vendor/` - Composer dependencies
- `tests/` - Test files
- `bin/` - Binary files

## Integration with Plugin Check

These rulesets are based on the official WordPress Plugin Check plugin:
https://wordpress.org/plugins/plugin-check/

They follow the same categories and standards used for WordPress.org plugin reviews.

## References

- [WordPress Coding Standards](https://developer.wordpress.org/coding-standards/wordpress-coding-standards/)
- [Plugin Check Plugin](https://wordpress.org/plugins/plugin-check/)
- [PHP_CodeSniffer](https://github.com/squizlabs/PHP_CodeSniffer)
- [WordPress Database API](https://developer.wordpress.org/apis/database/)
- [WordPress Data Validation](https://developer.wordpress.org/apis/security/data-validation/)
