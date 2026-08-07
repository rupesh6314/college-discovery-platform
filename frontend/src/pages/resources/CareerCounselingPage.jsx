import React from 'react';
import { motion } from 'framer-motion';
import { FiBriefcase, FiCompass, FiTrendingUp } from 'react-icons/fi';

const CareerCounselingPage = () => {
  const steps = [
    { title: 'Career Discovery', desc: 'Identify your strengths and interests using our psychometric assessments.', icon: FiCompass },
    { title: 'Industry Insights', desc: 'Learn about emerging career paths and future job market trends.', icon: FiTrendingUp },
    { title: 'Career Mapping', desc: 'Map out the educational requirements to achieve your professional goals.', icon: FiBriefcase }
  ];

  return (
    <div>
      <section className="bg-gradient-to-br from-teal-600 to-green-700 text-white py-16">
        <div className="container-custom">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold mb-4">Career Counseling</h1>
            <p className="text-xl text-teal-100">Confused about your future? Let our experts guide you to the perfect career path.</p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container-custom max-w-4xl">
          <div className="prose max-w-none text-gray-700 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Discover Your True Potential</h2>
            <p className="mb-4">
              Choosing the right career is one of the most important decisions of your life. Our certified career counselors use scientifically backed methods to help you understand your aptitude and personality.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, idx) => (
              <div key={idx} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <step.icon className="w-10 h-10 text-teal-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center border-t border-gray-100 pt-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Take the First Step</h3>
            <p className="text-gray-600 mb-6">Take our 15-minute free career assessment test to discover careers that match your profile.</p>
            <a href="mailto:supportcollegediscovery@gmail.com?subject=Start Career Assessment" className="inline-block bg-teal-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-teal-700 transition">
              Start Assessment
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CareerCounselingPage;
