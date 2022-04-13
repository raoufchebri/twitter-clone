CREATE TABLE IF NOT EXISTS twitter.authors
(
    id UUID,
    name TEXT,
    avatarurl TEXT,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS twitter.posts
(
    author_id UUID,
    author_name TEXT,
    author_avatarurl TEXT,
    timestamp TIMESTAMP,
    content TEXT,
    PRIMARY KEY (author_id, timestamp)
);