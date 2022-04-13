import React from 'react';
import { Box, IconButton, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

export default function PostForm() {
    return (
        <Box>
            <TextField
                multiline
                rows={4}
                placeholder="What's happening ?"
                variant='filled'
                fullWidth
            />
        </Box>
    );
}
