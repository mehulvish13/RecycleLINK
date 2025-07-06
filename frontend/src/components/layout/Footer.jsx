import { Link } from 'react-router-dom'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-recycling-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">RL</span>
              </div>
              <span className="text-xl font-bold">RecycleLINK</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              India's premier tech-driven e-waste management platform. Turn your electronic waste into rewards while contributing to a sustainable future.
            </p>
            <p className="text-sm text-gray-400">
              Built by <span className="text-recycling-primary font-medium">Mehul Vishwakarma</span> - Full-Stack ML Engineer
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-recycling-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/pickup/schedule" className="text-gray-300 hover:text-recycling-primary transition-colors">
                  Schedule Pickup
                </Link>
              </li>
              <li>
                <Link to="/rewards" className="text-gray-300 hover:text-recycling-primary transition-colors">
                  Rewards
                </Link>
              </li>
              <li>
                <Link to="/track/demo" className="text-gray-300 hover:text-recycling-primary transition-colors">
                  Track Pickup
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-gray-300">
              <li>Email: support@recyclelink.in</li>
              <li>Phone: +91 98765 43210</li>
              <li>Address: Mumbai, Maharashtra</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} RecycleLINK. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="text-gray-400 hover:text-recycling-primary text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-gray-400 hover:text-recycling-primary text-sm transition-colors">
              Terms of Service
            </Link>
            <Link to="/compliance" className="text-gray-400 hover:text-recycling-primary text-sm transition-colors">
              Compliance
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
