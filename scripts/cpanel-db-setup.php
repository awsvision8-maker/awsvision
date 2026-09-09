<?php
header('Content-Type: text/plain; charset=utf-8');
set_time_limit(0);

echo "setup-version: 5\n";
$token = $_GET['token'] ?? '';
if ($token !== 'awsv-setup-20260831') {
    echo "Forbidden\n";
    exit;
}

$config = [
    'host' => 'localhost',
    'port' => '5432',
    'dbname' => 'awsvision_webapp',
    'user' => 'awsvision_webappuser',
    'password' => 'Gug8HOlmPLI6rM4UcinqXADK',
];

$baseDir = '/home/awsvision/web.awsvision.com';
$schemaFile = $baseDir . '/schema-full.sql';
$dataFile = $baseDir . '/data.sql';

try {
    $pdo = new PDO(
        sprintf('pgsql:host=%s;port=%s;dbname=%s', $config['host'], $config['port'], $config['dbname']),
        $config['user'],
        $config['password'],
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
} catch (Exception $e) {
    echo 'CONNECT ERR: ' . $e->getMessage() . "\n";
    exit(1);
}

function runSqlFile(PDO $pdo, string $path, string $label): void
{
    if (!is_readable($path)) {
        throw new RuntimeException("Missing file: $path");
    }
    echo "== $label ==\n";
    $sql = file_get_contents($path);
    $sql = preg_replace('/^\xEF\xBB\xBF/', '', $sql);
    $sql = preg_replace('/--.*$/m', '', $sql);
    $statements = preg_split('/;\s*\n/', $sql);
    $ok = 0;
    foreach ($statements as $statement) {
        $statement = trim($statement);
        if ($statement === '') {
            continue;
        }
        try {
            $pdo->exec($statement);
            $ok++;
        } catch (PDOException $e) {
            $msg = $e->getMessage();
            if (
                stripos($msg, 'already exists') !== false ||
                stripos($msg, 'duplicate') !== false
            ) {
                echo "skip: $msg\n";
                continue;
            }
            throw $e;
        }
    }
    echo "executed $ok statements\n";
}

function importDataFile(PDO $pdo, string $path, string $label): void
{
    if (!is_readable($path)) {
        throw new RuntimeException("Missing file: $path");
    }
    echo "== $label ==\n";
    $sql = file_get_contents($path);
    $sql = preg_replace('/^\xEF\xBB\xBF/', '', $sql);
    $sql = preg_replace('/SET session_replication_role\s*=\s*[^;]+;/i', '', $sql);
    $sql = preg_replace('/^(BEGIN|COMMIT);\s*$/mi', '', $sql);

    echo 'data bytes: ' . strlen($sql) . "\n";

    $order = [
        'User', 'Admin', 'FdPromoConfig', 'ContactMessage', 'WaitlistEntry', 'AppointmentRequest',
        'SignupAttemptLog', 'BrandAmbassadorApplication', 'BrandAmbassador', 'NotificationBroadcast',
        'PortfolioAccount', 'InvestmentAgreement', 'Transaction', 'WithdrawalRequest', 'Session',
        'AdminSession', 'ManagerSession', 'KycDocumentRequest', 'BirthdayWish', 'UserNotification',
        'ChatConversation', 'ChatMessage', 'VisitorPresence',
    ];

    $sections = [];
    $parts = preg_split('/\n-- Table: /', $sql);
    array_shift($parts);
    foreach ($parts as $part) {
        $nl = strpos($part, "\n");
        if ($nl === false) {
            continue;
        }
        $header = substr($part, 0, $nl);
        $table = trim(strtok($header, ' ('));
        $sections[$table] = trim(substr($part, $nl + 1));
    }
    echo 'sections: ' . count($sections) . "\n";

    $ok = 0;
    foreach ($order as $table) {
        if (!isset($sections[$table])) {
            continue;
        }
        echo "import $table\n";
        $chunk = $sections[$table];
        $statements = preg_split('/;\s*\n/', $chunk);
        foreach ($statements as $statement) {
            $statement = trim($statement);
            if ($statement === '') {
                continue;
            }
            $pdo->exec($statement);
            $ok++;
        }
    }
    echo "executed $ok data statements\n";
}

function resetDatabase(PDO $pdo): void
{
    echo "== reset database ==\n";
    $tables = $pdo->query(
        "SELECT tablename FROM pg_tables WHERE schemaname = 'public'"
    )->fetchAll(PDO::FETCH_COLUMN);
    foreach ($tables as $table) {
        $pdo->exec('DROP TABLE IF EXISTS "' . str_replace('"', '""', $table) . '" CASCADE');
    }
    echo 'dropped ' . count($tables) . " tables\n";
}

try {
    resetDatabase($pdo);
    runSqlFile($pdo, $schemaFile, 'schema migrations');
    importDataFile($pdo, $dataFile, 'data import');
    $count = $pdo->query('SELECT COUNT(*) FROM "User"')->fetchColumn();
    echo "Users in database: $count\n";
    echo "DONE\n";
} catch (Throwable $e) {
    echo 'ERR: ' . $e->getMessage() . "\n";
    exit(1);
}
