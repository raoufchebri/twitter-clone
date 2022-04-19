const async = require('async');
const casual = require('casual');
const axios = require('axios');
const { getClientWithKeyspace, options } = require('./db');
require('dotenv').config();
const { log } = require('./helpers');

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
    let count = 0;
    async.map(Array(LIMIT), async () => {
        while (true) {
            try {
                const author = casual.random_element(authors);
                const post = casual.post(author);
                const fields = Object.keys(post);
                const params = Object.values(post);
                const query = `INSERT INTO posts(${fields.join(
                    ','
                )}) VALUES (${params.map(() => '?').join(',')})`;
                await client.execute(query, params, options);
                count += 1;
                log(`Created posts: ${count}`);
            } catch (err) {}
        }
    });
}

async function main() {
    const client = getClientWithKeyspace();
    const { data: authors } = await axios.get(`${BASE_URL}/authors`);
    createPosts(client, authors);
}

main();
