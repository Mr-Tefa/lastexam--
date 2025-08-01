import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLeaf, faBullseye, faUsers, faHandshake, faSeedling, faTruck } from '@fortawesome/free-solid-svg-icons';

export default function About() {
  return (
    <main className="bg-gray-50 min-h-screen w-full">
      {/* Hero Section with background image overlay */}
      <section className="relative bg-green-700 text-white py-20 mb-12 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80" alt="Groceries" className="absolute inset-0 w-full h-full object-cover opacity-30" />
        <div className="relative z-10 container mx-auto px-4 text-center">
          <FontAwesomeIcon icon={faLeaf} className="text-6xl mb-4" />
          <h1 className="text-5xl font-extrabold mb-4 drop-shadow-lg">About FreshCart</h1>
          <p className="text-xl max-w-2xl mx-auto mb-2 drop-shadow">
            FreshCart is your trusted partner for fresh groceries delivered to your door. We believe in making healthy living easy and accessible for everyone.
          </p>
        </div>
      </section>

      {/* Vision, Mission, and Values */}
      <section className="container mx-auto px-4 mb-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center text-center border-t-4 border-green-600">
          <FontAwesomeIcon icon={faBullseye} className="text-green-600 text-4xl mb-3" />
          <h2 className="text-2xl font-bold mb-2 text-green-700">Our Vision</h2>
          <p className="text-gray-600">To be the leading online grocery platform, providing the freshest products and best customer experience in the region.</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center text-center border-t-4 border-green-600">
          <FontAwesomeIcon icon={faLeaf} className="text-green-600 text-4xl mb-3" />
          <h2 className="text-2xl font-bold mb-2 text-green-700">Our Mission</h2>
          <p className="text-gray-600">To deliver high-quality groceries quickly and reliably, while supporting local farmers and sustainable practices.</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center text-center border-t-4 border-green-600">
          <FontAwesomeIcon icon={faHandshake} className="text-green-600 text-4xl mb-3" />
          <h2 className="text-2xl font-bold mb-2 text-green-700">Our Values</h2>
          <ul className="text-gray-600 text-left list-disc pl-6">
            <li>Integrity & Trust</li>
            <li>Customer First</li>
            <li>Innovation</li>
            <li>Sustainability</li>
            <li>Community Support</li>
          </ul>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="container mx-auto px-4 mb-16">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-6 text-green-700">Our Journey</h2>
          <div className="flex flex-col md:flex-row justify-center items-center gap-8">
            <div className="flex flex-col items-center">
              <FontAwesomeIcon icon={faSeedling} className="text-green-600 text-3xl mb-2" />
              <div className="font-bold text-gray-800">2019</div>
              <div className="text-gray-500 text-sm">FreshCart founded</div>
            </div>
            <div className="w-8 h-1 bg-green-200 md:mx-4 my-4 md:my-0 rounded-full" />
            <div className="flex flex-col items-center">
              <FontAwesomeIcon icon={faUsers} className="text-green-600 text-3xl mb-2" />
              <div className="font-bold text-gray-800">2021</div>
              <div className="text-gray-500 text-sm">10,000+ happy customers</div>
            </div>
            <div className="w-8 h-1 bg-green-200 md:mx-4 my-4 md:my-0 rounded-full" />
            <div className="flex flex-col items-center">
              <FontAwesomeIcon icon={faTruck} className="text-green-600 text-3xl mb-2" />
              <div className="font-bold text-gray-800">2023</div>
              <div className="text-gray-500 text-sm">Expanded to 3 cities</div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="container mx-auto px-4 mb-16">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <FontAwesomeIcon icon={faUsers} className="text-green-600 text-4xl mb-3" />
          <h2 className="text-2xl font-bold mb-4 text-green-700">Meet the Team</h2>
          <div className="flex flex-wrap justify-center gap-8 mt-6">
            {/* Example team members - replace with real data if available */}
            <div className="flex flex-col items-center">
              <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Team Member" className="w-20 h-20 rounded-full border-4 border-green-100 mb-2" />
              <div className="font-semibold text-gray-800">Ahmed Hassan</div>
              <div className="text-gray-500 text-sm">CEO & Founder</div>
            </div>
            <div className="flex flex-col items-center">
              <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Team Member" className="w-20 h-20 rounded-full border-4 border-green-100 mb-2" />
              <div className="font-semibold text-gray-800">Sara Ali</div>
              <div className="text-gray-500 text-sm">Operations Manager</div>
            </div>
            <div className="flex flex-col items-center">
              <img src="https://randomuser.me/api/portraits/men/65.jpg" alt="Team Member" className="w-20 h-20 rounded-full border-4 border-green-100 mb-2" />
              <div className="font-semibold text-gray-800">Mohamed Tarek</div>
              <div className="text-gray-500 text-sm">Tech Lead</div>
            </div>
            <div className="flex flex-col items-center">
              <img src="https://randomuser.me/api/portraits/women/68.jpg" alt="Team Member" className="w-20 h-20 rounded-full border-4 border-green-100 mb-2" />
              <div className="font-semibold text-gray-800">Mona Adel</div>
              <div className="text-gray-500 text-sm">Customer Success</div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
} 