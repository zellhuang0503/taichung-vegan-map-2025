# Google Maps 整合指南

## 1. API 金鑰設定

### 申請 Google Maps API 金鑰
1. 前往 [Google Cloud Console](https://console.cloud.google.com/)
2. 建立新專案或選擇現有專案
3. 啟用以下API：
   - Maps JavaScript API
   - Places API
   - Geocoding API
   - Directions API
4. 建立API金鑰並設定限制

### 環境變數設定
```bash
# .env
REACT_APP_GOOGLE_MAPS_API_KEY=your-api-key-here
```

## 2. React 地圖組件實作

### 基礎地圖組件
```javascript
// src/components/GoogleMap.jsx
import { useState, useEffect, useRef } from 'react'
import { Loader } from '@googlemaps/js-api-loader'

const GoogleMap = ({ center, zoom, onMarkerClick, restaurants }) => {
  const mapRef = useRef(null)
  const [map, setMap] = useState(null)
  const [markers, setMarkers] = useState([])

  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
      version: 'weekly',
      libraries: ['places', 'geometry']
    })

    loader.load().then(() => {
      const googleMap = new google.maps.Map(mapRef.current, {
        center,
        zoom,
        mapId: process.env.REACT_APP_GOOGLE_MAPS_ID,
        styles: [
          {
            "featureType": "poi",
            "elementType": "labels",
            "stylers": [{ "visibility": "off" }]
          }
        ]
      })
      setMap(googleMap)
    })
  }, [])

  useEffect(() => {
    if (map && restaurants) {
      // 清除現有標記
      markers.forEach(marker => marker.setMap(null))
      
      // 建立新標記
      const newMarkers = restaurants.map(restaurant => {
        const marker = new google.maps.Marker({
          position: {
            lat: restaurant.latitude,
            lng: restaurant.longitude
          },
          map,
          title: restaurant.name,
          icon: {
            url: '/veggie-marker.svg',
            scaledSize: new google.maps.Size(32, 32)
          }
        })
        
        marker.addListener('click', () => {
          onMarkerClick(restaurant)
        })
        
        return marker
      })
      
      setMarkers(newMarkers)
    }
  }, [map, restaurants])

  return <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
}

export default GoogleMap
```

### 地圖搜尋框組件
```javascript
// src/components/MapSearchBox.jsx
import { useState, useEffect, useRef } from 'react'
import { StandaloneSearchBox } from '@react-google-maps/api'

const MapSearchBox = ({ onPlacesChanged }) => {
  const searchBoxRef = useRef()
  
  const onLoad = (ref) => {
    searchBoxRef.current = ref
  }

  const onSBLoad = () => {
    const places = searchBoxRef.current.getPlaces()
    if (places && places.length > 0) {
      onPlacesChanged(places[0])
    }
  }

  return (
    <StandaloneSearchBox
      onLoad={onLoad}
      onPlacesChanged={onSBLoad}
    >
      <input
        type="text"
        placeholder="搜尋地點..."
        style={{
          boxSizing: `border-box`,
          border: `1px solid transparent`,
          width: `240px`,
          height: `32px`,
          padding: `0 12px`,
          borderRadius: `3px`,
          boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
          fontSize: `14px`,
          outline: `none`,
          textOverflow: `ellipses`,
          position: 'absolute',
          left: '10px',
          top: '10px'
        }}
      />
    </StandaloneSearchBox>
  )
}

export default MapSearchBox
```

## 3. Google Places API 餐廳資料抓取

### 餐廳搜尋服務
```javascript
// src/services/googlePlaces.js

class GooglePlacesService {
  constructor(apiKey) {
    this.apiKey = apiKey
    this.baseUrl = 'https://maps.googleapis.com/maps/api/place'
  }

  async searchVegetarianRestaurants(location = '台中市', radius = 5000) {
    // 多關鍵字搜尋以提高準確性
    const keywords = ['素食', 'vegan', 'vegetarian', '蔬食']
    const allResults = []

    for (const keyword of keywords) {
      const results = await this.searchPlaces(keyword, location, radius)
      allResults.push(...results)
    }

    // 去除重複結果
    const uniqueResults = this.removeDuplicates(allResults)
    return uniqueResults
  }

  async searchPlaces(keyword, location, radius) {
    const url = `${this.baseUrl}/textsearch/json?query=${encodeURIComponent(
      keyword + ' 餐廳 ' + location
    )}&key=${this.apiKey}&language=zh-TW`

    const response = await fetch(url)
    const data = await response.json()

    if (data.status === 'OK') {
      return data.results.map(place => ({
        google_place_id: place.place_id,
        name: place.name,
        address: place.formatted_address,
        phone: place.formatted_phone_number || '',
        latitude: place.geometry.location.lat,
        longitude: place.geometry.location.lng,
        rating: place.rating || 0,
        price_level: place.price_level || 1,
        photos: place.photos?.map(photo => ({
          photo_reference: photo.photo_reference,
          width: photo.width,
          height: photo.height
        })) || [],
        types: place.types || [],
        website: place.website || '',
        opening_hours: place.opening_hours?.weekday_text || []
      }))
    }

    return []
  }

  async getPlaceDetails(placeId) {
    const url = `${this.baseUrl}/details/json?place_id=${placeId}&key=${this.apiKey}&language=zh-TW&fields=name,formatted_address,formatted_phone_number,geometry,rating,price_level,photos,website,opening_hours,types,url`

    const response = await fetch(url)
    const data = await response.json()

    if (data.status === 'OK') {
      const place = data.result
      return {
        google_place_id: placeId,
        name: place.name,
        address: place.formatted_address,
        phone: place.formatted_phone_number || '',
        latitude: place.geometry.location.lat,
        longitude: place.geometry.location.lng,
        rating: place.rating || 0,
        price_level: place.price_level || 1,
        photos: place.photos?.map(photo => ({
          photo_reference: photo.photo_reference,
          width: photo.width,
          height: photo.height
        })) || [],
        types: place.types || [],
        website: place.website || '',
        opening_hours: place.opening_hours?.weekday_text || [],
        google_url: place.url
      }
    }

    return null
  }

  getPhotoUrl(photoReference, maxWidth = 400) {
    return `${this.baseUrl}/photo?maxwidth=${maxWidth}&photoreference=${photoReference}&key=${this.apiKey}`
  }

  removeDuplicates(restaurants) {
    const seen = new Set()
    return restaurants.filter(restaurant => {
      const duplicate = seen.has(restaurant.google_place_id)
      seen.add(restaurant.google_place_id)
      return !duplicate
    })
  }

  // 判斷是否為素食餐廳
  isVegetarianRestaurant(types, name) {
    const vegetarianKeywords = ['vegetarian', 'vegan', '素食', '蔬食']
    const nameContainsVegetarian = vegetarianKeywords.some(keyword => 
      name.toLowerCase().includes(keyword)
    )
    
    return nameContainsVegetarian || types.includes('vegetarian_restaurant')
  }

  // 分類素食類型
  classifyVegetarianType(types, name) {
    if (name.includes('vegan') || name.includes('純素') || types.includes('vegan_restaurant')) {
      return 'vegan'
    } else if (name.includes('素食') || types.includes('vegetarian_restaurant')) {
      return 'lacto-ovo'
    } else {
      return 'unknown'
    }
  }
}

export default GooglePlacesService
```

### 批次抓取腳本
```javascript
// scripts/fetchVegetarianRestaurants.js
import GooglePlacesService from '../src/services/googlePlaces'

const fetchAndStoreRestaurants = async () => {
  const service = new GooglePlacesService(process.env.GOOGLE_MAPS_API_KEY)
  
  // 台中市各區域
  const locations = [
    '台中市北區', '台中市西區', '台中市南區', '台中市東區',
    '台中市北屯區', '台中市西屯區', '台中市南屯區',
    '台中市豐原區', '台中市大里區', '台中市太平區'
  ]

  const allRestaurants = []

  for (const location of locations) {
    console.log(`正在抓取 ${location} 的素食餐廳...`)
    
    try {
      const restaurants = await service.searchVegetarianRestaurants(location, 3000)
      allRestaurants.push(...restaurants)
      console.log(`找到 ${restaurants.length} 家餐廳`)
      
      // 避免API限制，稍作延遲
      await new Promise(resolve => setTimeout(resolve, 1000))
    } catch (error) {
      console.error(`抓取 ${location} 時發生錯誤:`, error)
    }
  }

  // 去除重複
  const uniqueRestaurants = service.removeDuplicates(allRestaurants)
  console.log(`總共找到 ${uniqueRestaurants.length} 家不重複的素食餐廳`)

  // 存入Supabase
  await storeRestaurantsInSupabase(uniqueRestaurants)
}

const storeRestaurantsInSupabase = async (restaurants) => {
  // 這裡實作存入Supabase的邏輯
  // 請根據您的Supabase配置調整
  
  for (const restaurant of restaurants) {
    try {
      const { data, error } = await supabase
        .from('restaurants')
        .upsert(restaurant, { onConflict: 'google_place_id' })
      
      if (error) {
        console.error('存入資料庫時發生錯誤:', error)
      } else {
        console.log(`已儲存餐廳: ${restaurant.name}`)
      }
    } catch (error) {
      console.error(`處理餐廳 ${restaurant.name} 時發生錯誤:`, error)
    }
  }
}

// 執行批次抓取
fetchAndStoreRestaurants()
```

## 4. 前端搜尋與篩選

### 餐廳搜尋組件
```javascript
// src/components/RestaurantSearch.jsx
import { useState, useEffect } from 'react'
import { useRestaurants } from '../hooks/useRestaurants'

const RestaurantSearch = ({ onSearchResults }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    vegetarianType: '',
    cuisineType: '',
    priceRange: '',
    openNow: false
  })

  const { data: restaurants, isLoading, error } = useRestaurants()

  useEffect(() => {
    if (restaurants) {
      let filtered = restaurants

      // 關鍵字搜尋
      if (searchTerm) {
        filtered = filtered.filter(restaurant =>
          restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          restaurant.address.toLowerCase().includes(searchTerm.toLowerCase())
        )
      }

      // 素食類型篩選
      if (filters.vegetarianType) {
        filtered = filtered.filter(restaurant =>
          restaurant.vegetarian_type === filters.vegetarianType
        )
      }

      // 料理類型篩選
      if (filters.cuisineType) {
        filtered = filtered.filter(restaurant =>
          restaurant.cuisine_type.includes(filters.cuisineType)
        )
      }

      // 價格範圍篩選
      if (filters.priceRange) {
        filtered = filtered.filter(restaurant =>
          restaurant.price_range === parseInt(filters.priceRange)
        )
      }

      onSearchResults(filtered)
    }
  }, [searchTerm, filters, restaurants, onSearchResults])

  return (
    <div className="restaurant-search">
      <input
        type="text"
        placeholder="搜尋餐廳名稱或地址..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      
      <div className="filters">
        <select 
          value={filters.vegetarianType}
          onChange={(e) => setFilters({...filters, vegetarianType: e.target.value})}
        >
          <option value="">所有素食類型</option>
          <option value="vegan">純素 (Vegan)</option>
          <option value="lacto-ovo">蛋奶素 (Lacto-Ovo)</option>
          <option value="lacto">奶素 (Lacto)</option>
          <option value="ovo">蛋素 (Ovo)</option>
        </select>
        
        <select 
          value={filters.priceRange}
          onChange={(e) => setFilters({...filters, priceRange: e.target.value})}
        >
          <option value="">所有價格範圍</option>
          <option value="1">$ (150以下)</option>
          <option value="2">$$ (150-300)</option>
          <option value="3">$$$ (300-600)</option>
          <option value="4">$$$$ (600以上)</option>
        </select>
      </div>
    </div>
  )
}

export default RestaurantSearch
```

## 5. 使用限制與最佳實踐

### API 使用限制
1. **Maps JavaScript API**：每24小時免費請求次數有限制
2. **Places API**：每秒查詢次數(QPS)限制
3. **Geocoding API**：每日免費請求次數限制

### 最佳實踐
1. **快取策略**：
   - 餐廳資料快取24小時
   - 圖片URL快取1小時
   - 使用React Query進行客戶端快取

2. **錯誤處理**：
   - API請求失敗時顯示友善錯誤訊息
   - 自動重試機制
   - 降級顯示預設資料

3. **效能優化**：
   - 懶加載地圖組件
   - 圖片懶加載
   - 批次處理API請求

### 隱私與合規
1. **用戶位置**：
   - 僅在用戶明確授權時取得位置
   - 提供關閉位置追蹤選項

2. **資料保護**：
   - 遵守GDPR與台灣個資法
   - 明確告知資料使用方式
   - 提供資料刪除功能

3. **Google Maps 服務條款**：
   - 遵守Google Maps Platform服務條款
   - 正確標示Google Maps來源
   - 不修改地圖樣式過度