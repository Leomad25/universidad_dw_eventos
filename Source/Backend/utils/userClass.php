<?php

include "generalResponsive.php";

class User
{

}

class UserService
{
    public function createUser(string $document, string $name, string $nick, string $pass)
    {
        $responsive = new GenerateResponsive();
        if (strlen($document) > 0 &&
            strlen($name) > 0 &&
            strlen($nick) > 0 &&
            strlen($pass) > 0)
        {
            header('HTTP/1.1 200 OK');
            echo $responsive->getJson();
        } else {
            header('HTTP/1.1 500 Internal Server Error');
            $responsive->generateResponsive(-1, 'Err: Input params are invalid', null);
            echo $responsive->getJson();
        }
        
    }

    public function getUser(string $nick)
    {
        $responsive = new GenerateResponsive();
        if (strlen($nick) > 0)
        {
            header('HTTP/1.1 200 OK');
            echo $responsive->getJson();
        } else {
            header('HTTP/1.1 500 Internal Server Error');
            $responsive->generateResponsive(-1, 'Err: Input params are invalid', null);
            echo $responsive->getJson();
        }
    }

    public function allowedUser(int $id, bool $status)
    {
        $responsive = new GenerateResponsive();
        header('HTTP/1.1 200 OK');
        echo $responsive->getJson();
    }
}

?>