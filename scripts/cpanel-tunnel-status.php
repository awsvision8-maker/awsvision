<?php
header('Content-Type: text/plain');
$token = $_GET['token'] ?? '';
if ($token !== 'awsv-tunnel-20260831') {
    http_response_code(403);
    echo "Forbidden\n";
    exit;
}
$home = '/home/awsvision';
foreach (['tmp/cloudflared.log', 'tmp/cloudflared-endpoint.txt', 'tmp/cloudflared.pid'] as $rel) {
    $path = $home . '/' . $rel;
    echo "== $rel ==\n";
    echo is_readable($path) ? file_get_contents($path) : '(missing)';
    echo "\n\n";
}
