import React from 'react';
import { Box } from '@mui/material';
import axios from 'axios';
import { useEffect } from 'react';
import { useState } from 'react';
import PostItem from './PostItem';
import PostForm from './PostForm';

const BASE_URL = `http://localhost:3001/api`;

export default function PostList({ user }) {
    const [posts, setPosts] = useState([]);

    const getPosts = async () => {
        const { data } = await axios.get(`${BASE_URL}/posts`);
        setPosts(data);
    };

    const onPostSubmit = async (content) => {
        const {
            id: author_id,
            name: author_name,
            avatarurl: author_avatarurl,
        } = user;
        const newPost = {
            timestamp: new Date(),
            author_id,
            author_name,
            author_avatarurl,
            content,
        };
        setPosts([newPost, ...posts]);
        // await axios.post(`${BASE_URL}/posts`, newPost);
    };

    useEffect(() => {
        getPosts();
    }, []);

    return (
        <Box>
            <PostForm onPostSubmit={onPostSubmit} />
            <Box sx={{ mt: 2 }}>
                {posts.map((post) => (
                    <Box
                        key={`${post.author_id}${post.timestamp}`}
                        sx={{ mb: 2 }}
                    >
                        <PostItem post={post} />
                    </Box>
                ))}
            </Box>
        </Box>
    );
}
