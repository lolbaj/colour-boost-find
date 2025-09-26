# Colour Boost Find - Improved Version

This is an enhanced version of the Colour Boost Find resource discovery platform with several improvements:

## Key Improvements

### 1. User Authentication
- Added Firebase Authentication for user login/signup
- Implemented protected routes for user-only pages
- Created profile management system
- Added logout functionality

### 2. API Integration
- Replaced mock data with real API service
- Implemented React Query for efficient data fetching
- Added loading and error states for better UX
- Created API service layer for resource management

### 3. Performance Optimizations
- Implemented image lazy loading with blur effects
- Added code splitting for route components
- Optimized bundle size with tree-shaking
- Added caching strategies for better performance

### 4. UI/UX Enhancements
- Added advanced search functionality with filtering options
- Implemented search suggestions
- Added color-based filtering
- Created resource preview galleries
- Added resource rating system

## Getting Started

### Prerequisites
- Node.js
- npm or yarn

### Installation
```bash
npm install
```

### Environment Setup
Create a `.env` file with the following variables:
```
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_API_BASE_URL=your_api_base_url
```

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

## Features

### Authentication
- User registration and login
- Profile management
- Protected routes

### Resource Management
- Browse resources by category
- Search resources with advanced filters
- Like and download resources
- View resource details

### Performance
- Lazy loading images
- Code splitting
- Caching strategies

## Technologies Used

- React with TypeScript
- Vite
- Firebase Authentication
- React Query
- Tailwind CSS
- shadcn/ui components
- React Router DOM

## Folder Structure

```
src/
├── components/          # Reusable UI components
├── contexts/            # React context providers
│   ├── auth/            # Authentication context
│   └── resources/       # Resources context
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions and API service
├── pages/               # Page components
│   ├── auth/            # Authentication pages
│   └── ...              # Other pages
└── ...
```

## License
MIT