# PHPCS Quick Reference Guide

## ✅ Fixed Configuration
All PluginCheck-specific sniffs have been replaced with WordPress core equivalents.

## Quick Commands

### Run Security Checks Only
```bash
vendor/bin/phpcs --standard=phpcs-xml/plugin-check-security.xml . -n
```

### Run Performance Checks Only
```bash
vendor/bin/phpcs --standard=phpcs-xml/plugin-check-performance.xml . -n
```

### Run General Checks Only
```bash
vendor/bin/phpcs --standard=phpcs-xml/plugin-check-general.xml . -n
```

### Run All Checks (Main Config)
```bash
vendor/bin/phpcs --standard=phpcs.xml.dist -n
```

### Run on Specific File
```bash
vendor/bin/phpcs --standard=phpcs-xml/plugin-check-security.xml path/to/file.php
```

### Run on Specific Directory
```bash
vendor/bin/phpcs --standard=phpcs-xml/plugin-check-security.xml src/
```

### Generate Report File
```bash
vendor/bin/phpcs --standard=phpcs.xml.dist --report-file=phpcs-report.txt
```

### Different Report Formats
```bash
# Summary only
vendor/bin/phpcs --standard=phpcs.xml.dist --report=summary

# JSON format
vendor/bin/phpcs --standard=phpcs.xml.dist --report=json

# XML format
vendor/bin/phpcs --standard=phpcs.xml.dist --report=xml

# Source statistics
vendor/bin/phpcs --standard=phpcs.xml.dist --report=source
```

### Auto-fix Issues
```bash
vendor/bin/phpcbf --standard=phpcs.xml.dist
```

## Command Line Flags

- `-n` - Show only errors (hide warnings)
- `-s` - Show sniff codes in report
- `-v` - Verbose output
- `-p` - Show progress
- `--colors` - Use colors in output
- `--report=summary` - Show summary only
- `--severity=7` - Show only errors with severity 7 or higher

## Examples

### Security audit of recent changes
```bash
vendor/bin/phpcs --standard=phpcs-xml/plugin-check-security.xml $(git diff --name-only HEAD | grep '\.php$')
```

### Check specific security rules
```bash
vendor/bin/phpcs --standard=WordPress --sniffs=WordPress.Security.EscapeOutput,WordPress.Security.NonceVerification . -n
```

### Performance check with progress
```bash
vendor/bin/phpcs --standard=phpcs-xml/plugin-check-performance.xml . -p -n
```

## Available WordPress Sniffs

### Security Sniffs
- `WordPress.Security.EscapeOutput` - Check for escaped output
- `WordPress.Security.NonceVerification` - Check nonce verification
- `WordPress.Security.ValidatedSanitizedInput` - Check input sanitization
- `WordPress.Security.SafeRedirect` - Check safe redirects
- `WordPress.Security.PluginMenuSlug` - Check plugin menu slugs

### Database Sniffs
- `WordPress.DB.PreparedSQL` - Check prepared statements
- `WordPress.DB.PreparedSQLPlaceholders` - Check placeholder usage
- `WordPress.DB.DirectDatabaseQuery` - Check direct DB queries
- `WordPress.DB.RestrictedClasses` - Disallow direct mysqli/PDO
- `WordPress.DB.RestrictedFunctions` - Disallow direct mysql_* functions
- `WordPress.DB.SlowDBQuery` - Check for slow queries

### Performance Sniffs
- `WordPress.WP.AlternativeFunctions` - Use WP functions over PHP
- `WordPress.DB.SlowDBQuery` - Detect slow queries

### Code Analysis Sniffs
- `WordPress.CodeAnalysis.AssignmentInCondition` - Assignment in conditions
- `WordPress.CodeAnalysis.EmptyStatement` - Empty statements

## Tips

1. **Always run with `-n`** for production checks (errors only)
2. **Use specific rulesets** for faster scans
3. **Run `phpcbf`** first to auto-fix simple issues
4. **Check git diff** before commits: 
   ```bash
   git diff --name-only | grep '\.php$' | xargs vendor/bin/phpcs --standard=phpcs-xml/plugin-check-security.xml
   ```
5. **Add to pre-commit hook** for automatic checks
