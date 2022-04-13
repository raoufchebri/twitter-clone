const cassandra = require('cassandra-driver');
require('dotenv').config();

const { NODE_IP, DATA_CENTER, USERNAME, PASSWORD, KEYSPACE } = process.env;

const getClient = (keyspace) => {
    const cluster = new cassandra.Client({
        contactPoints: [NODE_IP],
        localDataCenter: DATA_CENTER,
        credentials: { username: USERNAME, password: PASSWORD },
        keyspace,
    });
    return cluster;
};

const getClientWithKeyspace = () => {
    return getClient(KEYSPACE);
};

module.exports = { getClient, getClientWithKeyspace };
