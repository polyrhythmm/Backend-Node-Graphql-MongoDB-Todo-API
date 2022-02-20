const mongoose = require('mongoose');
const MSchema = mongoose.Schema;

const todoSchema = MSchema({
  title: String,
  description: String,
  completed: Boolean,
  userId: String,
});

module.exports = mongoose.model('Todo', todoSchema);
