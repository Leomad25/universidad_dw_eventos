<?php

// autoload_static.php @generated by Composer

namespace Composer\Autoload;

class ComposerStaticInit63b667f033e1c5a12fdbbe4fe3709025
{
    public static $prefixLengthsPsr4 = array (
        'F' => 
        array (
            'Firebase\\JWT\\' => 13,
        ),
    );

    public static $prefixDirsPsr4 = array (
        'Firebase\\JWT\\' => 
        array (
            0 => __DIR__ . '/..' . '/firebase/php-jwt/src',
        ),
    );

    public static $classMap = array (
        'Composer\\InstalledVersions' => __DIR__ . '/..' . '/composer/InstalledVersions.php',
    );

    public static function getInitializer(ClassLoader $loader)
    {
        return \Closure::bind(function () use ($loader) {
            $loader->prefixLengthsPsr4 = ComposerStaticInit63b667f033e1c5a12fdbbe4fe3709025::$prefixLengthsPsr4;
            $loader->prefixDirsPsr4 = ComposerStaticInit63b667f033e1c5a12fdbbe4fe3709025::$prefixDirsPsr4;
            $loader->classMap = ComposerStaticInit63b667f033e1c5a12fdbbe4fe3709025::$classMap;

        }, null, ClassLoader::class);
    }
}
