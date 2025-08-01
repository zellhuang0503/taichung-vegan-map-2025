import React from 'react';
import { Box, Typography } from '@mui/material';

const ExplorePage: React.FC = () => {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        探索餐廳
      </Typography>
      <Typography>
        這裡是餐廳列表與地圖的頁面，我們將在這裡逐步建立篩選器、餐廳卡片和地圖視圖。
      </Typography>
    </Box>
  );
};

export default ExplorePage;
