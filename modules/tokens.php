<?php

/*
 * This is a generic class to manage game pieces.
 *
 * On DB side this is based on a standard table with the following fields:
 * token_key (string), token_location (string), token_state (int)
 *
 *
 * CREATE TABLE IF NOT EXISTS `token` (
 * `token_key` varchar(32) NOT NULL,
 * `token_location` varchar(32) NOT NULL,
 * `token_state` int(10),
 * PRIMARY KEY (`token_key`)
 * ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
 *
 *
 */
class TokenCounter extends APP_GameClass {
    var $table;

    function __construct() {
        $this->table = 'token';
    }

    // MUST be called before any other method if db table is not called 'token'
    function init($table) {
        $this->table = $table;
    }
    
    // This inserts new records in the database. Generically speaking you should only be calling during setup with some
    // rare exceptions.
    //
    // Tokens is an array with at least the following fields:
    // array(
    //      array(                              // This is my first token
    //          "key" => <unique key>           // This unique alphanum and underscore key
    //          "nbr" => <nbr>                  // Count of these tokens
    function createTokens($tokens) {
        $values = array ();
        $keys = array ();

        foreach ( $tokens as $token_info ) {
            $key = $token_info['key'];
            $nbr = $token_info['nbr'];

            self::checkKey($key);
            self::checkPosInt($nbr);

            $values [] = "( '$key', '$nbr' )";
            $keys [] = $key;
        }

        $sql = "INSERT INTO " . $this->table . " (token_key,token_nbr)";
        $sql .= " VALUES " . implode(",", $values);
        $this->DbQuery($sql);

        return $keys;
    }

    final static function checkPosInt($key) {
        if ($key && preg_match("/^[0-9]+$/", $key) == 0) {
            throw new feException("must be integer number");
        }
    }

    final static function checkKey($key, $like = false) {
        if ($key == null)
            throw new feException("key cannot be null");
        if (!is_string($key))
                throw new feException("key is not a string");
        $extra = "";
        if ($like)
            $extra = "%";
        if (preg_match("/^[A-Za-z_0-9{$extra}]+$/", $key) == 0) {
            throw new feException("key must be alphanum and underscore non empty string '$key'");
        }
    }
}