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

// Generate random posts
async function createPosts(client, authors, LIMIT = 1000) {
    const options = {
        consistency: types.consistencies.all,
    };
    async.map(Array(LIMIT), async () => {
        while (true) {
            const author = casual.random_element(authors);
            const post = casual.post(author);
            const fields = Object.keys(post);
            const params = Object.values(post);
            const query = `INSERT INTO posts(${fields.join(
                ','
            )}) VALUES (${params.map(() => '?').join(',')})`;
            await client.execute(query, params, options);
        }
    });
}

// Read user's posts
function readPosts(client, LIMIT = 1000) {
    const query = 'SELECT * FROM posts LIMIT 100';
    const options = {
        consistency: types.consistencies.one,
    };
    async.map(Array(LIMIT), async () => {
        try {
            while (true) {
                await client.execute(query, [], options);
            }
        } catch (err) {}
    });
}

function readAuthors(client, LIMIT = 1000) {
    const query = 'SELECT * FROM authors';
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

function getPostsByAuthor(client, authors, LIMIT = 1000) {
    const query = 'SELECT * FROM posts WHERE author_name=? ALLOW FILTERING';
    async.map(Array(LIMIT), async () => {
        try {
            while (true) {
                const { author_name } = casual.random_element(authors);
                await client.execute(query, [author_name]);
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
                createPosts(client, authors);
            },
            () => {
                readPosts(client);
            },
            () => {
                readAuthors(client);
            },
            // () => {
            //     reversed(client);
            // },
            () => {
                getPostsByAuthor(client, authors);
            },
        ],
        (err) => {
            console.error(err);
        }
    );
}

main();
