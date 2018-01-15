# alfred-fanfou

[![Greenkeeper badge](https://badges.greenkeeper.io/LitoMore/alfred-fanfou.svg)](https://greenkeeper.io/)
[![](https://img.shields.io/travis/LitoMore/alfred-fanfou/master.svg)](https://travis-ci.org/LitoMore/alfred-fanfou)
[![](https://img.shields.io/npm/v/alfred-fanfou.svg)](https://www.npmjs.com/package/alfred-fanfou)
[![](https://img.shields.io/npm/l/alfred-fanfou.svg)](https://github.com/LitoMore/alfred-fanfou/blob/master/LICENSE)
[![](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

Alfred 3 workflow for Fanfou

<div align="center"><img width="75%" height="75%" src="https://raw.githubusercontent.com/LitoMore/alfred-fanfou/master/screenshot.png" alt="alfred-fanfou" /></div>

## Installation

```bash
$ npm install -g alfred-fanfou
```

> Require [Node.js](https://nodejs.org/) >=6 and the Alfred [Powerpack](https://www.alfredapp.com/powerpack/).

## Config & Login

1. Config your [App](https://fanfou.com/apps)

```
ff config CONSUMER_KEY CONSUMER_SECRET
```

2. Login your fanfou account

```
ff login USERNAME PASSWORD
```

## Usage

```bash
ff SAY HELLO      # post status
ff h [count]      # show home-timeline
ff m [count]      # show mentions
ff me [count]     # show user-timeline
ff p [count]      # show public-timeline
ff undo           # delete last status
```

In timeline mode, hold <kbd>Command</kdb> to display additional information.

## Related

- [fanfou-sdk](https://github.com/LitoMore/fanfou-sdk-node) - Fanfou SDK for Node.js

## License

MIT © [LitoMore](https://github.com/LitoMore)
