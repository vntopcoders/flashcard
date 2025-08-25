# English Flashcards App

Ứng dụng học tiếng Anh với flashcard được xây dựng bằng Next.js, TypeScript và Supabase.

🚀 **Demo**: [Live on Vercel](https://your-app-url.vercel.app)

## Tính năng

- 🔄 **Flashcard với hiệu ứng flip**: Lật thẻ để xem nghĩa tiếng Việt
- ➕ **Thêm từ mới**: Form dễ sử dụng để thêm từ vựng
- 📊 **Phân loại và độ khó**: Chia từ theo danh mục và mức độ khó
- 🎯 **Theo dõi tiến độ**: Progress bar và điều hướng thẻ
- 📱 **Responsive**: Hoạt động tốt trên mọi thiết bị

## Công nghệ sử dụng

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: Supabase (PostgreSQL)
- **Icons**: Lucide React
- **Deployment**: Vercel

## Setup Supabase

1. **Tạo project mới trên [Supabase](https://supabase.com/)**

2. **Chạy SQL script**:
   - Vào Supabase Dashboard > SQL Editor
   - Copy nội dung file `supabase-setup.sql` và chạy

3. **Lấy API credentials**:
   - Vào Settings > API
   - Copy `Project URL` và `anon public key`

## Cài đặt và chạy

1. Clone repository:
   ```bash
   git clone <repository-url>
   cd flashcard
   ```

2. Cài đặt dependencies:
   ```bash
   npm install
   ```

3. Setup environment variables:
   ```bash
   cp .env.example .env
   ```
   Cập nhật `.env` với Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

4. Chạy development server:
   ```bash
   npm run dev
   ```

5. Mở trình duyệt tại [http://localhost:3000](http://localhost:3000)

## API Endpoints

- `GET /api/flashcards` - Lấy danh sách tất cả flashcards
- `POST /api/flashcards` - Tạo flashcard mới
- `GET /api/flashcards/[id]` - Lấy flashcard theo ID
- `PUT /api/flashcards/[id]` - Cập nhật flashcard
- `DELETE /api/flashcards/[id]` - Xóa flashcard

## Deployment

### Vercel (Khuyến nghị)

1. Push code lên GitHub
2. Kết nối repository với Vercel
3. Vercel sẽ tự động deploy

### Các hosting khác

Ứng dụng có thể deploy trên:
- Netlify
- Railway
- Render
- Heroku

## Cấu trúc dự án

```
src/
├── app/
│   ├── api/flashcards/          # API routes
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Home page
├── components/
│   ├── AddFlashcardForm.tsx     # Form thêm từ mới
│   └── FlashcardComponent.tsx   # Component flashcard
├── lib/
│   └── prisma.ts                # Prisma client
└── types/
    └── flashcard.ts             # TypeScript types
prisma/
├── schema.prisma                # Database schema
└── seed.ts                      # Seed data
```

## Contributing

1. Fork repository
2. Tạo branch mới: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Tạo Pull Request

## License

MIT License
# Force Vercel deployment update
