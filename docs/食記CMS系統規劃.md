      
      <div className="review-actions">
        <button 
          className={liked ? 'liked' : ''}
          onClick={() => setLiked(!liked)}
        >
          按讚 ({review.review_likes?.[0]?.count || 0})
        </button>
        <button>留言 ({review.review_comments?.[0]?.count || 0})</button>
        <button>分享</button>
      </div>
    </div>
  )
}

export default ReviewList
```

### 4.4 食記審核管理組件
```jsx
// ReviewModeration.jsx
import { useState, useEffect } from 'react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'

const ReviewModeration = () => {
  const [reports, setReports] = useState([])
  const supabase = useSupabaseClient()

  useEffect(() => {
    loadReports()
  }, [])

  const loadReports = async () => {
    const { data, error } = await supabase
      .from('review_reports')
      .select(`
        *,
        reviews(title, content),
        reporter:user_profiles(username)
      `)
      .eq('status', 'pending')
      .order('created_at', { ascending: false })

    if (!error) {
      setReports(data)
    }
  }

  const handleReportAction = async (reportId, action) => {
    const { error } = await supabase
      .from('review_reports')
      .update({
        status: action,
        reviewed_by: supabase.auth.user()?.id,
        reviewed_at: new Date().toISOString()
      })
      .eq('id', reportId)

    if (!error) {
      loadReports()
    }
  }

  return (
    <div className="review-moderation">
      <h2>食記審核管理</h2>
      
      {reports.map(report => (
        <div key={report.id} className="report-item">
          <h3>檢舉理由: {report.reason}</h3>
          <p>檢舉描述: {report.description}</p>
          
          <div className="reported-content">
            <h4>被檢舉食記: {report.reviews?.title}</h4>
            <div dangerouslySetInnerHTML={{ __html: report.reviews?.content }} />
          </div>
          
          <div className="report-actions">
            <button 
              onClick={() => handleReportAction(report.id, 'approved')}
              className="approve"
            >
              通過檢舉
            </button>
            <button 
              onClick={() => handleReportAction(report.id, 'rejected')}
              className="reject"
            >
              拒絕檢舉
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ReviewModeration
```

## 5. 搜尋與過濾功能

### 5.1 API 設計
```javascript
// src/services/reviewSearch.js

export class ReviewSearchService {
  constructor(supabase) {
    this.supabase = supabase
  }

  async searchReviews(filters = {}, page = 1, limit = 10) {
    let query = this.supabase
      .from('reviews')
      .select(`
        *,
        restaurants(name, address),
        user_profiles(username, avatar_url)
      `)
      .eq('is_draft', false)
      .order('created_at', { ascending: false })

    // 關鍵字搜尋
    if (filters.keyword) {
      query = query.or(`title.ilike.%${filters.keyword}%,content.ilike.%${filters.keyword}%`)
    }

    // 餐廳篩選
    if (filters.restaurantId) {
      query = query.eq('restaurant_id', filters.restaurantId)
    }

    // 用戶篩選
    if (filters.userId) {
      query = query.eq('user_id', filters.userId)
    }

    // 評分篩選
    if (filters.rating) {
      query = query.eq('rating', filters.rating)
    }

    // 日期範圍篩選
    if (filters.dateFrom) {
      query = query.gte('created_at', filters.dateFrom)
    }
    if (filters.dateTo) {
      query = query.lte('created_at', filters.dateTo)
    }

    // 標籤篩選
    if (filters.tags && filters.tags.length > 0) {
      query = query.contains('tags', filters.tags)
    }

    // 價格範圍篩選
    if (filters.priceRange) {
      query = query.eq('price_range', filters.priceRange)
    }

    // 分頁
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    const { data, error, count } = await query
    
    return {
      data: data || [],
      count: count || 0,
      error
    }
  }

  async getPopularTags(limit = 20) {
    const { data, error } = await this.supabase
      .from('review_tags')
      .select('*')
      .order('usage_count', { ascending: false })
      .limit(limit)

    return { data: data || [], error }
  }
}
```

### 5.2 搜尋組件
```jsx
// ReviewSearch.jsx
import { useState, useEffect } from 'react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { ReviewSearchService } from '../services/reviewSearch'

const ReviewSearch = ({ onResults }) => {
  const supabase = useSupabaseClient()
  const [filters, setFilters] = useState({})
  const [tags, setTags] = useState([])

  useEffect(() => {
    loadPopularTags()
  }, [])

  const loadPopularTags = async () => {
    const service = new ReviewSearchService(supabase)
    const { data } = await service.getPopularTags()
    setTags(data)
  }

  const handleSearch = async () => {
    const service = new ReviewSearchService(supabase)
    const results = await service.searchReviews(filters)
    onResults(results)
  }

  return (
    <div className="review-search">
      <div className="search-filters">
        <input
          type="text"
          placeholder="搜尋食記標題或內容..."
          onChange={(e) => setFilters({...filters, keyword: e.target.value})}
        />
        
        <select onChange={(e) => setFilters({...filters, rating: e.target.value})}>
          <option value="">所有評分</option>
          <option value="5">5 顆星</option>
          <option value="4">4 顆星以上</option>
          <option value="3">3 顆星以上</option>
        </select>
        
        <select onChange={(e) => setFilters({...filters, priceRange: e.target.value})}>
          <option value="">所有價格</option>
          <option value="1">$ (150以下)</option>
          <option value="2">$$ (150-300)</option>
          <option value="3">$$$ (300-600)</option>
          <option value="4">$$$$ (600以上)</option>
        </select>
        
        <button onClick={handleSearch}>搜尋</button>
      </div>
      
      <div className="tag-cloud">
        {tags.map(tag => (
          <span 
            key={tag.id}
            className="tag"
            style={{ backgroundColor: tag.color }}
            onClick={() => setFilters({...filters, tags: [...(filters.tags || []), tag.name]})}
          >
            {tag.name}
          </span>
        ))}
      </div>
    </div>
  )
}

export default ReviewSearch
```

## 6. 社群互動功能

### 6.1 按讚功能
```javascript
// src/hooks/useReviewLike.js
import { useState, useEffect } from 'react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'

export const useReviewLike = (reviewId) => {
  const supabase = useSupabaseClient()
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkIfLiked()
    loadLikeCount()
  }, [reviewId])

  const checkIfLiked = async () => {
    if (!reviewId) return
    
    const { data } = await supabase
      .from('review_likes')
      .select('id')
      .eq('review_id', reviewId)
      .eq('user_id', supabase.auth.user()?.id)
      .single()

    setLiked(!!data)
    setLoading(false)
  }

  const loadLikeCount = async () => {
    if (!reviewId) return
    
    const { count } = await supabase
      .from('review_likes')
      .select('*', { count: 'exact' })
      .eq('review_id', reviewId)

    setLikeCount(count || 0)
  }

  const toggleLike = async () => {
    if (!reviewId) return
    
    if (liked) {
      // 取消按讚
      const { error } = await supabase
        .from('review_likes')
        .delete()
        .match({
          review_id: reviewId,
          user_id: supabase.auth.user()?.id
        })
      
      if (!error) {
        setLiked(false)
        setLikeCount(prev => prev - 1)
      }
    } else {
      // 按讚
      const { error } = await supabase
        .from('review_likes')
        .insert([
          {
            review_id: reviewId,
            user_id: supabase.auth.user()?.id
          }
        ])
      
      if (!error) {
        setLiked(true)
        setLikeCount(prev => prev + 1)
      }
    }
  }

  return {
    liked,
    likeCount,
    loading,
    toggleLike
  }
}
```

### 6.2 留言功能
```javascript
// src/hooks/useReviewComments.js
import { useState, useEffect } from 'react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'

export const useReviewComments = (reviewId) => {
  const supabase = useSupabaseClient()
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadComments()
  }, [reviewId])

  const loadComments = async () => {
    if (!reviewId) return
    
    setLoading(true)
    const { data, error } = await supabase
      .from('review_comments')
      .select(`
        *,
        user_profiles(username, avatar_url)
      `)
      .eq('review_id', reviewId)
      .order('created_at', { ascending: true })

    if (!error) {
      setComments(data)
    }
    setLoading(false)
  }

  const addComment = async (content, parentId = null) => {
    if (!reviewId || !content.trim()) return
    
    const { data, error } = await supabase
      .from('review_comments')
      .insert([
        {
          review_id: reviewId,
          user_id: supabase.auth.user()?.id,
          content,
          parent_id: parentId
        }
      ])
      .select()
      .single()

    if (!error) {
      // 重新載入留言以包含新留言
      loadComments()
    }
    
    return { data, error }
  }

  const deleteComment = async (commentId) => {
    const { error } = await supabase
      .from('review_comments')
      .delete()
      .eq('id', commentId)
      .eq('user_id', supabase.auth.user()?.id)

    if (!error) {
      loadComments()
    }
  }

  return {
    comments,
    loading,
    addComment,
    deleteComment
  }
}
```

## 7. 審核與檢舉機制

### 7.1 檢舉功能
```javascript
// src/hooks/useReviewReport.js
import { useSupabaseClient } from '@supabase/auth-helpers-react'

export const useReviewReport = () => {
  const supabase = useSupabaseClient()

  const reportReview = async (reviewId, reason, description = '') => {
    if (!reviewId || !reason) return
    
    const { data, error } = await supabase
      .from('review_reports')
      .insert([
        {
          review_id: reviewId,
          reporter_id: supabase.auth.user()?.id,
          reason,
          description
        }
      ])
      .select()
      .single()

    return { data, error }
  }

  return {
    reportReview
  }
}
```

### 7.2 管理員審核
```javascript
// src/hooks/useReviewModeration.js
import { useState, useEffect } from 'react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'

export const useReviewModeration = () => {
  const supabase = useSupabaseClient()
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)

  const loadPendingReports = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('review_reports')
      .select(`
        *,
        reviews(title, content, user_id),
        reporter:user_profiles(username, avatar_url)
      `)
      .eq('status', 'pending')
      .order('created_at', { ascending: false })

    if (!error) {
      setReports(data)
    }
    setLoading(false)
  }

  const processReport = async (reportId, action) => {
    // 更新檢舉狀態
    const { error: reportError } = await supabase
      .from('review_reports')
      .update({
        status: action,
        reviewed_by: supabase.auth.user()?.id,
        reviewed_at: new Date().toISOString()
      })
      .eq('id', reportId)

    if (!reportError && action === 'approved') {
      // 如果檢舉通過，刪除相關食記
      const report = reports.find(r => r.id === reportId)
      if (report) {
        await supabase
          .from('reviews')
          .delete()
          .eq('id', report.review_id)
      }
    }

    if (!reportError) {
      loadPendingReports()
    }
  }

  return {
    reports,
    loading,
    loadPendingReports,
    processReport
  }
}
```

## 8. 性能優化策略

### 8.1 圖片處理與優化
```javascript
// src/services/imageOptimization.js

export class ImageOptimizationService {
  constructor(supabase) {
    this.supabase = supabase
  }

  // 上傳並優化圖片
  async uploadAndOptimize(file, bucket = 'review-photos') {
    const fileName = `${Date.now()}-${file.name}`
    
    // 上傳原始圖片
    const { data: uploadData, error: uploadError } = await this.supabase.storage
      .from(bucket)
      .upload(fileName, file)
    
    if (uploadError) {
      throw uploadError
    }
    
    // 獲取圖片URL
    const { data: { publicUrl } } = this.supabase.storage
      .from(bucket)
      .getPublicUrl(fileName)
    
    return {
      original: publicUrl,
      thumbnail: `${publicUrl}?width=300&height=300`,
      medium: `${publicUrl}?width=600&height=600`
    }
  }

  // 批量上傳圖片
  async batchUpload(files, bucket = 'review-photos') {
    const results = []
    
    for (const file of files) {
      try {
        const result = await this.uploadAndOptimize(file, bucket)
        results.push(result)
      } catch (error) {
        console.error('圖片上傳失敗:', error)
        results.push(null)
      }
    }
    
    return results
  }
}
```

### 8.2 客戶端緩存與樂觀更新
```javascript
// src/hooks/useOptimisticReviews.js
import { useState } from 'react'

export const useOptimisticReviews = (initialReviews = []) => {
  const [reviews, setReviews] = useState(initialReviews)

  const addReviewOptimistically = (newReview) => {
    // 樂觀更新：立即顯示新食記
    const tempReview = {
      ...newReview,
      id: 'temp-' + Date.now(),
      is_optimistic: true
    }
    
    setReviews(prev => [tempReview, ...prev])
    
    return tempReview.id
  }

  const confirmReview = (tempId, confirmedReview) => {
    // 確認樂觀更新：用實際數據替換臨時數據
    setReviews(prev => 
      prev.map(review => 
        review.id === tempId ? confirmedReview : review
      )
    )
  }

  const removeOptimisticReview = (tempId) => {
    // 移除樂觀更新的臨時數據
    setReviews(prev => prev.filter(review => review.id !== tempId))
  }

  return {
    reviews,
    addReviewOptimistically,
    confirmReview,
    removeOptimisticReview
  }
}
```

## 9. 部署與環境配置

### 9.1 Supabase Storage 配置
```sql
-- 建立圖片儲存桶
insert into storage.buckets (id, name, public)
values ('review-photos', 'review-photos', true);

-- 設定儲存桶權限
create policy "公開可讀取食記照片"
on storage.objects for select
using ( bucket_id = 'review-photos' );

create policy "用戶可上傳食記照片"
on storage.objects for insert
with check (
  bucket_id = 'review-photos' and
  (storage.foldername(name))[1] = auth.uid()::text
);

create policy "用戶可刪除自己的食記照片"
on storage.objects for delete
using (
  bucket_id = 'review-photos' and
  (storage.foldername(name))[1] = auth.uid()::text
);
```

### 9.2 環境變數配置
```bash
# .env
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key
REACT_APP_TINYMCE_API_KEY=your-tinymce-key
REACT_APP_GOOGLE_MAPS_API_KEY=your-google-maps-key

# 生產環境
NODE_ENV=production
```

### 9.3 部署配置
```json
// netlify.toml
[build]
  command = "npm run build"
  publish = "build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[template.environment]
  REACT_APP_SUPABASE_URL = "Your Supabase URL"
  REACT_APP_SUPABASE_ANON_KEY = "Your Supabase Anon Key"
  REACT_APP_TINYMCE_API_KEY = "Your TinyMCE API Key"
```

## 10. 測試策略

### 10.1 單元測試
```javascript
// __tests__/ReviewEditor.test.js
import { render, screen, fireEvent } from '@testing-library/react'
import ReviewEditor from '../components/ReviewEditor'

jest.mock('@supabase/auth-helpers-react', () => ({
  useSupabaseClient: () => ({
    storage: {
      from: () => ({
        upload: jest.fn().mockResolvedValue({ data: {}, error: null }),
        getPublicUrl: () => ({ data: { publicUrl: 'test-url' } })
      })
    }
  })
}))

describe('ReviewEditor', () => {
  test('應該渲染標題輸入框', () => {
    render(<ReviewEditor />)
    expect(screen.getByPlaceholderText('食記標題')).toBeInTheDocument()
  })

  test('應該能夠輸入標題', () => {
    render(<ReviewEditor />)
    const titleInput = screen.getByPlaceholderText('食記標題')
    fireEvent.change(titleInput, { target: { value: '測試食記' } })
    expect(titleInput.value).toBe('測試食記')
  })
})
```

### 10.2 整合測試
```javascript
// __tests__/reviewIntegration.test.js
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

describe('食記系統整合測試', () => {
  test('用戶應該能夠創建、讀取、更新和刪除食記', async () => {
    // 創建食記
    const { data: review, error: createError } = await supabase
      .from('reviews')
      .insert([
        {
          title: '測試食記',
          content: '這是一篇測試食記',
          rating: 5,
          restaurant_id: 'test-restaurant-id'
        }
      ])
      .select()
      .single()

    expect(createError).toBeNull()
    expect(review.title).toBe('測試食記')

    // 讀取食記
    const { data: fetchedReview, error: fetchError } = await supabase
      .from('reviews')
      .select('*')
      .eq('id', review.id)
      .single()

    expect(fetchError).toBeNull()
    expect(fetchedReview.id).toBe(review.id)

    // 更新食記
    const { data: updatedReview, error: updateError } = await supabase
      .from('reviews')
      .update({ title: '更新後的測試食記' })
      .eq('id', review.id)
      .select()
      .single()

    expect(updateError).toBeNull()
    expect(updatedReview.title).toBe('更新後的測試食記')

    // 刪除食記
    const { error: deleteError } = await supabase
      .from('reviews')
      .delete()
      .eq('id', review.id)

    expect(deleteError).toBeNull()
  })
})
```

## 11. 安全性考量

### 11.1 輸入驗證
```javascript
// src/utils/validation.js

export const validateReview = (reviewData) => {
  const errors = []

  if (!reviewData.title || reviewData.title.trim().length === 0) {
    errors.push('食記標題不能為空')
  }

  if (reviewData.title && reviewData.title.length > 100) {
    errors.push('食記標題不能超過100個字')
  }

  if (!reviewData.content || reviewData.content.trim().length === 0) {
    errors.push('食記內容不能為空')
  }

  if (reviewData.content && reviewData.content.length > 5000) {
    errors.push('食記內容不能超過5000個字')
  }

  if (reviewData.rating < 1 || reviewData.rating > 5) {
    errors.push('評分必須在1到5之間')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}
```

### 11.2 XSS 防護
```javascript
// src/utils/sanitization.js
import DOMPurify from 'dompurify'

export const sanitizeContent = (content) => {
  return DOMPurify.sanitize(content, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'ol