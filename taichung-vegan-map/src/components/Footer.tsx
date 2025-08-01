import React from 'react';
import { Box, Typography, Link, Container } from '@mui/material';

const Footer: React.FC = () => {
  return (
    <Box component="footer" sx={{ bgcolor: 'grey.50', borderTop: 1, borderColor: 'divider', py: 4 }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: 'center', textAlign: { xs: 'center', md: 'left' } }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: { xs: 'center', md: 'flex-start' }, mb: { xs: 2, md: 0 }, gap: 2 }}>
            <Link href="#" color="text.secondary" underline="hover">
              關於我們
            </Link>
            <Link href="#" color="text.secondary" underline="hover">
              合作夥伴方案
            </Link>
            <Link href="#" color="text.secondary" underline="hover">
              隱私權政策
            </Link>
            <Link href="#" color="text.secondary" underline="hover">
              服務條款
            </Link>
          </Box>
          <Typography variant="body2" color="text.secondary">
            &copy; {new Date().getFullYear()} Taichung Vege Map. All Rights Reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
