<?php
header('Content-Type: text/plain; charset=utf-8');
set_time_limit(0);

$token = $_GET['token'] ?? '';
if ($token !== 'awsv-bore-20260831') {
    http_response_code(403);
    echo "Forbidden\n";
    exit;
}

$home = '/home/awsvision';
$bin = $home . '/bin/bore';
$log = $home . '/tmp/bore.log';
$pidFile = $home . '/tmp/bore.pid';
$endpointFile = $home . '/tmp/bore-endpoint.txt';
$remotePort = 35542;

if (!is_executable($bin)) {
    echo "bore missing\n";
    exit(1);
}

if (is_file($pidFile)) {
    $pid = trim((string) file_get_contents($pidFile));
    if ($pid !== '' && ctype_digit($pid) && posix_kill((int) $pid, 0)) {
        echo "alive pid=$pid\n";
        if (is_readable($endpointFile)) {
            echo 'endpoint=' . trim((string) file_get_contents($endpointFile)) . "\n";
        }
        exit(0);
    }
}

if (is_file($pidFile)) {
    $pid = trim((string) file_get_contents($pidFile));
    if ($pid !== '' && ctype_digit($pid)) {
        posix_kill((int) $pid, 9);
    }
    @unlink($pidFile);
}

$cmd = escapeshellarg($bin) . ' local 5432 --to bore.pub --port ' . $remotePort . ' >> ' . escapeshellarg($log) . ' 2>&1 & echo $!';
$pid = trim((string) shell_exec($cmd));
file_put_contents($pidFile, $pid);
file_put_contents($endpointFile, 'bore.pub:' . $remotePort);
echo "restarted pid=$pid\n";
echo "endpoint=bore.pub:$remotePort\n";
