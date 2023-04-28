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

if ($_SERVER['REQUEST_METHOD'] == 'GET')
{
    $responsive = new GenerateResponsive();
    if (isset($_HEADERS['Authorization']))
    {
        $iduser = getIdUserFromToken($_HEADERS['Authorization']);
        if (!is_string($iduser))
        {
            $userClass = new UserService();
            $userData = $userClass->getUser($iduser);
            $responsive->generateResponsive(null, null, $userData);
        } else {
            header('HTTP/1.1 401 Unauthorized');
            $responsive->generateResponsive(-1, 'Err: '.$iduser, null);
        }
    } else {
        header("HTTP/1.1 401 Unauthorized");
        $responsive->generateResponsive(-1, 'Err: Token Not Found', null);
    }
    echo $responsive->getJson();
}

?>