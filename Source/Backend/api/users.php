<?php

include "../utils/userClass.php";

header("Content-Type: application/json");
$_INPUT = json_decode(file_get_contents('php://input'), true);
$_USER_SERVICE = new UserService();
    
switch($_SERVER['REQUEST_METHOD'])
{
    case 'POST':
        if (isset($_INPUT['document']) &&
            isset($_INPUT['name']) &&
            isset($_INPUT['nickname']) &&
            isset($_INPUT['password']))
        {
            $_USER_SERVICE->createUser(
                $_INPUT['document'],
                $_INPUT['name'],
                $_INPUT['nickname'],
                $_INPUT['password']
            );
        } else {
            header('HTTP/1.1 400 Bad Request');
        }
        break;

    case 'GET':
        if (isset($_INPUT['nickname']))
        {
            $_USER_SERVICE->getUser(
                $_INPUT['nickname']
            );
        } else {
            header('HTTP/1.1 400 Bad Request');
        }
        break;

    case 'PUT':
        if (isset($_INPUT['id']) &&
            isset($_INPUT['status']))
        {
            $idCast = intval($_INPUT['id']);
            if ($idCast > 0 && is_bool($_INPUT['status']))
            {
                $_USER_SERVICE->allowedUser(
                    $idCast,
                    $_INPUT['status']
                );
            } else {
                header('HTTP/1.1 400 Bad Request');
            }
        } else {
            header('HTTP/1.1 400 Bad Request');
        }
        break;
}
?>