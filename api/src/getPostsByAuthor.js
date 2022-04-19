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

function getPostsByAuthor(client, authors, LIMIT = 1000) {
    const query = 'SELECT * FROM posts WHERE author_name=? ALLOW FILTERING';
    let count = 0;
    async.map(Array(LIMIT), async () => {
        while (true) {
            try {
                const { name } = casual.random_element(authors);
                await client.execute(query, [name], options);
                count += 1;
                log(`Get posts by author count: ${count}, name = ${name}`);
            } catch (err) {}
        }
    });
}

async function main() {
    const client = getClientWithKeyspace();
    const { data: authors } = await axios.get(`${BASE_URL}/authors`);
    getPostsByAuthor(client, authors);
}

main();
