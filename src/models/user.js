const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserSchema = new Schema({
  name: String,
  username: String,
  authorId: String,
  appInventorInstance: String,
  projects: [{ type: Schema.Types.ObjectId, ref: 'GalleryApp' }],
});

module.exports = mongoose.model('User', UserSchema);
