const mongoose = require('mongoose');

const { Schema } = mongoose;

const GalleryAppSchema = new Schema({
  title: String,
  imagePath: String,
  creationDate: { type: Date, default: Date.now },
  lastModifiedDate: { type: Date, default: Date.now },
  tutorialUrl: String,
  credits: String,
  description: String,
  isDraft: { type: Boolean, default: false },
  numDownloads: { type: Number, default: 0 },
  numFavorites: { type: Number, default: 0 },
  aiaPath: String,
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  projectId: String,
  rootProjectId: String,
  parentProjectId: String,
  appInventorInstance: String,
});

module.exports = mongoose.model('GalleryApp', GalleryAppSchema);
