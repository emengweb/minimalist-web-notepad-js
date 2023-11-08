# Minimalist Web Notepad



This is an open-source clone of the minimalist-web-notepad, it rewrite with ChatGPT and base on Node.JS.

See php demo of minimalist-web-notepad at https://notes.orga.cat or https://notes.orga.cat/whatever.

## Installation

Make sure the web server is allowed to write to the `_tmp` directory.

## Usage (CLI)

Using the command-line interface you can both save and retrieve notes. Here are some examples using `curl`:

Retrieve a note's content and save it to a local file:

```
curl https://example.com/notes/test > test.txt
```

Save specific text to a note:

```
curl https://example.com/notes/test -d 'hello,

welcome to my pad!
'
```

Save the content of a local file (e.g., `/etc/hosts`) to a note:

```
cat /etc/hosts | curl https://example.com/notes/hosts --data-binary @-
```

## Other examples

There are git branches with examples using [Docker](https://github.com/pereorga/minimalist-web-notepad/tree/docker) and the [Web Crypto API](https://github.com/pereorga/minimalist-web-notepad/tree/encryption).


## Copyright and license

Copyright 2012 Pere Orga <pere@orga.cat>

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this work except in compliance with the License.
You may obtain a copy of the License at:

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
