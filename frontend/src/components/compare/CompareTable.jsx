import React from 'react'

const CompareTable = ({ colleges, comparisonMatrix, insights, rankings }) => {
  // Safely check if data exists
  if (!colleges || colleges.length === 0) {
    return <div className="text-center py-8">No colleges to compare</div>
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">Parameter</th>
            {colleges.map((college, idx) => (
              <th key={idx} className="p-3 text-left">{college.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="border-t">
            <td className="p-3 font-semibold">Location</td>
            {colleges.map((college, idx) => (
              <td key={idx} className="p-3">{college.city}, {college.state}</td>
            ))}
          </tr>
          <tr className="border-t">
            <td className="p-3 font-semibold">Rating</td>
            {colleges.map((college, idx) => (
              <td key={idx} className="p-3">{college.overallRating || 'N/A'} / 5</td>
            ))}
          </tr>
          <tr className="border-t">
            <td className="p-3 font-semibold">Total Fee</td>
            {colleges.map((college, idx) => (
              <td key={idx} className="p-3">₹{(college.totalFee || 0).toLocaleString()}</td>
            ))}
          </tr>
          <tr className="border-t">
            <td className="p-3 font-semibold">Avg Package</td>
            {colleges.map((college, idx) => (
              <td key={idx} className="p-3">₹{((college.averagePackage || 0) / 100000).toFixed(1)} LPA</td>
            ))}
          </tr>
          <tr className="border-t">
            <td className="p-3 font-semibold">Placement Rate</td>
            {colleges.map((college, idx) => (
              <td key={idx} className="p-3">{college.placementRate || 'N/A'}%</td>
            ))}
          </tr>
          <tr className="border-t">
            <td className="p-3 font-semibold">Established</td>
            {colleges.map((college, idx) => (
              <td key={idx} className="p-3">{college.established || 'N/A'}</td>
            ))}
          </tr>
          <tr className="border-t">
            <td className="p-3 font-semibold">Type</td>
            {colleges.map((college, idx) => (
              <td key={idx} className="p-3">{college.type || 'N/A'}</td>
            ))}
          </tr>
        </tbody>
      </table>
      
      {rankings && rankings.overall && rankings.overall[0] && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold">🏆 Top Pick</h4>
          <p>{rankings.overall[0].name} scores highest overall!</p>
        </div>
      )}
    </div>
  )
}

export default CompareTable