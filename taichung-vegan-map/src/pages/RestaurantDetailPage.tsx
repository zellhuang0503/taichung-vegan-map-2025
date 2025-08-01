import React from 'react'
import { Box, Typography, Container } from '@mui/material'
import { useParams } from 'react-router-dom'

const RestaurantDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          餐廳詳情
        </Typography>
        <Typography variant="body1" color="text.secondary">
          餐廳ID: {id}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          這裡將顯示餐廳的詳細資訊，包含照片、菜單、評價等。
        </Typography>
      </Box>
    </Container>
  )
}

export default RestaurantDetailPage
