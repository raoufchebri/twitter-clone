const async = require('async');
const { getClientWithKeyspace, options } = require('./db');
const { log } = require('./helpers');

function getPosts(client, LIMIT = 1000) {
    const query = 'SELECT * FROM posts LIMIT 500';
    let count = 0;
    async.map(Array(LIMIT), async () => {
        while (true) {
            try {
                const { rows } = await client.execute(query, [], options);
                count += 1;
                log(`Get posts: ${count}, posts found: ${rows.length}`);
            } catch (err) {}
        }
    });
}

async function main() {
    const client = getClientWithKeyspace();
    getPosts(client);
}

main();
