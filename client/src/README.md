# Cấu trúc thư mục Frontend

Cấu trúc này được tổ chức theo các nguyên tắc best practices cho React applications.

## 📁 Cấu trúc thư mục

```
src/
├── components/          # React components
│   ├── common/         # Components tái sử dụng (Button, Input, Card, etc.)
│   ├── layout/         # Layout components (Header, Footer, Sidebar, etc.)
│   └── features/       # Components theo feature cụ thể
│
├── pages/              # Page components (Home, About, Login, etc.)
│
├── hooks/              # Custom React hooks
│   └── useAuth.ts      # Authentication hook
│
├── services/           # API services
│   └── auth.service.ts # Authentication service
│
├── utils/              # Utility functions
│   ├── apiClient.ts    # HTTP client với interceptors
│   ├── format.ts       # Formatting utilities (date, currency, etc.)
│   └── validation.ts   # Validation utilities
│
├── types/              # TypeScript type definitions
│   └── index.ts        # Common types và interfaces
│
├── constants/          # Application constants
│   └── apiEndpoints.ts # API endpoints
│
├── contexts/           # React Context providers
│
├── config/             # Configuration files
│   ├── env.ts          # Environment variables
│   └── routes.ts       # Route definitions
│
├── styles/             # Global styles
│   ├── global.css      # Global styles
│   └── variables.css   # CSS variables
│
├── assets/             # Static assets (images, icons, etc.)
│
├── App.tsx             # Root component với routing
└── main.tsx            # Application entry point
```

## 🎯 Quy tắc tổ chức

### Components
- **common/**: Các component có thể tái sử dụng ở nhiều nơi
- **layout/**: Các component layout (Header, Footer, Sidebar)
- **features/**: Các component theo feature cụ thể (ví dụ: CourseCard, UserProfile)

### Pages
- Mỗi page là một route trong ứng dụng
- Pages sử dụng components từ `components/` để xây dựng UI

### Services
- Chứa các hàm gọi API
- Mỗi service tương ứng với một domain (auth, user, course, etc.)

### Hooks
- Custom hooks để tái sử dụng logic
- Ví dụ: `useAuth`, `useApi`, `useLocalStorage`

### Utils
- Các hàm utility không phụ thuộc vào React
- Format, validation, helpers, etc.

### Types
- TypeScript type definitions
- Tổ chức theo domain hoặc chức năng

### Constants
- Các giá trị không đổi trong ứng dụng
- API endpoints, configuration values, etc.

### Config
- Cấu hình ứng dụng
- Environment variables, routes, theme, etc.

## 📝 Best Practices

1. **Import paths**: Sử dụng absolute imports từ `src/`
   ```typescript
   import { Button } from 'components/common';
   import { useAuth } from 'hooks';
   ```

2. **File naming**: 
   - Components: PascalCase (Button.tsx)
   - Utilities: camelCase (format.ts)
   - Types: camelCase với .types.ts (user.types.ts)

3. **Exports**: Tạo file `index.ts` trong mỗi thư mục để export tập trung

4. **Styling**: 
   - CSS modules hoặc CSS files cùng tên với component
   - Global styles trong `styles/`
   - CSS variables trong `styles/variables.css`

5. **TypeScript**: 
   - Luôn định nghĩa types cho props và functions
   - Sử dụng interfaces cho object types

## 🚀 Sử dụng

### Thêm một page mới:
1. Tạo file trong `pages/NewPage.tsx`
2. Thêm route trong `config/routes.ts`
3. Thêm route trong `App.tsx`

### Thêm một component mới:
1. Tạo file trong `components/common/` hoặc `components/features/`
2. Export từ `components/common/index.ts` hoặc tương ứng
3. Import và sử dụng trong pages/components

### Thêm một service mới:
1. Tạo file trong `services/newService.service.ts`
2. Export từ `services/index.ts`
3. Sử dụng trong hooks hoặc components

## 📚 Ví dụ

### Sử dụng API Client:
```typescript
import { apiClient } from 'utils/apiClient';
import { API_ENDPOINTS } from 'constants/apiEndpoints';

const data = await apiClient.get(API_ENDPOINTS.USERS.PROFILE);
```

### Sử dụng Auth Hook:
```typescript
import { useAuth } from 'hooks';

const { user, login, logout, isAuthenticated } = useAuth();
```

### Sử dụng Format Utils:
```typescript
import { formatDate, formatCurrency } from 'utils/format';

const formattedDate = formatDate(new Date());
const formattedPrice = formatCurrency(1000000);
```

