import React, { useEffect, useRef, useState } from 'react'
import { Box, CircularProgress, Typography } from '@mui/material'
import { loadGoogleMaps } from '../services/maps'

// 擴展Window介面以包含google
declare global {
  interface Window {
    google: any
  }
}

interface Restaurant {
  id: string
  name: string
  lat: number
  lng: number
  address: string
  phone?: string
  rating?: number
  priceLevel?: number
  vegetarianType?: string
}

interface MapViewProps {
  restaurants?: Restaurant[]
  center?: { lat: number; lng: number }
  zoom?: number
  onRestaurantClick?: (restaurant: Restaurant) => void
  showUserLocation?: boolean
}

const MapView: React.FC<MapViewProps> = ({
  restaurants = [],
  center,
  zoom = 13,
  onRestaurantClick,
  showUserLocation = true
}) => {
  const mapRef = useRef<HTMLDivElement>(null)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)

  useEffect(() => {
    const initializeMap = async () => {
      try {
        setLoading(true)
        
        // 載入Google Maps API
        await loadGoogleMaps()

        if (!mapRef.current) return

        // 設定地圖中心
        let mapCenter = center
        if (!mapCenter && showUserLocation) {
          try {
            const position = await getCurrentPosition()
            mapCenter = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            }
            setUserLocation(mapCenter)
          } catch (error) {
            // 如果無法取得用戶位置，使用台中火車站為預設
            mapCenter = { lat: 24.1369, lng: 120.6869 }
          }
        } else if (!mapCenter) {
          mapCenter = { lat: 24.1369, lng: 120.6869 } // 台中火車站
        }

        // 建立地圖
        const newMap = new window.google.maps.Map(mapRef.current, {
          center: mapCenter,
          zoom,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }]
            }
          ]
        })



        // 加入餐廳標記
        if (restaurants.length > 0) {
          addRestaurantMarkers(newMap, restaurants)
        }

        // 加入用戶位置標記
        if (showUserLocation && userLocation) {
          addUserLocationMarker(newMap, userLocation)
        }

      } catch (error) {
        console.error('Error loading map:', error)
        setError('無法載入地圖，請檢查網路連線')
      } finally {
        setLoading(false)
      }
    }

    initializeMap()
  }, [center, zoom, restaurants, showUserLocation])

  const getCurrentPosition = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('瀏覽器不支援定位功能'))
        return
      }

      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      })
    })
  }

  const addRestaurantMarkers = (map: any, restaurants: Restaurant[]) => {
    restaurants.forEach((restaurant) => {
      const marker = new google.maps.Marker({
        position: { lat: restaurant.lat, lng: restaurant.lng },
        map,
        title: restaurant.name,
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="12" fill="#4CAF50" stroke="#FFFFFF" stroke-width="2"/>
              <text x="16" y="20" text-anchor="middle" fill="white" font-size="12" font-weight="bold">素</text>
            </svg>
          `),
          scaledSize: new google.maps.Size(32, 32)
        }
      })

      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 8px; max-width: 200px;">
            <h4 style="margin: 0 0 4px 0; color: #2E7D32;">${restaurant.name}</h4>
            <p style="margin: 0 0 4px 0; font-size: 12px; color: #666;">${restaurant.address}</p>
            ${restaurant.phone ? `<p style="margin: 0 0 4px 0; font-size: 12px;">電話: ${restaurant.phone}</p>` : ''}
            ${restaurant.rating ? `<p style="margin: 0; font-size: 12px;">評分: ${restaurant.rating}★</p>` : ''}
          </div>
        `
      })

      marker.addListener('click', () => {
        infoWindow.open(map, marker)
        onRestaurantClick?.(restaurant)
      })
    })
  }

  const addUserLocationMarker = (map: any, location: { lat: number; lng: number }) => {
    new window.google.maps.Marker({
      position: location,
      map,
      title: '您的位置',
      icon: {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
          <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="8" fill="#1976D2" stroke="#FFFFFF" stroke-width="2"/>
            <circle cx="12" cy="12" r="3" fill="#FFFFFF"/>
          </svg>
        `),
        scaledSize: new google.maps.Size(24, 24)
      }
    })
  }

  if (loading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="100%"
        minHeight="400px"
      >
        <CircularProgress />
        <Typography variant="body2" sx={{ mt: 2 }}>
          載入地圖中...
        </Typography>
      </Box>
    )
  }

  if (error) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="100%"
        minHeight="400px"
        p={3}
      >
        <Typography variant="h6" color="error" gutterBottom>
          載入失敗
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center">
          {error}
        </Typography>
      </Box>
    )
  }

  return (
    <Box
      ref={mapRef}
      sx={{
        width: '100%',
        height: '100%',
        minHeight: '400px',
        borderRadius: 2,
        overflow: 'hidden',
        boxShadow: 1
      }}
    />
  )
}

export default MapView
