const express = require('express');
const { getClientWithKeyspace } = require('./db');
const router = express.Router();

const client = getClientWithKeyspace();

router.get('/', (req, res) => res.json({ message: 'Welcome to API' }));

router.get('/posts', async (req, res) => {
    const { rows } = await client.execute('SELECT * FROM posts LIMIT 100');
    res.json(rows);
});

router.get('/authors', async (req, res) => {
    const { rows } = await client.execute('SELECT * FROM authors');
    res.json(rows);
});

module.exports = router;
