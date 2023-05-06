<?php

include "../../utils/generalResponsive.php";
include "../../utils/jwt/jwt.php";
include "../../utils/panelClass.php";

// cors
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT');
header('Access-Control-Allow-Headers: *');
// cors

header("Content-Type: application/json");

$_HEADERS = getallheaders();
$_INPUT = json_decode(file_get_contents('php://input'), true);

if ($_SERVER['REQUEST_METHOD'] === 'GET')
{
    $responsive = new GenerateResponsive();
    if (isset($_HEADERS['Authorization']))
    {
        $iduser = getIdUserFromToken($_HEADERS['Authorization']);
        if (!is_string($iduser))
        {
            $userClass = new UserService();
            if (!isset($_GET['nickname'])) {
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
                    header('HTTP/1.1 200 OK');
                    $responsive->generateResponsive(null, null, $userData);
                }
            } else {
                $userData = $userClass->getUserByNickWhitRole($iduser, $_GET['nickname']);
                if ($userData == -1)
                {
                    header('HTTP/1.1 500 Internal Server Error');
                    $responsive->generateResponsive(-1, 'Err: Iduser invalid', null);
                }
                else if (is_string($userData))
                {
                    if ($userData == 'Err: ACCESS DENIED')
                    {
                        header('HTTP/1.1 401 Unauthorized');
                    } else {
                        header('HTTP/1.1 500 Internal Server Error');
                    }
                    $responsive->generateResponsive(-1, $userData, null);
                }
                else
                {
                    header('HTTP/1.1 200 OK');
                    if ($userData == null) $userData = array('error' => 'User not found');
                    $responsive->generateResponsive(null, null, $userData);
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

if ($_SERVER['REQUEST_METHOD'] === 'POST')
{
    $responsive = new GenerateResponsive();
    if (isset($_HEADERS['Authorization']))
    {
        if (isset($_INPUT['nickname']))
        {
            $iduser = getIdUserFromToken($_HEADERS['Authorization']);
            if (!is_string($iduser))
            {
                $userClass = new UserService();
                $userList = $userClass->getUsersByNick($iduser, $_INPUT['nickname']);
                if ($userList == -1)
                {
                    header('HTTP/1.1 500 Internal Server Error');
                    $responsive->generateResponsive(-1, 'Err: Iduser invalid', null);
                }
                else if (is_string($userList))
                {
                    if ($userList == 'Err: ACCESS DENIED')
                    {
                        header('HTTP/1.1 401 Unauthorized');
                    } else {
                        header('HTTP/1.1 500 Internal Server Error');
                    }
                    $responsive->generateResponsive(-1, $userList, null);
                }
                else
                {
                    header('HTTP/1.1 200 OK');
                    if ($userList == null) $userList = array('error' => 'Users not found');
                    $responsive->generateResponsive(null, null, $userList);
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

if ($_SERVER['REQUEST_METHOD'] === 'PUT')
{
    $responsive = new GenerateResponsive();
    if (isset($_HEADERS['Authorization']))
    {
        if (isset($_INPUT['iduser']) && isset($_INPUT['status'])) {
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
                        $result = $userClass->setAllowedUser($_INPUT['iduser'], $_INPUT['status']);
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