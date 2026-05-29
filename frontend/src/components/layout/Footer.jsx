import React from 'react'
import { Link } from 'react-router-dom'
import { FiGithub, FiTwitter, FiLinkedin, FiMail } from 'react-icons/fi'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-20">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">C</span>
              </div>
              <span className="font-bold text-xl">CollegeDiscovery</span>
            </div>
            <p className="text-gray-400 text-sm">Find your perfect college with India's most comprehensive college discovery platform.</p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/colleges" className="hover:text-white transition">Browse Colleges</Link></li>
              <li><Link to="/compare" className="hover:text-white transition">Compare Colleges</Link></li>
              <li><Link to="/community" className="hover:text-white transition">Community Q&A</Link></li>
              <li><Link to="/app/dashboard" className="hover:text-white transition">Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition">Admission Guidance</a></li>
              <li><a href="#" className="hover:text-white transition">Exam Preparation</a></li>
              <li><a href="#" className="hover:text-white transition">Career Counseling</a></li>
              <li><a href="#" className="hover:text-white transition">Scholarship Info</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Connect</h3>
            <div className="flex space-x-4 mb-4">
              <a href="#" className="text-gray-400 hover:text-white transition"><FiGithub size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-white transition"><FiTwitter size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-white transition"><FiLinkedin size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-white transition"><FiMail size={20} /></a>
            </div>
            <p className="text-gray-400 text-sm">📧 supportcollegediscovery@gmail.com<br />📞 +91 8500617107</p>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; 2026 CollegeDiscovery. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer