import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';

const ContactPage = () => {
  const location = useLocation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const subject = params.get('subject');
    if (subject) {
      setFormData(prev => ({ ...prev, subject }));
    }
  }, [location]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would send data to the backend
    toast.success('Your message has been sent successfully! We will get back to you soon.');
    setFormData({ name: '', email: '', subject: formData.subject, message: '' });
  };

  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="container-custom max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white text-center">
            <h1 className="text-3xl font-bold mb-2">Get in Touch</h1>
            <p className="text-blue-100">Fill out the form below and our team will get back to you shortly.</p>
          </div>
          
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Full Name</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  placeholder="John Doe"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2">Email Address</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Subject / Interested Service</label>
                <select 
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Book a Free Session">Admission Guidance (Book a Free Session)</option>
                  <option value="Inquiry about Exam Preparation Test Series">Exam Preparation Test Series</option>
                  <option value="Start Career Assessment">Career Counseling (Start Assessment)</option>
                  <option value="Help with finding scholarships">Scholarship Assistance</option>
                </select>
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2">Message</label>
                <textarea 
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="4" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="How can we help you?"
                ></textarea>
              </div>
              
              <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition">
                Send Message
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactPage;
