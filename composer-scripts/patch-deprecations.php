<?php

/**
 * This script patches PHP 8+ compatibility issues in Illuminate Container and Eloquent classes.
 *
 * It fixes:
 * 1. PSR-11 ContainerInterface compatibility (has() and get() methods)
 * 2. ArrayAccess interface compatibility (offsetExists, offsetGet, offsetSet, offsetUnset)
 * 3. Nullable parameter declarations
 * 4. Return type declarations for PHP 8+
 */

function patchContainerPSR11($file) {
    if (!file_exists($file)) {
        echo "❌ File not found: $file\n";
        return;
    }

    $content = file_get_contents($file);
    $originalContent = $content;

    // Fix has() method - PSR-11 requires: has(string $id): bool
    $content = preg_replace(
        '/public function has\(\$id\)(\s*\{)/s',
        'public function has(string $id): bool$1',
        $content
    );

    // Fix get() method - PSR-11 requires: get(string $id)
    $content = preg_replace(
        '/public function get\(\$id\)(\s*\{)/s',
        'public function get(string $id)$1',
        $content
    );

    // Fix offsetExists - ArrayAccess requires: offsetExists($key): bool
    $content = preg_replace(
        '/public function offsetExists\(\$key\)(\s*\{)/s',
        'public function offsetExists($key): bool$1',
        $content
    );

    // Fix offsetGet - ArrayAccess requires: offsetGet($key): mixed
    $content = preg_replace(
        '/public function offsetGet\(\$key\)(\s*\{)/s',
        'public function offsetGet($key): mixed$1',
        $content
    );

    // Fix offsetSet - ArrayAccess requires: offsetSet($key, $value): void
    $content = preg_replace(
        '/public function offsetSet\(\$key, \$value\)(\s*\{)/s',
        'public function offsetSet($key, $value): void$1',
        $content
    );

    // Fix offsetUnset - ArrayAccess requires: offsetUnset($key): void
    $content = preg_replace(
        '/public function offsetUnset\(\$key\)(\s*\{)/s',
        'public function offsetUnset($key): void$1',
        $content
    );

    // Fix nullable parameters - PHP 8.1+ requires explicit nullable type
    $content = preg_replace(
        '/public function resolving\(\$abstract, Closure \$callback = null\)/s',
        'public function resolving($abstract, ?Closure $callback = null)',
        $content
    );

    $content = preg_replace(
        '/public function afterResolving\(\$abstract, Closure \$callback = null\)/s',
        'public function afterResolving($abstract, ?Closure $callback = null)',
        $content
    );

    $content = preg_replace(
        '/public static function setInstance\(ContainerContract \$container = null\)/s',
        'public static function setInstance(?ContainerContract $container = null)',
        $content
    );

    if ($content !== $originalContent) {
        file_put_contents($file, $content);
        echo "✅ Patched Container: PSR-11 and ArrayAccess compatibility\n";
    } else {
        echo "⚠️ Container already patched or no changes needed\n";
    }
}

function patchReturnType($file, $method) {
    if (!file_exists($file)) {
        echo "❌ File not found: $file\n";
        return;
    }

    $content = file_get_contents($file);

    // Check if method is already patched with the attribute
    $alreadyPatched = preg_match(
        '/#[ \t]*\\\\?ReturnTypeWillChange[ \t]*\n[ \t]*public function[ \t]+' . preg_quote($method) . '\s*\(/',
        $content
    );

    // Alternatively, scan just before the method for attribute presence
    if (! $alreadyPatched) {
        // Match the method declaration with optional preceding attributes
        $methodPattern = '/((?:\s*#\[.*?\]\s*)*)\s*(public function[ \t]+' . preg_quote($method) . '\s*\([^)]*\))/';

        $patched = preg_replace_callback($methodPattern, function($matches) use ($method) {
            $attributes = $matches[1];
            $signature  = $matches[2];

            // Avoid duplicating ReturnTypeWillChange
            if (stripos($attributes, 'ReturnTypeWillChange') !== false) {
                echo "⚠️ Already patched: $method\n";
                return $matches[0];
            }

            echo "✅ Patched: $method\n";
            return "#[\\ReturnTypeWillChange]\n    " . $signature;
        }, $content, 1, $count);

        if ($count > 0) {
            file_put_contents($file, $patched);
        } else {
            echo "❌ Could not patch: $method\n";
        }
    } else {
        echo "⚠️ Already patched: $method\n";
    }
}


// Patch Container class for PSR-11 and ArrayAccess compatibility
echo "=== Patching Illuminate Container ===\n";
$targetContainerFile = __DIR__ . '/../vendor/illuminate/container/Container.php';
patchContainerPSR11($targetContainerFile);

// Patch Model and Collection classes
echo "\n=== Patching Eloquent Model and Collection ===\n";
$targetModelFile = __DIR__ . '/../vendor/illuminate/database/Eloquent/Model.php';
$targetCollectionFile = __DIR__ . '/../vendor/illuminate/support/Collection.php';

$methods = ['offsetExists', 'offsetGet', 'offsetSet', 'offsetUnset', 'jsonSerialize', 'count', 'getIterator'];

foreach ($methods as $method) {
    patchReturnType($targetModelFile, $method);
    patchReturnType($targetCollectionFile, $method);
}

// Patch Illuminate Pagination classes
echo "\n=== Patching Illuminate Pagination ===\n";
$targetAbstractPaginatorFile = __DIR__ . '/../vendor/illuminate/pagination/AbstractPaginator.php';
$targetPaginatorFile = __DIR__ . '/../vendor/illuminate/pagination/Paginator.php';
$targetLengthAwarePaginatorFile = __DIR__ . '/../vendor/illuminate/pagination/LengthAwarePaginator.php';

foreach ($methods as $method) {
    patchReturnType($targetAbstractPaginatorFile, $method);
    patchReturnType($targetPaginatorFile, $method);
    patchReturnType($targetLengthAwarePaginatorFile, $method);
}

// Patch League Fractal ParamBag
echo "\n=== Patching League Fractal ParamBag ===\n";
$targetParamBagFile = __DIR__ . '/../vendor/league/fractal/src/ParamBag.php';
$fractalMethods = ['offsetExists', 'offsetGet', 'offsetSet', 'offsetUnset', 'getIterator'];

foreach ($fractalMethods as $method) {
    patchReturnType($targetParamBagFile, $method);
}

echo "\n✅ All patches applied successfully!\n";
