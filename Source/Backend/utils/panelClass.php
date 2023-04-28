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
}

?>