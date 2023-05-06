<?php

include "../../utils/generalResponsive.php";
include "../../utils/jwt/jwt.php";
include "../../utils/panelClass.php";

// cors
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: *');
// cors

header("Content-Type: application/json");

$_HEADERS = getallheaders();

if ($_SERVER['REQUEST_METHOD'] === 'GET')
{
    $responsive = new GenerateResponsive();
    if (isset($_HEADERS['Authorization']))
    {
        $iduser = getIdUserFromToken($_HEADERS['Authorization']);
        if (!is_string($iduser))
        {
            $userClass = new UserService();
            $userData = $userClass->getUser($iduser);
            if ($userData == null)
            {
                header('HTTP/1.1 500 Internal Server Error');
                $responsive->generateResponsive(-1, 'Err: Iduser invalid', null);
            }
            else if (is_string($userData))
            {
                header('HTTP/1.1 500 Internal Server Error');
                $responsive->generateResponsive(-1, $userData, null);
            }
            else
            {
                if ($userData['peso'] != 9) {
                    header('HTTP/1.1 401 Unauthorized');
                    $responsive->generateResponsive(-1, 'Err: Role level 9 requiered ', null);
                } else {
                    $roleClass = new RoleService();
                    $result = $roleClass->getAllRoles();
                    if (!is_string($result))
                    {
                        header('HTTP/1.1 200 OK');
                        $responsive->generateResponsive(null, null, $result);
                    } else {
                        header('HTTP/1.1 500 Internal Server Error');
                        $responsive->generateResponsive(-1, $result, null);
                    }
                }
            }
        } else {
            header('HTTP/1.1 401 Unauthorized');
            $responsive->generateResponsive(-1, 'Err: '.$iduser, null);
        }
    } else {
        header('HTTP/1.1 401 Unauthorized');
        $responsive->generateResponsive(-1, 'Err: Token Not Found', null);
    }
    echo $responsive->getJson();
}

?>