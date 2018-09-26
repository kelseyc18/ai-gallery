const mongoose = require('mongoose');

const GalleryAppSchema = new mongoose.Schema({
  title: String,
  imagePath: String,
  creationDate: { type: Date, default: Date.now },
  lastModifiedDate: { type: Date, default: Date.now },
  tutorialUrl: String,
  credits: String,
  description: String,
  isDraft: Boolean,
  numDownloads: { type: Number, default: 0 },
  numFavorites: { type: Number, default: 0 },
  aiaPath: String,
  authorId: String,
  projectId: String,
  appInventorInstance: String
});

module.exports = mongoose.model('GalleryApp', GalleryAppSchema);
