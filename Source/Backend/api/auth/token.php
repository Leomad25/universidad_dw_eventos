<?php

include "../../utils/generalResponsive.php";
include "../../utils/jwt/jwt.php";

// cors
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header("Access-Control-Allow-Headers: *");
// cors

header("Content-Type: application/json");
$_HEADERS = getallheaders();

switch($_SERVER['REQUEST_METHOD'])
{
    case 'GET':
        $responsive = new GenerateResponsive();
        if (isset($_HEADERS['Authorization']))
        {
            $valid = isValidJWT($_HEADERS['Authorization']);
            if (!is_string($valid)) {
                header('HTTP/1.1 200 OK');
                $responsive->generateResponsive(null, null, ['isValid' => $valid]);
            } else {
                header('HTTP/1.1 400 Bad Request');
                $responsive->generateResponsive(-1, 'Err: '.$valid, null);
            }
        } else {
            header('HTTP/1.1 400 Bad Request');
            $responsive->generateResponsive(-1, 'Err: Token Not Found', null);
        }
        echo $responsive->getJson();
        break;
}

?>