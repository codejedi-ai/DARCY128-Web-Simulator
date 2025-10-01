import { useState, useEffect } from 'preact/hooks';
import App from './App';
import FeaturesPage from './pages/pages/features';
import MIPS32CodeViewer from './components/MIPS32CodeViewer';
import RegisterView from './components/RegisterView';
import HexProgramInput from './components/HexProgramInput';

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

  // Route to MIPS instruction stepping (uses MIPS32CodeViewer)
  if (currentPath === '/step' || currentPath === '/mips-step') {
    return <MIPS32CodeViewer />;
  }

  // Route to Register View
  if (currentPath === '/registers' || currentPath === '/register-view') {
    return <RegisterView />;
  }

  // Route to Hex Program Input
  if (currentPath === '/hex' || currentPath === '/hex-input') {
    return <HexProgramInput />;
  }

  // Home -> Features (now hosts test suite)
  if (currentPath === '/' || currentPath === '/features') {
    return <FeaturesPage />;
  }

  // Default
  return <FeaturesPage />;
}
