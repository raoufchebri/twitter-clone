const casual = require('casual');
const { getClientWithKeyspace } = require('./db');
const async = require('async');

const SPRITES = [
    'male',
    'female',
    'human',
    'identicon',
    'initials',
    'bottts',
    'avataaars',
    'jdenticon',
    'gridy',
    'micah',
];

const BASE_AVATAR_URL = 'https://avatars.dicebear.com/api';

casual.define('author', () => ({
    id: casual.uuid,
    name: casual.full_name,
    avatarurl: `${BASE_AVATAR_URL}/${casual.random_element(
        SPRITES
    )}/${casual.first_name.toLowerCase()}.svg`,
}));

async function createAuthors(LIMIT = 1000) {
    const client = getClientWithKeyspace();
    let author_count = 0;
    await async.map(Array(LIMIT), async () => {
        const author = casual.author;
        const query = `INSERT INTO authors(${Object.keys(author).join(
            ', '
        )}) VALUES (${Object.values(author)
            .map((value) => '?')
            .join(', ')})`;
        const params = Object.values(author);
        await client.execute(query, params);
        author_count += 1;
        process.stdout.clearLine();
        process.stdout.cursorTo(0);
        process.stdout.write(`Authors created: ${author_count}`);
    });
    return client;
}

createAuthors().then((client) => client.shutdown());
