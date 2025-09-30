import { useState, useEffect } from 'preact/hooks';
import App from './App';
import FeaturesPage from './pages/pages/features';
import Darcy128CodeViewer from './components/Darcy128CodeViewer';
import RegisterView from './components/RegisterView';

export default function Router() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

  // Route to canvas demo
  if (currentPath === '/demo' || currentPath === '/canvas') {
    return <App onNavigate={navigate} />;
  }

  // Route to MIPS instruction stepping (uses Darcy128CodeViewer)
  if (currentPath === '/step' || currentPath === '/mips-step') {
    return <Darcy128CodeViewer />;
  }

  // Route to Register View
  if (currentPath === '/registers' || currentPath === '/register-view') {
    return <RegisterView />;
  }

  // Home -> Features (now hosts test suite)
  if (currentPath === '/' || currentPath === '/features') {
    return <FeaturesPage />;
  }

  // Default
  return <FeaturesPage />;
}
