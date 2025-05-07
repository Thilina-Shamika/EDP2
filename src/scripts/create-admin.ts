import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect('mongodb+srv://thilinashamika:yunodPLWnXbdtIvD@edpropnew.w9ieuwu.mongodb.net/?retryWrites=true&w=majority&appName=EDPropNew');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

// User Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
}, {
  timestamps: true,
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const hashedPassword = await bcrypt.hash(this.password, 12);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error as Error);
  }
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

async function createAdminUser() {
  try {
    console.log('Connecting to MongoDB...');
    await connectDB();

    const adminUser = {
      name: 'Admin User',
      email: 'admin@edprop.com',
      password: 'Admin@123',
      role: 'admin',
    };

    console.log('Checking for existing admin user...');
    const existingAdmin = await User.findOne({ email: adminUser.email });
    if (existingAdmin) {
      console.log('Admin user already exists with email:', existingAdmin.email);
      process.exit(0);
    }

    console.log('Creating new admin user...');
    const newAdmin = await User.create(adminUser);
    console.log('Admin user created successfully:', {
      id: newAdmin._id,
      email: newAdmin.email,
      role: newAdmin.role
    });
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
}

createAdminUser(); 