# Welcome to Admin Dashboard

A comprehensive admin dashboard with **8 production-ready forms** built using React, TypeScript, Formik, Yup, and shadcn/ui components.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env and set VITE_API_BASE_URL

# Start development server
npm run dev

# Navigate to http://localhost:5173/forms to see all forms
```

## ✨ What's Included

### 8 Production-Ready Forms
1. **Contact Form** - Standard contact with validation
2. **FAQ Form** - Image upload + dynamic Q&A
3. **Our Story Form** - Complex nested sections
4. **Real Winners Form** - Icon selector + winners list
5. **Services Form** - Tabbed interface with comprehensive fields
6. **Settings Form** - Site config + social media
7. **United Voices Form** - Dual image upload (2MB max)
8. **Banner Form** - Simple title/subtitle

### Features
- ✅ Full TypeScript support
- ✅ Formik form management
- ✅ Yup validation schemas
- ✅ File upload with preview
- ✅ Dynamic arrays (add/remove)
- ✅ Icon selectors
- ✅ Toast notifications
- ✅ Loading states
- ✅ Responsive design
- ✅ Accessibility support

## 📚 Documentation

**Start Here:**
- **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** - Quick start guide ⚡
- **[DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md)** - Complete docs index

**Complete Guides:**
- [FORMS_GUIDE.md](FORMS_GUIDE.md) - Implementation guide
- [API_ENDPOINTS.md](API_ENDPOINTS.md) - Backend specifications
- [ARCHITECTURE.md](ARCHITECTURE.md) - System architecture
- [src/forms/README.md](src/forms/README.md) - Detailed form docs

## 🎯 Usage

### Import Forms
```tsx
import { ContactForm, FAQForm, ServicesForm } from '@/forms';

function MyPage() {
  return <ContactForm />;
}
```

### Access Types
```tsx
import type { ContactFormData } from '@/types/forms';
```

### Demo Page
Visit `/forms` in your browser to see all forms in action with comprehensive examples.

## Project info

**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
