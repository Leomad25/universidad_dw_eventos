<?php

include "generalResponsive.php";
include "database/connection.php";
include "database/sentencesSQL.php";
include "jwt/jwt.php";

class AuthService
{
    function loginUser(string $nick, string $pass)
    {
        $responsive = new GenerateResponsive();
        if (strlen($nick) > 0 && strlen($pass) > 0)
        {
            $database = new DatabaseConn();
            if ($database->getConnection() != null)
            {
                $userSentences = new UserSentencesSQL(new SentencesSQL($database));
                $result = $userSentences->getUserByNick($nick);
                if (!empty($result))
                {
                    $user = $result[0];
                    if ($this->passwordMach($user['contrasena'], $pass))
                    {
                        $body = array(
                            'id' => $user['idusuario'],
                            'jwt' => generateJWT($user['idusuario'], $user['documento'])
                        );
                        header('HTTP/1.1 200 OK');
                        $responsive->generateResponsive(null, null, $body);
                    } else {
                        header('HTTP/1.1 500 Internal Server Error');
                        $responsive->generateResponsive(-1, 'Err: Password not mach', null);
                    }
                } else {
                    header('HTTP/1.1 500 Internal Server Error');
                    $responsive->generateResponsive(-1, 'Err: User not found', null);
                }
            } else {
                header('HTTP/1.1 500 Internal Server Error');
                $responsive->generateResponsive(-1, 'Err: ' . $database->getErrMessage(), null);
            }
        } else {
            header('HTTP/1.1 500 Internal Server Error');
            $responsive->generateResponsive(-1, 'Err: Input params are invalid', null);
        }
        echo $responsive->getJson();
    }

    function registerUser(string $document, string $name, string $nick, string $pass)
    {
        $responsive = new GenerateResponsive();
        if (strlen($nick) > 0 && strlen($pass) > 0)
        {
            $database = new DatabaseConn();
            if ($database->getConnection() != null)
            {
                $userSentences = new UserSentencesSQL(new SentencesSQL($database));
                $result = $userSentences->getUserByNick($nick);
                if (empty($result))
                {
                    $result = $userSentences->createUser($document, $name, $nick, hash('sha256', $pass));
                    if (!empty($result))
                    {
                        if (is_string($result))
                        {
                            header('HTTP/1.1 500 Internal Server Error');
                            $responsive->generateResponsive(-1, 'Err: ' . $result, null);
                        } else {
                            $result = $result[0];
                            $userId = $result['idusuario'];
                            $roleUserSentences = new RolesUsersSentencesSQL(new SentencesSQL($database));
                            $roleSentences = new RolesSentencesSQL(new SentencesSQL($database));
                            $result = $roleSentences->getRoleByTag('asistente');
                            if (!empty($result)) {
                                $result = $result[0];
                                $roleId = $result['idrole'];
                                $result = $roleUserSentences->createRoleUser($userId, $roleId);
                                header('HTTP/1.1 200 OK');
                                $responsive->generateResponsive(null, null, array(
                                    'created' => true,
                                    'role' => true
                                ));
                            } else {
                                header('HTTP/1.1 200 OK');
                                $responsive->generateResponsive(null, null, array(
                                    'created' => true,
                                    'role' => false
                                ));
                            }
                        }
                    } else {
                        header('HTTP/1.1 500 Internal Server Error');
                        $responsive->generateResponsive(-1, 'Err: User creation failed', null);
                    }
                } else {
                    header('HTTP/1.1 500 Internal Server Error');
                    $responsive->generateResponsive(-1, 'Err: User already exist', null);
                }
            } else {
                header('HTTP/1.1 500 Internal Server Error');
                $responsive->generateResponsive(-1, 'Err: ' . $database->getErrMessage(), null);
            }
        } else {
            header('HTTP/1.1 500 Internal Server Error');
            $responsive->generateResponsive(-1, 'Err: Input params are invalid', null);
        }
        echo $responsive->getJson();
    }

    private function passwordMach(string $passStore, string $pass): bool
    {
        $encrypt = strtoupper(hash('sha256', $pass));
        if ($passStore == $encrypt) return true;
        return false;
    }
}

?>