import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';

export default function TermsAndConditions() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <div className="bg-gray-50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold text-gray-900 text-center pt-24 pb-24">Terms and Conditions</h1>
            <p className="mt-4 text-lg text-gray-600 text-center">Last updated: March 2024</p>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24">
          <div>
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p className="mb-4">
              By accessing and using the services of ED Properties, a real estate company based in Dubai, you agree to be bound by these Terms and Conditions. If you do not agree, please do not use our services or website.
            </p>

            <h2 className="text-2xl font-semibold mb-4">2. Our Services</h2>
            <p className="mb-4">
              ED Properties provides real estate services in Dubai, including:
            </p>
            <ul className="list-disc pl-6 mb-6">
              <li>Property sales, purchases, and rentals</li>
              <li>Real estate investment advisory</li>
              <li>Property management and valuation</li>
              <li>Market research and consultation</li>
            </ul>

            <h2 className="text-2xl font-semibold mb-4">3. User Responsibilities</h2>
            <p className="mb-4">
              As a user, you agree to:
            </p>
            <ul className="list-disc pl-6 mb-6">
              <li>Provide accurate and up-to-date information</li>
              <li>Use our website and services lawfully and ethically</li>
              <li>Maintain the confidentiality of your account details</li>
              <li>Not engage in fraudulent, misleading, or illegal activities</li>
            </ul>

            <h2 className="text-2xl font-semibold mb-4">4. Property Listings & Information</h2>
            <p className="mb-4">
              While we strive to provide accurate property information, all listings are subject to verification and may change without notice. Images and descriptions are for illustrative purposes. We recommend viewing properties in person before making decisions.
            </p>

            <h2 className="text-2xl font-semibold mb-4">5. Limitation of Liability</h2>
            <p className="mb-6">
              ED Properties is not liable for any indirect, incidental, or consequential damages arising from your use of our services or website. All transactions are subject to applicable Dubai and UAE laws.
            </p>

            <h2 className="text-2xl font-semibold mb-4">6. Intellectual Property</h2>
            <p className="mb-6">
              All content on this website, including text, images, logos, and software, is the property of ED Properties and protected by intellectual property laws. You may not use, reproduce, or distribute our content without written permission.
            </p>

            <h2 className="text-2xl font-semibold mb-4">7. Governing Law</h2>
            <p className="mb-6">
              These Terms and Conditions are governed by the laws of Dubai and the United Arab Emirates.
            </p>

            <h2 className="text-2xl font-semibold mb-4">8. Contact Information</h2>
            <p>
              For any questions regarding these Terms and Conditions, please contact us:<br />
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