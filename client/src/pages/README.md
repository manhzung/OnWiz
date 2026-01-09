# Pages Structure

Cấu trúc các trang trong ứng dụng được tổ chức như sau:

## 📁 Cấu trúc thư mục

```
pages/
├── index.ts                 # Export tập trung tất cả pages
├── Home/                    # Trang chủ
│   ├── index.ts
│   ├── Home.tsx
│   └── Home.css
├── About/                   # Trang giới thiệu
│   ├── index.ts
│   ├── About.tsx
│   └── About.css
├── Auth/                    # Trang đăng nhập/đăng ký
│   ├── index.ts
│   ├── Auth.tsx
│   └── Auth.css
└── admin/                   # Admin pages
    ├── index.ts             # Export tập trung admin pages
    ├── Dashboard/
    │   ├── index.ts
    │   ├── Dashboard.tsx
    │   └── Dashboard.css
    ├── Users/
    │   ├── index.ts
    │   ├── Users.tsx
    │   └── Users.css
    ├── Groups/
    │   ├── index.ts
    │   ├── Groups.tsx
    │   └── Groups.css
    └── Payments/
        ├── index.ts
        ├── Payments.tsx
        └── Payments.css
```

## 📝 Cấu trúc file chuẩn

Mỗi file page component nên tuân theo cấu trúc sau:

```typescript
/**
 * Page description
 */

// 1. React imports
import { useState } from 'react';

// 2. Component imports
import { Button } from '../components/common/Button';

// 3. Config/Utils imports
import { ROUTES } from '../config/routes';

// 4. Styles
import './PageName.css';

// ============================================================================
// Types (nếu có)
// ============================================================================

interface CustomType {
  // ...
}

// ============================================================================
// Component
// ============================================================================

export const PageName = () => {
  // ==========================================================================
  // Hooks & Router
  // ==========================================================================
  const navigate = useNavigate();
  
  // ==========================================================================
  // State Management
  // ==========================================================================
  const [state, setState] = useState();
  
  // ==========================================================================
  // Effects
  // ==========================================================================
  useEffect(() => {
    // ...
  }, []);
  
  // ==========================================================================
  // Handlers
  // ==========================================================================
  const handleAction = () => {
    // ...
  };
  
  // ==========================================================================
  // Validation
  // ==========================================================================
  const validate = () => {
    // ...
  };
  
  // ==========================================================================
  // Data
  // ==========================================================================
  const data = [];
  
  // ==========================================================================
  // Computed Values
  // ==========================================================================
  const filteredData = data.filter();
  
  // ==========================================================================
  // Render
  // ==========================================================================
  return (
    // JSX
  );
};
```

## 🎯 Quy tắc

1. **Imports**: Sắp xếp theo thứ tự:
   - React hooks
   - Components
   - Config/Utils
   - Styles

2. **Sections**: Chia code thành các sections rõ ràng với comments
   - Types
   - Hooks & Router
   - State Management
   - Effects
   - Handlers
   - Validation
   - Data
   - Computed Values
   - Render

3. **Naming**: 
   - Component: PascalCase
   - File: PascalCase.tsx
   - CSS: PascalCase.css

4. **Exports**: Sử dụng named exports

## 📦 Sử dụng

```typescript
// Import từ index
import { Home, About, Auth } from './pages';
import { Dashboard, Users } from './pages/admin';
```

