# IELTS Flashcard Learning System

## 🎯 Tính năng mới - Hệ thống học IELTS

Ứng dụng đã được cập nhật với hệ thống học từ vựng IELTS chuyên nghiệp, bao gồm:

### ✨ Tính năng chính

- **100 từ vựng IELTS Academic Level 1** - Từ quan trọng nhất theo IELTS UP
- **Phiên âm IPA chuẩn** - Học phát âm chính xác
- **Nghĩa tiếng Việt chi tiết** - Dễ hiểu và ghi nhớ
- **5 bài học có cấu trúc** - Mỗi bài 20 từ, học từng bước
- **Âm thanh phát âm** - Click để nghe phát âm chuẩn
- **Hình ảnh minh họa** - Hỗ trợ ghi nhớ bằng hình ảnh

### 🚀 Cách sử dụng

#### 1. Import dữ liệu IELTS
```
1. Truy cập: http://localhost:3000/admin
2. Click "Import dữ liệu IELTS" 
3. Đợi quá trình import hoàn tất
```

#### 2. Bắt đầu học
```
1. Vào trang chính: http://localhost:3000
2. Chọn bài học IELTS (Level 1)
3. Bắt đầu học với flashcards
```

#### 3. Tính năng học tập
- **Lật thẻ**: Click để xem nghĩa tiếng Việt
- **Nghe phát âm**: Click biểu tượng loa
- **Xem phiên âm**: IPA hiển thị ngay dưới từ tiếng Anh
- **Xem hình ảnh**: Hình ảnh minh họa ở mặt sau thẻ

### 📚 Cấu trúc bài học

```
IELTS Level 1 (1-20)    - achieve, administration, affect...
IELTS Level 1 (21-40)   - consistent, constitutional, consumer...
IELTS Level 1 (41-60)   - factors, feature, final...
IELTS Level 1 (61-80)   - media, method, modern...
IELTS Level 1 (81-100)  - regulations, relevant, require...
```

### 🎨 Giao diện mới

- **Phiên âm IPA**: Hiển thị với font mono, dễ đọc
- **Màu sắc phân loại**: Mỗi bài học có màu riêng biệt
- **Layout responsive**: Hoạt động tốt trên mọi thiết bị

### 🔧 Cập nhật kỹ thuật

#### Database Schema
```sql
-- Thêm cột IPA vào bảng flashcards
ALTER TABLE flashcards ADD COLUMN ipa TEXT;

-- Cập nhật types
interface Flashcard {
  ipa?: string | null  // Phiên âm IPA
  // ... các field khác
}
```

#### API Endpoints
- `POST /api/import-ielts` - Import dữ liệu IELTS
- `GET /api/flashcards?lesson=<id>` - Lấy flashcards theo bài học
- `POST /api/flashcards` - Tạo flashcard mới (hỗ trợ IPA)

### 🎯 Kế hoạch phát triển

#### Sắp tới
- [ ] IELTS Level 2, 3, 4, 5 (400 từ nữa)
- [ ] Bài tập trắc nghiệm
- [ ] Theo dõi tiến độ học tập
- [ ] Ôn tập thông minh (spaced repetition)

#### Nguồn dữ liệu bổ sung
- [ ] Academic Word List (AWL) - 570 từ
- [ ] IELTS 4000 Words PDF
- [ ] IELTS Liz Vocabulary (theo chủ đề)

### 📖 Nguồn tham khảo

1. **IELTS UP Academic Wordlist**: https://ielts-up.com/writing/ielts-academic-wordlist.html
2. **Academic Word List**: https://www.eapfoundation.com/vocab/academic/awllists/
3. **IELTS Liz**: https://ieltsliz.com/vocabulary/

### 🔥 Quick Start

```bash
# 1. Chạy ứng dụng
npm run dev

# 2. Truy cập trang admin
http://localhost:3000/admin

# 3. Import dữ liệu IELTS
Click "Import dữ liệu IELTS"

# 4. Bắt đầu học
http://localhost:3000
```

### ⚡ Tips học hiệu quả

1. **Học theo thứ tự**: Bắt đầu từ bài 1-20, sau đó tiếp tục
2. **Lặp lại**: Học mỗi bài nhiều lần trước khi chuyển bài mới  
3. **Chú ý phiên âm**: Đọc to theo IPA để học phát âm chuẩn
4. **Sử dụng ngữ cảnh**: Tạo câu với từ vừa học
5. **Ôn tập thường xuyên**: Quay lại bài cũ để củng cố

Chúc bạn học tốt! 🎓
