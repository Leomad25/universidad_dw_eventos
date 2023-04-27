<?php

include "../../utils/authClass.php";

// cors
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header("Access-Control-Allow-Headers: *");
// cors

header("Content-Type: application/json");
$_INPUT = json_decode(file_get_contents('php://input'), true);
$_AUTH_SERVICE = new AuthService();
    
switch($_SERVER['REQUEST_METHOD'])
{
    case 'POST':
        if (isset($_INPUT['document']) &&
            isset($_INPUT['name']) &&
            isset($_INPUT['nickname']) &&
            isset($_INPUT['password']))
        {
            $_AUTH_SERVICE->registerUser(
                $_INPUT['document'],
                $_INPUT['name'],
                $_INPUT['nickname'],
                $_INPUT['password']
            );
        } else {
            header('HTTP/1.1 400 Bad Request');
        }
        break;
}

?>