<?php
header('Content-Type: text/plain');
echo 'pdo_pgsql=' . (extension_loaded('pdo_pgsql') ? 'yes' : 'no') . "\n";
echo 'pgsql=' . (function_exists('pg_connect') ? 'yes' : 'no') . "\n";
if (!extension_loaded('pdo_pgsql')) {
    exit(0);
}
try {
    $pdo = new PDO(
        'pgsql:host=localhost;port=5432;dbname=awsvision_webapp',
        'awsvision_webappuser',
        'Gug8HOlmPLI6rM4UcinqXADK'
    );
    echo $pdo->query('SELECT version()')->fetchColumn() . "\n";
} catch (Exception $e) {
    echo 'ERR: ' . $e->getMessage() . "\n";
}
