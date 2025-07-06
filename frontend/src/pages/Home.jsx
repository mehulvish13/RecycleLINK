import { Link } from 'react-router-dom'
import { 
  RecycleIcon, 
  DevicePhoneMobileIcon, 
  GiftIcon, 
  ChartBarIcon,
  TruckIcon,
  MapPinIcon 
} from '@heroicons/react/24/outline'

const Home = () => {
  const features = [
    {
      icon: DevicePhoneMobileIcon,
      title: 'AI-Powered Device Recognition',
      description: 'Upload photos of your e-waste and our AI will automatically identify device types and estimate their value.',
    },
    {
      icon: TruckIcon,
      title: 'Easy Pickup Scheduling',
      description: 'Schedule convenient pickup times and track your e-waste collection in real-time.',
    },
    {
      icon: GiftIcon,
      title: 'Digital Rewards',
      description: 'Earn points, coupons, and cashback for responsible e-waste recycling.',
    },
    {
      icon: ChartBarIcon,
      title: 'Analytics & Tracking',
      description: 'Monitor your environmental impact with detailed analytics and compliance reports.',
    },
  ]

  const stats = [
    { label: 'E-Waste Collected', value: '2,500+ kg', icon: RecycleIcon },
    { label: 'Users Registered', value: '1,200+', icon: DevicePhoneMobileIcon },
    { label: 'Pickups Completed', value: '850+', icon: TruckIcon },
    { label: 'Cities Covered', value: '15+', icon: MapPinIcon },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-recycling-primary to-recycling-secondary text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
              India's Tech-Driven
              <span className="block text-yellow-300">E-Waste Management</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-green-100 max-w-3xl mx-auto">
              Turn your electronic waste into rewards while contributing to a sustainable future. 
              AI-powered, compliance-ready, and designed for India.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/register" 
                className="bg-white text-recycling-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
              >
                Get Started
              </Link>
              <Link 
                to="/track/demo" 
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-recycling-primary transition-colors duration-200"
              >
                Track Pickup
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <stat.icon className="h-12 w-12 text-recycling-primary" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How RecycleLINK Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our AI-driven platform makes e-waste recycling simple, rewarding, and environmentally responsible.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
                <div className="flex justify-center mb-4">
                  <feature.icon className="h-12 w-12 text-recycling-primary" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-center">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Simple 4-Step Process
            </h2>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Upload Photos', desc: 'Take photos of your e-waste devices' },
              { step: '02', title: 'AI Classification', desc: 'Our AI identifies and values your items' },
              { step: '03', title: 'Schedule Pickup', desc: 'Choose convenient pickup time and location' },
              { step: '04', title: 'Earn Rewards', desc: 'Get digital rewards and track environmental impact' },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-recycling-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-recycling-primary text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl mb-8 text-green-100">
            Join thousands of Indians who are already contributing to a cleaner, more sustainable future through responsible e-waste management.
          </p>
          <Link 
            to="/register" 
            className="bg-white text-recycling-primary px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors duration-200 inline-block"
          >
            Start Recycling Today
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home
