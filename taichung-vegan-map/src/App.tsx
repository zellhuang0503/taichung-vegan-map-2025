import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'

// Import the custom theme
import theme from './theme';

// Pages
import HomePage from './pages/HomePage'
import RestaurantListPage from './pages/RestaurantListPage'
import RestaurantDetailPage from './pages/RestaurantDetailPage'
import WriteReviewPage from './pages/WriteReviewPage'

// Components
import Header from './components/Header'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <div className="App">
            <Header />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/restaurants" element={<RestaurantListPage />} />
              <Route path="/restaurant/:id" element={<RestaurantDetailPage />} />
              <Route path="/write-review" element={<WriteReviewPage />} />
            </Routes>
          </div>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App
