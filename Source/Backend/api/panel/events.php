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
                if ($userData['peso'] < 5) {
                    header('HTTP/1.1 401 Unauthorized');
                    $responsive->generateResponsive(-1, 'Err: Role level 5 or upper requiered ', null);
                }
                    else
                {
                    $eventClass = new EventService();
                    if (!isset($_GET['idevent'])) {
                        $result = $eventClass->getEventByManager($iduser);
                        if (is_string($userData)) {
                            header('HTTP/1.1 500 Internal Server Error');
                            $responsive->generateResponsive(-1, 'Err: ' . $result, null);
                        }
                            else
                        {
                            header('HTTP/1.1 200 OK');
                            $responsive->generateResponsive(null, null, $result);
                        }
                    } else {
                        $result = $eventClass->getEventById($_GET['idevent']);
                        if (is_string($userData)) {
                            header('HTTP/1.1 500 Internal Server Error');
                            $responsive->generateResponsive(-1, 'Err: ' . $result, null);
                        }
                            else
                        {
                            header('HTTP/1.1 200 OK');
                            $responsive->generateResponsive(null, null, $result);
                        }
                    }
                }
            }
        }
            else
        {
            header('HTTP/1.1 401 Unauthorized');
            $responsive->generateResponsive(-1, 'Err: '.$iduser, null);
        }
    }
        else
    {
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
        if (isset($_INPUT['name']) &&
            isset($_INPUT['description']) &&
            isset($_INPUT['manager']) &&
            isset($_INPUT['dateInit']) &&
            isset($_INPUT['dateEnd']))
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
                    if ($userData['peso'] < 5) {
                        header('HTTP/1.1 401 Unauthorized');
                        $responsive->generateResponsive(-1, 'Err: Role level 5 or upper requiered ', null);
                    }
                        else
                    {
                        $dateInit = strtotime($_INPUT['dateInit']);
                        $dateEnd = strtotime($_INPUT['dateEnd']);
                        if ($dateInit == false || $dateEnd == false)
                        {
                            header('HTTP/1.1 500 Internal Server Error');
                            $responsive->generateResponsive(
                                -1,
                                'Err: date is invalid -> [(dateInit): ' . $_INPUT['dateInit'] . '], [(dateEnd): ' . $_INPUT['dateEnd'] .']',
                                null);
                        }
                            else
                        {
                            $eventClass = new EventService();
                            $result = $eventClass->createEvent(
                                $_INPUT['name'],
                                $_INPUT['description'],
                                $_INPUT['manager'],
                                $dateInit,
                                $dateEnd);
                            if (!is_string($result))
                            {
                                header('HTTP/1.1 200 OK');
                                $responsive->generateResponsive(null, null, $result);
                            }
                                else
                            {
                                header('HTTP/1.1 500 Internal Server Error');
                                $responsive->generateResponsive(-1, 'Err: ' . $result, null);
                            }
                        }
                    }
                }
            }
                else
            {
                header('HTTP/1.1 401 Unauthorized');
                $responsive->generateResponsive(-1, 'Err: '.$iduser, null);
            }
            echo $responsive->getJson();
        }
            else
        {
            header('HTTP/1.1 400 Bad Request');
        }
    }
        else
    {
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
        if ((isset($_INPUT['idevent']) && isset($_INPUT['description']) && isset($_INPUT['isUrl']) && isset($_INPUT['direction'])) ||
            (isset($_INPUT['idevent']) && isset($_INPUT['status'])))
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
                    if ($userData['peso'] < 5) {
                        header('HTTP/1.1 401 Unauthorized');
                        $responsive->generateResponsive(-1, 'Err: Role level 5 or upper requiered ', null);
                    }
                        else
                    {
                        $eventClass = new EventService();
                        $result = $eventClass->getEventById($_INPUT['idevent']);
                        if (is_string($result)) {
                            header('HTTP/1.1 500 Internal Server Error');
                            $responsive->generateResponsive(-1, $result, null);
                        }
                            else
                        {
                            if (count($result) > 0) {
                                $event = $result[0];
                                if ($event['encargado'] == $iduser)
                                {
                                    if (isset($_INPUT['idevent']) &&
                                        isset($_INPUT['description']) &&
                                        isset($_INPUT['isUrl']) &&
                                        isset($_INPUT['direction']))
                                    {
                                        $result = $eventClass->updateEvent(
                                            $_INPUT['idevent'],
                                            $_INPUT['description'],
                                            $_INPUT['isUrl'],
                                            $_INPUT['direction']
                                        );
                                    }
                                        else
                                    {
                                        $result = $eventClass->updateStatusEvent(
                                            $_INPUT['idevent'],
                                            $_INPUT['status']
                                        );
                                    }
                                    if (!is_string($result))
                                    {
                                        header('HTTP/1.1 200 OK');
                                        $responsive->generateResponsive(null, null, $result);
                                    }
                                        else
                                    {
                                        header('HTTP/1.1 500 Internal Server Error');
                                        $responsive->generateResponsive(-1, 'Err: ' . $result, null);
                                    }
                                }
                                    else
                                {
                                    header('HTTP/1.1 500 Internal Server Error');
                                    $responsive->generateResponsive(-1, "Err: Your not manager of this event", null);
                                }
                            }
                                else
                            {
                                header('HTTP/1.1 500 Internal Server Error');
                                $responsive->generateResponsive(-1, "Err: Event not fount", null);
                            }
                        }
                    }
                }
            }
                else
            {
                header('HTTP/1.1 401 Unauthorized');
                $responsive->generateResponsive(-1, 'Err: '.$iduser, null);
            }
            echo $responsive->getJson();
        }
            else
        {
            header('HTTP/1.1 400 Bad Request');
        }
    }
        else
    {
        header('HTTP/1.1 401 Unauthorized');
        $responsive->generateResponsive(-1, 'Err: Token Not Found', null);
        echo $responsive->getJson();
    }
}

?>