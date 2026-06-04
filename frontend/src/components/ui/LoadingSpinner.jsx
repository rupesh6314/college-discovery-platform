import React, { useState, useEffect } from 'react'

const LoadingSpinner = () => {
  const [message, setMessage] = useState('Loading...')

  useEffect(() => {
    // If the loading takes more than 3 seconds, it means the Render free tier backend is probably asleep
    const timer = setTimeout(() => {
      setMessage('Waking up the backend... Please wait (can take up to 50s)')
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 transition-all duration-500">{message}</p>
      </div>
    </div>
  )
}

export default LoadingSpinner