const async = require('async');
const { getClientWithKeyspace, options } = require('./db');
const { log } = require('./helpers');

function getAuthors(client, LIMIT = 1000) {
    const query = 'SELECT * FROM authors';
    let count = 0;
    async.map(Array(LIMIT), async () => {
        while (true) {
            try {
                const { rows } = await client.execute(query, [], options);
                count += 1;
                log(
                    `Get authors count: ${count}, authors found: ${rows.length}`
                );
            } catch (err) {}
        }
    });
}

async function main() {
    const client = getClientWithKeyspace();
    getAuthors(client);
}

main();
