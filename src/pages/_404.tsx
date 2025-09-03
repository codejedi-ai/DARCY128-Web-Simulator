import { Navigation } from '../components/Navigation';

export function NotFound() {
	return (
		<div>
			<Navigation />
			<main style={{ padding: '4rem 2rem', textAlign: 'center' }}>
				<h1>404: Page Not Found</h1>
				<p>The page you're looking for doesn't exist.</p>
				<a href="/" style={{ color: '#ffd700', textDecoration: 'underline' }}>
					Return to Home
				</a>
			</main>
		</div>
	);
}