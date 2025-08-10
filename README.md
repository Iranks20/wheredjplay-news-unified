# WhereDJsPlay Unified Platform

A modern news platform for DJ and electronic music content, featuring both a public-facing news website and an admin panel for content management.

## 🚀 Features

### Frontend (Public)
- **News Website**: Modern, responsive design with dark/light mode
- **Article Display**: Rich article content with images and metadata
- **Category Filtering**: Browse articles by category
- **Newsletter Subscription**: Email subscription functionality
- **Social Sharing**: Share articles on social media platforms

### Admin Panel
- **Dashboard**: Analytics and overview statistics
- **Article Management**: Create, edit, publish, and delete articles
- **Category Management**: Organize content with categories
- **User Management**: Manage team members and permissions
- **Settings**: Platform configuration

### API Backend
- **RESTful API**: Complete CRUD operations
- **Authentication**: JWT-based authentication system
- **File Upload**: Image upload and processing
- **Analytics**: Dashboard statistics and view tracking
- **Search**: Advanced search functionality

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Lucide React** for icons

### Backend
- **Node.js** with Express.js
- **MySQL** database
- **JWT** for authentication
- **Multer** for file uploads
- **Sharp** for image processing

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

### 1. Clone and Setup Frontend

```bash
cd wheredjsplay-unified
npm install
```

### 2. Setup Environment Variables

Create a `.env` file in the frontend root:

```env
# API Configuration
VITE_API_URL=http://localhost:3001/api/v1

# App Configuration
VITE_APP_NAME=WhereDJsPlay
VITE_APP_VERSION=1.0.0

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_NEWSLETTER=true
```

### 3. Setup Backend

```bash
cd wheredjsplay-api
npm install
```

Create a `.env` file in the API root:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=wheredjsplay_news
DB_PORT=3306

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d

# File Upload Configuration
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS Configuration
CORS_ORIGIN=http://localhost:3001,http://localhost:5173

# API Configuration
API_PREFIX=/api/v1
```

### 4. Setup Database

Run the database setup scripts:

```bash
cd wheredjsplay-api
npm run migrate
npm run seed
```

### 5. Start the Application

#### Start the API Server
```bash
cd wheredjsplay-api
npm run dev
```

#### Start the Frontend
```bash
cd wheredjsplay-unified
npm run dev
```

## 🔐 Default Credentials

### Admin User
- **Email**: `admin@wheredjsplay.com`
- **Password**: `admin123`

### Sample Users
- **Editor**: `sarah@wheredjsplay.com` / `password123`
- **Author**: `mike@wheredjsplay.com` / `password123`
- **Author**: `lisa@wheredjsplay.com` / `password123`

## 📁 Project Structure

```
wheredjsplay-unified/
├── src/
│   ├── components/          # Reusable UI components
│   ├── contexts/           # React contexts (Auth, etc.)
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # API services and utilities
│   ├── pages/              # Admin panel pages
│   ├── screens/            # Frontend screens
│   └── utils/              # Utility functions
├── public/                 # Static assets
└── package.json

wheredjsplay-api/
├── config/                 # Database configuration
├── middleware/             # Express middleware
├── routes/                 # API route handlers
├── scripts/                # Database setup scripts
├── uploads/                # File upload directory
└── server.js              # Main server file
```

## 🔌 API Integration

### Centralized Configuration
The API base URL is configured in `src/lib/api.ts`:

```typescript
const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3
};
```

### Service Classes
All API calls are organized into service classes:

- `AuthService` - Authentication and user management
- `ArticlesService` - Article CRUD operations
- `CategoriesService` - Category management
- `UsersService` - User management
- `UploadService` - File upload handling
- `AnalyticsService` - Dashboard analytics
- `SearchService` - Search functionality
- `NewsletterService` - Newsletter subscriptions
- `SettingsService` - Platform settings

### Custom Hooks
State management for API calls:

- `useApi()` - Basic API state management
- `useApiWithPagination()` - Paginated API state management

### Authentication Context
Global authentication state management:

```typescript
const { user, isAuthenticated, login, logout } = useAuth();
```

## 🎨 Design System

### Frontend (WhereDJsPlay)
- **Primary Color**: `#09afdf` (wdp-accent)
- **Background**: Light gray to dark gray
- **Text**: Dark gray to white

### Admin Panel
- **Primary Color**: `#3b82f6` (admin-accent)
- **Background**: White to dark gray
- **Text**: Dark gray to white

## 🚀 Deployment

### Frontend (Netlify)
1. Build the project: `npm run build`
2. Deploy the `dist` folder to Netlify
3. Set environment variables in Netlify dashboard

### Backend (VPS/Cloud)
1. Set up a MySQL database
2. Configure environment variables
3. Run database migrations
4. Start the server with PM2: `pm2 start server.js`

## 📊 API Endpoints

### Authentication
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/register` - User registration
- `GET /api/v1/auth/me` - Get current user
- `POST /api/v1/auth/logout` - User logout

### Articles
- `GET /api/v1/articles` - Get all articles
- `GET /api/v1/articles/:id` - Get single article
- `POST /api/v1/articles` - Create article
- `PUT /api/v1/articles/:id` - Update article
- `DELETE /api/v1/articles/:id` - Delete article

### Categories
- `GET /api/v1/categories` - Get all categories
- `POST /api/v1/categories` - Create category
- `PUT /api/v1/categories/:id` - Update category
- `DELETE /api/v1/categories/:id` - Delete category

### Users
- `GET /api/v1/users` - Get all users
- `POST /api/v1/users` - Create user
- `PUT /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user

### Analytics
- `GET /api/v1/analytics/dashboard` - Dashboard statistics
- `GET /api/v1/analytics/articles` - Article analytics

## 🔧 Development

### Adding New API Endpoints
1. Add the endpoint to the appropriate service class in `src/lib/api.ts`
2. Create a custom hook if needed in `src/hooks/`
3. Use the service in your component

### Adding New Components
1. Create the component in `src/components/`
2. Export it from `src/components/index.ts`
3. Import and use in your pages/screens

### Database Schema Changes
1. Update the schema in `database_setup.sql`
2. Run migrations: `npm run migrate`
3. Update API routes if needed

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email contact@wheredjsplay.com or create an issue in the repository.
