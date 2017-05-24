const fs = require('fs')
const homedir = require('homedir')
const Fanfou = require('fanfou-sdk')
const filePath = `${homedir()}/.alfred-fanfou/config.json`
const arg = process.argv[2]
const argStr = Buffer.from(arg, 'base64').toString()
const args = argStr.split(' ')

if (args[0] === 'config') {
  const consumerKey = args[1]
  const consumerSecret = args[2]

  createConfig({
    consumer_key: consumerKey,
    consumer_secret: consumerSecret
  })
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
  ff.xauth((e, res) => {
    if (!e) {
      const oauthToken = res.oauth_token
      const oauthTokenSecret = res.oauth_token_secret
      config.oauth_token = oauthToken
      config.oauth_token_secret = oauthTokenSecret
      createConfig(config)
    }
  })
} else {
  const text = argStr
  console.log(text)
  const config = require(filePath)

  const ff = new Fanfou({
    auth_type: 'oauth',
    consumer_key: config.consumer_key,
    consumer_secret: config.consumer_secret,
    oauth_token: config.oauth_token,
    oauth_token_secret: config.oauth_token_secret
  })

  ff.post('/statuses/update', {status: text}, () => {})
}

function createConfig (content) {
  fs.mkdir(`${homedir()}/.alfred-fanfou/`, () => {
    fs.writeFileSync(filePath, JSON.stringify(content))
  })
}
