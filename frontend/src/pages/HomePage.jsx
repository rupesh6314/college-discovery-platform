import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiSearch, FiBarChart2, FiUsers, FiStar, FiTrendingUp, FiAward } from 'react-icons/fi'

const HomePage = () => {
  const features = [
    { icon: FiSearch, title: 'Smart Search', description: 'Find colleges by name, location, courses, or exams with advanced filters', color: 'text-blue-600' },
    { icon: FiBarChart2, title: 'Unlimited Comparison', description: 'Compare 2-20 colleges side-by-side across 50+ parameters', color: 'text-green-600' },
    { icon: FiUsers, title: 'Community Q&A', description: 'Get answers from current students and alumni', color: 'text-purple-600' },
    { icon: FiStar, title: 'Real Reviews', description: 'Read verified student reviews with multi-dimensional ratings', color: 'text-yellow-600' },
    { icon: FiTrendingUp, title: 'AI Insights', description: 'Smart recommendations based on your profile and preferences', color: 'text-red-600' },
    { icon: FiAward, title: 'ROI Calculator', description: 'Calculate returns on your education investment', color: 'text-indigo-600' }
  ]

  const stats = [
    { number: '1000+', label: 'Colleges' },
    { number: '50+', label: 'Comparison Parameters' },
    { number: '10K+', label: 'Student Reviews' },
    { number: '100%', label: 'Free Forever' }
  ]

  return (
    <div>
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <div className="container-custom py-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Find Your Perfect College Journey</h1>
            <p className="text-xl mb-8 text-blue-100">Compare 1000+ colleges, read real reviews, and make informed decisions about your future</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/colleges" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">Explore Colleges</Link>
              <Link to="/compare" className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition">Start Comparing</Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-12 bg-white shadow-sm">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div key={index} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.1 }} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-600">{stat.number}</div>
                <div className="text-gray-600 mt-2">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose CollegeDiscovery?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Everything you need to make the right college decision</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300">
                <feature.icon className={`w-12 h-12 ${feature.color} mb-4`} />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Find Your Dream College?</h2>
          <p className="text-xl text-blue-100 mb-8">Join thousands of students who've found their perfect match</p>
          <Link to="/auth/register" className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">Get Started Now</Link>
        </div>
      </section>
    </div>
  )
}

export default HomePage