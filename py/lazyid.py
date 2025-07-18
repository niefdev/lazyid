import time
import random
import datetime

BASE64_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"

def _encode(bit_string):
    output = ''
    for i in range(0, len(bit_string), 6):
        chunk = bit_string[i:i+6].ljust(6, '0')
        index = int(chunk, 2)
        output += BASE64_CHARS[index]
    return output

def _decode(encoded):
    bit_string = ''
    for ch in encoded:
        if ch not in BASE64_CHARS:
            raise ValueError("Invalid character in ID")
        index = BASE64_CHARS.index(ch)
        bit_string += bin(index)[2:].zfill(6)
    return bit_string

def _get_timestamp_bits():
    ms = int(time.time() * 1000)
    return bin(ms)[2:].zfill(42)

def _generate_random_bits(length):
    bits = ''
    for _ in range((length + 7) // 8):
        byte = random.getrandbits(8)
        bits += bin(byte)[2:].zfill(8)
    return bits[:length]

def _bit_to_timestamp(bit_string):
    ts_ms = int(bit_string[:42], 2)
    seconds = ts_ms // 1000
    milliseconds = ts_ms % 1000
    dt = datetime.datetime.fromtimestamp(seconds)
    return dt.strftime('%Y-%m-%d %H:%M:%S') + '.' + str(milliseconds).zfill(3)

def lazyid(id=None):
    if id is None:
        timestamp_bits = _get_timestamp_bits()
        timestamp_encoded = _encode(timestamp_bits).rjust(7, '0')

        rand_bits = _generate_random_bits(42)
        rand_encoded = _encode(rand_bits)

        return timestamp_encoded + rand_encoded
    else:
        if len(id) != 14:
            raise ValueError("Invalid ID length")

        ts_encoded = id[:7]
        rand_encoded = id[7:]

        ts_bits = _decode(ts_encoded)
        rand_bits = _decode(rand_encoded)

        return {
            'timestamp': _bit_to_timestamp(ts_bits),
            'random_bit': rand_bits
        }
