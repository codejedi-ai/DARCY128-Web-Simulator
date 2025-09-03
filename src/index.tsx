import { LocationProvider, Router, Route, hydrate, prerender as ssr } from 'preact-iso';

import { Home } from './pages/Home/index.jsx';
import { NotFound } from './pages/_404.jsx';
import { Admissions } from './pages/Admissions.jsx';
import { About } from './pages/About.jsx';
import { Academics } from './pages/Academics.jsx';
import { Services } from './pages/Services.jsx';
import { Support } from './pages/Support.jsx';
import './style.css';

export function App() {
	return (
		<LocationProvider>
			<Router>
				<Route path="/" component={Home} />
				<Route path="/admissions" component={Admissions} />
				<Route path="/about" component={About} />
				<Route path="/academics" component={Academics} />
				<Route path="/services" component={Services} />
				<Route path="/support" component={Support} />
				<Route default component={NotFound} />
			</Router>
		</LocationProvider>
	);
}

if (typeof window !== 'undefined') {
	hydrate(<App />, document.getElementById('app'));
}

export async function prerender(data) {
	return await ssr(<App {...data} />);
}