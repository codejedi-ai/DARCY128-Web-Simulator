import { useState, useEffect } from 'preact/hooks';
import App from './App';
import FeaturesPage from './pages/pages/features';
import MipsEmulator from './components/MipsEmulator';
import Darcy128CodeViewer from './components/Darcy128CodeViewer';
import Darcy128TestSuite from './components/Darcy128TestSuite';

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

  // Route to MIPS emulator (legacy)
  if (currentPath === '/mips' || currentPath === '/emulator') {
    return <MipsEmulator screenWidth={window.innerWidth} />;
  }

  // Route to Darcy128 emulator (revolutionary 128-bit processor)
  if (currentPath === '/darcy128' || currentPath === '/darcy128-emulator') {
    return <Darcy128CodeViewer />;
  }

  // Route to Darcy128 Test Suite
  if (currentPath === '/tests' || currentPath === '/test-suite') {
    return <Darcy128TestSuite />;
  }

  // Route to Features (home page)
  if (currentPath === '/' || currentPath === '/features') {
    return <FeaturesPage />;
  }

  // Default to Features page
  return <FeaturesPage />;
}
