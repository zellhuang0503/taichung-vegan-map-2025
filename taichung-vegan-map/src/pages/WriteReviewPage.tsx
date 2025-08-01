import React from 'react'
import { Box, Typography, Container } from '@mui/material'

const WriteReviewPage: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          撰寫食記
        </Typography>
        <Typography variant="body1" color="text.secondary">
          這裡將提供豐富的文字編輯器，讓您分享用餐體驗。
        </Typography>
      </Box>
    </Container>
  )
}

export default WriteReviewPage
