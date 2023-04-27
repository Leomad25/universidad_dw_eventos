<?php

include "generalResponsive.php";
include "database/connection.php";
include "database/sentencesSQL.php";

class UserService
{
    private function validateUserExistsById(UserSentencesSQL $userSentences, int $id): bool
    {
        $result = $userSentences->getUserById($id);
        if (!empty($result)) return true;
        return false;
    }

    private function validateUserExistsByNick(UserSentencesSQL $userSentences, string $nick): bool
    {
        $result = $userSentences->getUserByNick($nick);
        if (!empty($result)) return true;
        return false;
    }

    public function createUser(string $document, string $name, string $nick, string $pass)
    {
        $responsive = new GenerateResponsive();
        if (strlen($document) > 0 &&
            strlen($name) > 0 &&
            strlen($nick) > 0 &&
            strlen($pass) > 0)
        {
            $database = new DatabaseConn();
            if ($database->getConnection() != null)
            {
                $userSentences = new UserSentencesSQL(new SentencesSQL($database));
                if ($this->validateUserExistsByNick($userSentences, $nick)) {
                    header('HTTP/1.1 500 Internal Server Error');
                    $responsive->generateResponsive(-1, "Err: User already exists", null);
                } else {
                    header('HTTP/1.1 200 OK');
                    $result = $userSentences->createUser($document, $name, $nick, $pass);
                    $responsive->generateResponsive(null, null, $result);
                }
                echo $responsive->getJson();
            } else {
                header('HTTP/1.1 500 Internal Server Error');
                $responsive->generateResponsive(-1, 'Err: ' . $database->getErrMessage(), null);
                echo $responsive->getJson();
            }
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
            $database = new DatabaseConn();
            if ($database->getConnection() != null)
            {
                $userSentences = new UserSentencesSQL(new SentencesSQL($database));
                $result = $userSentences->getUserByNick($nick);
                if (!empty($result))
                {
                    header('HTTP/1.1 200 OK');
                    $responsive->generateResponsive(null, null, $result);
                } else {
                    header('HTTP/1.1 500 Internal Server Error');
                    $responsive->generateResponsive(-1, 'Err: User not found', null);
                }
                echo $responsive->getJson();
            } else {
                header('HTTP/1.1 500 Internal Server Error');
                $responsive->generateResponsive(-1, 'Err: ' . $database->getErrMessage(), null);
                echo $responsive->getJson();
            }
        } else {
            header('HTTP/1.1 500 Internal Server Error');
            $responsive->generateResponsive(-1, 'Err: Input params are invalid', null);
            echo $responsive->getJson();
        }
    }

    public function allowedUser(int $id, bool $status)
    {
        $responsive = new GenerateResponsive();
        $database = new DatabaseConn();
        if ($database->getConnection() != null)
        {
            $userSentences = new UserSentencesSQL(new SentencesSQL($database));
                if ($this->validateUserExistsById($userSentences, $id)) {
                    header('HTTP/1.1 200 OK');
                    $result = $userSentences->allowedUser($id, $status);
                    $responsive->generateResponsive(null, null, $result);
                } else {
                    header('HTTP/1.1 500 Internal Server Error');
                    $responsive->generateResponsive(-1, "Err: User not found", null);
                }
                echo $responsive->getJson();
        } else {
            header('HTTP/1.1 500 Internal Server Error');
            $responsive->generateResponsive(-1, 'Err: ' . $database->getErrMessage(), null);
            echo $responsive->getJson();
        }
    }
}

?>