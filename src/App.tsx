import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import * as Components from './components';
import * as Screens from './screens';
import * as Pages from './pages';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  // Initialize theme from localStorage
  useEffect(() => {
    const theme = localStorage.getItem('theme') || 'light';
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, []);

  return (
    <AuthProvider>
      <Router>
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
                <Route path="settings" element={<Pages.Settings />} />
              </Route>
            </Route>
            
            {/* Catch all route - redirect to homepage */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App; 