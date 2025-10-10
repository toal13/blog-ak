# Anna Kawa Arkitekt - Portfolio Website

A full-stack architecture portfolio website featuring project management, multilingual support, and dynamic tag filtering.

[日本語版 / Japanese](./README.ja.md) | [🌐 Live Demo](https://blog-ak.vercel.app/ja)

![Next.js](https://img.shields.io/badge/Next.js-15.4.6-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Firebase](https://img.shields.io/badge/Firebase-11.0-orange)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC)

## 🌐 Live Demo

**Visit the live site:** [https://blog-ak.vercel.app/en](https://your-site.vercel.app)

## 🎯 Project Overview

A modern, minimalist portfolio website for architect Anna Kawa, featuring:

- **Admin panel** for content management without coding
- **Multilingual support** (Japanese, English, Swedish)
- **Dynamic filtering** by project tags
- **Responsive design** with mobile-first approach
- **Automatic image optimization** and cloud storage

## ✨ Key Features

### Frontend

- 🌍 **Multilingual** - Seamless language switching with next-intl
- 📱 **Responsive Design** - Mobile, tablet, and desktop optimized
- 🏷️ **Tag Filtering** - Dynamic project categorization and filtering
- 🖼️ **Masonry Layout** - Pinterest-style image gallery
- ⚡ **Performance** - Next.js App Router with server components
- 🎨 **Minimalist UI** - Clean black & white design with custom typography

### Backend & Admin

- 🔐 **Authentication** - Firebase Auth with email/password and Google login
- 📝 **Content Management** - Full CRUD operations for projects
- 🖼️ **Image Management** - Drag-and-drop upload to Firebase Storage
- 💾 **Database** - Firestore for scalable NoSQL data storage
- 🗑️ **Cascade Delete** - Automatic cleanup of images when deleting projects
- 📊 **Dashboard** - Real-time statistics (total, drafts, published)

## 🛠 Tech Stack

### Frontend

- **Framework:** Next.js 15.4.6 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4.0
- **UI Components:** shadcn/ui, lucide-react
- **Internationalization:** next-intl
- **Forms:** react-hook-form + zod validation
- **Markdown:** react-markdown

### Backend

- **Database:** Firebase Firestore
- **Storage:** Firebase Storage
- **Authentication:** Firebase Auth
- **Hosting:** Vercel

### Developer Experience

- **Type Safety:** Full TypeScript coverage
- **Code Quality:** ESLint + Prettier
- **Performance:** Next.js Image optimization
- **Security:** Firebase security rules

## 📱 Pages & Routes

| Route                | Description                         |
| -------------------- | ----------------------------------- |
| `/`                  | Home - Featured and latest projects |
| `/projects`          | All projects with tag filtering     |
| `/[slug]`            | Individual project details          |
| `/profile`           | About the architect                 |
| `/contact`           | Contact form                        |
| `/admin`             | Admin dashboard (auth required)     |
| `/admin/blog`        | Manage all posts                    |
| `/admin/blog/new`    | Create new project                  |
| `/admin/blog/[slug]` | Edit existing project               |

## 🎨 Design System

### Visual Design

- **Color Palette:** Minimalist black & white with subtle grays
- **Layout:** Two-column detail pages, Masonry gallery
- **Typography:**
  - English/Swedish: Playfair Display (headings) + Crimson Pro (body)
  - Japanese: Noto Serif JP (Light 300 / Regular 400)

### User Experience

- Smooth hover animations
- Sticky navigation header
- Mobile hamburger menu
- Toast notifications for user feedback
- Loading states and error handling

## 💡 Technical Highlights

### 1. **Dynamic Tag System**

- Tags are automatically collected from all projects
- No predefined categories - completely flexible
- Real-time filtering without page reload
- Alphabetically sorted for easy navigation

### 2. **Image Optimization**

- Automatic WebP conversion via Next.js Image
- Responsive images with different sizes
- Lazy loading for performance
- Support for both portrait and landscape orientations
- Maximum file size validation (5MB)

### 3. **Multilingual Architecture**

- URL-based language switching (`/ja`, `/en`, `/sv`)
- Server-side translations for SEO
- Separate content per language
- Language switcher in header

### 4. **Admin Security**

- Email whitelist for admin access
- Firebase security rules for data protection
- Automatic session management
- Protected routes with authentication checks

### 5. **Data Management**

- Cascade delete: removes Firestore doc + Storage images
- Optimistic UI updates
- Real-time dashboard statistics
- Draft/Published workflow

## 🚀 Quick Start

```bash
# Clone repository
git clone https://github.com/your-username/anna-kawa-portfolio.git
cd anna-kawa-portfolio

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local
# Add your Firebase credentials to .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

Create `.env.local` with your Firebase credentials:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_ALLOWED_ADMIN_EMAIL=admin@example.com
```

## 📊 Project Structure

```
app/
├── [locale]/              # Multilingual routes
│   ├── page.tsx           # Home page
│   ├── projects/          # Projects with filters
│   ├── [slug]/            # Project details
│   └── admin/             # Admin panel
├── components/            # Reusable components
└── api/                   # API routes

lib/
├── firebase/              # Firebase config & utilities
├── types/                 # TypeScript definitions
└── validations/           # Zod schemas
```

## 👤 Developer

**Tomoyo Alvåg** - Full Stack Developer

- 🌐 Portfolio: [tomoyo-alvag.vercel.app](https://tomoyo-alvag.vercel.app/en)
- 💼 GitHub: [@toal13](https://github.com/toal13)
- 🔗 LinkedIn: [tomoyo-alvåg](https://www.linkedin.com/in/tomoyo-alv%C3%A5g-6b678219/)

---

**💡 This project demonstrates:** Modern web development, full-stack capabilities, cloud architecture, responsive design, and production-ready code quality.

---

## <a name="japanese-version"></a>🇯🇵 日本語版

<details>
<summary>クリックして日本語のREADMEを表示</summary>

# Anna Kawa Arkitekt - ポートフォリオサイト

プロジェクト管理、多言語対応、動的タグフィルタリングを備えたフルスタック建築ポートフォリオサイト。

[English Version](./README.md) | [🌐 デモサイト](https://blog-ak.vercel.app/ja)

![Next.js](https://img.shields.io/badge/Next.js-15.4.6-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Firebase](https://img.shields.io/badge/Firebase-11.0-orange)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC)

## 🌐 デモサイト

**公開 URL:** [https://blog-ak.vercel.app/ja](https://blog-ak.vercel.app/ja)

## 🎯 プロジェクト概要

建築家 Anna Kawa のための、モダンでミニマルなポートフォリオサイト。以下の特徴があります：

- コーディング不要の**管理画面**
- **多言語対応**（日本語・英語・スウェーデン語）
- **タグフィルタリング**による動的なプロジェクト分類
- モバイルファーストの**レスポンシブデザイン**
- **画像の自動最適化**とクラウドストレージ

## ✨ 主な機能

### フロントエンド

- 🌍 **多言語対応** – next-intl を用いたスムーズな言語切り替え
- 📱 **レスポンシブデザイン** – すべてのデバイスに最適化
- 🏷️ **タグフィルタリング** – プロジェクトを動的に分類
- 🖼️ **Masonry レイアウト** – Pinterest 風ギャラリー
- ⚡ **高パフォーマンス** – Next.js App Router + Server Components
- 🎨 **ミニマル UI** – シンプルで洗練されたデザイン

### バックエンド・管理画面

- 🔐 **認証機能** – Firebase Auth（メール／Google ログイン）
- 📝 **コンテンツ管理** – プロジェクトの CRUD 操作
- 🖼️ **画像管理** – Firebase Storage へのドラッグ＆ドロップアップロード
- 💾 **データベース** – Firestore NoSQL
- 🗑️ **カスケード削除** – プロジェクト削除時に画像も自動削除
- 📊 **ダッシュボード** – リアルタイム統計

</details>

---

**💡 Tip:** 日本語全文は別ファイルでも閲覧できます → [📄 README.ja.md](./README.ja.md)
