#!/usr/bin/env node

'use strict'

const fs = require('fs')
const homedir = require('homedir')
const Fanfou = require('fanfou-sdk')

const configPath = process.env.NODE_ENV === 'test' ? '/.alfred-fanfou-test/' : '/.alfred-fanfou/'
const filePath = `${homedir()}${configPath}config.json`
const arg = process.argv[2]

const base64 = {
  decode: str => Buffer.from(str, 'base64').toString(),
  encode: str => Buffer.from(str).toString('base64')
}

const output = item => console.log(JSON.stringify(item))
const argStr = base64.decode(arg)
const args = argStr.split(' ')

const createConfig = (content) => {
  return new Promise((resolve, reject) => {
    fs.mkdir(`${homedir()}${configPath}`, () => {
      fs.writeFileSync(filePath, JSON.stringify(content, null, 2))
      resolve(content)
    })
  })
}

if (args[0] === 'config') {
  const consumerKey = args[1]
  const consumerSecret = args[2]
  const cf = async () => {
    await createConfig({
      consumer_key: consumerKey,
      consumer_secret: consumerSecret
    })
    console.log('配置成功！')
  }
  cf()
} else if (args[0] === 'login') {
  const username = args[1]
  const password = args[2]
  const config = require(filePath)
  const ff = new Fanfou({
    auth_type: 'xauth',
    consumer_key: config.consumer_key,
    consumer_secret: config.consumer_secret,
    username: username,
    password: password
  })
  ff.xauth(async (e, res) => {
    if (e) console.log(e.message)
    else {
      const oauthToken = res.oauth_token
      const oauthTokenSecret = res.oauth_token_secret
      config.oauth_token = oauthToken
      config.oauth_token_secret = oauthTokenSecret
      await createConfig(config)
      console.log('登录成功！')
    }
  })
} else if (['h', 'm', 'me', 'p', 'undo'].indexOf(args[0]) !== -1) {
  const config = require(filePath)
  const ff = new Fanfou({
    auth_type: 'oauth',
    consumer_key: config.consumer_key,
    consumer_secret: config.consumer_secret,
    oauth_token: config.oauth_token,
    oauth_token_secret: config.oauth_token_secret
  })
  const count = args[1] || 10

  const getTimeline = uri => {
    ff.get(uri, {count}, (err, res) => {
      if (err) output({items: [{title: '饭否', subtitle: err.message}]})
      else {
        const timeline = []
        res.forEach(item => {
          timeline.push({title: item.user.name, subtitle: item.text})
        })
        output({items: timeline})
      }
    })
  }

  const undo = () => {
    ff.get('/statuses/user_timeline', {count: 1}, (err, res) => {
      if (err) output({items: [{title: '饭否', subtitle: err.message}]})
      else {
        const status = res[0] || {}
        ff.post('/statuses/destroy', {id: status.id}, (err, res) => {
          if (err) output({items: [{title: '饭否', subtitle: err.message}]})
          else console.log('删除成功！')
        })
      }
    })
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
} else {
  const text = argStr
  const config = require(filePath)
  const ff = new Fanfou({
    auth_type: 'oauth',
    consumer_key: config.consumer_key,
    consumer_secret: config.consumer_secret,
    oauth_token: config.oauth_token,
    oauth_token_secret: config.oauth_token_secret
  })
  ff.post('/statuses/update', {status: text}, (err, res) => {
    if (err) console.log(err.message)
    else console.log(res.text)
  })
}