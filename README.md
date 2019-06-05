# alfred-fanfou

[![Greenkeeper badge](https://badges.greenkeeper.io/LitoMore/alfred-fanfou.svg)](https://greenkeeper.io/)
[![](https://img.shields.io/travis/LitoMore/alfred-fanfou/master.svg)](https://travis-ci.org/LitoMore/alfred-fanfou)
[![](https://img.shields.io/npm/v/alfred-fanfou.svg)](https://www.npmjs.com/package/alfred-fanfou)
[![](https://img.shields.io/npm/l/alfred-fanfou.svg)](https://github.com/LitoMore/alfred-fanfou/blob/master/LICENSE)
[![](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/xojs/xo)

Alfred 3 workflow for Fanfou

<div align="center"><img width="75%" height="75%" src="https://raw.githubusercontent.com/LitoMore/alfred-fanfou/master/screenshot.png" alt="alfred-fanfou" /></div>

## Install

### Using npm

```bash
$ npm i -g alfred-fanfou
```

> Require [Node.js](https://nodejs.org/) >=8 and the Alfred [Powerpack](https://www.alfredapp.com/powerpack/).

### Manually

Download from [Packal](http://www.packal.org/workflow/alfred-fanfou), then drag this workflow file to your Alfred.

---

<a href="https://www.patreon.com/LitoMore">
  <img src="https://c5.patreon.com/external/logo/become_a_patron_button@2x.png" width="160">
</a>

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

In timeline mode:

- Hold <kbd>Command</kbd> to display additional information.
- Press <kbd>Command + L</kbd> to preview full status.
- Press <kbd>Command + C</kbd> to copy status ID to clipboard.
- Press <kbd>Shift</kbd> or <kbd>Command + Y</kbd> to quick look a photo.

## Related

- [fanfou-sdk](https://github.com/LitoMore/fanfou-sdk-node) - Fanfou SDK for Node.js

## License

MIT © [LitoMore](https://github.com/LitoMore)
