'use strict'

const test = require('ava')
const execa = require('execa')

const {
  CONSUMER_KEY,
  CONSUMER_SECRET,
  FANFOU_USERNAME,
  FANFOU_PASSWORD
} = process.env

const base64 = {
  encode: (q) => {
    return Buffer.from(q).toString('base64')
  }
}

const configQuery = `config ${CONSUMER_KEY} ${CONSUMER_SECRET}`
const loginQuery = `login ${FANFOU_USERNAME} ${FANFOU_PASSWORD}`
const postQuery = `alfred test - ${Math.random().toString(36).substr(2, 5)}`

test('ff config', async t => {
  const {stdout} = await execa('./fanfou.js', [base64.encode(configQuery)])
  t.is(stdout, '配置成功！')
})

test('ff login', async t => {
  const {stdout} = await execa('./fanfou.js', [base64.encode(loginQuery)])
  t.is(stdout, '登录成功！')
})

test('ff post', async t => {
  const {stdout} = await execa('./fanfou.js', [base64.encode(postQuery)])
  t.is(stdout, postQuery)
})
