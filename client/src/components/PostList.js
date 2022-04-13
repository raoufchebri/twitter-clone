import React from 'react';
import { Box } from '@mui/material';
import axios from 'axios';
import { useEffect } from 'react';
import { useState } from 'react';
import PostItem from './PostItem';

const BASE_URL = `http://localhost:3001/api`;

export default function PostList() {
    const [posts, setPosts] = useState([]);

    const getPosts = async () => {
        const { data } = await axios.get(`${BASE_URL}/posts`);
        setPosts(data);
    };

    useEffect(() => {
        getPosts();
    }, []);

    return (
        <Box>
            {posts.map((post) => (
                <Box key={`${post.author_id}${post.timestamp}`} sx={{ mb: 2 }}>
                    <PostItem post={post} />
                </Box>
            ))}
        </Box>
    );
}
