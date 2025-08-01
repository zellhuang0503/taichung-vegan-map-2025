# 台中素食地圖 (Taichung Veggie Map)

一個專為素食者設計的餐廳探索平台，結合Google Maps、社群食記和精準搜尋功能。

## 🎯 專案特色

- **精準搜尋**：根據素食類型、料理風格、價格區間篩選
- **社群驅動**：真實用戶食記與評價
- **即時資訊**：營業時間、菜單更新
- **路線導航**：整合Google Maps提供最佳路線

## 🛠️ 技術架構

- **前端框架**：React 18 + TypeScript
- **UI框架**：Material-UI (MUI)
- **地圖服務**：Google Maps JavaScript API
- **後端服務**：Supabase (PostgreSQL + Auth + Storage)
- **狀態管理**：React Query
- **建構工具**：Vite

## 📋 系統需求

- Node.js 18.0 或更高版本
- npm 或 yarn 套件管理器
- Google Maps API Key
- Supabase 專案設定

## 🚀 快速開始

### 1. 環境設定

複製環境變數範例檔案：
```bash
cp .env.example .env
```

編輯 `.env` 檔案，填入您的API金鑰：
```env
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. 安裝相依套件

```bash
npm install
```

### 3. 啟動開發伺服器

```bash
npm run dev
```

應用程式將在 http://localhost:5173 啟動

### 4. 建構生產版本

```bash
npm run build
```

## 📁 專案結構

```
src/
├── components/          # 共用組件
├── pages/              # 頁面組件
├── services/           # API服務
├── hooks/              # 自定義Hooks
├── types/              # TypeScript類型定義
└── utils/              # 工具函數
```

## 🔧 開發指南

### 新增頁面
1. 在 `src/pages/` 建立新的頁面組件
2. 在 `src/App.tsx` 新增路由
3. 更新 `src/components/Header.tsx` 的導航連結

### 使用API
- Google Maps: 使用 `src/services/maps.ts`
- Supabase: 使用 `src/services/supabase.ts`

### 樣式指南
- 使用Material-UI組件和主題系統
- 主色調：綠色 (#4CAF50) - 象徵自然與健康
- 輔助色：橙色 (#FF9800) - 重點按鈕與提醒

## 🌐 部署

### Netlify部署
1. 連結GitHub儲存庫
2. 設定環境變數
3. 建構指令：`npm run build`
4. 發布目錄：`dist`

## 📊 功能開發進度

- [x] 專案初始化
- [x] 基礎路由設定
- [x] 主要頁面框架
- [ ] Google Maps整合
- [ ] Supabase資料庫連接
- [ ] 餐廳列表功能
- [ ] 搜尋與篩選
- [ ] 食記CMS系統
- [ ] 用戶認證
- [ ] 社群功能

## 🤝 貢獻指南

1. Fork 專案
2. 建立功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交變更 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟 Pull Request

## 📄 授權

本專案採用 MIT 授權條款 - 詳見 [LICENSE](LICENSE) 檔案

## 📞 聯絡資訊

如有問題或建議，請透過以下方式聯絡：
- Email: [your-email@example.com]
- GitHub Issues: [專案Issues頁面]

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
