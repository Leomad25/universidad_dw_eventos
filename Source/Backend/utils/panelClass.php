<?php

include 'database/connection.php';
include 'database/sentencesSQL.php';

class UserService
{
    public function getUser(int $id): array|string|null
    {
        if ($id > 0)
        {
            $database = new DatabaseConn();
            if ($database->getConnection() != null)
            {
                $sentenceSQL = new SentencesSQL($database);
                $userSentences = new UserSentencesSQL($sentenceSQL);
                $roleUserSentences = new RolesUsersSentencesSQL($sentenceSQL);
                $roleSentences = new RolesSentencesSQL($sentenceSQL);
                $result = $userSentences->getUserById($id);
                if (!is_string($result))
                {
                    $userData = $result[0];
                    $result = $roleUserSentences->getRoleIdByIdUser($id);
                    if (!is_string($result))
                    {
                        $userData = $userData + $result[0];
                        $idRole = $userData['idrole'];
                        $result = $roleSentences->getRoleById($idRole);
                        if (!is_string($result))
                        {
                            $userData = array_merge($userData, $result[0]);
                            unset($userData['contrasena']);
                            unset($userData['id_role_usuario']);
                            return $userData;
                        }
                    }
                }
                return $result;
            }
        }
        return null;
    }

    public function getUserByNickWhitRole(int $id, string $nick): int | array | string
    {
        if ($id > 0)
        {
            $database = new DatabaseConn();
            if ($database->getConnection() != null)
            {
                $sentenceSQL = new SentencesSQL($database);
                $userSentences = new UserSentencesSQL($sentenceSQL);
                $roleUserSentences = new RolesUsersSentencesSQL($sentenceSQL);
                $roleSentences = new RolesSentencesSQL($sentenceSQL);
                
                $result = $roleUserSentences->getRoleIdByIdUser($id);
                if (is_string($result)) return $result;
                $result = $result[0];
                
                $result = $roleSentences->getRoleById($result['idrole']);
                if (is_string($result)) return $result;
                $result = $result[0];

                if ($result['peso'] != 9) return 'Err: ACCESS DENIED';
                
                $result = $userSentences->getUserByNickWhitRole($nick);
                if (!is_string($result) && count($result) > 0) return $result[0];
                return "Err: User not Found";
            }
        } else {
            return -1;
        }
    }

    public function getUsersByNick(int $id, string $nick): int | array | string
    {
        if ($id > 0)
        {
            $database = new DatabaseConn();
            if ($database->getConnection() != null)
            {
                $sentenceSQL = new SentencesSQL($database);
                $userSentences = new UserSentencesSQL($sentenceSQL);
                $roleUserSentences = new RolesUsersSentencesSQL($sentenceSQL);
                $roleSentences = new RolesSentencesSQL($sentenceSQL);
                
                $result = $roleUserSentences->getRoleIdByIdUser($id);
                if (is_string($result)) return $result;
                $result = $result[0];
                
                $result = $roleSentences->getRoleById($result['idrole']);
                if (is_string($result)) return $result;
                $result = $result[0];

                if ($result['peso'] != 9) return 'Err: ACCESS DENIED';
                
                $result = $userSentences->getUsersByNick($nick);
                return $result;
            }
        } else {
            return -1;
        }
    }

    public function setAllowedUser(int $iduser, bool $status): array | string
    {
        $database = new DatabaseConn();
        if ($database->getConnection() != null)
        {
            $userSentences = new UserSentencesSQL(new SentencesSQL($database));
            $result = $userSentences->setAllowedUser($iduser, $status);
            return $result;
        }
    }
}

class RoleService {
    public function getAllRoles(): array | string
    {
        $database = new DatabaseConn();
        if ($database->getConnection() != null)
        {
            $roleSentences = new RolesSentencesSQL(new SentencesSQL($database));
            $result = $roleSentences->getAllRoles();
            return $result;
        }
    }
}

class RoleUserService {
    public function changeRoleUser(int $iduser, int $idrole, int $asigned): array | string
    {
        $database = new DatabaseConn();
        if ($database->getConnection() != null)
        {
            $roleUserSentences = new RolesUsersSentencesSQL(new SentencesSQL($database));
            $result = $roleUserSentences->changueRoleUser($iduser, $idrole, $asigned);
            return $result;
        }
    }
}

class EventService {
    public function createEvent(string $name, string $description, int $manager, int $dateInit, int $dateEnd): array | string
    {
        $database = new DatabaseConn();
        if ($database->getConnection() != null)
        {
            $eventsSentences = new EventsSentencesSQL(new SentencesSQL($database));
            $result = $eventsSentences->createEvent($name, $description, $manager, $dateInit, $dateEnd);
            return $result;
        }
    }

    public function getEventByManager(int $manager): array | string
    {
        $database = new DatabaseConn();
        if ($database->getConnection() != null)
        {
            $eventsSentences = new EventsSentencesSQL(new SentencesSQL($database));
            $result = $eventsSentences->getEventByManager($manager);
            return $result;
        }
    }

    public function getEventById(int $idEvent): array | string
    {
        $database = new DatabaseConn();
        if ($database->getConnection() != null)
        {
            $eventsSentences = new EventsSentencesSQL(new SentencesSQL($database));
            $result = $eventsSentences->getEventById($idEvent);
            return $result;
        }
    }

    public function updateEvent(int $idevent, string $description, bool $isUrl, string $direction): array | string
    {
        $database = new DatabaseConn();
        if ($database->getConnection() != null)
        {
            $eventsSentences = new EventsSentencesSQL(new SentencesSQL($database));
            $result = $eventsSentences->updateEvent($idevent, $description, $isUrl, $direction);
            return $result;
        }
    }

    public function updateStatusEvent(int $idevent, int $status): array | string
    {
        $database = new DatabaseConn();
        if ($database->getConnection() != null)
        {
            $eventsSentences = new EventsSentencesSQL(new SentencesSQL($database));
            $result = $eventsSentences->updateStatusEvent($idevent, $status);
            return $result;
        }
    }
}

?>