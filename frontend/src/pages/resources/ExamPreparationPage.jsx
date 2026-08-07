import React from 'react';
import { motion } from 'framer-motion';
import { FiBookOpen, FiClock, FiTarget } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const ExamPreparationPage = () => {
  const resources = [
    { title: 'Mock Tests', desc: 'Full-length practice tests for JEE, NEET, CUET, and CAT.', icon: FiClock },
    { title: 'Study Materials', desc: 'Comprehensive notes and previous year question papers.', icon: FiBookOpen },
    { title: 'Performance Analytics', desc: 'Identify your weak areas with AI-driven performance reports.', icon: FiTarget }
  ];

  return (
    <div>
      <section className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white py-16">
        <div className="container-custom">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold mb-4">Exam Preparation</h1>
            <p className="text-xl text-indigo-100">Ace your entrance exams with our curated study resources and mock tests.</p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container-custom max-w-4xl">
          <div className="prose max-w-none text-gray-700 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Top Scores Unlock Top Colleges</h2>
            <p className="mb-4">
              Entrance exams are the gateway to premier institutions. We provide a structured approach to your preparation, ensuring you cover the syllabus efficiently and practice effectively.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {resources.map((res, idx) => (
              <div key={idx} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow border border-gray-100">
                <res.icon className="w-10 h-10 text-indigo-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">{res.title}</h3>
                <p className="text-gray-600">{res.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 p-8 bg-indigo-50 rounded-2xl text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to start practicing?</h3>
            <p className="text-gray-600 mb-6">Join our test series and get detailed analytics on your performance.</p>
            <Link to="/contact?subject=Inquiry about Exam Preparation Test Series" className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition">
              Explore Test Series
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ExamPreparationPage;
