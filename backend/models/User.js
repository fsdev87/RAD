const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String, // hash if you're doing auth
  role: { type: String, enum: ['user', 'doctor'], default: 'user' }
});

module.exports = mongoose.model('User', userSchema);
