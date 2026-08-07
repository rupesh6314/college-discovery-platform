import React from 'react';
import { motion } from 'framer-motion';
import { FiAward, FiGlobe, FiInfo } from 'react-icons/fi';

const ScholarshipInfoPage = () => {
  const types = [
    { title: 'Merit-Based Scholarships', desc: 'For students with outstanding academic, athletic, or artistic records.', icon: FiAward },
    { title: 'Need-Based Grants', desc: 'Financial assistance for students from economically weaker sections.', icon: FiInfo },
    { title: 'International Scholarships', desc: 'Funding opportunities for students planning to study abroad.', icon: FiGlobe }
  ];

  return (
    <div>
      <section className="bg-gradient-to-br from-yellow-500 to-orange-600 text-white py-16">
        <div className="container-custom">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold mb-4">Scholarships & Grants</h1>
            <p className="text-xl text-yellow-100">Make your education affordable. Explore thousands of scholarships.</p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container-custom max-w-4xl">
          <div className="prose max-w-none text-gray-700 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Funding Your Dream Education</h2>
            <p className="mb-4">
              Financial constraints should never come in the way of a great education. We maintain an up-to-date database of government schemes, university-specific grants, and private scholarships.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {types.map((type, idx) => (
              <div key={idx} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <type.icon className="w-10 h-10 text-orange-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">{type.title}</h3>
                <p className="text-gray-600">{type.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 bg-orange-50 p-8 rounded-2xl border border-orange-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Need help applying?</h3>
            <p className="text-gray-600 mb-6">Our experts can help you identify scholarships you are eligible for and assist with the application process.</p>
            <a href="mailto:supportcollegediscovery@gmail.com?subject=Help with finding scholarships" className="inline-block bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-700 transition">
              Find Scholarships
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ScholarshipInfoPage;
