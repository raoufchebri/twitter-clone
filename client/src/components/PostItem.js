import {
    Avatar,
    Card,
    CardContent,
    CardHeader,
    Typography,
} from '@mui/material';
import { red } from '@mui/material/colors';
import React from 'react';

export default function PostItem({ post }) {
    const { author_name, author_avatarurl, timestamp, content } = post;
    return (
        <Card>
            <CardHeader
                avatar={<Avatar src={author_avatarurl} />}
                title={author_name}
                subheader={new Date(timestamp).toUTCString()}
            />
            <CardContent>
                <Typography variant='body2' color='text.secondary'>
                    {content}
                </Typography>
            </CardContent>
        </Card>
    );
}
