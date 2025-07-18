# LazyId

[![npm version](https://img.shields.io/npm/v/lazyid)](https://www.npmjs.com/package/lazyid)
[![PyPI version](https://img.shields.io/pypi/v/lazyid)](https://pypi.org/project/lazyid/)
[![Packagist version](https://img.shields.io/packagist/v/niefdev/lazyid)](https://packagist.org/packages/niefdev/lazyid)
[![License](https://img.shields.io/github/license/niefdev/lazyid)](LICENSE)

Minimal 14-character URL-safe unique ID generator based on millisecond timestamp and cryptographically secure random bits.

## Overview

LazyId is a lightweight, cross-platform library for generating and parsing 14-character, URL-safe unique identifiers. Each ID encodes a 42-bit timestamp (milliseconds since Unix epoch, UTC) and a 42-bit cryptographically secure random value, using a custom Base64 alphabet (`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_`). 

No external dependencies. Consistent output across JavaScript, Python, and PHP.

## Features

- **Compact**: Generates 14-character IDs using a URL-safe Base64 alphabet.
- **Timestamp-Based**: Embeds a 42-bit timestamp (milliseconds since 1970-01-01 UTC).
- **Cryptographic Random**: 42 bits of secure random data.
- **Cross-Platform**: Identical output in JavaScript, Python, and PHP.
- **Reversible**: Extract the original timestamp from any ID.
- **No Dependencies**: Uses only standard libraries.
- **Practically Collision-Free**: Safe for massive scale.

## Installation

### JavaScript (Node.js or Browser)
Install via npm:
```bash
npm install lazyid
```

### Python
Install via PyPI:
```bash
pip install lazyid
```

### PHP
Install via Composer:
```bash
composer require niefdev/lazyid
```

## Usage

### JavaScript
```javascript
const lazyid = require("lazyid");

let id = lazyid();
let data = lazyid(id);

// e.g.

// {
//   timestamp: 2025-07-18T00:41:54.579Z,
//   random_bit: '000001100000101000000100000111001001011101'
// }
```

### Python
```python
from lazyid import lazyid

id = lazyid()
data = lazyid('ZgZJT4smNKOm1p')

# e.g.

# {'timestamp': datetime.datetime(2025, 7, 18, 7, 32, 38, 500000), 'random_bit': '000110011101110011001100100101010001011011'}
```

### PHP
```php
<?php
require 'vendor/autoload.php';

use function LazyID\lazyid;

$id = lazyid();
$data = lazyid($id);

// e.g.

// array(2) {
//   ["timestamp"]=>
//   object(DateTime)#7 (3) {
//     ["date"]=>
//     string(26) "2025-07-18 00:38:00.254000"
//     ["timezone_type"]=>
//     int(3)
//     ["timezone"]=>
//     string(3) "UTC"
//   }
//   ["random_bit"]=>
//   string(42) "110101011111010111101110011100111101010000"
// }
```

## API Reference

### `lazyid([id: string])`
- **Generate**: Call with no arguments to create a new LazyId string.
- **Parse**: Call with an ID string to extract `{ timestamp, random_bit }`.

**Returns:**
- **JavaScript**: `string` (generate) or `{ timestamp: string, random_bit: string }` (parse)
- **Python**: `str` (generate) or `{ 'timestamp': str, 'random_bit': str }` (parse)
- **PHP**: `string` (generate) or `[ 'timestamp' => string, 'random_bit' => string ]` (parse)

**Throws:** Error if the input string is invalid.

## Structure of LazyId

- **Total Bits**: 84 bits
- **Timestamp**: 42 bits (milliseconds since 1970-01-01 UTC), reversible without loss.
- **Random Data**: 42 bits (cryptographically secure)
- **Encoding**: Custom Base64 (`A-Z`, `a-z`, `0-9`, `-`, `_`)
- **Length**: 14 characters (84 bits encoded)

## Notes

- **Timezone**: All timestamps are UTC+0. Use `toISOString()` in JS, `datetime.utcfromtimestamp()` in Python, and ISO8601 in PHP.
- **Random Quality**: Uses cryptographic random generation (`crypto.randomBytes`, `os.urandom`, `random_bytes`) with no fallback.
- **Interoperability**: IDs generated in one language can be parsed in another.

## Collision Resistance

Combines 42-bit time + 42-bit cryptographic randomness. Practically impossible to collide, even across distributed systems. Safe for use as database keys, slugs, file names, or event IDs.

## Contributing

Contributions welcome! Please submit issues or pull requests to the GitHub repository.

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/your-feature`).
3. Commit changes (`git commit -m 'Add your feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request.

## Issues

Report bugs or request features at https://github.com/niefdev/lazyid/issues.

## License

MIT © [niefdev](https://github.com/niefdev)

## Author

Developed by **niefdev**

## Version

Current version: **1.0.0**

## Repository

Source code: https://github.com/niefdev/lazyid

## Homepage

Learn more: https://github.com/niefdev/lazyid#readme