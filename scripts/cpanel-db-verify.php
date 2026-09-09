<?php
header('Content-Type: text/plain');
$pdo = new PDO(
    'pgsql:host=localhost;port=5432;dbname=awsvision_webapp',
    'awsvision_webappuser',
    'Gug8HOlmPLI6rM4UcinqXADK',
    [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
);
foreach (['User', 'PortfolioAccount', 'Transaction', 'InvestmentAgreement', 'Admin'] as $table) {
    $count = $pdo->query('SELECT COUNT(*) FROM "' . $table . '"')->fetchColumn();
    echo "$table: $count\n";
}
