<?php
header('Content-Type: text/plain');
$token = $_GET['token'] ?? '';
if ($token !== 'awsv-bore-20260831') {
    http_response_code(403);
    echo "Forbidden\n";
    exit;
}
echo shell_exec('ps aux | grep bore | grep -v grep') ?: "no bore process\n";
foreach (['/home/awsvision/tmp/bore.log', '/home/awsvision/tmp/bore-endpoint.txt', '/home/awsvision/tmp/bore.pid'] as $f) {
    echo "== $f ==\n";
    echo is_readable($f) ? file_get_contents($f) : '(missing)';
    echo "\n";
}
