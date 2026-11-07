const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const User = require('./models/AuthCiti.js'); // Ensure this points correctly to your User model file

async function seedDatabase() {
  try {
    console.log('Connecting to local MongoDB...');
    // Replace with your local database connection details
    await mongoose.connect('mongodb://127.0.0.1:27017/civic_tracker_db');
    console.log('Connected successfully.');

    console.log('Clearing old user records to run a clean baseline...');
    await User.deleteMany({});

    const totalRecords = 100000;
    const batchSize = 5000;
    const totalBatches = totalRecords / batchSize;

    console.log(`Starting to seed ${totalRecords} users in ${totalBatches} batches...`);

    for (let batch = 1; batch <= totalBatches; batch++) {
      const dummyUsers = [];

      for (let i = 0; i < batchSize; i++) {
        // Randomly pick an enterprise role
        const role = faker.helpers.arrayElement(['citizen', 'worker', 'manager', 'admin']);
        let department = 'none';

        // Apply your custom validation logic: workers/managers/admins need real departments
        if (role !== 'citizen') {
          department = faker.helpers.arrayElement(['water', 'electricity', 'roads', 'sanitation', 'global']);
        }

        dummyUsers.push({
          name: faker.person.fullName(),
          email: faker.internet.email().toLowerCase(),
          password: 'hashed_dummy_password_123', // Kept generic to speed up generation
          role: role,
          department: department
        });
      }

      // Bulk insertion bypasses high RAM consumption loops
      await User.insertMany(dummyUsers);
      console.log(`Progress: Batch ${batch}/${totalBatches} inserted (${batch * batchSize} users total).`);
    }

    // Insert your distinct benchmark target user at the very end of the stack
    // Since role is 'citizen', department must be 'none' to clear validation
    await User.create({
      name: 'Target Benchmark User',
      email: 'zackary_target_user@example.com',
      password: 'target_password_xyz',
      role: 'citizen',
      department: 'none'
    });

    console.log('Successfully added the target benchmark user at the end!');
    console.log('Seeding operation completed successfully!');
    
  } catch (error) {
    console.error('An error occurred during seeding:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
    process.exit(0);
  }
}

seedDatabase();