import { Phone, Mail, MessageCircle } from 'lucide-react';

export default function EDPropertiesCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
      <h2 className="text-2xl font-bold mb-3 text-gray-900">ED Properties</h2>
      <p className="text-gray-600 text-base mb-6">
      Have a question, need more information, or just exploring your options? Reach out to ED Properties today. Our team is here to assist you every step of the way.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <a href="tel:+971586800956" className="flex items-center justify-center gap-2 bg-black text-white py-3 px-6 rounded-xl hover:bg-gray-800 transition-colors text-base font-medium">
          <Phone className="w-5 h-5" /> Call
        </a>
        <a href="mailto:info@edproperties.ae" className="flex items-center justify-center gap-2 bg-black text-white py-3 px-6 rounded-xl hover:bg-gray-800 transition-colors text-base font-medium">
          <Mail className="w-5 h-5" /> Email
        </a>
        <a href="https://wa.me/971525999948" className="flex items-center justify-center gap-2 bg-black text-white py-3 px-6 rounded-xl hover:bg-gray-800 transition-colors text-base font-medium">
          <MessageCircle className="w-5 h-5" /> Whatsapp
        </a>
      </div>
    </div>
  );
} 