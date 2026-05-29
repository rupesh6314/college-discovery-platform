import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { FiAward, FiTrendingUp, FiDollarSign, FiStar, FiInfo } from 'react-icons/fi'
import CompareTable from './CompareTable'

const CompareDashboard = ({ colleges, insights, rankings, comparisonMatrix }) => {
  const [activeView, setActiveView] = useState('table')

  if (!colleges || colleges.length < 2) {
    return (
      <div className="text-center py-12 bg-white rounded-xl">
        <p className="text-gray-500">Add at least 2 colleges to start comparing</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* View Toggle */}
      <div className="flex gap-2 bg-gray-100 rounded-lg p-1 w-fit">
        <button onClick={() => setActiveView('table')} className={`px-4 py-2 rounded-lg transition ${activeView === 'table' ? 'bg-white shadow-sm' : ''}`}>Table View</button>
        <button onClick={() => setActiveView('insights')} className={`px-4 py-2 rounded-lg transition ${activeView === 'insights' ? 'bg-white shadow-sm' : ''}`}>AI Insights</button>
      </div>

      {activeView === 'table' ? (
        <CompareTable colleges={colleges} comparisonMatrix={comparisonMatrix} insights={insights} rankings={rankings} />
      ) : (
        <div className="space-y-6">
          {/* Rankings */}
          {rankings && (
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><FiAward className="text-yellow-500" /> Rankings</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg"><div className="text-xs text-gray-500">Overall</div><div className="font-bold text-sm">{rankings.overall[0]?.name}</div><div className="text-xs text-gray-500">Score: {rankings.overall[0]?.score}</div></div>
                <div className="text-center p-3 bg-gray-50 rounded-lg"><div className="text-xs text-gray-500">Best ROI</div><div className="font-bold text-sm">{rankings.roi[0]?.name}</div><div className="text-xs text-gray-500">{rankings.roi[0]?.roi}% ROI</div></div>
                <div className="text-center p-3 bg-gray-50 rounded-lg"><div className="text-xs text-gray-500">Highest Package</div><div className="font-bold text-sm">{rankings.placement[0]?.name}</div><div className="text-xs text-gray-500">₹{rankings.placement[0]?.package / 100000} LPA</div></div>
                <div className="text-center p-3 bg-gray-50 rounded-lg"><div className="text-xs text-gray-500">Most Affordable</div><div className="font-bold text-sm">{rankings.affordability[0]?.name}</div><div className="text-xs text-gray-500">₹{rankings.affordability[0]?.fee / 100000}L</div></div>
                <div className="text-center p-3 bg-gray-50 rounded-lg"><div className="text-xs text-gray-500">Highest Rated</div><div className="font-bold text-sm">{rankings.rating[0]?.name}</div><div className="text-xs text-gray-500">⭐ {rankings.rating[0]?.rating}</div></div>
              </div>
            </div>
          )}

          {/* AI Insights Summary */}
          {insights && (
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-6 text-white">
              <h3 className="text-lg font-bold mb-2 flex items-center gap-2"><FiInfo /> AI Analysis</h3>
              <p className="text-blue-100">{insights.summary}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {insights.recommendations?.map((rec, i) => (
                  <div key={i} className="bg-white/20 rounded-lg px-3 py-1 text-sm">{rec}</div>
                ))}
              </div>
            </div>
          )}

          {/* Pros & Cons */}
          {insights?.prosAndCons && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(insights.prosAndCons).map(([name, data]) => (
                <div key={name} className="bg-white rounded-xl p-5 shadow-sm">
                  <h4 className="font-semibold mb-3">{name}</h4>
                  {data.pros?.length > 0 && <div className="mb-3"><div className="text-sm font-medium text-green-600 mb-1">✓ Pros</div><ul className="list-disc list-inside text-sm space-y-1">{data.pros.slice(0, 4).map((pro, i) => <li key={i}>{pro}</li>)}</ul></div>}
                  {data.cons?.length > 0 && <div><div className="text-sm font-medium text-red-600 mb-1">✗ Cons</div><ul className="list-disc list-inside text-sm space-y-1">{data.cons.slice(0, 4).map((con, i) => <li key={i}>{con}</li>)}</ul></div>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default CompareDashboard