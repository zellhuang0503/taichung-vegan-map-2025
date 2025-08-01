import React from 'react';
import { Box } from '@mui/material';
import MapView from '../components/MapView';
import HeroSection from '../components/HeroSection';
import GuidesSection from '../components/GuidesSection';
import ReviewsSection from '../components/ReviewsSection';
import Footer from '../components/Footer';

// 模擬的餐廳資料，未來會從 Supabase 讀取
const sampleRestaurants = [
  { id: '1', name: '森林旁邊', lat: 24.1369, lng: 120.6869, address: '台中市西區森林路123號' },
  { id: '2', name: '斐得蔬食', lat: 24.1450, lng: 120.6950, address: '台中市北區斐得路456號' },
  { id: '3', name: '善齋', lat: 24.1280, lng: 120.6780, address: '台中市南區善齋巷789號' },
];

const HomePage: React.FC = () => {
  return (
    <>
      <HeroSection />
      <GuidesSection />
      <ReviewsSection />
      <Box sx={{ height: '500px', my: 4 }}>
        <MapView 
          restaurants={sampleRestaurants}
          zoom={13}
          showUserLocation={true}
        />
      </Box>
      <Footer />
    </>
  );
};

export default HomePage;
