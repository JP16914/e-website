
const mongoose = require('mongoose');

// Use the URI from .env or hardcode for test
const uri = 'mongodb+srv://phuoc:123@phuoc.xbitvje.mongodb.net/?appName=phuoc';

console.log('Test connecting to:', uri);

mongoose.connect(uri)
  .then(() => {
    console.log('Connected successfully!');
    process.exit(0);
  })
  .catch(err => {
    console.error('Connection failed:', err);
    process.exit(1);
  });
