<?php

/**
 * routeur pour les api */

$action = $_GET['action'];
$r = file_get_contents('php://input');
$r = json_decode($r, true);

$router = match ($action) {
    'save_score' => function () use ($r) {
        // save score to file
        $handle = fopen('scores.json', 'a');
        fwrite($handle, json_encode($r, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) . "\n");
        fclose($handle);
    },
    default => function () {
        echo 'default';
    }
};
// Call the closure returned by the match expression.
$router();
