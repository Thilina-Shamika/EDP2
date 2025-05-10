import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';

export default function PrivacyPolicy() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <div className="bg-gray-50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold text-gray-900 text-center pt-24 pb-24">Privacy Policy</h1>
            <p className="mt-4 text-lg text-gray-600 text-center">Last updated: March 2024</p>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24">
          <div>
            <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
            <p className="mb-4">
              At ED Properties, a leading real estate company in Dubai, we collect information you provide directly to us when you inquire about, buy, sell, or rent property through our services. This includes:
            </p>
            <ul className="list-disc pl-6 mb-6">
              <li>Name, email address, and phone numbers</li>
              <li>Property preferences and requirements</li>
              <li>Financial and identification information for transactions</li>
              <li>Communication records and correspondence</li>
            </ul>

            <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
            <p className="mb-4">
              We use your information to:
            </p>
            <ul className="list-disc pl-6 mb-6">
              <li>Facilitate property sales, purchases, and rentals in Dubai</li>
              <li>Respond to your inquiries and provide customer support</li>
              <li>Send you property listings and market updates relevant to your interests</li>
              <li>Comply with UAE legal and regulatory requirements</li>
              <li>Improve our services and website experience</li>
            </ul>

            <h2 className="text-2xl font-semibold mb-4">3. Information Sharing</h2>
            <p className="mb-4">
              We may share your information with:
            </p>
            <ul className="list-disc pl-6 mb-6">
              <li>Our trusted agents and property consultants</li>
              <li>Service providers who assist in our operations (e.g., IT, marketing, legal)</li>
              <li>Government authorities and regulators as required by Dubai and UAE law</li>
              <li>Other parties with your explicit consent</li>
            </ul>

            <h2 className="text-2xl font-semibold mb-4">4. Data Security</h2>
            <p className="mb-6">
              We implement industry-standard security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. Only authorized staff and partners have access to your data.
            </p>

            <h2 className="text-2xl font-semibold mb-4">5. Your Rights</h2>
            <p className="mb-4">
              You have the right to:
            </p>
            <ul className="list-disc pl-6 mb-6">
              <li>Request access to your personal information</li>
              <li>Correct or update your data</li>
              <li>Request deletion of your data, subject to legal requirements</li>
              <li>Opt out of marketing communications at any time</li>
            </ul>

            <h2 className="text-2xl font-semibold mb-4">6. Contact Us</h2>
            <p>
              For any questions or requests regarding this Privacy Policy or your data, please contact us:<br />
              608, Al Jawhara Building,<br />
              Khalid Bin Al Waleed Rd,<br />
              Al Mankhool,<br />
              Dubai<br />
              <strong>Phone:</strong> +971 58 680 0956, +971 52 599 9948<br />
              <strong>Email:</strong> info@edproperties.ae
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
} 