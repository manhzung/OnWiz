# Hướng dẫn chuyển đổi CSS sang Tailwind

## Đã hoàn thành

✅ **Components/Common:**
- Button.tsx
- Card.tsx
- Input.tsx
- ProgressBar.tsx
- Table.tsx
- Badge.tsx
- PointsDisplay.tsx

✅ **Components/Layout:**
- Header.tsx
- Footer.tsx
- MainLayout.tsx
- AdminLayout.tsx

✅ **Global Styles:**
- tailwind.css (thay thế global.css và variables.css)

## Cần chuyển đổi

### Pages cần chuyển đổi:
1. `pages/Home/Home.tsx` và `Home.css`
2. `pages/About/About.tsx` và `About.css`
3. `pages/Auth/Auth.tsx` và `Auth.css`
4. `pages/Course/Course.tsx` và `Course.css`
5. `pages/Courses/Courses.tsx` và `Courses.css`
6. `pages/Learning/Learning.tsx` và `Learning.css`
7. `pages/Learning/Theory/Theory.tsx` và `Theory.css`
8. `pages/Learning/Quiz/Quiz.tsx` và `Quiz.css`
9. `pages/Learning/Quiz/QuizResult.tsx` và `QuizResult.css`
10. `pages/Learning/Video/Video.tsx` và `Video.css`
11. `pages/MyLearning/MyLearning.tsx` và `MyLearning.css`
12. `pages/admin/Dashboard/Dashboard.tsx` và `Dashboard.css`
13. `pages/admin/Users/Users.tsx` và `Users.css`
14. `pages/admin/Groups/Groups.tsx` và `Groups.css`
15. `pages/admin/Payments/Payments.tsx` và `Payments.css`

## Cách chuyển đổi

### Bước 1: Xóa import CSS
```tsx
// Xóa dòng này:
import './ComponentName.css';
```

### Bước 2: Import cn utility
```tsx
import { cn } from '../../utils/cn';
```

### Bước 3: Chuyển đổi className
Thay thế các className CSS bằng Tailwind classes:

**Ví dụ:**
```tsx
// Trước:
<div className="container">
  <h1 className="title">Hello</h1>
</div>

// Sau:
<div className="max-w-7xl mx-auto px-6">
  <h1 className="text-3xl font-bold text-gray-900">Hello</h1>
</div>
```

### Bước 4: Sử dụng cn() cho conditional classes
```tsx
// Trước:
<div className={`card ${isActive ? 'active' : ''}`}>

// Sau:
<div className={cn('bg-white rounded-lg', isActive && 'border-primary')}>
```

## Mapping CSS Variables sang Tailwind

| CSS Variable | Tailwind Class |
|-------------|---------------|
| `var(--color-primary)` | `text-primary` hoặc `bg-primary` |
| `var(--color-gray-200)` | `text-gray-200` hoặc `bg-gray-200` |
| `var(--spacing-md)` | `p-4` hoặc `gap-4` |
| `var(--radius-lg)` | `rounded-xl` |
| `var(--gradient-primary)` | `bg-gradient-primary` |
| `var(--shadow-md)` | `shadow-md` |

## Lưu ý

1. **Gradients:** Sử dụng `bg-gradient-primary` đã được định nghĩa trong `tailwind.config.js`
2. **Animations:** Có thể cần thêm vào `tailwind.config.js` hoặc sử dụng inline styles
3. **Pseudo-elements:** Sử dụng Tailwind's `before:` và `after:` utilities
4. **Responsive:** Sử dụng `max-md:`, `max-lg:` cho breakpoints

## Sau khi chuyển đổi xong

1. Xóa tất cả các file `.css` trong `pages/` và `components/`
2. Kiểm tra lại ứng dụng hoạt động bình thường
3. Test responsive trên các thiết bị khác nhau

