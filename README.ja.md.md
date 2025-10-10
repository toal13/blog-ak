## 📄 README.ja.md (ポートフォリオ用・日本語版)

````markdown
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

- コーディング不要の**管理画面**によるコンテンツ管理
- **多言語対応**（日本語・英語・スウェーデン語）
- プロジェクトタグによる**動的フィルタリング**
- モバイルファーストの**レスポンシブデザイン**
- **画像の自動最適化**とクラウドストレージ

## ✨ 主な機能

### フロントエンド

- 🌍 **多言語対応** - next-intl によるシームレスな言語切り替え
- 📱 **レスポンシブデザイン** - モバイル・タブレット・デスクトップ最適化
- 🏷️ **タグフィルター** - 動的なプロジェクト分類とフィルタリング
- 🖼️ **Masonry レイアウト** - Pinterest 風の画像ギャラリー
- ⚡ **パフォーマンス** - Next.js App Router + Server Components
- 🎨 **ミニマル UI** - 白黒デザイン + カスタムタイポグラフィ

### バックエンド・管理画面

- 🔐 **認証** - Firebase Auth（メール/パスワード、Google ログイン）
- 📝 **コンテンツ管理** - プロジェクトの CRUD 操作
- 🖼️ **画像管理** - ドラッグ&ドロップで Firebase Storage にアップロード
- 💾 **データベース** - Firestore によるスケーラブルな NoSQL ストレージ
- 🗑️ **カスケード削除** - プロジェクト削除時に画像も自動削除
- 📊 **ダッシュボード** - リアルタイム統計（合計・下書き・公開中）

## 🛠 技術スタック

### フロントエンド

- **フレームワーク:** Next.js 15.4.6 (App Router)
- **言語:** TypeScript
- **スタイリング:** Tailwind CSS 4.0
- **UI コンポーネント:** shadcn/ui, lucide-react
- **国際化:** next-intl
- **フォーム:** react-hook-form + zod バリデーション
- **Markdown:** react-markdown

### バックエンド

- **データベース:** Firebase Firestore
- **ストレージ:** Firebase Storage
- **認証:** Firebase Auth
- **ホスティング:** Vercel

### 開発体験

- **型安全性:** 完全な TypeScript カバレッジ
- **コード品質:** ESLint + Prettier
- **パフォーマンス:** Next.js Image 最適化
- **セキュリティ:** Firebase セキュリティルール

## 📱 ページ・ルート構成

| ルート               | 説明                              |
| -------------------- | --------------------------------- |
| `/`                  | ホーム - 代表作と最新プロジェクト |
| `/projects`          | 全プロジェクト + タグフィルター   |
| `/[slug]`            | プロジェクト詳細                  |
| `/profile`           | 建築家について                    |
| `/contact`           | お問い合わせフォーム              |
| `/admin`             | 管理画面ダッシュボード（要認証）  |
| `/admin/blog`        | 投稿管理                          |
| `/admin/blog/new`    | 新規作成                          |
| `/admin/blog/[slug]` | 編集                              |

## 🎨 デザインシステム

### ビジュアルデザイン

- **カラーパレット:** ミニマルな白黒 + 微妙なグレー
- **レイアウト:** 2 カラム詳細ページ、Masonry ギャラリー
- **タイポグラフィ:**
  - 英語・スウェーデン語: Playfair Display (見出し) + Crimson Pro (本文)
  - 日本語: Noto Serif JP (Light 300 / Regular 400)

### ユーザー体験

- スムーズなホバーアニメーション
- 固定ナビゲーションヘッダー
- モバイルハンバーガーメニュー
- トースト通知によるフィードバック
- ローディング状態とエラーハンドリング

## 💡 技術的なハイライト

### 1. **動的タグシステム**

- すべてのプロジェクトからタグを自動収集
- 事前定義なし - 完全に柔軟
- ページリロードなしのリアルタイムフィルタリング
- アルファベット順に自動ソート

### 2. **画像最適化**

- Next.js Image による自動 WebP 変換
- 異なるサイズのレスポンシブ画像
- パフォーマンス向上のための遅延読み込み
- 縦長・横長両方の向きに対応
- 最大ファイルサイズ検証（5MB）

### 3. **多言語アーキテクチャ**

- URL ベースの言語切り替え（`/ja`, `/en`, `/sv`）
- SEO のためのサーバーサイド翻訳
- 言語ごとに独立したコンテンツ
- ヘッダーに言語切り替えボタン

### 4. **管理画面のセキュリティ**

- 管理者アクセスのメールホワイトリスト
- データ保護のための Firebase セキュリティルール
- 自動セッション管理
- 認証チェック付きの保護されたルート

### 5. **データ管理**

- カスケード削除: Firestore ドキュメント + Storage 画像を削除
- 楽観的 UI 更新
- リアルタイムダッシュボード統計
- 下書き/公開ワークフロー

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
├── [locale]/          # 多言語ルート
│   ├── page.tsx       # ホームページ
│   ├── projects/      # プロジェクト一覧 + フィルター
│   ├── [slug]/        # プロジェクト詳細
│   └── admin/         # 管理画面
├── components/        # 再利用可能なコンポーネント
├── api/              # API ルート
lib/
├── firebase/         # Firebase 設定とユーティリティ
├── types/            # TypeScript 型定義
└── validations/      # Zod スキーマ
```

## 👤 Developer

**Tomoyo Alvåg** - Full Stack Developer

- 🌐 Portfolio: [tomoyo-alvag.vercel.app](https://tomoyo-alvag.vercel.app/en)
- 💼 GitHub: [@toal13](https://github.com/toal13)
- 🔗 LinkedIn: [tomoyo-alvåg](https://www.linkedin.com/in/tomoyo-alv%C3%A5g-6b678219/)

---

**💡 This project demonstrates:** Modern web development, full-stack capabilities, cloud architecture, responsive design, and production-ready code quality.
````
