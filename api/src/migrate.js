const { getClient } = require('./db');
const cql = require('./cql');

async function main() {
    console.log('Bootstrapping database...');
    const client = getClient();
    console.log('Creating keyspace...');
    await client.execute(cql.KEYSPACE);
    console.log('Keyspace created');
    console.log('Migrating database...');
    for (const query of cql.MIGRATE) {
        console.log(`query = ${query}`);
        await client.execute(query);
    }
    console.log('Database migrated');

    return client;
}

main().then((client) => client.shutdown());
