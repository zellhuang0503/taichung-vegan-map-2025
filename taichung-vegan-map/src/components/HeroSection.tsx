import React from 'react';
import { Box, Typography, TextField, Button, Link } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const HeroSection: React.FC = () => {
  return (
    <Box sx={{
      textAlign: 'center',
      py: { xs: 8, md: 16 },
      px: 2,
      bgcolor: 'background.default',
    }}>
      <Typography variant="h1" component="h1" gutterBottom sx={{
        fontSize: { xs: '2rem', md: '3rem' },
        fontWeight: 'bold',
        mb: 2,
      }}>
        今天，想來點什麼樣的蔬食？
      </Typography>
      <Typography variant="h2" component="p" sx={{
        fontSize: '1rem',
        color: 'text.secondary',
        mb: 4,
        maxWidth: '42rem',
        mx: 'auto',
      }}>
        探索台中最棒的素食與蔬食餐廳，從巷弄小店到精緻料理。
      </Typography>
      <Box sx={{
        maxWidth: '42rem',
        mx: 'auto',
        position: 'relative',
      }}>
        <TextField
          fullWidth
          placeholder="輸入餐廳、地區或菜式..."
          variant="outlined"
          sx={{
            '& .MuiOutlinedInput-root': {
              height: '3.5rem',
              pr: '10rem',
              borderRadius: '9999px',
              bgcolor: 'background.paper',
            },
          }}
        />
        <Button
          variant="contained"
          size="large"
          sx={{
            position: 'absolute',
            right: '0.5rem',
            top: '50%',
            transform: 'translateY(-50%)',
            height: '2.75rem',
            px: 4,
            borderRadius: '9999px',
            fontWeight: 'bold',
          }}
          startIcon={<SearchIcon />}
        >
          搜尋
        </Button>
      </Box>
      <Box sx={{ mt: 3 }}>
        <Typography variant="body2" color="text.secondary" component="span">
          熱門標籤：
        </Typography>
        <Link href="#" underline="hover" sx={{ mx: 0.5 }}>
          #創意料理
        </Link>
        <span>, </span>
        <Link href="#" underline="hover" sx={{ mx: 0.5 }}>
          #景觀餐廳
        </Link>
        <span>, </span>
        <Link href="#" underline="hover" sx={{ mx: 0.5 }}>
          #純素咖啡廳
        </Link>
      </Box>
    </Box>
  );
};

export default HeroSection;
