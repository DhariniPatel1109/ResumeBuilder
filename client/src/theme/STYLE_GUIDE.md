# 🎨 ResumeBuilder Design System

## Overview
This design system provides a centralized way to manage all UI elements, colors, typography, and spacing across the entire ResumeBuilder application.

## 🎯 Key Benefits
- **Single Source of Truth**: All design decisions in one place
- **Consistency**: Same look and feel across all pages
- **Maintainability**: Easy to update colors, fonts, and styles globally
- **Developer Experience**: Type-safe theme access with IntelliSense
- **Scalability**: Easy to add new components and pages

## 🎨 Theme Structure

### Colors
```typescript
// Primary brand colors
primary: {
  500: '#667eea', // Main primary
  600: '#5a6fd8', // Hover state
  // ... more shades
}

// Secondary brand colors  
secondary: {
  500: '#764ba2', // Main secondary
  600: '#6a4190', // Hover state
  // ... more shades
}

// Semantic colors
success: { 500: '#22c55e' }
warning: { 500: '#f59e0b' }
error: { 500: '#ef4444' }
info: { 500: '#3b82f6' }
```

### Typography
```typescript
fontFamily: {
  sans: ['Inter', 'system-ui', 'sans-serif'],
  mono: ['JetBrains Mono', 'Monaco', 'Menlo', 'Ubuntu Mono', 'monospace'],
}

fontSize: {
  xs: ['0.75rem', { lineHeight: '1rem' }],    // 12px
  sm: ['0.875rem', { lineHeight: '1.25rem' }], // 14px
  base: ['1rem', { lineHeight: '1.5rem' }],    // 16px
  lg: ['1.125rem', { lineHeight: '1.75rem' }], // 18px
  xl: ['1.25rem', { lineHeight: '1.75rem' }],  // 20px
  '2xl': ['1.5rem', { lineHeight: '2rem' }],   // 24px
  '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px
}
```

### Spacing
```typescript
spacing: {
  1: '0.25rem',  // 4px
  2: '0.5rem',   // 8px
  3: '0.75rem',  // 12px
  4: '1rem',     // 16px
  6: '1.5rem',   // 24px
  8: '2rem',     // 32px
  12: '3rem',    // 48px
  16: '4rem',    // 64px
}
```

## 🧩 Component Library

### Button Component
```tsx
import Button from '../components/ui/Button';

// Usage
<Button variant="primary" size="lg" loading={false}>
  Click me
</Button>

// Variants: primary, secondary, outline, ghost, danger, success
// Sizes: sm, base, lg, xl
```

### Input Component
```tsx
import Input from '../components/ui/Input';

// Usage
<Input
  label="Company Name"
  placeholder="Enter company name"
  error="This field is required"
  leftIcon={<Icon />}
/>
```

### Card Component
```tsx
import Card from '../components/ui/Card';

// Usage
<Card variant="elevated" padding="lg">
  <h3>Card Title</h3>
  <p>Card content</p>
</Card>
```

### Section Component
*Note: Section component has been removed. Use Card component with proper styling for section layouts.*

## 🎯 Usage Patterns

### 1. Using Theme in Components
```tsx
import { useTheme } from '../theme/ThemeProvider';

const MyComponent = () => {
  const { theme } = useTheme();
  
  return (
    <div 
      style={{ 
        backgroundColor: theme.colors.primary[500],
        padding: theme.spacing[4]
      }}
    >
      Content
    </div>
  );
};
```

### 2. Using Tailwind with Theme
```tsx
// Tailwind classes automatically use our theme
<div className="bg-primary-500 text-white p-4 rounded-lg">
  Content
</div>
```

### 3. Page Layout
```tsx
import PageLayout from '../components/layout/PageLayout';

const MyPage = () => {
  return (
    <PageLayout
      title="Resume Editor"
      subtitle="Edit your resume content"
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Editor' }
      ]}
      headerActions={<Button>Save</Button>}
    >
      Page content
    </PageLayout>
  );
};
```

## 🔧 Customization

### Adding New Colors
```typescript
// In theme/index.ts
colors: {
  // ... existing colors
  brand: {
    500: '#your-color',
    600: '#your-color-dark',
  }
}
```

### Adding New Component Variants
```typescript
// In theme/index.ts
components: {
  button: {
    variants: {
      // ... existing variants
      custom: 'bg-brand-500 text-white hover:bg-brand-600'
    }
  }
}
```

### Updating Global Styles
```typescript
// In theme/index.ts
typography: {
  fontFamily: {
    sans: ['Your Font', 'system-ui', 'sans-serif'],
  }
}
```

## 📱 Responsive Design

All components are mobile-first and responsive by default:

```tsx
// Mobile-first approach
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  {/* Content */}
</div>

// Typography scales
<h1 className="text-2xl md:text-3xl lg:text-4xl">
  Responsive Title
</h1>
```

## 🌙 Dark Mode

Dark mode is automatically handled by the theme system:

```tsx
const { isDark, toggleTheme } = useTheme();

// Toggle between light and dark
<Button onClick={toggleTheme}>
  {isDark ? '☀️ Light' : '🌙 Dark'}
</Button>
```

## 🚀 Best Practices

1. **Always use the theme system** - Don't hardcode colors or spacing
2. **Use semantic color names** - `error-500` instead of `red-500`
3. **Follow the spacing scale** - Use predefined spacing values
4. **Use component variants** - Don't create custom styles for common patterns
5. **Keep it consistent** - Use the same patterns across all pages
6. **Test responsiveness** - Always test on mobile and desktop
7. **Use TypeScript** - Get type safety and IntelliSense

## 🔄 Migration Guide

### From Custom CSS to Theme System

**Before:**
```css
.my-button {
  background: #667eea;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
}
```

**After:**
```tsx
<Button variant="primary" size="lg">
  Click me
</Button>
```

### From Inline Styles to Theme

**Before:**
```tsx
<div style={{ backgroundColor: '#667eea', padding: '16px' }}>
  Content
</div>
```

**After:**
```tsx
<div className="bg-primary-500 p-4">
  Content
</div>
```

This design system ensures consistency, maintainability, and a great developer experience across the entire ResumeBuilder application! 🎨✨
