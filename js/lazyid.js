(function (root, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define(factory);
    } else {
        root.lazyid = factory();
    }
}(typeof self !== 'undefined' ? self : this, function () {
    var base64Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';

    function encode(bitString) {
        var output = '';
        for (var i = 0; i < bitString.length; i += 6) {
            var chunk = bitString.substr(i, 6);
            while (chunk.length < 6) chunk += '0';
            output += base64Chars[parseInt(chunk, 2)];
        }
        return output;
    }

    function decode(encoded) {
        var bitString = '';
        for (var i = 0; i < encoded.length; i++) {
            var index = base64Chars.indexOf(encoded.charAt(i));
            if (index === -1) throw new Error('Invalid character in ID');
            bitString += index.toString(2).padStart(6, '0');
        }
        return bitString;
    }

    function getTimestampBits() {
        var now = Date.now();
        var msBits = now.toString(2);
        return msBits.padStart(42, '0');
    }

    function generateRandomBits(length) {
        var bytes = new Uint8Array(Math.ceil(length / 8));
        if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
            crypto.getRandomValues(bytes);
        } else if (typeof require !== 'undefined') {
            require('crypto').randomFillSync(bytes);
        } else {
            throw new Error('Secure random not available.');
        }

        var bitString = '';
        for (var i = 0; i < bytes.length; i++) {
            bitString += bytes[i].toString(2).padStart(8, '0');
        }
        return bitString.substr(0, length);
    }

    function bitToTimestamp(bitString) {
        var ts = parseInt(bitString.substr(0, 42), 2);
        var date = new Date(ts);
        var pad = function (n, w) {
            return n.toString().padStart(w, '0');
        };
        return date.getFullYear() + '-' +
            pad(date.getMonth() + 1, 2) + '-' +
            pad(date.getDate(), 2) + ' ' +
            pad(date.getHours(), 2) + ':' +
            pad(date.getMinutes(), 2) + ':' +
            pad(date.getSeconds(), 2) + '.' +
            pad(ts % 1000, 3);
    }

    function lazyid(id) {
        if (!id) {
            var timestamp = getTimestampBits();
            var timestampEncoded = encode(timestamp).padStart(7, '0');

            var randBits = generateRandomBits(42);
            var randEncoded = encode(randBits);

            return timestampEncoded + randEncoded;
        } else {
            if (id.length !== 14) throw new Error('Invalid ID length');

            var tsEncoded = id.slice(0, 7);
            var randEncoded = id.slice(7, 14);

            var tsBits = decode(tsEncoded);
            var randBits = decode(randEncoded);

            return {
                timestamp: bitToTimestamp(tsBits),
                random_bit: randBits
            };
        }
    }

    return lazyid;
}));