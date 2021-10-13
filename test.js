import process from 'node:process';
import {Buffer} from 'node:buffer';
import test from 'ava';
import execa from 'execa';

const {
	CONSUMER_KEY,
	CONSUMER_SECRET,
	FANFOU_USERNAME,
	FANFOU_PASSWORD,
} = process.env;

process.env.NODE_ENV = 'test';

const PULL_REQUEST_FROM_FORKED = !(CONSUMER_KEY && CONSUMER_SECRET && FANFOU_USERNAME && FANFOU_PASSWORD);

const base64 = {
	encode: q => Buffer.from(q).toString('base64'),
};

const configQuery = `config ${CONSUMER_KEY} ${CONSUMER_SECRET}`;
const loginQuery = `login ${FANFOU_USERNAME} ${FANFOU_PASSWORD}`;
const postQuery = `alfred test - ${Math.random().toString(36).slice(2, 5)}`;
const homeQuery = 'h 1';

test('ff config', async t => {
	const {stdout} = await execa('./lib/fanfou.js', [base64.encode(configQuery)]);
	t.is(stdout, '配置成功！');
});

test('ff login', async t => {
	const {stdout} = await execa('./lib/fanfou.js', [base64.encode(loginQuery)]);
	if (PULL_REQUEST_FROM_FORKED) {
		t.is(stdout, 'Invalid consumer');
	} else {
		t.is(stdout, '登录成功！');
	}
});

test('ff post', async t => {
	const {stdout} = await execa('./lib/fanfou.js', [base64.encode(postQuery)]);
	if (PULL_REQUEST_FROM_FORKED) {
		t.is(stdout, 'Invalid consumer');
	} else {
		t.is(stdout, postQuery);
	}
});

test('ff me 1', async t => {
	const {stdout} = await execa('./lib/fanfou.js', [base64.encode(homeQuery)]);
	const {length} = JSON.parse(stdout).items;
	t.is(length, 1);
});
