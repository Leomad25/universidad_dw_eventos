<?php

include "../utils/othersClass.php";

// cors
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header("Access-Control-Allow-Headers: *");
// cors

header("Content-Type: application/json");

$dateServices = new DateService();
$responsive = new GenerateResponsive();

switch($_SERVER['REQUEST_METHOD'])
{
    case 'GET':
        if (
            isset($_GET['opt'])
        ){
            if($_GET['opt'] == 'date') {
                $date = $dateServices->getDate();
                if ($date == null)
                {
                    header('HTTP/1.1 500 Internal Server Error');
                    $responsive->generateResponsive(-1, 'Err: Error to get date.', null);
                }
                    else
                {
                    header('HTTP/1.1 200 OK');
                    $responsive->generateResponsive(null, null, $date);
                }
                echo $responsive->getJson();
                return;
            }
            return header('HTTP/1.1 404 Not Found');
        }
            else
        {
            header('HTTP/1.1 400 Bad Request');
        }
        break;
}

?>