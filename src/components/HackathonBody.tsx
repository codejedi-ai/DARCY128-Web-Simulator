export function HackathonBody() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-black via-gray-900 to-black text-white">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&fit=crop')] bg-cover bg-center opacity-20"></div>
        <div className="relative mx-12 lg:mx-24 py-20 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block bg-gradient-to-r from-waterloo-gold to-waterloo-yellow text-black px-6 py-2 rounded-full text-sm font-semibold tracking-wide mb-8 shadow-lg">
              HACKATHON 2025
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-waterloo-gold bg-clip-text text-transparent">
              Warrior Life Hackathon
            </h1>
            <p className="text-xl lg:text-2xl mb-12 text-gray-200 max-w-3xl mx-auto leading-relaxed">
              Build innovative solutions to enhance student life at the University of Waterloo
            </p>
            
            {/* Stats */}
            <div className="flex justify-center gap-12 mb-12">
              <div className="text-center">
                <div className="text-4xl lg:text-5xl font-bold text-waterloo-gold mb-2">48</div>
                <div className="text-gray-300">Hours</div>
              </div>
              <div className="text-center">
                <div className="text-4xl lg:text-5xl font-bold text-waterloo-gold mb-2">$10K</div>
                <div className="text-gray-300">Prizes</div>
              </div>
              <div className="text-center">
                <div className="text-4xl lg:text-5xl font-bold text-waterloo-gold mb-2">200+</div>
                <div className="text-gray-300">Students</div>
              </div>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-waterloo-gold to-waterloo-yellow text-black px-8 py-4 rounded-lg text-lg font-semibold hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                Register Now
              </button>
              <button className="border-2 border-white/30 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:border-waterloo-gold hover:bg-waterloo-gold/10 transition-all duration-300 backdrop-blur-sm">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Challenge Areas */}
      <section className="py-20 bg-white">
        <div className="mx-12 lg:mx-24">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Challenge Areas</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Focus on one of these key areas to improve Waterloo student life
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border-t-4 border-t-waterloo-gold">
                <div className="text-5xl mb-6">📚</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Academic Excellence</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Build tools to enhance studying, course planning, research collaboration, and academic success.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center text-gray-700">
                    <span className="text-waterloo-gold mr-3">→</span>
                    Study group matching
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="text-waterloo-gold mr-3">→</span>
                    Course recommendation systems
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="text-waterloo-gold mr-3">→</span>
                    Research collaboration platforms
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border-t-4 border-t-blue-500">
                <div className="text-5xl mb-6">🤝</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Community Building</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Create solutions that connect students and strengthen the Waterloo community.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center text-gray-700">
                    <span className="text-blue-500 mr-3">→</span>
                    Event discovery platforms
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="text-blue-500 mr-3">→</span>
                    Mentorship matching
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="text-blue-500 mr-3">→</span>
                    Club and society tools
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border-t-4 border-t-green-500">
                <div className="text-5xl mb-6">💪</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Student Wellness</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Develop applications focused on mental health, physical wellness, and work-life balance.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center text-gray-700">
                    <span className="text-green-500 mr-3">→</span>
                    Stress management tools
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="text-green-500 mr-3">→</span>
                    Fitness tracking
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="text-green-500 mr-3">→</span>
                    Mindfulness applications
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border-t-4 border-t-purple-500">
                <div className="text-5xl mb-6">🏫</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Campus Life</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Improve daily campus experiences from navigation to dining to facility usage.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center text-gray-700">
                    <span className="text-purple-500 mr-3">→</span>
                    Campus navigation apps
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="text-purple-500 mr-3">→</span>
                    Dining hall optimization
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="text-purple-500 mr-3">→</span>
                    Space booking systems
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-gray-100">
        <div className="mx-12 lg:mx-24">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Event Timeline</h2>
              <p className="text-xl text-gray-600">Your 48-hour journey to innovation</p>
            </div>
            
            <div className="space-y-8">
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-l-waterloo-gold">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="bg-waterloo-gold text-black px-4 py-2 rounded-lg font-bold text-center md:w-40">
                    Friday 6:00 PM
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-gray-900 mb-2">Opening Ceremony</h4>
                    <p className="text-gray-600">Welcome, team formation, and challenge presentations</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-l-blue-500">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="bg-blue-500 text-white px-4 py-2 rounded-lg font-bold text-center md:w-40">
                    Friday 8:00 PM
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-gray-900 mb-2">Hacking Begins</h4>
                    <p className="text-gray-600">Start building your solutions with mentor support</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-l-green-500">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="bg-green-500 text-white px-4 py-2 rounded-lg font-bold text-center md:w-40">
                    Saturday 12:00 PM
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-gray-900 mb-2">Midpoint Check-in</h4>
                    <p className="text-gray-600">Progress updates and additional mentoring sessions</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-l-orange-500">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="bg-orange-500 text-white px-4 py-2 rounded-lg font-bold text-center md:w-40">
                    Sunday 2:00 PM
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-gray-900 mb-2">Submissions Due</h4>
                    <p className="text-gray-600">Final project submissions and demo preparations</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-l-purple-500">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="bg-purple-500 text-white px-4 py-2 rounded-lg font-bold text-center md:w-40">
                    Sunday 4:00 PM
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-gray-900 mb-2">Presentations & Awards</h4>
                    <p className="text-gray-600">Team presentations, judging, and prize ceremony</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Prizes */}
      <section className="py-20 bg-gradient-to-br from-black to-gray-900 text-white">
        <div className="mx-12 lg:mx-24">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold mb-4">Prizes & Recognition</h2>
              <p className="text-xl text-gray-300">Rewarding innovation and excellence</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-waterloo-gold/20 to-waterloo-yellow/20 backdrop-blur-sm rounded-xl p-8 text-center border-2 border-waterloo-gold/30 hover:border-waterloo-gold hover:-translate-y-2 transition-all duration-300">
                <div className="bg-waterloo-gold text-black px-4 py-2 rounded-full font-bold text-lg mb-4 inline-block">
                  1st Place
                </div>
                <h3 className="text-4xl font-bold text-waterloo-gold mb-4">$5,000</h3>
                <p className="text-xl mb-6 text-gray-200">Grand Prize Winner</p>
                <ul className="space-y-3 text-gray-300">
                  <li className="border-b border-gray-600 pb-2">Cash prize</li>
                  <li className="border-b border-gray-600 pb-2">Mentorship program</li>
                  <li>Implementation support</li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-gray-600/20 to-gray-500/20 backdrop-blur-sm rounded-xl p-8 text-center border-2 border-gray-500/30 hover:border-gray-400 hover:-translate-y-2 transition-all duration-300">
                <div className="bg-gray-400 text-black px-4 py-2 rounded-full font-bold text-lg mb-4 inline-block">
                  2nd Place
                </div>
                <h3 className="text-4xl font-bold text-gray-300 mb-4">$3,000</h3>
                <p className="text-xl mb-6 text-gray-200">Runner-up</p>
                <ul className="space-y-3 text-gray-300">
                  <li className="border-b border-gray-600 pb-2">Cash prize</li>
                  <li className="border-b border-gray-600 pb-2">Tech resources</li>
                  <li>University recognition</li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-orange-600/20 to-orange-500/20 backdrop-blur-sm rounded-xl p-8 text-center border-2 border-orange-500/30 hover:border-orange-400 hover:-translate-y-2 transition-all duration-300">
                <div className="bg-orange-500 text-white px-4 py-2 rounded-full font-bold text-lg mb-4 inline-block">
                  3rd Place
                </div>
                <h3 className="text-4xl font-bold text-orange-400 mb-4">$2,000</h3>
                <p className="text-xl mb-6 text-gray-200">Third Place</p>
                <ul className="space-y-3 text-gray-300">
                  <li className="border-b border-gray-600 pb-2">Cash prize</li>
                  <li className="border-b border-gray-600 pb-2">Development tools</li>
                  <li>Networking opportunities</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Registration CTA */}
      <section className="py-20 bg-gradient-to-r from-waterloo-gold to-waterloo-yellow">
        <div className="mx-12 lg:mx-24">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl lg:text-5xl font-bold text-black mb-6">Ready to Make a Difference?</h2>
            <p className="text-xl text-gray-800 mb-8 max-w-2xl mx-auto">
              Join fellow Waterloo students in building the future of university life
            </p>
            <button className="bg-black text-white px-12 py-4 rounded-lg text-xl font-bold hover:bg-gray-800 hover:-translate-y-1 transition-all duration-300 shadow-lg">
              Register for Warrior Life Hackathon
            </button>
            <p className="text-gray-700 mt-6 text-lg">Registration closes March 15th, 2025</p>
          </div>
        </div>
      </section>
    </div>
  );
}