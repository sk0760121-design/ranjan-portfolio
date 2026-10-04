import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CMSProvider } from './context/CMSContext';
import { PortfolioHome } from './pages/PortfolioHome';
import { ProjectDetail } from './pages/ProjectDetail';
import { AdminLayout } from './admin/AdminLayout';
import { AdminLogin } from './admin/AdminLogin';
import { DynamicTypography } from './components/DynamicTypography';

const AppContent: React.FC = () => {
  const { user, isAdmin, loading } = useAuth();
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname + window.location.hash;
  });

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname + window.location.hash);
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  // Check if current route is admin
  const isAdminRoute =
    currentPath.startsWith('/admin') ||
    currentPath.includes('#admin') ||
    window.location.pathname === '/admin' ||
    window.location.hash.startsWith('#admin');

  // Check if route is a project detail view
  const projectMatch =
    currentPath.match(/\/project\/([a-zA-Z0-9_-]+)/) ||
    currentPath.match(/#project\/([a-zA-Z0-9_-]+)/);

  if (isAdminRoute) {
    if (loading) {
      return (
        <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-2 border-[#FF2027] border-t-transparent rounded-full animate-spin" />
            <span className="text-xs uppercase font-mono tracking-widest text-[#8A8A8A]">
              Verifying Authorization...
            </span>
          </div>
        </div>
      );
    }

    if (user && isAdmin) {
      return <AdminLayout />;
    }

    return <AdminLogin />;
  }

  if (projectMatch && projectMatch[1]) {
    return (
      <ProjectDetail
        slug={projectMatch[1]}
        onBack={() => {
          if (window.location.hash) {
            window.location.hash = '';
          } else {
            window.history.pushState({}, '', '/');
            setCurrentPath('/');
          }
        }}
      />
    );
  }

  return <PortfolioHome />;
};

export default function App() {
  return (
    <AuthProvider>
      <CMSProvider>
        <DynamicTypography />
        <AppContent />
      </CMSProvider>
    </AuthProvider>
  );
}
