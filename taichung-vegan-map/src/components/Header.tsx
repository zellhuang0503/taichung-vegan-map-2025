import React from 'react'
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material'
import { Link } from 'react-router-dom'
import { Map as MapIcon, Restaurant as RestaurantIcon, AddCircle as AddCircleIcon } from '@mui/icons-material'

const Header: React.FC = () => {
  return (
    <AppBar position="static" sx={{ bgcolor: 'primary.main' }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          台中素食地圖
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            color="inherit" 
            component={Link} 
            to="/"
            startIcon={<MapIcon />}
          >
            首頁
          </Button>
          <Button 
            color="inherit" 
            component={Link} 
            to="/restaurants"
            startIcon={<RestaurantIcon />}
          >
            餐廳列表
          </Button>
          <Button 
            color="inherit" 
            component={Link} 
            to="/write-review"
            startIcon={<AddCircleIcon />}
          >
            撰寫食記
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Header
