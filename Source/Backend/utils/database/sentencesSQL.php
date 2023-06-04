<?php

include_once('connection.php');

class SentencesSQL
{
    private ?DatabaseConn $databaseConn = null;

    public function __construct(DatabaseConn $databaseConn)
    {
        $this->databaseConn = $databaseConn;
    }

    public function createSentence(string $sql): PDOStatement|false
    {
        $conn = $this->databaseConn->getConnection();
        return $conn->prepare($sql);
    }

    public function getResult(PDOStatement $sentence): array|string
    {
        try {
            $sentence->execute();
            $sentence->setFetchMode(PDO::FETCH_ASSOC);
            return $sentence->fetchAll();
        } catch(PDOException $err) {
            return $err->getMessage();
        }
    }
}

class UserSentencesSQL
{
    private ?SentencesSQL $sentencesSQL = null;

    public function __construct(SentencesSQL $sentencesSQL)
    {
        $this->sentencesSQL = $sentencesSQL;
    }

    public function createUser(string $document, string $name, string $nick, string $pass): array|string
    {
        $sql = 'CALL `uni_dw_eventos`.`usuarios.create`(:document, :name, :nick, :pass)';
        $sentence = $this->sentencesSQL->createSentence($sql);
        $sentence->bindParam(':document', $document);
        $sentence->bindParam(':name', $name);
        $sentence->bindParam(':nick', $nick);
        $sentence->bindParam(':pass', $pass);
        return $this->sentencesSQL->getResult($sentence);
    }

    public function getUserById(int $id): array|string
    {
        $sql = 'CALL `uni_dw_eventos`.`usuarios.getById`(:id)';
        $sentence = $this->sentencesSQL->createSentence($sql);
        $sentence->bindParam(':id', $id);
        return $this->sentencesSQL->getResult($sentence);
    }

    public function getUserByNick(string $nick): array|string
    {
        $sql = 'CALL `uni_dw_eventos`.`usuarios.getByNick`(:nick)';
        $sentence = $this->sentencesSQL->createSentence($sql);
        $sentence->bindParam(':nick', $nick);
        return $this->sentencesSQL->getResult($sentence);
    }

    public function getUserByNickWhitRole(string $nick): array|string
    {
        $sql = 'CALL `uni_dw_eventos`.`usuarios.getByNick.WhitRole`(:nick)';
        $sentence = $this->sentencesSQL->createSentence($sql);
        $sentence->bindParam(':nick', $nick);
        return $this->sentencesSQL->getResult($sentence);
    }

    public function getUsersByNick(string $nick): array|string
    {
        $sql = 'CALL `uni_dw_eventos`.`usuarios.getUsersByNick`(:nick)';
        $sentence = $this->sentencesSQL->createSentence($sql);
        $sentence->bindValue(':nick', '%'.$nick.'%', PDO::PARAM_STR);
        return $this->sentencesSQL->getResult($sentence);
    }

    public function setAllowedUser(int $id, bool $status): array|string
    {
        $sql = 'CALL `uni_dw_eventos`.`usuarios.setAllowed`(:id, :status)';
        $sentence = $this->sentencesSQL->createSentence($sql);
        $sentence->bindValue(':id', $id, PDO::PARAM_INT);
        $sentence->bindValue(':status', $status, PDO::PARAM_BOOL);
        return $this->sentencesSQL->getResult($sentence);
    }
}

class RolesUsersSentencesSQL
{
    private ?SentencesSQL $sentencesSQL = null;

    public function __construct(SentencesSQL $sentencesSQL)
    {
        $this->sentencesSQL = $sentencesSQL;
    }

    public function createRoleUser(int $userId, int $roleId): array|string
    {
        $sql = 'CALL `uni_dw_eventos`.`roles_usuarios.create`(:userId, :roleId)';
        $sentence = $this->sentencesSQL->createSentence($sql);
        $sentence->bindValue(':userId', $userId, PDO::PARAM_INT);
        $sentence->bindValue(':roleId', $roleId, PDO::PARAM_INT);
        return $this->sentencesSQL->getResult($sentence);
    }

    public function getRoleIdByIdUser(int $userId): array|string
    {
        $sql = 'CALL `uni_dw_eventos`.`roles_usuarios.getByUser`(:userId)';
        $sentence = $this->sentencesSQL->createSentence($sql);
        $sentence->bindValue(':userId', $userId, PDO::PARAM_INT);
        return $this->sentencesSQL->getResult($sentence);
    }

    public function changueRoleUser(int $iduser, int $idrole, int $asigned): array|string
    {
        $sql = 'CALL `uni_dw_eventos`.`roles_usuarios.updateRole`(:iduser, :idrole, :asigned)';
        $sentence = $this->sentencesSQL->createSentence($sql);
        $sentence->bindValue(':iduser', $iduser, PDO::PARAM_INT);
        $sentence->bindValue(':idrole', $idrole, PDO::PARAM_INT);
        $sentence->bindValue(':asigned', $asigned, PDO::PARAM_INT);
        return $this->sentencesSQL->getResult($sentence);
    }
}

class RolesSentencesSQL
{
    private ?SentencesSQL $sentencesSQL = null;

    public function __construct(SentencesSQL $sentencesSQL)
    {
        $this->sentencesSQL = $sentencesSQL;
    }

    public function getRoleByTag(string $tag): array|string
    {
        $sql = 'CALL `uni_dw_eventos`.`roles.getByTag`(:tag)';
        $sentence = $this->sentencesSQL->createSentence($sql);
        $sentence->bindValue(':tag', $tag, PDO::PARAM_STR);
        return $this->sentencesSQL->getResult($sentence);
    }

    public function getRoleById(int $idRole): array|string
    {
        $sql = 'CALL `uni_dw_eventos`.`roles.getById`(:idRole)';
        $sentence = $this->sentencesSQL->createSentence($sql);
        $sentence->bindValue(':idRole', $idRole, PDO::PARAM_INT);
        return $this->sentencesSQL->getResult($sentence);
    }

    public function getAllRoles(): array|string
    {
        $sql = 'CALL `uni_dw_eventos`.`roles.getAll`()';
        $sentence = $this->sentencesSQL->createSentence($sql);
        return $this->sentencesSQL->getResult($sentence);
    }
}

class EventsSentencesSQL
{
    private ?SentencesSQL $sentencesSQL = null;

    public function __construct(SentencesSQL $sentencesSQL)
    {
        $this->sentencesSQL = $sentencesSQL;
    }

    public function createEvent(string $name, string $description, int $manager, int $dateInit, int $dateEnd): array|string
    {
        $sql = 'CALL `uni_dw_eventos`.`eventos.create`(:name, :description, :manager, :dateInit, :dateEnd, :timeInit, :timeEnd)';
        $sentence = $this->sentencesSQL->createSentence($sql);
        $sentence->bindValue(':name', $name, PDO::PARAM_STR);
        $sentence->bindValue(':description', $description, PDO::PARAM_STR);
        $sentence->bindValue(':manager', $manager, PDO::PARAM_STR);
        $sentence->bindValue(':dateInit', date('Y-m-d', $dateInit), PDO::PARAM_STR);
        $sentence->bindValue(':dateEnd', date('Y-m-d', $dateEnd), PDO::PARAM_STR);
        $sentence->bindValue(':timeInit', date('H:i:s', $dateInit), PDO::PARAM_STR);
        $sentence->bindValue(':timeEnd', date('H:i:s', $dateEnd), PDO::PARAM_STR);
        return $this->sentencesSQL->getResult($sentence);
    }

    public function getEventByManager(int $manager): array | string
    {
        $sql = 'CALL `uni_dw_eventos`.`eventos.getByManager`(:manager)';
        $sentence = $this->sentencesSQL->createSentence($sql);
        $sentence->bindValue(':manager', $manager, PDO::PARAM_INT);
        return $this->sentencesSQL->getResult($sentence);
    }

    public function getEventById(int $idEvent): array | string
    {
        $sql = 'CALL `uni_dw_eventos`.`eventos.getById`(:idEvent)';
        $sentence = $this->sentencesSQL->createSentence($sql);
        $sentence->bindValue(':idEvent', $idEvent, PDO::PARAM_INT);
        return $this->sentencesSQL->getResult($sentence);
    }

    public function updateEvent(int $idevent, string $description, bool $isUrl, string $direction): array | string
    {
        $sql = 'CALL `uni_dw_eventos`.`eventos.update`(:idevent, :description, :direction, :isUrl)';
        $sentence = $this->sentencesSQL->createSentence($sql);
        $sentence->bindValue(':idevent', $idevent, PDO::PARAM_INT);
        $sentence->bindValue(':description', $description, PDO::PARAM_STR);
        $sentence->bindValue(':direction', $direction, PDO::PARAM_STR);
        $sentence->bindValue(':isUrl', $isUrl, PDO::PARAM_BOOL);
        return $this->sentencesSQL->getResult($sentence);
    }

    public function updateStatusEvent(int $idevent, int $status): array | string
    {
        $sql = 'CALL `uni_dw_eventos`.`eventos.setStatus`(:idevent, :status)';
        $sentence = $this->sentencesSQL->createSentence($sql);
        $sentence->bindValue(':idevent', $idevent, PDO::PARAM_INT);
        $sentence->bindValue(':status', $status, PDO::PARAM_INT);
        return $this->sentencesSQL->getResult($sentence);
    }
}

?>