# Database Seeding Guide

## Tổng quan

Script seed này sẽ populate database với mock data khớp với frontend để phát triển và testing.

## Dữ liệu được tạo

### Users (4 users)
- Admin: admin@example.com
- Instructor: john@example.com
- Students: jane@example.com, mike@example.com

### Courses (24 courses)
- Các category: Web Development, Data Science, Programming, Business, Design, AI & ML, etc.
- Rating, students, pricing, metadata đầy đủ
- 6 courses được publish, 18 courses draft

### Enrollments
- Mỗi student enroll 3-6 courses
- Progress và completed lessons ngẫu nhiên
- Total lessons = 20 cho mỗi course

### Transactions (3-8 transactions/user)
- Types: deposit, purchase, refund, withdrawal
- Status: completed, pending, failed
- Balance được cập nhật tương ứng

## Cách chạy

### 1. Đảm bảo MongoDB đang chạy
```bash
# Nếu dùng Docker
docker-compose up -d mongodb

# Hoặc MongoDB local
mongod
```

### 2. Cài đặt dependencies (nếu chưa)
```bash
cd server
npm install
```

### 3. Chạy seed script
```bash
npm run seed
```

### 4. Kiểm tra kết quả
```bash
# Kết nối MongoDB shell
mongo

# Xem collections
show collections

# Đếm documents
db.users.count()
db.courses.count()
db.enrollments.count()
db.transactions.count()
```

## API Endpoints để test

### Courses
```bash
# Get published courses
GET /v1/courses?is_published=true

# Get courses by category
GET /v1/courses?category=Web Development

# Search courses
GET /v1/courses?search=react
```

### Enrollments
```bash
# Get user enrollments
GET /v1/enrollments
```

### Transactions
```bash
# Get user transactions
GET /v1/transactions
```

## Cấu trúc dữ liệu khớp với Frontend

### Course Model
```javascript
{
  title, slug, description,
  instructor, instructor_id, category,
  thumbnail_url, pricing,
  rating, totalRatings, students,
  level, duration, type, tags,
  is_published, created_at, updated_at
}
```

### Enrollment Model
```javascript
{
  user_id, course_id,
  completedLessons, totalLessons,
  progress_percent, lastAccessedAt,
  status, created_at, updated_at
}
```

### Transaction Model
```javascript
{
  user_id, type, amount, balance_after,
  status, date, courseId,
  description, created_at, updated_at
}
```

## Troubleshooting

### Lỗi kết nối MongoDB
```bash
# Kiểm tra MongoDB đang chạy
ps aux | grep mongo

# Hoặc restart
sudo systemctl restart mongod
```

### Lỗi duplicate key
```bash
# Drop database và chạy lại
mongo
use your_database_name
db.dropDatabase()
exit
npm run seed
```

### Lỗi validation
- Kiểm tra required fields trong models
- Đảm bảo data types đúng

## Notes

- Script sẽ skip nếu data đã tồn tại
- Balance được cập nhật tự động theo transactions
- Courses có pricing với currency VND
- Progress được tính ngẫu nhiên nhưng hợp lý
