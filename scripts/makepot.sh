#!/bin/bash
set -euo pipefail

# makepot script for WP Project Manager

# Set defaults or use environment variables
MEMORY_LIMIT=${PHP_MEMORY_LIMIT:-512M}
MAX_EXECUTION_TIME=${PHP_MAX_EXECUTION_TIME:-300}

# Check for prerequisites
if [ ! -f "package.json" ]; then
    echo "Error: package.json not found. Run from plugin root." >&2
    exit 1
fi
if [ ! -f "node_modules/wp-vue-i18n/bin/wpvuei18n" ]; then
    echo "Error: wp-vue-i18n not found. Run 'npm install' first." >&2
    exit 1
fi
if ! command -v php >/dev/null 2>&1; then
    echo "Error: PHP is not installed or not in PATH." >&2
    exit 1
fi

# Run makepot
php -d memory_limit="$MEMORY_LIMIT" \
    -d max_execution_time="$MAX_EXECUTION_TIME" \
    ./node_modules/wp-vue-i18n/bin/wpvuei18n makepot "$@" 
