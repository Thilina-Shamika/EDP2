import connectDB from '../lib/mongodb';
import OffPlanProperty from '../models/OffPlanProperty';

const sampleProperties = [
  {
    title: 'Dubai Creek Harbour Apartments',
    propertyType: 'Apartment',
    price: 'Starting from AED 1.2M',
    mainImage: '/images/creek.png',
    location: 'Dubai Creek Harbour',
    developer: 'Emaar Properties',
    handoverDate: 'Q4 2024',
    status: 'published',
    beds: '1-3'
  },
  {
    title: 'The Heights Country Club',
    propertyType: 'Villa',
    price: 'Starting from AED 3.5M',
    mainImage: '/images/heights.png',
    location: 'Dubai Hills Estate',
    developer: 'Emaar Properties',
    handoverDate: 'Q2 2025',
    status: 'published',
    beds: '4-6'
  },
  {
    title: 'EXPO Living Project',
    propertyType: 'Apartment',
    price: 'Starting from AED 950K',
    mainImage: '/images/harbour.jpg',
    location: 'Dubai South',
    developer: 'Dubai Holding',
    handoverDate: 'Q3 2024',
    status: 'published',
    beds: '1-2'
  },
  {
    title: 'Arabian Ranches III',
    propertyType: 'Villa',
    price: 'Starting from AED 2.8M',
    mainImage: '/images/arabian.png',
    location: 'Arabian Ranches',
    developer: 'Emaar Properties',
    handoverDate: 'Q1 2025',
    status: 'published',
    beds: '3-5'
  }
];

async function seedDatabase() {
  try {
    await connectDB();
    
    // Clear existing properties
    await OffPlanProperty.deleteMany({});
    
    // Insert sample properties
    await OffPlanProperty.insertMany(sampleProperties);
    
    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase(); 