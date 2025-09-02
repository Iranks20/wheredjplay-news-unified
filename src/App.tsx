import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import * as Components from './components';
import * as Screens from './screens';
import * as Pages from './pages';
import { AuthProvider } from './contexts/AuthContext';

// 404 Page Component
function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-wdp-background flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl font-bold text-wdp-accent mb-4">404</div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-wdp-text mb-4">
          Page Not Found
        </h1>
        <p className="text-gray-600 dark:text-wdp-text/80 mb-8 max-w-md">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <a
          href="/"
          className="inline-flex items-center px-6 py-3 bg-wdp-accent text-white rounded-lg font-semibold hover:bg-wdp-accent-hover transition-colors"
        >
          Go to Homepage
        </a>
      </div>
    </div>
  );
}

function App() {
  // Initialize theme from localStorage
  useEffect(() => {
    const theme = localStorage.getItem('theme') || 'dark';
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, []);

  return (
    <AuthProvider>
      <Router basename="/wdjpnews">
        <div className="flex flex-col min-h-screen">
          <Routes>
            {/* Frontend Routes */}
            <Route path="/" element={<Screens.Homepage />} />
            <Route path="/article/:slug" element={<Screens.ArticleDetail />} />
            <Route path="/category/:category" element={<Screens.Homepage />} />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<Pages.Login />} />
            <Route path="/admin" element={<Components.ProtectedRoute />}>
              <Route element={<Components.Layout />}>
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<Pages.Dashboard />} />
                <Route path="articles" element={<Pages.Articles />} />
                <Route path="articles/new" element={<Pages.ArticleEditor />} />
                <Route path="articles/edit/:id" element={<Pages.ArticleEditor />} />
                <Route path="categories" element={<Pages.Categories />} />
                <Route path="categories/new" element={<Pages.CategoryEditor />} />
                <Route path="categories/edit/:id" element={<Pages.CategoryEditor />} />
                <Route path="users" element={<Pages.Users />} />
                <Route path="users/new" element={<Pages.UserEditor />} />
                <Route path="users/edit/:id" element={<Pages.UserEditor />} />
                <Route path="subscribers" element={<Pages.Subscribers />} />
                <Route path="settings" element={<Pages.Settings />} />
              </Route>
            </Route>
            
            {/* 404 Route - Must be last */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App; 