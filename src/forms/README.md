# Forms Documentation

This directory contains production-ready forms built with Formik, Yup, and shadcn/ui components. All forms are fully typed with TypeScript and ready to submit data to your backend API.

## 📁 Structure

```
forms/
├── ContactForm/
│   ├── ContactForm.tsx
│   └── validation.ts
├── FAQForm/
│   ├── FAQForm.tsx
│   └── validation.ts
├── OurStoryForm/
│   ├── OurStoryForm.tsx
│   └── validation.ts
├── RealWinnersForm/
│   ├── RealWinnersForm.tsx
│   └── validation.ts
├── ServicesForm/
│   ├── ServicesForm.tsx
│   └── validation.ts
├── SettingForm/
│   ├── SettingForm.tsx
│   └── validation.ts
├── UnitedVoicesForm/
│   ├── UnitedVoicesForm.tsx
│   └── validation.ts
├── BannerForm/
│   ├── BannerForm.tsx
│   └── validation.ts
└── index.ts
```

## 🚀 Available Forms

### 1. Contact Form
**Endpoint:** `POST /api/contact`

A standard contact form with name, email, phone, and message fields.

**Usage:**
```tsx
import { ContactForm } from '@/forms';

function ContactPage() {
  return <ContactForm />;
}
```

**Fields:**
- First Name (required)
- Last Name (required)
- Email (required, email format)
- Phone Number (required, 10-15 digits)
- Message (required, min 10 characters)

---

### 2. FAQ Form
**Endpoint:** `POST /api/faq`

Manage FAQs with image upload and dynamic question-answer pairs.

**Usage:**
```tsx
import { FAQForm } from '@/forms';

function FAQManagementPage() {
  return <FAQForm />;
}
```

**Fields:**
- Image Upload (required)
- FAQ Array (min 1 item)
  - Question (required)
  - Answer (required, min 20 characters)

---

### 3. Our Story Form
**Endpoint:** `POST /api/our-story`

Complex nested form for managing story sections with multiple content arrays.

**Usage:**
```tsx
import { OurStoryForm } from '@/forms';

function OurStoryPage() {
  return <OurStoryForm />;
}
```

**Fields:**
- Sections Array (min 1)
  - Title (required)
  - Content Array (required)
  - Points Array (optional)
  - Ending (optional)
  - Sub Title (optional)
  - Sub Points Array (optional)

---

### 4. Real Winners Form
**Endpoint:** `POST /api/real-winners`

Create winner showcases with icon selection.

**Usage:**
```tsx
import { RealWinnersForm } from '@/forms';

function RealWinnersPage() {
  return <RealWinnersForm />;
}
```

**Fields:**
- Section Title (required)
- Section Description (required)
- Winners List Array (min 1)
  - Icon (required, dropdown selection)
  - Title (required)
  - Description (required, max 500 chars)

**Available Icons:**
- Trophy, Medal, Star, Crown, Award
- Heart, Thumbs Up, Check, Check Circle, Gem

---

### 5. Services Form
**Endpoint:** `POST /api/services`

Comprehensive service management with tabs for organization.

**Usage:**
```tsx
import { ServicesForm } from '@/forms';

function ServicesPage() {
  return <ServicesForm />;
}
```

**Features:**
- Tabbed interface (Basic Info, Demands & References, Details)
- Image upload with preview
- Dynamic demands array
- Optional references with URL validation
- Nested details sections

**Fields:**
- Title (required)
- Description (required)
- Image (required)
- URL Slug (required, lowercase with hyphens)
- Demands Array (required, min 1)
- Demand Text (optional)
- References Array (optional)
- Details Object (optional)
  - Intro (optional)
  - Sections Array with unique keys

---

### 6. Setting Form
**Endpoint:** `POST /api/settings`

Site-wide settings including logo and social media links.

**Usage:**
```tsx
import { SettingForm } from '@/forms';

function SettingsPage() {
  return <SettingForm />;
}
```

**Fields:**
- Site Title (required)
- Site Description (required)
- Logo Upload (optional)
- Address (optional)
- Phone (optional)
- Email (optional, email format)
- Social Links Array (optional)
  - Platform (required)
  - URL (required, URL format)
  - Icon (required, dropdown)

**Available Social Icons:**
- Facebook, Twitter, Instagram, LinkedIn
- YouTube, WhatsApp, TikTok, GitHub
- Pinterest, Reddit

---

### 7. United Voices Form
**Endpoint:** `POST /api/united-voices`

Dual image upload with file size and type validation.

**Usage:**
```tsx
import { UnitedVoicesForm } from '@/forms';

function UnitedVoicesPage() {
  return <UnitedVoicesForm />;
}
```

**Fields:**
- Title (optional)
- Sub Title (optional)
- Description (optional)
- Front Image (required, JPEG/PNG, max 2MB)
- Back Image (required, JPEG/PNG, max 2MB)
- Voices Array (optional)
  - Heading (optional)
  - Sub Heading (optional)

**File Validation:**
- Only JPEG and PNG formats
- Maximum 2MB file size
- Real-time file size display

---

### 8. Banner Form
**Endpoint:** `POST /api/banner`

Simple banner configuration form.

**Usage:**
```tsx
import { BannerForm } from '@/forms';

function BannerPage() {
  return <BannerForm />;
}
```

**Fields:**
- Title (optional)
- Sub Title (optional)

---

## 🔧 Configuration

### API Base URL

Configure your API base URL in your `.env` file:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

The axios instance is located at `src/lib/axios.ts` and automatically:
- Adds authentication tokens from localStorage
- Handles common HTTP errors (401, 403, 404, 500)
- Sets proper headers for multipart/form-data

### Authentication

The axios instance automatically adds Bearer tokens from localStorage:

```typescript
// Set token after login
localStorage.setItem('authToken', 'your-token-here');

// Forms will automatically include this in requests
```

---

## 🎨 Styling

All forms use shadcn/ui components which are already installed in your project:
- Card, CardHeader, CardTitle, CardDescription, CardContent
- Button, Input, Textarea, Label
- Select, Separator, Tabs
- Toast notifications for success/error messages

Forms are fully responsive and follow these breakpoints:
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

---

## 📝 TypeScript Types

All form types are defined in `src/types/forms.ts`:

```typescript
import type {
  ContactFormData,
  FAQFormData,
  OurStoryFormData,
  RealWinnersFormData,
  ServicesFormData,
  SettingFormData,
  UnitedVoicesFormData,
  BannerFormData,
} from '@/types/forms';
```

---

## 🔒 Validation

All forms use Yup validation schemas with:
- Required field validation
- Type validation (email, URL, file types)
- Length constraints (min/max characters)
- Custom validation (file size, unique keys)
- Real-time error messages

---

## 📤 Form Submission

All forms follow this pattern:

1. **Client-side validation** - Yup schema validation
2. **Loading state** - Submit button shows spinner
3. **FormData creation** - For forms with file uploads
4. **API request** - Using axios instance
5. **Success handling** - Toast notification + form reset
6. **Error handling** - Toast notification with error message

### Example Response Handling:

```typescript
// Success
{
  title: 'Success!',
  description: 'Form submitted successfully',
  variant: 'default'
}

// Error
{
  title: 'Error',
  description: error.response?.data?.message || 'Failed to submit',
  variant: 'destructive'
}
```

---

## 🧪 Testing Forms

### Test individual forms:

```tsx
import { ContactForm } from '@/forms';

// In your test component/page
<ContactForm />
```

### Mock API for testing:

```typescript
// Setup mock server or use environment variable
VITE_API_BASE_URL=https://jsonplaceholder.typicode.com
```

---

## 🐛 Common Issues

### Issue: Images not uploading
**Solution:** Ensure backend accepts `multipart/form-data` and file field names match.

### Issue: Validation not working
**Solution:** Check Yup schema and ensure field names match form fields.

### Issue: Toast not showing
**Solution:** Ensure Toaster component is rendered in your app root:

```tsx
import { Toaster } from '@/components/ui/toaster';

function App() {
  return (
    <>
      {/* Your app content */}
      <Toaster />
    </>
  );
}
```

---

## 📚 Dependencies

```json
{
  "formik": "^2.4.5",
  "yup": "^1.3.3",
  "axios": "^1.6.2",
  "react-icons": "^4.12.0",
  "lucide-react": "latest"
}
```

All shadcn/ui components are already installed in your project.

---

## 🎯 Best Practices

1. **Always validate on both client and server** - Never trust client-side validation alone
2. **Handle file uploads properly** - Check file size and type on server
3. **Sanitize user input** - Prevent XSS and injection attacks
4. **Use environment variables** - Never hardcode API URLs
5. **Implement rate limiting** - Prevent spam submissions
6. **Log errors properly** - Use proper error tracking (Sentry, etc.)

---

## 🔐 Security Considerations

- All forms include CSRF protection via axios interceptors
- File uploads are validated for type and size
- URLs are validated before submission
- Email addresses are validated using Yup email schema
- Phone numbers use regex validation

---

## 📱 Responsive Design

All forms are mobile-first and responsive:
- Single column on mobile
- Two columns for related fields on tablet/desktop
- Touch-friendly buttons and inputs
- Proper spacing and padding
- Accessible labels and error messages

---

## ♿ Accessibility

Forms include:
- Proper label associations
- ARIA attributes
- Keyboard navigation support
- Focus management
- Error announcements
- Required field indicators

---

## 📞 Support

For issues or questions:
1. Check form validation schema
2. Verify API endpoint configuration
3. Check browser console for errors
4. Review axios instance configuration
5. Ensure all dependencies are installed

---

## 🔄 Updates

To update forms:
1. Modify validation schema in `validation.ts`
2. Update TypeScript types in `types/forms.ts`
3. Adjust form component as needed
4. Test thoroughly before deployment

---

Made with ❤️ using React, Formik, Yup, and shadcn/ui
