import React from 'react';
import { Box, Typography, Grid, Card, CardContent, Avatar, Link } from '@mui/material';

// 模擬的用戶食記資料
const reviews = [
  {
    id: 1,
    username: '旅食小光',
    location: '森林旁邊',
    content: '這家氣氛超棒，餐點精緻又美味，尤其是他們的招牌猴頭菇排，絕對會再訪的口袋名單！',
    images: [
      'https://images.unsplash.com/photo-1567529990293-6e39b9d2b3f2?q=80&w=400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?q=80&w=400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1484980972926-ed5a6c54165e?q=80&w=400&auto=format&fit=crop',
    ],
  },
  {
    id: 2,
    username: 'Vegan Jenny',
    location: '斐得蔬食',
    content: '驚為天人的美味！完全顛覆我對素食的想像，每一道菜都充滿創意，CP值很高的選擇。',
    images: [
      'https://images.unsplash.com/photo-1470337458703-46ad1756a187?q=80&w=400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?q=80&w=400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?q=80&w=400&auto=format&fit=crop',
    ],
  },
  {
    id: 3,
    username: '老饕張大哥',
    location: '善齋',
    content: '傳統口味的經典，炒飯跟麵疙瘩都很有水準，是家庭聚餐的好地方，價格也很實惠。',
    images: [
      'https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1543339308-43e59d6b70a6?q=80&w=400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1594179047519-f6469a4c5f8a?q=80&w=400&auto=format&fit=crop',
    ],
  },
  {
    id: 4,
    username: '艾蜜莉',
    location: 'Veganday',
    content: '他們的純素甜點太強了！蛋糕跟肉桂捲都好好吃，完全吃不出來沒有蛋奶，一定會為了甜點再來。',
    images: [
      'https://images.unsplash.com/photo-1587314168485-3236d6710814?q=80&w=400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?q=80&w=400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1528740096961-3798add19cb7?q=80&w=400&auto=format&fit=crop',
    ],
  },
];

const ReviewsSection: React.FC = () => {
  return (
    <Box sx={{ py: 8 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h2" component="h2" gutterBottom sx={{
          fontSize: '1.875rem',
          fontWeight: 'bold',
          fontFamily: 'Georgia, serif', // 模擬 font-serif
        }}>
          社群食記 | REVIEWS
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          來自真實用戶的最新美食體驗
        </Typography>
      </Box>
      <Grid container spacing={2} justifyContent="center">
        {reviews.map((review) => (
          <Grid item xs={12} sm={6} lg={3} key={review.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }} elevation={0} variant="outlined">
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar src={`https://i.pravatar.cc/40?u=user${review.id}`} sx={{ width: 40, height: 40, mr: 2 }} />
                  <Box>
                    <Typography variant="subtitle1" component="div" sx={{ fontWeight: 'bold' }}>
                      {review.username}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      @ {review.location}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body2" sx={{ mb: 2, minHeight: '3rem' }}>
                  "{review.content}"
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {review.images.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`review-${review.id}-${index}`}
                      style={{ width: '32%', height: 'auto', borderRadius: 4 }}
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ReviewsSection;
