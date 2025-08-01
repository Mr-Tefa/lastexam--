import React, { useState } from 'react';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = e => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="container mx-auto px-4 py-16 max-w-2xl">
      <h1 className="text-4xl font-bold mb-6 text-green-700 text-center">Contact Us</h1>
      <div className="mb-8 text-center">
        <p className="text-gray-700 text-lg">Have a question or feedback? We'd love to hear from you!</p>
        <div className="mt-4">
          <span className="block text-gray-600">Email: <a href="mailto:support@freshcart.com" className="text-green-600 underline">support@freshcart.com</a></span>
          <span className="block text-gray-600">Phone: <a href="tel:+18001234567" className="text-green-600 underline">+1 (800) 123-4567</a></span>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Name</label>
          <input type="text" name="name" value={form.name} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-4 py-2" />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Email</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-4 py-2" />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Message</label>
          <textarea name="message" value={form.message} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-4 py-2" rows={4} />
        </div>
        <button type="submit" className="w-full bg-green-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-green-700 transition-colors">Send Message</button>
        {submitted && <div className="mt-4 text-green-700 font-semibold text-center">Thank you for contacting us! We'll get back to you soon.</div>}
      </form>
      <div className="bg-gray-100 rounded-xl p-6 text-center">
        <h2 className="text-xl font-bold mb-2 text-green-600">Our Location</h2>
        <div className="w-full h-48 bg-gray-300 rounded-lg flex items-center justify-center text-gray-500">[Map Placeholder]</div>
      </div>
    </main>
  );
} 