<?php

include "../../vendor/autoload.php";

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

function getJwtKey(): string {
    return 'secret_key';
}

function generateJWT(int $id, string $document): string
{
    $now = strtotime("now");
    $payload = [
        'exp' => $now + (3600*24),
        'data' => [
            'iduser' => $id,
            'document' => $document
        ]
    ];
    return JWT::encode($payload, getJwtKey(), 'HS256');
}

function isValidJWT(string $jwt): bool|string
{
    $jwt = str_replace('Bearer ', '', $jwt);
    try {
        JWT::decode($jwt, new Key(getJwtKey(), 'HS256'));
        return true;
    } catch (Exception $err) {
        return $err->getMessage();
    }
    
}

?>