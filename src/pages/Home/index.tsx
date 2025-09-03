import { Navigation } from '../../components/Navigation';

export function Home() {
	return (
		<div className="home-page main-content">
			<Navigation />
			
			{/* Hero Section */}
			<section className="warrior-hero">
				<div className="warrior-hero-content">
					<div className="warrior-badge">
						<span className="warrior-badge-text">HACKATHON 2025</span>
					</div>
					<h1 className="warrior-title">
						Warrior Life Hackathon
					</h1>
					<p className="warrior-subtitle">
						Build innovative solutions to enhance student life at the University of Waterloo
					</p>
					<div className="warrior-stats">
						<div className="stat-item">
							<span className="stat-number">48</span>
							<span className="stat-label">Hours</span>
						</div>
						<div className="stat-item">
							<span className="stat-number">$10K</span>
							<span className="stat-label">Prizes</span>
						</div>
						<div className="stat-item">
							<span className="stat-number">200+</span>
							<span className="stat-label">Students</span>
						</div>
					</div>
					<div className="warrior-cta">
						<button className="cta-primary">Register Now</button>
						<button className="cta-secondary">Learn More</button>
			{/* Challenge Areas */}
			<section className="challenge-areas page-section">
				<div className="container">
					<h2 className="section-title">Challenge Areas</h2>
					<p className="section-subtitle">
						Focus on one of these key areas to improve Waterloo student life
					</p>
					<div className="challenges-grid">
						<div className="challenge-card">
							<div className="challenge-icon study">📚</div>
							<h3>Academic Excellence</h3>
							<p>Build tools to enhance studying, course planning, research collaboration, and academic success.</p>
							<ul className="challenge-examples">
								<li>Study group matching</li>
								<li>Course recommendation systems</li>
								<li>Research collaboration platforms</li>
							</ul>
						</div>
						<div className="challenge-card">
							<div className="challenge-icon community">🤝</div>
							<h3>Community Building</h3>
							<p>Create solutions that connect students and strengthen the Waterloo community.</p>
							<ul className="challenge-examples">
								<li>Event discovery platforms</li>
								<li>Mentorship matching</li>
								<li>Club and society tools</li>
							</ul>
						</div>
						<div className="challenge-card">
							<div className="challenge-icon wellness">💪</div>
							<h3>Student Wellness</h3>
							<p>Develop applications focused on mental health, physical wellness, and work-life balance.</p>
							<ul className="challenge-examples">
								<li>Stress management tools</li>
								<li>Fitness tracking</li>
								<li>Mindfulness applications</li>
							</ul>
						</div>
						<div className="challenge-card">
							<div className="challenge-icon campus">🏫</div>
							<h3>Campus Life</h3>
							<p>Improve daily campus experiences from navigation to dining to facility usage.</p>
							<ul className="challenge-examples">
								<li>Campus navigation apps</li>
								<li>Dining hall optimization</li>
								<li>Space booking systems</li>
							</ul>
						</div>
					</div>
				</div>
			</section>
					</div>
			{/* Timeline */}
			<section className="timeline-section page-section">
				<div className="container">
					<h2 className="section-title">Event Timeline</h2>
					<div className="timeline">
						<div className="timeline-item">
							<div className="timeline-time">Friday 6:00 PM</div>
							<div className="timeline-content">
								<h4>Opening Ceremony</h4>
								<p>Welcome, team formation, and challenge presentations</p>
							</div>
						</div>
						<div className="timeline-item">
							<div className="timeline-time">Friday 8:00 PM</div>
							<div className="timeline-content">
								<h4>Hacking Begins</h4>
								<p>Start building your solutions with mentor support</p>
							</div>
						</div>
						<div className="timeline-item">
							<div className="timeline-time">Saturday 12:00 PM</div>
							<div className="timeline-content">
								<h4>Midpoint Check-in</h4>
								<p>Progress updates and additional mentoring sessions</p>
							</div>
						</div>
						<div className="timeline-item">
							<div className="timeline-time">Sunday 2:00 PM</div>
							<div className="timeline-content">
								<h4>Submissions Due</h4>
								<p>Final project submissions and demo preparations</p>
							</div>
						</div>
						<div className="timeline-item">
							<div className="timeline-time">Sunday 4:00 PM</div>
							<div className="timeline-content">
								<h4>Presentations & Awards</h4>
								<p>Team presentations, judging, and prize ceremony</p>
							</div>
						</div>
					</div>
				</div>
			</section>
				</div>
			{/* Prizes */}
			<section className="prizes-section page-section">
				<div className="container">
					<h2 className="section-title">Prizes & Recognition</h2>
					<div className="prizes-grid">
						<div className="prize-card first-place">
							<div className="prize-rank">1st</div>
							<h3>$5,000</h3>
							<p>Grand Prize Winner</p>
							<ul>
								<li>Cash prize</li>
								<li>Mentorship program</li>
								<li>Implementation support</li>
							</ul>
						</div>
						<div className="prize-card second-place">
							<div className="prize-rank">2nd</div>
							<h3>$3,000</h3>
							<p>Runner-up</p>
							<ul>
								<li>Cash prize</li>
								<li>Tech resources</li>
								<li>University recognition</li>
							</ul>
						</div>
						<div className="prize-card third-place">
							<div className="prize-rank">3rd</div>
							<h3>$2,000</h3>
							<p>Third Place</p>
							<ul>
								<li>Cash prize</li>
								<li>Development tools</li>
								<li>Networking opportunities</li>
							</ul>
						</div>
					</div>
				</div>
			</section>
			</section>
			{/* Registration CTA */}
			<section className="registration-cta page-section">
				<div className="container">
					<div className="cta-content">
						<h2>Ready to Make a Difference?</h2>
						<p>Join fellow Waterloo students in building the future of university life</p>
						<button className="cta-register">Register for Warrior Life Hackathon</button>
						<p className="cta-note">Registration closes March 15th, 2025</p>
					</div>
				</div>
			</section>
		</div>
	);
}