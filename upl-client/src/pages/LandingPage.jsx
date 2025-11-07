import { Link } from 'react-router-dom';
import { FaHandshake, FaChartLine, FaUsers, FaCheckCircle } from 'react-icons/fa';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-indigo-600">UPL Partner</h1>
            <div className="space-x-4">
              <Link
                to="/enquiry"
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                Apply Now
              </Link>
              <Link
                to="/login"
                className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Become a Partner with Us
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join our growing network of franchise partners and unlock opportunities for success
          </p>
          <Link
            to="/enquiry"
            className="inline-block px-8 py-3 bg-indigo-600 text-white text-lg font-semibold rounded-lg hover:bg-indigo-700 transition shadow-lg"
          >
            Start Your Application
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <FaHandshake className="text-4xl text-indigo-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Partnership Benefits</h3>
            <p className="text-gray-600">
              Comprehensive support and training to help you succeed in your business
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <FaChartLine className="text-4xl text-indigo-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Growth Opportunities</h3>
            <p className="text-gray-600">
              Access to proven business models and marketing strategies
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <FaUsers className="text-4xl text-indigo-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Expert Support</h3>
            <p className="text-gray-600">
              Dedicated team to assist you throughout your partnership journey
            </p>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-white">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid md:grid-cols-4 gap-8">
          {[
            { step: '1', title: 'Submit Enquiry', desc: 'Fill out our partnership enquiry form' },
            { step: '2', title: 'Review Process', desc: 'Our team reviews your application' },
            { step: '3', title: 'Get Approved', desc: 'Receive approval and account access' },
            { step: '4', title: 'Start Partnership', desc: 'Complete onboarding and begin' }
          ].map((item) => (
            <div key={item.step} className="text-center">
              <div className="w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                {item.step}
              </div>
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-indigo-600 rounded-lg p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join hundreds of successful partners already working with us
          </p>
          <Link
            to="/enquiry"
            className="inline-block px-8 py-3 bg-white text-indigo-600 text-lg font-semibold rounded-lg hover:bg-gray-100 transition"
          >
            Apply Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2024 UPL Partner Management. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

