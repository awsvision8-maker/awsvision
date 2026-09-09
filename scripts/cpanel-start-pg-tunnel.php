<?php
header('Content-Type: text/plain');
set_time_limit(0);

$token = $_GET['token'] ?? '';
if ($token !== 'awsv-tunnel-20260831') {
    http_response_code(403);
    echo "Forbidden\n";
    exit;
}

$home = '/home/awsvision';
$bin = $home . '/bin/cloudflared';
$log = $home . '/tmp/cloudflared.log';
$pidFile = $home . '/tmp/cloudflared.pid';
$endpointFile = $home . '/tmp/cloudflared-endpoint.txt';

@mkdir($home . '/bin', 0755, true);
@mkdir($home . '/tmp', 0755, true);

if (!is_executable($bin)) {
    echo "Downloading cloudflared...\n";
    $url = 'https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64';
    $data = @file_get_contents($url);
    if ($data === false) {
        echo "Download failed\n";
        exit(1);
    }
    file_put_contents($bin, $data);
    chmod($bin, 0755);
    echo "Downloaded " . strlen($data) . " bytes\n";
}

if (is_file($pidFile)) {
    $pid = trim((string) file_get_contents($pidFile));
    if ($pid !== '' && is_numeric($pid) && posix_kill((int) $pid, 0)) {
        echo "Tunnel already running pid=$pid\n";
        if (is_readable($endpointFile)) {
            echo "Endpoint: " . trim((string) file_get_contents($endpointFile)) . "\n";
        }
        exit(0);
    }
}

@unlink($log);
@unlink($endpointFile);

$cmd = escapeshellarg($bin) . ' tunnel --url tcp://127.0.0.1:5432 --logfile ' . escapeshellarg($log) . ' --loglevel info > /dev/null 2>&1 & echo $!';
$pid = trim((string) shell_exec($cmd));
file_put_contents($pidFile, $pid);
echo "Started cloudflared pid=$pid\n";

for ($i = 0; $i < 30; $i++) {
    sleep(1);
    if (!is_readable($log)) {
        continue;
    }
    $logText = file_get_contents($log);
    if (preg_match('/https:\/\/[a-z0-9-]+\.trycloudflare\.com/i', $logText, $m)) {
        $host = parse_url($m[0], PHP_URL_HOST);
        $endpoint = $host . ':5432';
        file_put_contents($endpointFile, $endpoint);
        echo "Endpoint: $endpoint\n";
        echo "DONE\n";
        exit(0);
    }
    if (preg_match('/tcp:\/\/([^:\s]+):(\d+)/i', $logText, $m)) {
        $endpoint = $m[1] . ':' . $m[2];
        file_put_contents($endpointFile, $endpoint);
        echo "Endpoint: $endpoint\n";
        echo "DONE\n";
        exit(0);
    }
}

echo "Tunnel started but endpoint not found yet. Log tail:\n";
echo is_readable($log) ? substr((string) file_get_contents($log), -2000) : '(no log)';
echo "\n";
