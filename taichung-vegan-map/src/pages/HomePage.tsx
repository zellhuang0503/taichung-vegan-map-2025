import React from 'react'
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Stack
} from '@mui/material'
import { RateReview as RateReviewIcon } from '@mui/icons-material'
import MapView from '../components/MapView'

const HomePage: React.FC = () => {
  const sampleRestaurants = [
    {
      id: '1',
      name: '綠色天堂素食餐廳',
      lat: 24.1369,
      lng: 120.6869,
      address: '台中市西區公益路123號',
      phone: '04-1234-5678',
      rating: 4.5,
      priceLevel: 2,
      vegetarianType: '全素'
    },
    {
      id: '2',
      name: '養生素食坊',
      lat: 24.1400,
      lng: 120.6900,
      address: '台中市西區美村路456號',
      phone: '04-8765-4321',
      rating: 4.2,
      priceLevel: 1,
      vegetarianType: '蛋奶素'
    },
    {
      id: '3',
      name: '禪悅素食',
      lat: 24.1340,
      lng: 120.6840,
      address: '台中市西區忠明南路789號',
      phone: '04-2468-1357',
      rating: 4.7,
      priceLevel: 3,
      vegetarianType: '五辛素'
    }
  ]

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* 地圖區塊 */}
      <Box sx={{ height: '400px', mb: 4 }}>
        <MapView 
          restaurants={sampleRestaurants}
          zoom={15}
          showUserLocation={true}
        />
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box textAlign="center" mb={6}>
          <Typography variant="h2" component="h1" gutterBottom color="primary">
            台中素食地圖
          </Typography>
          <Typography variant="h5" color="text.secondary" paragraph>
            探索台中最完整的素食餐廳
          </Typography>
        </Box>

        <Stack spacing={3} direction="row" flexWrap="wrap" justifyContent="center">
          {sampleRestaurants.map((restaurant) => (
            <Card key={restaurant.id} sx={{ width: 300, mb: 2 }}>
              <CardContent>
                <Typography variant="h6" component="h3">
                  {restaurant.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {restaurant.address}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  類型：{restaurant.vegetarianType}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Stack>

        <Box textAlign="center" mt={4}>
          <Button
            variant="contained"
            size="large"
            href="/restaurants"
            sx={{ mr: 2 }}
          >
            查看所有餐廳
          </Button>
          <Button
            variant="outlined"
            size="large"
            startIcon={<RateReviewIcon />}
            href="/write-review"
          >
            撰寫食記
          </Button>
        </Box>
      </Container>
    </Box>
  )
}

export default HomePage
