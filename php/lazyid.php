
<?php

function lazyid($id = null) {
    $base64Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';

    $encode = function (string $bitString) use ($base64Chars) {
        $output = '';
        for ($i = 0; $i < strlen($bitString); $i += 6) {
            $chunk = substr($bitString, $i, 6);
            $chunk = str_pad($chunk, 6, '0', STR_PAD_RIGHT);
            $output .= $base64Chars[bindec($chunk)];
        }
        return $output;
    };

    $decode = function (string $encoded) use ($base64Chars) {
        $bitString = '';
        for ($i = 0; $i < strlen($encoded); $i++) {
            $index = strpos($base64Chars, $encoded[$i]);
            if ($index === false) throw new Exception("Invalid character in ID");
            $bitString .= str_pad(decbin($index), 6, '0', STR_PAD_LEFT);
        }
        return $bitString;
    };

    $getTimestamp = function () {
        return str_pad(decbin((int)(microtime(true) * 1000)), 42, '0', STR_PAD_LEFT);
    };

    $generateRandomBit = function ($length) {
        $bytes = random_bytes((int)ceil($length / 8));
        $bitString = '';
        foreach (unpack('C*', $bytes) as $byte) {
            $bitString .= str_pad(decbin($byte), 8, '0', STR_PAD_LEFT);
        }
        return substr($bitString, 0, $length);
    };

    $bitToTimestamp = function ($bitString) {
        $timestampMs = bindec(substr($bitString, 0, 42));
        $seconds = floor($timestampMs / 1000);
        $milliseconds = $timestampMs % 1000;

        $dt = new DateTime("@$seconds");
        $dt->setTimezone(new DateTimeZone(date_default_timezone_get()));
        $dt = DateTime::createFromFormat(
            'U.u',
            sprintf('%d.%03d000', $seconds, $milliseconds)
        );
        $dt->setTimezone(new DateTimeZone(date_default_timezone_get()));
        return $dt;
    };

    if ($id === null) {
        $timestamp = $getTimestamp();
        $timestampEncoded = str_pad($encode($timestamp), 7, '0', STR_PAD_LEFT);

        $rand = $generateRandomBit(42);
        $randEncoded = $encode($rand);

        return $timestampEncoded . $randEncoded;
    } else {
        if (strlen($id) !== 14) throw new Exception("Invalid ID length");

        $tsEncoded = substr($id, 0, 7);
        $randEncoded = substr($id, 7, 7);

        $timestampBit = $decode($tsEncoded);
        $randomBit = $decode($randEncoded);

        return [
            'timestamp' => $bitToTimestamp($timestampBit),
            'random_bit' => $randomBit
        ];
    }
}
