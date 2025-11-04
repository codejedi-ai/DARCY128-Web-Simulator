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
    { path: '/', label: 'Canvas' },
  ];

  return (
    <header 
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        background: "#353535",
        color: "white",
        padding: "15px 0",
        zIndex: 1000,
        boxShadow: "0 2px 4px rgba(0,0,0,0.5)",
        borderBottom: "1px solid #2a2a2a"
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
            fontSize: "20px",
            fontWeight: "600",
            color: "#ddd",
            letterSpacing: "0.5px"
          }}>
            Curious UI
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
                background: currentPath === item.path ? "#525252" : "transparent",
                border: "none",
                color: currentPath === item.path ? "#fff" : "#aaa",
                padding: "8px 16px",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "400",
                transition: "all 0.15s ease",
                textDecoration: "none"
              }}
              onMouseEnter={(e) => {
                if (currentPath !== item.path) {
                  e.currentTarget.style.background = "#454545";
                  e.currentTarget.style.color = "#fff";
                }
              }}
              onMouseLeave={(e) => {
                if (currentPath !== item.path) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#aaa";
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
