#!/usr/bin/env node
const got = require('got');
const valvelet = require('valvelet');
const fs = require('fs');
const yargs = require('yargs');

const request = valvelet(async (url) => {
  try {
    const response = await got(url);
    return JSON.parse(response.body);
  } catch (err) {
    if (err.headers['x-ratelimit-remaining'] === '0') {
      const time = parseInt(err.headers['x-ratelimit-reset']);
      console.error(`Rate limit reached try again after ${new Date(time * 1000)}`);
    } else {
      console.error(err.headers);
    }
    process.exit(1);
    throw err;
  }
}, 50, 5000);

const getFollowing = async (username) => {
  const following = await request(`https://api.github.com/users/${username}/following`);
  return following.map(a => a.login);
};

const getKey = async (username) => {
  const keys = await request(`https://api.github.com/users/${username}/gpg_keys`);
  return keys.map(key => key.raw_key).join('\n\n');
}

const run = async (username) => {
  const following = await getFollowing(username);
  const keys = await Promise.all(following.map(getKey));
  const file = keys.join('\n\n');
  fs.writeFileSync('./keys.asc', file, 'utf-8');
}

const username = yargs.argv._[0];

if (!username) {
  console.log('Usage: get-gpg-keys-from-github-followers [username]');
  process.exit();
}

run(username).catch(console.error);