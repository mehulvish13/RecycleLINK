import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import { 
  PlusIcon, 
  TruckIcon, 
  GiftIcon, 
  ChartBarIcon,
  CameraIcon,
  ClockIcon 
} from '@heroicons/react/24/outline'

const Dashboard = () => {
  const { user } = useAuth()

  const quickActions = [
    {
      title: 'Schedule Pickup',
      description: 'Book a new e-waste collection',
      icon: PlusIcon,
      href: '/pickup/schedule',
      color: 'bg-green-500'
    },
    {
      title: 'Upload E-waste Photo',
      description: 'Get AI classification and value estimate',
      icon: CameraIcon,
      href: '/ewaste/upload',
      color: 'bg-blue-500'
    },
    {
      title: 'View Rewards',
      description: 'Check your earned rewards',
      icon: GiftIcon,
      href: '/rewards',
      color: 'bg-purple-500'
    },
    {
      title: 'Track Pickup',
      description: 'Monitor your pickup status',
      icon: TruckIcon,
      href: '/track/recent',
      color: 'bg-orange-500'
    }
  ]

  const stats = [
    { label: 'Total Pickups', value: user?.totalPickups || 0, icon: TruckIcon },
    { label: 'Rewards Earned', value: `₹${user?.totalRewards || 0}`, icon: GiftIcon },
    { label: 'Environmental Impact', value: '2.5 kg CO₂ saved', icon: ChartBarIcon },
    { label: 'Last Pickup', value: '5 days ago', icon: ClockIcon },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.firstName}! 👋
          </h1>
          <p className="text-gray-600 mt-2">
            Ready to make a positive environmental impact today?
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <stat.icon className="h-8 w-8 text-recycling-primary" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.href}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 group"
              >
                <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {action.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {action.description}
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Pickups */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Pickups</h3>
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-center justify-between border-b border-gray-200 pb-4">
                  <div>
                    <p className="font-medium text-gray-900">Pickup #{item}001</p>
                    <p className="text-sm text-gray-500">2 devices • 3.2 kg</p>
                  </div>
                  <span className="badge badge-green">Completed</span>
                </div>
              ))}
            </div>
            <Link 
              to="/pickups" 
              className="text-recycling-primary hover:text-recycling-secondary text-sm font-medium mt-4 inline-block"
            >
              View all pickups →
            </Link>
          </div>

          {/* Environmental Impact */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Environmental Impact</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">CO₂ Emissions Saved</span>
                <span className="font-semibold text-green-600">2.5 kg</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Materials Recycled</span>
                <span className="font-semibold text-blue-600">8.7 kg</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Landfill Diverted</span>
                <span className="font-semibold text-purple-600">12.1 kg</span>
              </div>
            </div>
            <div className="mt-4 p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-800">
                🌱 Great job! You've helped save the equivalent of 1 tree this month.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
