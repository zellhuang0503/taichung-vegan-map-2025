, 'ul', 'li', 'a', 'img'],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class']
  })
}
```

### 11.3 請求頻率限制
```javascript
// src/utils/rateLimit.js

export class RateLimiter {
  constructor(maxRequests = 10, windowMs = 60000) {
    this.maxRequests = maxRequests
    this.windowMs = windowMs
    this.requests = new Map()
  }

  isAllowed(userId) {
    const now = Date.now()
    const userRequests = this.requests.get(userId) || []
    
    // 移除過期的請求記錄
    const validRequests = userRequests.filter(time => now - time < this.windowMs)
    
    if (validRequests.length >= this.maxRequests) {
      return false
    }
    
    validRequests.push(now)
    this.requests.set(userId, validRequests)
    return true
  }
}
```

## 12. 監控與錯誤處理

### 12.1 錯誤邊界
```javascript
// src/components/ErrorBoundary.jsx
import { Component } from 'react'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    // 記錄錯誤到監控服務
    console.error('食記系統錯誤:', error, errorInfo)
    
    // 可以發送到 Sentry 或其他錯誤監控服務
    // Sentry.captureException(error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>發生錯誤</h2>
          <p>抱歉，系統出現問題。請稍後再試。</p>
          <button onClick={() => window.location.reload()}>
            重新載入頁面
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
```

### 12.2 性能監控
```javascript
// src/utils/performanceMonitor.js

export class PerformanceMonitor {
  static measureOperation(operationName, operation) {
    const start = performance.now()
    
    return operation().finally(() => {
      const end = performance.now()
      const duration = end - start
      
      // 記錄操作耗時
      console.log(`${operationName} 耗時: ${duration.toFixed(2)}ms`)
      
      // 可以發送到分析服務
      // analytics.track('operation_performance', {
      //   operation: operationName,
      //   duration: duration
      // });
    })
  }

  static measureComponentRender(componentName, renderFunction) {
    return (...args) => {
      return this.measureOperation(
        `${componentName}_render`,
        () => renderFunction(...args)
      )
    }
  }
}
```

## 13. 國際化支持

### 13.1 多語言配置
```javascript
// src/i18n/locales/zh-TW.js

export default {
  review: {
    title: '食記標題',
    content: '食記內容',
    rating: '評分',
    tags: '標籤',
    visitDate: '造訪日期',
    priceRange: '價格範圍',
    photos: '照片',
    saveDraft: '儲存草稿',
    publish: '發布',
    edit: '編輯',
    delete: '刪除',
    like: '按讚',
    comment: '留言',
    share: '分享',
    report: '檢舉'
  },
  
  priceRange: {
    '1': '$ (150以下)',
    '2': '$$ (150-300)',
    '3': '$$$ (300-600)',
    '4': '$$$$ (600以上)'
  },
  
  validation: {
    titleRequired: '食記標題不能為空',
    titleTooLong: '食記標題不能超過100個字',
    contentRequired: '食記內容不能為空',
    contentTooLong: '食記內容不能超過5000個字',
    ratingInvalid: '評分必須在1到5之間'
  }
}
```

### 13.2 國際化工具
```javascript
// src/i18n/index.js
import zhTW from './locales/zh-TW'
import en from './locales/en'

const locales = {
  'zh-TW': zhTW,
  'en': en
}

class I18n {
  constructor() {
    this.locale = 'zh-TW'
    this.translations = locales[this.locale]
  }

  setLocale(locale) {
    if (locales[locale]) {
      this.locale = locale
      this.translations = locales[locale]
    }
  }

  t(key) {
    return key.split('.').reduce((obj, k) => obj && obj[k], this.translations) || key
  }
}

export default new I18n()
```

## 14. 未來擴展

### 14.1 AI 食記助手
```javascript
// src/services/aiReviewAssistant.js

export class AIReviewAssistant {
  constructor(apiKey) {
    this.apiKey = apiKey
  }

  async generateReviewSuggestions(reviewData) {
    // 調用 AI API 生成食記建議
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: '你是一個素食食記專家，擅長幫助用戶撰寫有吸引力的食記。'
          },
          {
            role: 'user',
            content: `請根據以下食記草稿提供改进建議：\n\n標題: ${reviewData.title}\n\n內容: ${reviewData.content}\n\n評分: ${reviewData.rating}\n\n標籤: ${reviewData.tags.join(', ')}`
          }
        ]
      })
    })

    const data = await response.json()
    return data.choices[0].message.content
  }
}
```

### 14.2 社群功能擴展
```javascript
// src/components/ReviewCommunity.jsx
import { useState, useEffect } from 'react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'

const ReviewCommunity = () => {
  const supabase = useSupabaseClient()
  const [trendingReviews, setTrendingReviews] = useState([])
  const [featuredUsers, setFeaturedUsers] = useState([])

  useEffect(() => {
    loadTrendingReviews()
    loadFeaturedUsers()
  }, [])

  const loadTrendingReviews = async () => {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        user_profiles(username, avatar_url),
        restaurants(name)
      `)
      .eq('is_featured', true)
      .order('created_at', { ascending: false })
      .limit(10)

    if (!error) {
      setTrendingReviews(data)
    }
  }

  const loadFeaturedUsers = async () => {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('is_featured', true)
      .order('review_count', { ascending: false })
      .limit(5)

    if (!error) {
      setFeaturedUsers(data)
    }
  }

  return (
    <div className="review-community">
      <section className="trending-reviews">
        <h2>熱門食記</h2>
        {trendingReviews.map(review => (
          <div key={review.id} className="review-preview">
            <h3>{review.title}</h3>
            <p>{review.content.substring(0, 100)}...</p>
            <div className="review-meta">
              <span>by {review.user_profiles?.username}</span>
              <span>at {review.restaurants?.name}</span>
            </div>
          </div>
        ))}
      </section>

      <section className="featured-users">
        <h2>推薦用戶</h2>
        {featuredUsers.map(user => (
          <div key={user.id} className="user-card">
            <img src={user.avatar_url} alt={user.username} />
            <div>
              <h3>{user.username}</h3>
              <p>{user.review_count} 篇食記</p>
            </div>
          </div>
        ))}
      </section>
    </div>
  )
}

export default ReviewCommunity
```

---

這份食記CMS系統規劃涵蓋了從系統架構到前端組件、資料庫設計、安全性考量、性能優化以及未來擴展的完整設計。通過這個系統，用戶可以輕鬆創建、管理和分享素食食記，同時平台也能有效管理內容品質和用戶互動。