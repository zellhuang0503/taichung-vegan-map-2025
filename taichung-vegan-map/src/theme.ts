import { createTheme } from '@mui/material/styles';

// 從 veggie_map_theme_1.css 提取的顏色值 (已轉換為 RGB)
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: 'rgb(79, 167, 101)', // --primary: Matcha Green
      contrastText: 'rgb(255, 255, 255)', // --primary-foreground: White
    },
    secondary: {
      main: 'rgb(243, 241, 237)', // --secondary
      contrastText: 'rgb(99, 99, 99)', // --secondary-foreground
    },
    background: {
      default: 'rgb(250, 248, 244)', // --background: Soft Ivory
      paper: 'rgb(255, 255, 255)', // --card / --popover: White
    },
    text: {
      primary: 'rgb(37, 37, 37)', // --foreground / --card-foreground / --popover-foreground: Charcoal
      secondary: 'rgb(125, 125, 125)', // --muted-foreground
    },
    divider: 'rgb(230, 227, 221)', // --border
    action: {
      active: 'rgb(79, 167, 101)', // --primary for active states
      hover: 'rgb(217, 213, 204)', // --accent: Light Beige for hover
    },
    error: {
      main: 'rgb(188, 80, 80)', // --destructive: Muted Red
      contrastText: 'rgb(255, 255, 255)', // --destructive-foreground: White
    },
    // 可以根據需要添加更多調色板顏色，例如 warning, info, success
  },
  typography: {
    fontFamily: [
      'Noto Sans JP',
      'sans-serif',
    ].join(','),
    h1: {
      fontFamily: [
        'Noto Serif JP',
        'serif',
      ].join(','),
    },
    h2: {
      fontFamily: [
        'Noto Serif JP',
        'serif',
      ].join(','),
    },
    h3: {
      fontFamily: [
        'Noto Serif JP',
        'serif',
      ].join(','),
    },
    // 可以根據需要進一步細化其他字體樣式
  },
  // 可以根據需要添加更多主題設定，例如 shadows, spacing 等
});

export default theme;
