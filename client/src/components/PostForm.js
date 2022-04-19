import React from 'react';
import { Box, TextField } from '@mui/material';

export default function PostForm({ onPostSubmit }) {
    const [content, setContent] = React.useState('');
    const onSubmit = (e) => {
        if (e.key === 'Enter') {
            setContent('');
            onPostSubmit(content);
        }
    };
    return (
        <Box>
            <TextField
                rows={4}
                placeholder="What's happening ?"
                variant='filled'
                fullWidth
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={onSubmit}
            />
        </Box>
    );
}
