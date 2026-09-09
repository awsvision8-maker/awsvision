<?php
header('Content-Type: text/plain');
echo 'disable_functions=' . ini_get('disable_functions') . "\n";
echo 'exec=' . (function_exists('exec') ? 'yes' : 'no') . "\n";
echo 'shell_exec=' . (function_exists('shell_exec') ? 'yes' : 'no') . "\n";
echo 'proc_open=' . (function_exists('proc_open') ? 'yes' : 'no') . "\n";
