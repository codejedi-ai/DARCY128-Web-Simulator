export function Navbar() {
  const navItems = [
    { label: 'test1' },
    { label: 'test2' },
    { label: 'test3' },
  ];

  return (
    <header className="bg-black text-white sticky top-0 z-50 shadow-lg">
      <div className="mx-8 lg:mx-16">
        <div className="flex items-center justify-between h-[70px]">
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <img 
              src="logo.png" 
              alt="University of Waterloo Logo" 
              className="w-10 h-10 rounded"
            />
            <div className="flex flex-col leading-none">
              <span className="text-xs font-normal tracking-widest text-gray-300">UNIVERSITY OF</span>
              <span className="text-lg font-bold tracking-wide text-white">WATERLOO</span>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8 flex-1 justify-center">
            {navItems.map((item) => (
              <a 
                key={item.label}
                href="#" 
                className="text-white text-sm font-normal py-2 transition-colors duration-200 hover:text-waterloo-gold whitespace-nowrap"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Search Section */}
          <div className="flex items-center">
            <div className="relative flex items-center">
              <input 
                type="text" 
                placeholder="Search" 
                className="bg-transparent border border-gray-600 text-white px-3 py-2 pr-10 rounded text-sm w-48 transition-all duration-200 placeholder-gray-400 focus:outline-none focus:border-waterloo-gold focus:bg-white/5"
              />
              <button className="absolute right-2 text-gray-400 hover:text-waterloo-gold transition-colors duration-200 p-1">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Color Bars */}
      <div className="waterloo-color-bars">
        <div className="color-bar color-bar-1"></div>
        <div className="color-bar color-bar-2"></div>
        <div className="color-bar color-bar-3"></div>
        <div className="color-bar color-bar-4"></div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden px-8 pb-4 border-t border-gray-700">
        <nav className="flex gap-4 pt-4 overflow-x-auto">
          {navItems.map((item) => (
            <a 
              key={item.label}
              href="#" 
              className="text-white text-sm font-normal py-2 transition-colors duration-200 hover:text-waterloo-gold whitespace-nowrap"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}