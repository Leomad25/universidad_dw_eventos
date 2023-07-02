<?php

include 'database/sentencesSQL.php';
include "../utils/generalResponsive.php";

class DateService
{
    public function getDate(): array|string|null {
        $database = new DatabaseConn();
        if ($database->getConnection() != null)
        {
            $sentenceSQL = new SentencesSQL($database);
            $othersService = new OthersSentencesSQL($sentenceSQL);
            $result = $othersService->getDate();
            if (!is_string($result))
            {
                $result = $result[0];
            }
            return $result;
        }
        return null;
    }
}

?>