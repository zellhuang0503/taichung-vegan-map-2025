# 食記CMS系統規劃

## 1. 系統架構概述

### 1.1 系統目標
建立一個完整的內容管理系統，讓用戶能夠輕鬆創建、編輯和管理他們的素食餐廳食記。系統將整合Supabase作為後端服務，實現無需傳統伺服器的現代化架構。

### 1.2 技術架構
```
前端層 (React 18 + TypeScript)
├── 食記編輯器 (TinyMCE)
├── 圖片上傳組件 (Supabase Storage)
├── 食記列表組件
└── 食記審核管理介面

後端層 (Supabase)
├── 資料庫 (PostgreSQL)
├── 身份驗證 (JWT)
├── 儲存服務 (CDN)
└── 即時功能 (WebSockets)
```

## 2. 資料庫設計

### 2.1 食記主表 (reviews)
```sql
CREATE TABLE reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  photos JSONB DEFAULT '[]',
  tags TEXT[] DEFAULT '{}',
  visit_date DATE,
  price_range INTEGER CHECK (price_range >= 1 AND price_range <= 4),
  is_draft BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 索引優化
CREATE INDEX idx_reviews_restaurant_id ON reviews(restaurant_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);
CREATE INDEX idx_reviews_is_draft ON reviews(is_draft);
CREATE INDEX idx_reviews_created_at ON reviews(created_at DESC);
CREATE INDEX idx_reviews_tags ON reviews USING GIN (tags);
```

### 2.2 食記照片表 (review_photos)
```sql
CREATE TABLE review_photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  review_id UUID REFERENCES reviews(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  caption TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_review_photos_review_id ON review_photos(review_id);
```

### 2.3 食記標籤系統
```sql
-- 標籤主表
CREATE TABLE review_tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  color TEXT DEFAULT '#6366f1',
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 食記與標籤關聯表
CREATE TABLE review_tag_mappings (
  review_id UUID REFERENCES reviews(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES review_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (review_id, tag_id)
);
```

### 2.4 社群互動表
```sql
-- 按讚表
CREATE TABLE review_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  review_id UUID REFERENCES reviews(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(review_id, user_id)
);

-- 留言表
CREATE TABLE review_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  review_id UUID REFERENCES reviews(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  parent_id UUID REFERENCES review_comments(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_review_comments_review_id ON review_comments(review_id);
CREATE INDEX idx_review_comments_parent_id ON review_comments(parent_id);

-- 檢舉表
CREATE TABLE review_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  review_id UUID REFERENCES reviews(id) ON DELETE CASCADE,
  reporter_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_review_reports_status ON review_reports(status);
CREATE INDEX idx_review_reports_review_id ON review_reports(review_id);
```

## 3. Row Level Security (RLS) 策略

### 3.1 食記讀取權限
```sql
-- 公開食記可查看
CREATE POLICY "公開食記可查看" ON reviews
    FOR SELECT USING (is_draft = false);

-- 用戶可查看自己的草稿
CREATE POLICY "用戶可查看自己的草稿" ON reviews
    FOR SELECT USING (user_id = auth.uid());
```

### 3.2 食記寫入權限
```sql
-- 用戶可管理自己的食記
CREATE POLICY "用戶可管理自己的食記" ON reviews
    FOR ALL USING (user_id = auth.uid());

-- 管理員可管理所有食記
CREATE POLICY "管理員可管理所有食記" ON reviews
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid() AND is_admin = true
        )
    );
```

### 3.3 社群互動權限
```sql
-- 用戶可管理自己的按讚
CREATE POLICY "用戶可管理自己的按讚" ON review_likes
    FOR ALL USING (user_id = auth.uid());

-- 用戶可管理自己的留言
CREATE POLICY "用戶可管理自己的留言" ON review_comments
    FOR ALL USING (user_id = auth.uid());

-- 用戶可檢舉任何食記
CREATE POLICY "用戶可檢舉食記" ON review_reports
    FOR INSERT WITH CHECK (reporter_id = auth.uid());

-- 管理員可審核檢舉
CREATE POLICY "管理員可審核檢舉" ON review_reports
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid() AND is_admin = true
        )
    );
```

## 4. 前端組件設計

### 4.1 食記編輯器組件
```jsx
// ReviewEditor.jsx
import { useState, useEffect } from 'react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { Editor } from '@tinymce/tinymce-react'

const ReviewEditor = ({ restaurantId, reviewId, onSave }) => {
  const supabase = useSupabaseClient()
  const [review, setReview] = useState({
    title: '',
    content: '',
    rating: 5,
    visit_date: new Date().toISOString().split('T')[0],
    price_range: 2,
    tags: [],
    photos: [],
    is_draft: true
  })

  // 載入現有食記
  useEffect(() => {
    if (reviewId) {
      loadReview()
    }
  }, [reviewId])

  const loadReview = async () => {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('id', reviewId)
      .single()

    if (!error) {
      setReview(data)
    }
  }

  const handleSave = async (publish = false) => {
    const reviewData = {
      ...review,
      restaurant_id: restaurantId,
      is_draft: !publish
    }

    let result
    if (reviewId) {
      // 更新現有食記
      result = await supabase
        .from('reviews')
        .update(reviewData)
        .eq('id', reviewId)
    } else {
      // 創建新食記
      result = await supabase
        .from('reviews')
        .insert([reviewData])
    }

    if (!result.error) {
      onSave && onSave(result.data)
    }
  }

  return (
    <div className="review-editor">
      <input
        type="text"
        placeholder="食記標題"
        value={review.title}
        onChange={(e) => setReview({...review, title: e.target.value})}
      />
      
      <Editor
        apiKey={process.env.REACT_APP_TINYMCE_API_KEY}
        value={review.content}
        onEditorChange={(content) => setReview({...review, content})}
        init={{
          height: 500,
          menubar: false,
          plugins: [
            'advlist autolink lists link image charmap print preview anchor',
            'searchreplace visualblocks code fullscreen',
            'insertdatetime media table paste code help wordcount'
          ],
          toolbar:
            'undo redo | formatselect | bold italic backcolor | \
            alignleft aligncenter alignright alignjustify | \
            bullist numlist outdent indent | removeformat | help'
        }}
      />
      
      <ImageUploader 
        photos={review.photos}
        onChange={(photos) => setReview({...review, photos})}
      />
      
      <div className="review-meta">
        <select 
          value={review.rating}
          onChange={(e) => setReview({...review, rating: parseInt(e.target.value)})}
        >
          {[1,2,3,4,5].map(num => 
            <option key={num} value={num}>{num} 顆星</option>
          )}
        </select>
        
        <input
          type="date"
          value={review.visit_date}
          onChange={(e) => setReview({...review, visit_date: e.target.value})}
        />
        
        <select 
          value={review.price_range}
          onChange={(e) => setReview({...review, price_range: parseInt(e.target.value)})}
        >
          <option value={1}>$ (150以下)</option>
          <option value={2}>$$ (150-300)</option>
          <option value={3}>$$$ (300-600)</option>
          <option value={4}>$$$$ (600以上)</option>
        </select>
      </div>
      
      <div className="editor-actions">
        <button onClick={() => handleSave(false)}>儲存草稿</button>
        <button onClick={() => handleSave(true)}>發布食記</button>
      </div>
    </div>
  )
}

export default ReviewEditor
```

### 4.2 圖片上傳組件
```jsx
// ImageUploader.jsx
import { useState } from 'react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'

const ImageUploader = ({ photos = [], onChange }) => {
  const supabase = useSupabaseClient()
  const [uploading, setUploading] = useState(false)

  const handleUpload = async (files) => {
    setUploading(true)
    for (const file of files) {
      const fileName = `${Date.now()}-${file.name}`
      const { data, error } = await supabase.storage
        .from('review-photos')
        .upload(fileName, file)
      
      if (!error) {
        const { data: { publicUrl } } = supabase.storage
          .from('review-photos')
          .getPublicUrl(fileName)
        onChange([...photos, publicUrl])
      }
    }
    setUploading(false)
  }

  const handleDelete = (index) => {
    const newPhotos = [...photos]
    newPhotos.splice(index, 1)
    onChange(newPhotos)
  }

  return (
    <div className="image-uploader">
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => handleUpload(e.target.files)}
        disabled={uploading}
      />
      
      {uploading && <div>上傳中...</div>}
      
      <div className="photo-preview">
        {photos.map((photo, index) => (
          <div key={index} className="photo-item">
            <img src={photo} alt={`食記照片 ${index + 1}`} />
            <button onClick={() => handleDelete(index)}>刪除</button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ImageUploader
```

### 4.3 食記列表組件
```jsx
// ReviewList.jsx
import { useState, useEffect } from 'react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'

const ReviewList = ({ restaurantId, userId }) => {
  const supabase = useSupabaseClient()
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadReviews()
  }, [restaurantId, userId])

  const loadReviews = async () => {
    setLoading(true)
    let query = supabase
      .from('reviews')
      .select(`
        *,
        user_profiles(username, avatar_url),
        review_likes(count),
        review_comments(count)
      `)
      .eq('is_draft', false)
      .order('created_at', { ascending: false })

    if (restaurantId) {
      query = query.eq('restaurant_id', restaurantId)
    }
    
    if (userId) {
      query = query.eq('user_id', userId)
    }

    const { data, error } = await query
    
    if (!error) {
      setReviews(data)
    }
    setLoading(false)
  }

  if (loading) return <div>載入中...</div>

  return (
    <div className="review-list">
      {reviews.map(review => (
        <ReviewItem key={review.id} review={review} />
      ))}
    </div>
  )
}

const ReviewItem = ({ review }) => {
  const [liked, setLiked] = useState(false)
  
  return (
    <div className="review-item">
      <div className="review-header">
        <img src={review.user_profiles?.avatar_url} alt="用戶頭像" />
        <div>
          <h4>{review.user_profiles?.username}</h4>
          <div className="rating">{'★'.repeat(review.rating)}</div>
        </div>
      </div>
      
      <h3>{review.title}</h3>
      <div dangerouslySetInnerHTML={{ __html: review.content.substring(0, 200) + '...' }} />
      
      {review.photos && review.photos.length > 0 && (
        <div className="review-photos">
          {review.photos.slice(0, 3).map((photo, index) => (
            <img key={index} src={photo} alt={`食記照片 ${index + 1}`} />
          ))}
        </div>
      )
