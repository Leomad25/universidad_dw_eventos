<?php

include "../../utils/generalResponsive.php";
include "../../utils/jwt/jwt.php";
include "../../utils/panelClass.php";

// cors
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: PUT');
header('Access-Control-Allow-Headers: *');
// cors

header("Content-Type: application/json");

$_HEADERS = getallheaders();


if ($_SERVER['REQUEST_METHOD'] === 'PUT')
{
    $responsive = new GenerateResponsive();
    if (isset($_HEADERS['Authorization']))
    {
        $_INPUT = json_decode(file_get_contents('php://input'), true);
        if (isset($_INPUT['iduser']) && isset($_INPUT['idrole'])) {
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
                        $roleUserClass = new RoleUserService();
                        $result = $roleUserClass->changeRoleUser($_INPUT['iduser'], $_INPUT['idrole'], $iduser);
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
            echo $responsive->getJson();
        } else {
            header('HTTP/1.1 400 Bad Request');
        }
    } else {
        header('HTTP/1.1 401 Unauthorized');
        $responsive->generateResponsive(-1, 'Err: Token Not Found', null);
        echo $responsive->getJson();
    }
}

?>