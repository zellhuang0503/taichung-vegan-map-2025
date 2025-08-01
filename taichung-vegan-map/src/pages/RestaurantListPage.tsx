import React from 'react'
import { Box, Typography, Container } from '@mui/material'

const RestaurantListPage: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          餐廳列表
        </Typography>
        <Typography variant="body1" color="text.secondary">
          這裡將顯示台中地區的素食餐廳列表，包含篩選和搜尋功能。
        </Typography>
      </Box>
    </Container>
  )
}

export default RestaurantListPage
