const mongoose = require('mongoose');

const { Schema } = mongoose;

const TagSchema = new Schema({
  id: String,
  name: String,
});

module.exports = mongoose.model('Tag', TagSchema);
