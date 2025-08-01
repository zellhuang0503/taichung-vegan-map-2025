import React, { useEffect, useState } from 'react'
import { Box, Typography, Button, Grid, Card, CardContent, Container } from '@mui/material'
import { MapPin, Search, Star, Users } from 'lucide-react'

const HomePage: React.FC = () => {
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null)

  useEffect(() => {
    // 獲取用戶位置
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        },
        (error) => {
          console.error('Error getting location:', error)
        }
      )
    }
  }, [])

  const features = [
    {
      icon: <MapPin size={32} className="text-primary" />,
      title: "精準定位",
      description: "快速找到您附近的素食餐廳"
    },
    {
      icon: <Search size={32} className="text-primary" />,
      title: "智能搜尋",
      description: "依據素食類型、料理風格精準篩選"
    },
    {
      icon: <Star size={32} className="text-primary" />,
      title: "真實評價",
      description: "來自素食社群的可靠食記與評分"
    },
    {
      icon: <Users size={32} className="text-primary" />,
      title: "社群互動",
      description: "分享您的素食體驗，建立連結"
    }
  ]

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Hero Section */}
      <Box 
        sx={{ 
          textAlign: 'center', 
          py: 8, 
          background: 'linear-gradient(135deg, #4CAF50 0%, #81C784 100%)',
          color: 'white',
          borderRadius: 2,
          mb: 6
        }}
      >
        <Typography variant="h2" component="h1" gutterBottom>
          台中素食地圖
        </Typography>
        <Typography variant="h5" component="p" gutterBottom>
          探索台中最完整的素食餐廳
        </Typography>
        <Typography variant="body1" sx={{ mb: 4, opacity: 0.9 }}>
          精準搜尋、真實評價、社群分享，讓您的素食生活更豐富
        </Typography>
        <Button 
          variant="contained" 
          size="large" 
          sx={{ 
            bgcolor: 'white', 
            color: 'primary.main',
            '&:hover': { bgcolor: 'grey.100' }
          }}
        >
          開始探索
        </Button>
      </Box>

      {/* Features Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" component="h2" textAlign="center" gutterBottom>
          主要功能
        </Typography>
        <Grid container spacing={4} sx={{ mt: 2 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{ height: '100%', textAlign: 'center', p: 2 }}>
                <CardContent>
                  <Box sx={{ mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Location Info */}
      {userLocation && (
        <Box sx={{ textAlign: 'center', p: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            您的位置
          </Typography>
          <Typography variant="body2" color="text.secondary">
            緯度: {userLocation.lat.toFixed(4)}, 經度: {userLocation.lng.toFixed(4)}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            正在為您載入附近的素食餐廳...
          </Typography>
        </Box>
      )}
    </Container>
  )
}

export default HomePage
