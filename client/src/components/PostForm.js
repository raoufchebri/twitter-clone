import React from 'react';
import { Box, TextField } from '@mui/material';

export default function PostForm({ onPostSubmit }) {
    const [content, setContent] = React.useState('');

    return (
        <Box>
            <TextField
                multiline
                rows={4}
                placeholder="What's happening ?"
                variant='filled'
                fullWidth
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onSubmit={() => onPostSubmit(content)}
            />
        </Box>
    );
}
