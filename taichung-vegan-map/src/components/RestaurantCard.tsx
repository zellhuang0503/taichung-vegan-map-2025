import React from 'react';
import { Box, Typography, Card, CardContent, CardMedia, Chip, Rating } from '@mui/material';

interface RestaurantCardProps {
  restaurant: {
    name: string;
    imageUrl: string;
    rating: number;
    reviewCount: number;
    description: string;
    tags: string[];
  };
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant }) => {
  return (
    <Card sx={{ display: 'flex', mb: 2, transition: '0.3s', '&:hover': { boxShadow: 6, transform: 'scale(1.02)' } }}>
      <CardMedia
        component="img"
        sx={{ width: 151 }}
        image={restaurant.imageUrl}
        alt={restaurant.name}
      />
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ flex: '1 0 auto' }}>
          <Typography component="div" variant="h6">
            {restaurant.name}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', my: 1 }}>
            <Rating name="read-only" value={restaurant.rating} precision={0.5} readOnly />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
              ({restaurant.reviewCount} 則評論)
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" paragraph sx={{ 
              display: '-webkit-box',
              '-webkit-line-clamp': '2',
              '-webkit-box-orient': 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}>
            {restaurant.description}
          </Typography>
          <Box>
            {restaurant.tags.map((tag) => (
              <Chip key={tag} label={`#${tag}`} size="small" sx={{ mr: 1, mt: 1 }} />
            ))}
          </Box>
        </CardContent>
      </Box>
    </Card>
  );
};

export default RestaurantCard;
