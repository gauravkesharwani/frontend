import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image 
            src="/images/hero-cityscape.jpg" 
            alt="Strategic Real Estate Investments" 
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary-900/80 via-primary-700/70 to-primary-600/60"></div>
        </div>
        <div className="relative z-10 section-container text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Strategic Real Estate<br />
            <span className="text-accent-400">Investments for</span><br />
            Your Future
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto">
            Discover personalized real estate opportunities matched to your investment goals
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/calculator" className="btn-primary text-lg px-8 py-4">
              Get Started
            </Link>
            <button className="btn-outline text-lg px-8 py-4 bg-white/10 backdrop-blur-sm border-white text-white hover:bg-white hover:text-primary-500">
              Learn More
            </button>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary-600">
        <div className="section-container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="text-white">
              <div className="text-5xl font-bold mb-2">$450M+</div>
              <div className="text-xl text-gray-200">Assets Under Management</div>
            </div>
            <div className="text-white">
              <div className="text-5xl font-bold mb-2">25.4%</div>
              <div className="text-xl text-gray-200">Average Annual Return</div>
            </div>
            <div className="text-white">
              <div className="text-5xl font-bold mb-2">2.1K+</div>
              <div className="text-xl text-gray-200">Satisfied Investors</div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Invest Section */}
      <section className="py-20 bg-white">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Why Smart Investors<br />
                <span className="text-primary-500">Choose Real Estate</span>
              </h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Consistent Cash Flow</h3>
                    <p className="text-gray-600">Generate reliable passive income through strategic property investments</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Long-term Appreciation</h3>
                    <p className="text-gray-600">Build wealth through property value appreciation over time</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Portfolio Diversification</h3>
                    <p className="text-gray-600">Hedge against market volatility with tangible asset investments</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative h-96 lg:h-full min-h-[400px] rounded-2xl overflow-hidden shadow-2xl">
              <Image 
                src="/images/investment-property.jpg" 
                alt="Luxury Investment Property" 
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Investment Process Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <Image 
            src="/images/ai-real-estate.jpg" 
            alt="AI-Powered Real Estate" 
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary-800/90 via-primary-700/85 to-primary-900/90"></div>
        </div>
        <div className="relative z-10 section-container">
          <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-4">
            Strategic Investing<br />
            <span className="text-accent-400">Made Simple</span>
          </h2>
          <p className="text-xl text-gray-200 text-center mb-16 max-w-3xl mx-auto">
            Our AI-powered platform makes real estate investing accessible and straightforward
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
              <div className="w-16 h-16 bg-accent-500 rounded-full flex items-center justify-center mb-6">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">Share Your Goals</h3>
              <p className="text-gray-200">
                Tell us about your investment timeline, capital, and preferences through a quick conversation
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
              <div className="w-16 h-16 bg-accent-500 rounded-full flex items-center justify-center mb-6">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">Get Matched</h3>
              <p className="text-gray-200">
                Our AI analyzes your profile and matches you with curated investment opportunities
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
              <div className="w-16 h-16 bg-accent-500 rounded-full flex items-center justify-center mb-6">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">Start Investing</h3>
              <p className="text-gray-200">
                Connect with our team to review opportunities and begin your investment journey
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Future of Real Estate Section */}
      <section className="py-20 bg-gray-50">
        <div className="section-container">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              The Future of<br />
              <span className="text-primary-500">Real Estate Investment</span>
            </h2>
            <p className="text-xl text-gray-600">
              Powered by cutting-edge AI technology and decades of real estate expertise
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-gray-900">Personalized Matching</h3>
              </div>
              <p className="text-gray-600">
                Advanced algorithms analyze your unique investment profile to recommend properties that align with your goals, risk tolerance, and timeline.
              </p>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-gray-900">Market Intelligence</h3>
              </div>
              <p className="text-gray-600">
                Real-time market data and predictive analytics help identify emerging opportunities and optimize your investment strategy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="section-container text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Start Your<br />
            Investment Journey?
          </h2>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Join thousands of investors building wealth through strategic real estate investments
          </p>
          <Link href="/calculator" className="inline-block bg-white text-primary-600 hover:bg-gray-100 font-semibold text-lg px-8 py-4 rounded-lg transition-colors duration-200">
            Get Started Now
          </Link>
        </div>
      </section>
    </div>
  )
}
