<?php


use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;


require "PHPMailer-master/src/PHPMailer.php"
require "PHPMailer-master/src/Exception.php"

$mail = new PHPMailer(true);
$mail ->CharSet= "UTF-8";



$name = $_POST["user_name"];
$company = $_POST["user_company"];
$phone = $_POST["user_phone"];
$email = $_POST["user_email"];
$brend = $_POST["brending"];
$design = $_POST["design"];
$verstka = $_POST["verstka"];
$programming = $_POST["programming"];
$another = $_POST["another"];
$price = $_POST["price"];
$days = $_POST["days"];
$textOne = $_POST["text_1"];
$textTwo = $_POST["text_2"];


$body = $name . ' ' . $company . ' ' . $phone . ' ' . $email;

$theme = "[Заявка с формы]";

$mail->addAddress("seedsedowsidushka@gmail.com");

$mail->Subject = $theme;
$mail->Body = $body;
$mail->send();

