<?php
require 'vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;

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

        // send email
        $mail = new PHPMailer(true);
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->SMTPSecure = 'tls';
        $mail->Port = 587;  // TCP port to connect to
        $mail->Username = 'referencementschool@gmail.com';
        $mail->Password = 'guhnmrdhblypwqyj';
        $mail->setFrom('referencementschool@gmail.com', 'Formapedia');
        $mail->addAddress('yvon.huynh@gmail.com');
        // $mail->addReplyTo('phpmailer@synchromedia.co.uk', 'Information');
        $mail->isHTML(true);  // Set email format to HTML
        $mail->Subject = 'Le résultat de votre test';
        $mail->Body = 'This is the HTML message body <b>in bold!</b>';
        // $mail->AltBody = 'This is the body in plain text for non-HTML mail clients';
        $mail->send();
    },
    default => function () {
        echo 'default';
    }
};
// Call the closure returned by the match expression.
$router();
