import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';

export default function CookiePolicy() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <div className="bg-gray-50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold text-gray-900 text-center pt-24 pb-24">Cookie Policy</h1>
            <p className="mt-4 text-lg text-gray-600 text-center">Last updated: March 2024</p>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24">
          <div>
            <h2 className="text-2xl font-semibold mb-4">1. What Are Cookies?</h2>
            <p className="mb-4">
              Cookies are small text files stored on your device when you visit the ED Properties website. We use cookies to enhance your experience, analyze site usage, and provide relevant property information for the Dubai real estate market.
            </p>

            <h2 className="text-2xl font-semibold mb-4">2. Types of Cookies We Use</h2>
            <p className="mb-4">
              We use the following types of cookies on our Dubai real estate website:
            </p>
            <ul className="list-disc pl-6 mb-6">
              <li><strong>Essential Cookies:</strong> Necessary for the website to function and for you to use our property services.</li>
              <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our site so we can improve our services and property listings.</li>
              <li><strong>Functionality Cookies:</strong> Remember your preferences, such as saved properties or language settings.</li>
              <li><strong>Marketing Cookies:</strong> Used to deliver property offers and updates relevant to your interests.</li>
            </ul>

            <h2 className="text-2xl font-semibold mb-4">3. How We Use Cookies</h2>
            <p className="mb-4">
              We use cookies to:
            </p>
            <ul className="list-disc pl-6 mb-6">
              <li>Remember your preferences and saved properties</li>
              <li>Analyze website traffic and user behavior</li>
              <li>Improve our website and property search experience</li>
              <li>Provide personalized property recommendations</li>
              <li>Enable social media and sharing features</li>
            </ul>

            <h2 className="text-2xl font-semibold mb-4">4. Third-Party Cookies</h2>
            <p className="mb-4">
              We may use third-party services (such as Google Analytics) to help us analyze website usage and deliver targeted property ads. These third parties may set their own cookies on your device.
            </p>

            <h2 className="text-2xl font-semibold mb-4">5. Managing Cookies</h2>
            <p className="mb-6">
              You can control and manage cookies in your browser settings. Please note that disabling certain cookies may affect your ability to use some features of our Dubai real estate website.
            </p>

            <h2 className="text-2xl font-semibold mb-4">6. Cookie Duration</h2>
            <p className="mb-4">
              Some cookies are session-based (deleted when you close your browser), while others are persistent (remain on your device for a set period).
            </p>

            <h2 className="text-2xl font-semibold mb-4">7. Updates to This Policy</h2>
            <p className="mb-6">
              We may update this Cookie Policy from time to time. Any changes will be posted on this page with an updated revision date.
            </p>

            <h2 className="text-2xl font-semibold mb-4">8. Contact Us</h2>
            <p>
              For any questions about our Cookie Policy or how we use cookies on our Dubai real estate website, please contact us:<br />
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