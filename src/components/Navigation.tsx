import { useLocation } from 'preact-iso';

export function Navigation() {
	const { url } = useLocation();

	const navItems = [
		{ label: 'Admissions', href: '/admissions' },
		{ label: 'About Waterloo', href: '/about' },
		{ label: 'Faculties & Academics', href: '/academics' },
		{ label: 'Offices & Services', href: '/services' },
		{ label: 'Support Waterloo', href: '/support' },
	];

	return (
		<header className="waterloo-header">
			<div className="header-container">
				<div className="logo-section">
					<img 
						src="logo.png" 
						alt="University of Waterloo Logo" 
						className="logo"
					/>
					<div className="logo-text">
						<span className="university">UNIVERSITY OF</span>
						<span className="waterloo">WATERLOO</span>
					</div>
				</div>
				
				<nav className="main-nav">
					{navItems.map((item) => (
						<a 
							key={item.href}
							href={item.href} 
							className={`nav-link ${url === item.href ? 'active' : ''}`}
						>
							{item.label}
						</a>
					))}
				</nav>

				<div className="search-section">
					<div className="search-container">
						<input 
							type="text" 
							placeholder="Search" 
							className="search-input"
						/>
						<button className="search-button" aria-label="Search">
							<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
								<circle cx="11" cy="11" r="8"></circle>
								<path d="m21 21-4.35-4.35"></path>
							</svg>
						</button>
					</div>
				</div>
			</div>
			<div>
				<div style="height: 7px; width: 25%; float: left; background-color: rgb(255, 254, 174);"></div>
				<div style="height: 7px; width: 25%; float: left; background-color: rgb(254, 232, 79);"></div>
				<div style="height: 7px; width: 25%; float: left; background-color: rgb(254, 212, 91);"></div>
				<div style="height: 7px; width: 25%; float: left; background-color: rgb(227, 179, 58);"></div>
			</div>
		</header>
	);
}