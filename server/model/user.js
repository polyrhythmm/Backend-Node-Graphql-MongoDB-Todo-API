const mongoose = require('mongoose');

const MSchema = mongoose.Schema;

const userSchema = MSchema({
  name: String,
});

module.exports = mongoose.model('User', userSchema);
