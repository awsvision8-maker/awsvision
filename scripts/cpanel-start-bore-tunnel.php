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

@mkdir($home . '/bin', 0755, true);
@mkdir($home . '/tmp', 0755, true);

if (!is_executable($bin)) {
    echo "bore binary missing\n";
    exit(1);
}

if (is_file($pidFile)) {
    $pid = trim((string) file_get_contents($pidFile));
    if ($pid !== '' && ctype_digit($pid) && posix_kill((int) $pid, 0)) {
        posix_kill((int) $pid, 9);
        echo "stopped old pid=$pid\n";
    }
    @unlink($pidFile);
}

@unlink($log);
$remotePort = 35542;
$cmd = escapeshellarg($bin) . ' local 5432 --to bore.pub --port ' . $remotePort . ' > ' . escapeshellarg($log) . ' 2>&1 & echo $!';
$pid = trim((string) shell_exec($cmd));
file_put_contents($pidFile, $pid);
echo "Started bore pid=$pid\n";

for ($i = 0; $i < 20; $i++) {
    sleep(1);
    if (!is_readable($log)) {
        continue;
    }
    $text = (string) file_get_contents($log);
    if (preg_match('/listening at bore\.pub:(\d+)/i', $text, $m)) {
        $endpoint = 'bore.pub:' . $m[1];
        file_put_contents($endpointFile, $endpoint);
        echo "Endpoint: $endpoint\n";
        echo "DONE\n";
        exit(0);
    }
    if (preg_match('/error|failed/i', $text)) {
        echo "Log:\n$text\n";
        exit(1);
    }
}

echo "Timeout. Log:\n";
echo is_readable($log) ? (string) file_get_contents($log) : '(no log)';
