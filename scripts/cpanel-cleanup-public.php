<?php
header('Content-Type: text/plain');
$token = $_GET['token'] ?? '';
if ($token !== 'awsv-cleanup-20260831') {
    http_response_code(403);
    echo "Forbidden\n";
    exit;
}
$paths = [
    '/home/awsvision/web.awsvision.com/start-pg-tunnel.php',
    '/home/awsvision/web.awsvision.com/tunnel-status.php',
    '/home/awsvision/web.awsvision.com/exec-test.php',
];
foreach ($paths as $path) {
    if (is_file($path)) {
        unlink($path);
        echo "deleted $path\n";
    }
}
$pidFile = '/home/awsvision/tmp/cloudflared.pid';
if (is_file($pidFile)) {
    $pid = (int) trim((string) file_get_contents($pidFile));
    if ($pid > 0) {
        posix_kill($pid, 9);
        echo "killed cloudflared pid=$pid\n";
    }
    unlink($pidFile);
}
echo "done\n";
