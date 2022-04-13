import React from 'react';
import {
    Avatar,
    Card,
    CardContent,
    CardHeader,
    IconButton,
    Typography,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';

export default function PostItem({ post }) {
    const [isFavorite, setIsFavorite] = React.useState(false);
    const { author_name, author_avatarurl, timestamp, content } = post;
    return (
        <Card>
            <CardHeader
                avatar={<Avatar src={author_avatarurl} />}
                title={author_name}
                subheader={new Date(timestamp).toUTCString()}
                action={
                    <IconButton
                        aria-label='settings'
                        onClick={() => setIsFavorite(!isFavorite)}
                    >
                        {isFavorite ? (
                            <FavoriteIcon />
                        ) : (
                            <FavoriteOutlinedIcon />
                        )}
                    </IconButton>
                }
            />
            <CardContent>
                <Typography variant='body2' color='text.secondary'>
                    {content}
                </Typography>
            </CardContent>
        </Card>
    );
}
