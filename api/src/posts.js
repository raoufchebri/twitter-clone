const async = require('async');
const casual = require('casual');
const axios = require('axios');
const { getClientWithKeyspace } = require('./db');
require('dotenv').config();
const { types } = require('cassandra-driver');

const PORT = process.env.PORT || 3001;
const BASE_URL = `http://localhost:${PORT}/api`;

casual.define('post', ({ id, name, avatarurl }) => ({
    author_id: id,
    author_name: name,
    author_avatarurl: avatarurl,
    timestamp: new Date(),
    content: casual.sentences(casual.integer(1, 4)),
}));

function getInsertParams(tableName, values) {
    const fields = Object.keys(values);
    const query = `INSERT INTO ${tableName}(${fields.join(
        ','
    )}) VALUES (${fields.map(() => '?').join(',')})`;
    const params = Object.values(values);
    return { query, params };
}

function getRandomPost(authors) {
    const author = casual.random_element(authors);
    const post = casual.post(author);
    return post;
}

async function nonPrepared(client, authors, LIMIT = 1000) {
    console.log('NonPrepared ...');
    async.map(Array(LIMIT), async () => {
        while (true) {
            const post = getRandomPost(authors);
            const { query, params } = getInsertParams('posts', post);
            await client.execute(query, params);
        }
    });
}

function nonPaged(client, LIMIT = 100) {
    console.log('NonPaged ...');
    const query = 'SELECT * FROM posts LIMIT 1000';
    async.map(Array(LIMIT), async () => {
        try {
            while (true) {
                // client.stream ...
                await client.execute(query);
            }
        } catch (err) {}
    });
}

function bypassCache(client, LIMIT = 100) {
    console.log('BYPASS CACHE ...');
    const query = 'SELECT * FROM posts LIMIT 1000 BYPASS CACHE';
    async.map(Array(LIMIT), async () => {
        try {
            while (true) {
                await client.execute(query);
            }
        } catch (err) {}
    });
}

function reversed(client, LIMIT = 1000) {
    const query = 'SELECT author_name FROM posts ORDERBY timestamp LIMIT 100';
    let count = 0;
    async.map(Array(LIMIT), async () => {
        try {
            while (true) {
                await client.execute(query);
                count += 1;
                process.stdout.clearLine();
                process.stdout.cursorTo(0);
                process.stdout.write(`reversed: ${count}`);
            }
        } catch (err) {}
    });
}

function consistencyLevelRead(client, LIMIT = 1000) {
    const readQueryClOne = 'SELECT * FROM posts LIMIT 100';
    const options = {
        consistency: types.consistencies.one,
        prepare: true,
    };
    async.map(Array(LIMIT), async () => {
        try {
            while (true) {
                await client.execute(readQueryClOne, [], options);
                console.log('done');
            }
        } catch (err) {}
    });
}

function consistencyLevelWrite(client, authors, LIMIT = 1000) {
    const options = {
        consistency: types.consistencies.all,
        prepare: true,
    };
    async.map(Array(LIMIT), async () => {
        try {
            while (true) {
                const post = getRandomPost(authors);
                const { query, params } = getInsertParams('posts', post);
                await client.execute(query, params, options);
            }
        } catch (err) {}
    });
}

function allowFiltering(client, authors, LIMIT = 1000) {
    const query = 'SELECT * FROM posts WHERE author_id=?';
    async.map(Array(LIMIT), async () => {
        try {
            while (true) {
                const { author_id } = casual.random_element(authors);
                await client.execute(query, [author_id]);
            }
        } catch (err) {
            console.log(err);
        }
    });
}

async function main() {
    const client = getClientWithKeyspace();
    const { data: authors } = await axios.get(`${BASE_URL}/authors`);
    async.parallel(
        [
            () => {
                nonPrepared(client, authors);
            },
            () => {
                allowFiltering(client, authors);
            },
            // () => {
            //     nonPaged(client);
            // },
            // () => {
            //     reversed(client);
            // },
            () => {
                consistencyLevelRead(client);
            },
            () => {
                consistencyLevelWrite(client, authors);
            },
            // () => {
            //     bypassCache(client);
            // },
        ],
        (err) => {
            console.error(err);
        }
    );
}

main();
