#!/usr/bin/env node
'use strict'

const fs = require('fs')
const os = require('os')
const importLazy = require('import-lazy')(require)

const Fanfou = importLazy('fanfou-sdk')
const Timeago = importLazy('timeago.js')

const homedir = os.homedir()
const configPath = process.env.NODE_ENV === 'test' ? '/.alfred-fanfou-test/' : '/.alfred-fanfou/'
const filePath = `${homedir}${configPath}config.json`
const arg = process.argv[2]

const base64 = {
  decode: str => Buffer.from(str, 'base64').toString(),
  encode: str => Buffer.from(str).toString('base64')
}

const output = item => console.log(JSON.stringify(item))
const argStr = base64.decode(arg)
const args = argStr.split(' ')

const createConfig = content => {
  try {
    fs.mkdirSync(`${homedir}${configPath}`)
  } catch (err) {}

  fs.writeFileSync(filePath, JSON.stringify(content, null, 2))
}

if (args[0] === 'config') {
  const [, consumerKey, consumerSecret] = args
  createConfig({
    consumer_key: consumerKey,
    consumer_secret: consumerSecret
  })
  console.log('配置成功！')
} else if (args[0] === 'login') {
  const [, username, password] = args
  const config = require(filePath)
  const ff = new Fanfou({
    authType: 'xauth',
    consumerKey: config.consumer_key,
    consumerSecret: config.consumer_secret,
    username,
    password,
    protocol: config.https ? 'https:' : 'http:',
    hooks: {
      baseString: str => config.https ? str.replace('https', 'http') : str
    }
  });
  (async () => {
    try {
      const {oauthToken, oauthTokenSecret} = await ff.xauth()
      config.oauth_token = oauthToken
      config.oauth_token_secret = oauthTokenSecret
      createConfig(config)
      console.log('登录成功！')
    } catch (err) {
      console.log(err.message)
    }
  })()
} else if (['h', 'm', 'me', 'p', 'undo'].indexOf(args[0]) === -1) {
  const text = argStr
  const config = require(filePath)
  const ff = new Fanfou({
    consumerKey: config.consumer_key,
    consumerSecret: config.consumer_secret,
    oauthToken: config.oauth_token,
    oauthTokenSecret: config.oauth_token_secret,
    protocol: config.https ? 'https:' : 'http:',
    hooks: {
      baseString: str => config.https ? str.replace('https', 'http') : str
    }
  });

  (async () => {
    try {
      const res = await ff.post('/statuses/update', {status: text})
      console.log(res)
    } catch (err) {
      console.log(err.message)
    }
  })()
} else {
  const config = require(filePath)
  const ff = new Fanfou({
    consumerKey: config.consumer_key,
    consumerSecret: config.consumer_secret,
    oauthToken: config.oauth_token,
    oauthTokenSecret: config.oauth_token_secret,
    protocol: config.https ? 'https:' : 'http:',
    hooks: {
      baseString: str => config.https ? str.replace('https', 'http') : str
    }
  })
  const count = args[1] || 10
  const getTimeline = async uri => {
    try {
      const res = await ff.get(uri, {count})
      const timeline = []
      res.forEach(item => {
        const photo = item.photo && item.photo.largeurl

        timeline.push({
          title: item.user.name,
          subtitle: `${photo ? '[图] ' : ''}${item.text}`,
          mods: {
            cmd: {
              subtitle: (new Timeago().format(item.created_at, 'zh_CN') + ' via ' + item.source_name)
            }
          },
          text: {
            copy: item.id,
            largetype: item.plain_text
          },
          quicklookurl: photo
        })
      })
      output({items: timeline})
    } catch (err) {
      output({items: [{title: '饭否', subtitle: err.message}]})
    }
  }

  const undo = async () => {
    try {
      const userTimeline = await ff.get('/statuses/user_timleine', {count: 1})
      const [status = {}] = userTimeline
      await ff.post('/statuses/destroy', {id: status.id})
      console.log('删除成功！')
    } catch (err) {
      output({items: [{title: '饭否', subtitle: err.message}]})
    }
  }

  switch (args[0]) {
    case 'h':
      getTimeline('/statuses/home_timeline')
      break
    case 'm':
      getTimeline('/statuses/mentions')
      break
    case 'me':
      getTimeline('/statuses/user_timeline')
      break
    case 'p':
      getTimeline('/statuses/public_timeline')
      break
    case 'undo':
      undo()
      break
    default:
      break
  }
}
