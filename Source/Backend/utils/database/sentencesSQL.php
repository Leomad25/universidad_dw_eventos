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

    public function allowedUser(int $id, bool $status): array|string
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
}

?>