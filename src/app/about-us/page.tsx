import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';

export default function AboutUs() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white py-24 flex flex-col items-center justify-center">
        {/* About Us Pill */}

        <div className="flex justify-center mb-6">
          <span className="inline-block bg-gray-100 text-gray-800 px-4 py-2 rounded-full text-sm font-medium">
            About Us
          </span>
        </div>

         {/* Main Heading */}
         <h1 className="text-3xl mb-5 md:text-4xl font-bold text-center text-gray-900">
          Elite Destination Property (EDP)
        </h1>


        {/* Subtitle */}
        <p className="text-center text-lg text-gray-700 max-w-2xl mb-8">
          Trust and relationships are at the heart of our story. It all started when our founders Abdul Basir Qayumi and Mirwais Jahanbaz shared a clear vision: put our investors first and build lasting partnerships through genuine understanding of our market.
        </p>
       
      </main>
      <Footer />
    </>
  );
} 