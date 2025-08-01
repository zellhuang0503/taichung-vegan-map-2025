import React from 'react';
import { Box, Typography, Grid, Card, CardMedia, CardContent, CardActionArea, Link } from '@mui/material';

// 模擬的指南文章資料
const guides = [
  {
    id: 1,
    title: '台中必吃的10間寂靜素食',
    author: '編輯團隊',
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-2850a86b2bda?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 2,
    title: '文青風格蔬食地圖',
    author: '美食家陳小姐',
    imageUrl: 'https://images.unsplash.com/photo-1590763021898-82357a4f1370?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 3,
    title: '一個人也能享受的靜心料理',
    author: '旅人作家 A.K.',
    imageUrl: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?q=80&w=800&auto=format&fit=crop',
  },
];

const GuidesSection: React.FC = () => {
  return (
    <Box sx={{ py: 8, bgcolor: 'grey.50' }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h2" component="h2" gutterBottom sx={{
          fontSize: '1.875rem',
          fontWeight: 'bold',
          fontFamily: 'Georgia, serif', // 模擬 font-serif
        }}>
          深度報導 | GUIDES
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          由美食家與編輯團隊為您精心挑選的專題
        </Typography>
      </Box>
      <Grid container spacing={4} justifyContent="center">
        {guides.map((guide) => (
          <Grid item xs={12} md={4} key={guide.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }} elevation={0}>
              <CardActionArea sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <CardMedia
                  component="img"
                  height="192"
                  image={guide.imageUrl}
                  alt={guide.title}
                  sx={{ width: '100%' }}
                />
                <CardContent sx={{ flexGrow: 1, width: '100%' }}>
                  <Typography gutterBottom variant="h5" component="h3" sx={{ fontWeight: 'bold', fontFamily: 'Georgia, serif' }}>
                    {guide.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    by {guide.author}
                  </Typography>
                  <Link href="#" underline="hover" color="primary" sx={{ fontWeight: 'bold' }}>
                    閱讀更多 &rarr;
                  </Link>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default GuidesSection;
