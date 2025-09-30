import { useState, useEffect } from 'react';

interface NavbarProps {
  screenWidth?: number;
}

const Navbar = ({ screenWidth }: NavbarProps = {}) => {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  // Handle navigation
  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  // Listen for browser navigation
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);
  
  const navItems = [
    { path: '/demo', label: 'Canvas' },
    { path: '/darcy128', label: '🚀 DARCY128' },
    { path: '/mips', label: 'MIPS32 (Legacy)' },
  ];

  return (
    <header 
      style={{
        position: "fixed", 
        top: 0,
        left: 0,
        width: "100%",
        background: "rgba(0, 0, 0, 0.9)",
        backdropFilter: "blur(10px)",
        color: "white",
        padding: "15px 0",
        zIndex: 1000,
        boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)"
      }}
    >
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        width: "100%",
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "0 20px",
        gap: "20px",
        boxSizing: "border-box"
      }}>
        {/* Left: Logo and Title */}
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          gap: "10px",
          flexShrink: 0,
          cursor: "pointer"
        }} onClick={() => navigate('/')}>
          <div style={{ 
            fontSize: "24px",
            fontWeight: "bold",
            color: "#00ffff"
          }}>
            DARCY128
          </div>
        </div>
        
        {/* Center: Navigation */}
        <nav style={{ 
          display: "flex", 
          gap: "20px",
          flex: 1,
          justifyContent: "center"
        }}>
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                background: currentPath === item.path ? "rgba(0, 255, 255, 0.2)" : "transparent",
                border: currentPath === item.path ? "1px solid rgba(0, 255, 255, 0.5)" : "1px solid transparent",
                color: currentPath === item.path ? "#00ffff" : "white",
                padding: "8px 16px",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: currentPath === item.path ? "600" : "400",
                transition: "all 0.2s ease",
                textDecoration: "none"
              }}
              onMouseEnter={(e) => {
                if (currentPath !== item.path) {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.3)";
                }
              }}
              onMouseLeave={(e) => {
                if (currentPath !== item.path) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.borderColor = "transparent";
                }
              }}
            >
              {item.label}
            </button>
          ))}
        </nav>
        
        {/* Right: Version Status */}
        <div style={{ 
          display: "flex", 
          alignItems: "center",
          flexShrink: 0,
          gap: "10px"
        }}>
          <div style={{ 
            fontSize: "12px",
            color: "#888"
          }}>
            v0.1.0-alpha
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
