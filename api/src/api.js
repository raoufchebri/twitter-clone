const express = require('express');
const { createRandomAuthor } = require('./authors');
const { getClientWithKeyspace } = require('./db');
const router = express.Router();

const client = getClientWithKeyspace();

router.get('/', (_, res) => res.json({ message: 'Welcome to API' }));

router.get('/posts', async (_, res) => {
    const { rows } = await client.execute('SELECT * FROM posts LIMIT 100');
    res.json(rows);
});

router.get('/authors', async (_, res) => {
    const { rows } = await client.execute('SELECT * FROM authors');
    res.json(rows);
});

router.get('/author/:id', (_, res) => {
    const author = createRandomAuthor();
    res.json(author);
});

module.exports = router;
