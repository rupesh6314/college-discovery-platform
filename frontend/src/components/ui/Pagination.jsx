import React from 'react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const pages = []
    for (let i = Math.max(1, currentPage - 2); i <= Math.min(totalPages, currentPage + 2); i++) pages.push(i)
    if (pages[0] > 1) pages.unshift('...')
    if (pages[pages.length - 1] < totalPages) pages.push('...')
    return pages
  }

  if (totalPages <= 1) return null

  return (
    <div className="flex justify-center gap-2 mt-8">
      <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="p-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"><FiChevronLeft /></button>
      {getPageNumbers().map((page, idx) => page === '...' ? (<span key={idx} className="px-3 py-2">...</span>) : (<button key={idx} onClick={() => onPageChange(page)} className={`px-3 py-2 border rounded-lg ${currentPage === page ? 'bg-blue-600 text-white border-blue-600' : 'hover:bg-gray-50'}`}>{page}</button>))}
      <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="p-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"><FiChevronRight /></button>
    </div>
  )
}

export default Pagination