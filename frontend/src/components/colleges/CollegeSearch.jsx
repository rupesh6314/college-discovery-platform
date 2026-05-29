// frontend/src/components/colleges/CollegeSearch.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react'
import { FiSearch } from 'react-icons/fi'

const CollegeSearch = ({ value, onChange }) => {
  const [inputValue, setInputValue] = useState(value || '')
  const isInternalChange = useRef(false)

  // Handle input change
  const handleInputChange = (e) => {
    const newValue = e.target.value
    setInputValue(newValue)
    isInternalChange.current = true
  }

  // Trigger onChange after debounce
  useEffect(() => {
    if (!isInternalChange.current) return
    
    const timeoutId = setTimeout(() => {
      if (onChange) {
        onChange(inputValue)
      }
      isInternalChange.current = false
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [inputValue, onChange])

  // Sync external value changes (when filters reset, etc.)
  useEffect(() => {
    if (value !== inputValue && !isInternalChange.current) {
      setInputValue(value || '')
    }
  }, [value])

  return (
    <div className="relative">
      <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Search colleges by name, city, or course..."
        className="w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  )
}

export default CollegeSearch