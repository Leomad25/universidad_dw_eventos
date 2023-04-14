<?php

class DatabaseConn {
    private ?PDO $connection = null;
    private ?string $errMessage = null;

    private array $configDatabase = array(
        'host' => 'localhost:3306',
        'db' => 'uni_dw_eventos',
        'user' => 'unidmeventos.pa',
        'pass' => 'public_access'
    );

    public function __construct()
    {
        try {
            $this->connection = new PDO(
                'mysql:host=' . $this->configDatabase['host'] . ';dbname=' . $this->configDatabase['db'],
                $this->configDatabase['user'],
                $this->configDatabase['pass']
            );
            $this->connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (PDOException $e) {
            $this->connection = null;
            $this->errMessage = $e->getMessage();
        }
    }

    public function getConnection() 
    {
        return $this->connection;
    }

    public function getErrMessage() 
    {
        return $this->errMessage;
    }
}


?>