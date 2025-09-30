import { useState, useEffect } from 'preact/hooks';
import App from './App';
import FeaturesPage from './pages/pages/features';
import MipsEmulator from './components/MipsEmulator';

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

  // Route to MIPS emulator
  if (currentPath === '/mips' || currentPath === '/emulator') {
    return <MipsEmulator screenWidth={window.innerWidth} />;
  }

  // Route to Features (home page)
  if (currentPath === '/' || currentPath === '/features') {
    return <FeaturesPage />;
  }

  // Default to Features page
  return <FeaturesPage />;
}
