# 🚀 HR Helper 2.0

一個基於 React + Vite 的高效 HR 輔助工具，整合了 Gemini AI 功能。

## ✨ 特色功能

- **AI 驅動**: 整合 Google Gemini API 進行數據分析與處理。
- **高效開發**: 使用 Vite + React 19，提供極速的開發體驗。
- **現代化設計**: 採用 Tailwind CSS 4 與 Framer Motion (Motion) 打造流暢 UI。
- **自動化部署**: 整合 GitHub Actions，推送到 `main` 分支後自動部署至 GitHub Pages。
  
## 🛠️ 技術棧

- **Frontend**: React 19, TypeScript, Vite 6
- **Styling**: Tailwind CSS 4, Lucide React (Icons)
- **Animation**: Motion (Framer Motion)
- **Data**: PapaParse (CSV Parsing)
- **AI**: @google/genai

## 🚀 快速開始

### 1. 安裝與執行

確保你已安裝 [Node.js](https://nodejs.org/) (建議 v20+)。

```bash
# 安裝依賴
npm install

# 啟動開發伺服器
npm run dev
```

### 2. 環境變數設定

在根目錄建立 `.env.local` 並填入你的 API Key：

```env
VITE_GEMINI_API_KEY=your_api_key_here
```

## 📦 腳本說明

- `npm run dev`: 啟動 Vite 開發伺服器。
- `npm run build`: 進行 TypeScript 檢查並構建生產版本。
- `npm run lint`: 執行程式碼品質檢查。
- `npm run clean`: 清除 `dist` 產出目錄。

## 🚢 部署 (GitHub Actions)

本專案已設定自動化部署流程：
1. 將程式碼推送到 GitHub 的 `main` 分支。
2. GitHub Actions 會自動觸發 `.github/workflows/deploy.yml`。
3. 程式碼會被編譯並部署到 GitHub Pages。

> [!NOTE]
> 部署前請確保在 GitHub 專案設定中開啟 **Pages** 功能，並將來源設為 **GitHub Actions**。

## 📂 專案結構

- `src/`: 原始碼
  - `components/`: 可複用 UI 組件
  - `App.tsx`: 主要應用程式邏輯
  - `main.tsx`: 入口點
- `.github/`: CI/CD 配置
- `vite.config.ts`: Vite 設定檔
- `tsconfig.json`: TypeScript 設定檔
