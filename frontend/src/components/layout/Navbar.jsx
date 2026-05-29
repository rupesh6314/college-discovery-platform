import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../../store/slices/authSlice'
import { FiMenu, FiX, FiUser, FiLogOut, FiBookmark, FiBarChart2, FiHome, FiSearch, FiMessageCircle } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { user, isAuthenticated } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
    toast.success('Logged out successfully')
  }

  const navLinks = [
    { name: 'Home', path: '/', icon: FiHome },
    { name: 'Colleges', path: '/colleges', icon: FiSearch },
    { name: 'Compare', path: '/compare', icon: FiBarChart2 },
    { name: 'Community', path: '/community', icon: FiMessageCircle },
  ]

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">C</span>
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              CollegeDiscovery
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition"
              >
                <link.icon size={18} />
                <span>{link.name}</span>
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link to="/app/dashboard" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600">
                  <FiUser />
                  <span>{user?.name?.split(' ')[0]}</span>
                </Link>
                <Link to="/app/saved" className="text-gray-700 hover:text-blue-600">
                  <FiBookmark size={20} />
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-red-600 hover:text-red-700"
                >
                  <FiLogOut />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <>
                <Link to="/auth/login" className="text-gray-700 hover:text-blue-600 transition">Login</Link>
                <Link to="/auth/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">Sign Up</Link>
              </>
            )}
          </div>

          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 rounded-md text-gray-700 hover:text-blue-600">
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden py-4 border-t"
            >
              {navLinks.map((link) => (
                <Link key={link.path} to={link.path} onClick={() => setIsOpen(false)} className="flex items-center space-x-2 px-4 py-3 text-gray-700 hover:bg-gray-50">
                  <link.icon size={18} />
                  <span>{link.name}</span>
                </Link>
              ))}
              {isAuthenticated ? (
                <>
                  <Link to="/app/dashboard" onClick={() => setIsOpen(false)} className="flex items-center space-x-2 px-4 py-3 text-gray-700 hover:bg-gray-50">
                    <FiUser size={18} />
                    <span>Dashboard</span>
                  </Link>
                  <Link to="/app/saved" onClick={() => setIsOpen(false)} className="flex items-center space-x-2 px-4 py-3 text-gray-700 hover:bg-gray-50">
                    <FiBookmark size={18} />
                    <span>Saved</span>
                  </Link>
                  <button onClick={() => { handleLogout(); setIsOpen(false) }} className="w-full flex items-center space-x-2 px-4 py-3 text-red-600 hover:bg-gray-50">
                    <FiLogOut size={18} />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link to="/auth/login" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-gray-700 hover:bg-gray-50">Login</Link>
                  <Link to="/auth/register" onClick={() => setIsOpen(false)} className="block px-4 py-3 bg-blue-600 text-white rounded-lg mx-4 text-center">Sign Up</Link>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}

export default Navbar