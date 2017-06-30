#!/usr/bin/env node
'use strict'
const fs = require('fs')
const path = require('path')
const homedir = require('homedir')
const Fanfou = require('fanfou-sdk')
const isProduction = !fs.existsSync(path.join(__dirname, '.gitignore'))
const configPath = isProduction ? '/.alfred-fanfou/' : '/.alfred-fanfou-dev/'
const filePath = `${homedir()}${configPath}config.json`
const arg = process.argv[2]
const argStr = Buffer.from(arg, 'base64').toString()
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
