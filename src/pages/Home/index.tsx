import { Navigation } from '../../components/Navigation';
import { HeroSection } from '../../components/HeroSection';

export function Home() {
	return (
		<div className="home-page">
			<Navigation />
			<HeroSection />
		</div>
	);
}