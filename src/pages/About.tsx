import { Navigation } from '../components/Navigation';

export function About() {
	return (
		<div>
			<Navigation />
			<main style={{ padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
				<h1>About Waterloo</h1>
				<p>Discover the University of Waterloo's history, mission, and values.</p>
			</main>
		</div>
	);
}