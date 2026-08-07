import React from 'react';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiFileText, FiUsers } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const AdmissionGuidancePage = () => {
  const steps = [
    { title: 'Profile Evaluation', desc: 'We analyze your academic background, test scores, and extracurriculars.', icon: FiFileText },
    { title: 'College Shortlisting', desc: 'Based on your profile, we suggest the best-fit colleges for your career goals.', icon: FiCheckCircle },
    { title: 'Application Assistance', desc: 'Get help with filling forms, writing essays, and preparing for interviews.', icon: FiUsers }
  ];

  return (
    <div>
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white py-16">
        <div className="container-custom">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold mb-4">Admission Guidance</h1>
            <p className="text-xl text-blue-100">Expert counseling to help you navigate the complex college admission process.</p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container-custom max-w-4xl">
          <div className="prose max-w-none text-gray-700 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Journey to the Perfect College</h2>
            <p className="mb-4">
              Getting into your dream college requires more than just good grades. It requires a strategic approach to applications, a deep understanding of what colleges look for, and the ability to present your unique story effectively.
            </p>
            <p>
              Our admission guidance program connects you with experienced counselors who have helped 50+ students secure seats in top-tier institutions across India.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, idx) => (
              <div key={idx} className="bg-gray-50 rounded-xl p-6 shadow-sm border border-gray-100">
                <step.icon className="w-10 h-10 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.desc}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <Link to="/contact?subject=Book a Free Session" className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
              Book a Free Session
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdmissionGuidancePage;
