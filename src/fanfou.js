#!/usr/bin/env node
import {promises as fs} from 'node:fs';
import os from 'node:os';
import process from 'node:process';
import {Buffer} from 'node:buffer';
import Fanfou from 'fanfou-sdk';
import Timeago from 'timeago.js';

const homedir = os.homedir();
const configPath = process.env.NODE_ENV === 'test' ? '/.alfred-fanfou-test/' : '/.alfred-fanfou/';
const filePath = `${homedir}${configPath}config.json`;
const arg = process.argv[2];

const base64 = {
	decode: string => Buffer.from(string, 'base64').toString(),
	encode: string => Buffer.from(string).toString('base64'),
};

const output = item => console.log(JSON.stringify(item));
const argString = base64.decode(arg);
const args = argString.split(' ');

const createConfig = async content => {
	try {
		await fs.mkdir(`${homedir}${configPath}`);
	} catch {}

	await fs.writeFile(filePath, JSON.stringify(content, null, 2));
};

const run = async () => {
	if (args[0] === 'config') {
		const [, consumerKey, consumerSecret] = args;
		await createConfig({
			consumerKey,
			consumerSecret,
		});
		console.log('配置成功！');
	} else if (args[0] === 'login') {
		const [, username, password] = args;
		const config = JSON.parse(await fs.readFile(filePath));
		const ff = new Fanfou({
			consumerKey: config.consumerKey,
			consumerSecret: config.consumerSecret,
			username,
			password,
			protocol: 'https:',
			hooks: {
				baseString: string => string.replace('https', 'http'),
			},
		});
		try {
			const {oauthToken, oauthTokenSecret} = await ff.xauth();
			config.oauthToken = oauthToken;
			config.oauthTokenSecret = oauthTokenSecret;
			await createConfig(config);
			console.log('登录成功！');
		} catch (error) {
			console.log(error.message);
		}
	} else if (['h', 'm', 'me', 'p', 'undo'].includes(args[0])) {
		const config = JSON.parse(await fs.readFile(filePath));
		const ff = new Fanfou({
			consumerKey: config.consumerKey,
			consumerSecret: config.consumerSecret,
			oauthToken: config.oauthToken,
			oauthTokenSecret: config.oauthTokenSecret,
			protocol: 'https:',
			hooks: {
				baseString: string => string.replace('https', 'http'),
			},
		});
		const count = args[1] || 10;
		const getTimeline = async uri => {
			try {
				const result = await ff.get(uri, {count});
				const timeline = [];
				for (const item of result) {
					const photo = item.photo && item.photo.originurl;

					timeline.push({
						title: item.user.name,
						subtitle: `${photo ? '[图] ' : ''}${item.text}`,
						mods: {
							cmd: {
								subtitle: (new Timeago().format(item.created_at, 'zh_CN') + ' via ' + item.source_name),
							},
						},
						text: {
							copy: item.id,
							largetype: item.plain_text,
						},
						quicklookurl: photo,
					});
				}

				output({items: timeline});
			} catch (error) {
				output({items: [{title: '饭否', subtitle: error.message}]});
			}
		};

		const undo = async () => {
			try {
				const userTimeline = await ff.get('/statuses/user_timleine', {count: 1});
				const [status = {}] = userTimeline;
				await ff.post('/statuses/destroy', {id: status.id});
				console.log('删除成功！');
			} catch (error) {
				output({items: [{title: '饭否', subtitle: error.message}]});
			}
		};

		switch (args[0]) {
			case 'h':
				getTimeline('/statuses/home_timeline');
				break;
			case 'm':
				getTimeline('/statuses/mentions');
				break;
			case 'me':
				getTimeline('/statuses/user_timeline');
				break;
			case 'p':
				getTimeline('/statuses/public_timeline');
				break;
			case 'undo':
				undo();
				break;
			default:
				break;
		}
	} else {
		const text = argString;
		const config = JSON.parse(await fs.readFile(filePath));
		const ff = new Fanfou({
			consumerKey: config.consumerKey,
			consumerSecret: config.consumerSecret,
			oauthToken: config.oauthToken,
			oauthTokenSecret: config.oauthTokenSecret,
			protocol: 'https:',
			hooks: {
				baseString: string => string.replace('https', 'http'),
			},
		});

		try {
			const result = await ff.post('/statuses/update', {status: text});
			console.log(result);
		} catch (error) {
			console.log(error.message);
		}
	}
};

run();
