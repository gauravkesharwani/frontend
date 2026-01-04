import Logo from '@/components/Logo'

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm z-50 border-b border-gray-200">
        <div className="section-container">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Logo variant="default" size="md" />
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-gray-700 hover:text-primary-500 transition-colors">
                About
              </a>
              <a href="#" className="text-gray-700 hover:text-primary-500 transition-colors">
                Investments
              </a>
              <a href="#" className="text-gray-700 hover:text-primary-500 transition-colors">
                Process
              </a>
              <a href="/calculator" className="btn-primary">
                Get Started
              </a>
            </div>
          </div>
        </div>
      </nav>
      <main className="pt-16">
        {children}
      </main>
      <footer className="bg-primary-900 text-white py-12">
        <div className="section-container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="mb-4">
                <Logo variant="light" size="sm" />
              </div>
              <p className="text-gray-300">
                Strategic real estate investments for the modern investor.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Disclaimer</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-primary-700 text-center text-gray-300">
            <p>&copy; {new Date().getFullYear()} Alti. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  )
}
