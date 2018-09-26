const express = require('express');
const os = require('os');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });

const app = express();

const GalleryApp = require('../models/galleryapp');

mongoose.connect(
  process.env.MONGODB_URI || 'mongodb://hal:abelson1@ds113703.mlab.com:13703/ai-gallery'
);
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

app.use(express.static('dist'));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    encoded: true
  })
);

// Make db accessible to router
app.use((req, _, next) => {
  req.db = db;
  next();
});

app.get('/api/getUsername', (req, res) => res.send({ username: os.userInfo().username }));
app.get('/api/getApps', (req, res) => {
  GalleryApp.find().exec((err, apps) => {
    res.send({ apps });
  });
});
app.post('/api/addApp', upload.single('aia'), (req, res) => {
  const {
    title, authorId, projectId, appInventorInstance
  } = req.body;

  const galleryApp = new GalleryApp({
    title,
    authorId,
    projectId,
    appInventorInstance,
    aiaPath: req.file.path
  });
  console.log(galleryApp);
  galleryApp.save((err, newApp) => {
    if (err) return console.log(err);
    return res.send(newApp);
  });
});
app.listen(8080, () => console.log('Listening on port 8080!'));
