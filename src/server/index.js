const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');
const async = require('async');

const upload = multer({ dest: 'uploads/' });

const app = express();

const GalleryApp = require('../models/galleryapp');
const User = require('../models/user');

mongoose.connect(
  process.env.MONGODB_URI || 'mongodb://hal:abelson1@ds113703.mlab.com:13703/ai-gallery',
);
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

app.use(express.static('dist'));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    encoded: true,
  }),
);

// Make db accessible to router
app.use((req, _, next) => {
  req.db = db;
  next();
});

// USER ROUTES
app.post('/api/user/create', (req, res) => {
  const {
    authorId, name, username, appInventorInstance,
  } = req.body;

  const user = new User({
    authorId,
    name,
    username,
    appInventorInstance,
  });
  user.save((err, user) => res.send({ err, user }));
});
app.get('/api/user/:username', (req, res) => {
  User.findOne({ username: req.params.username })
    .populate({ path: 'projects', populate: { path: 'author' } })
    .exec((err, user) => res.send({ err, user }));
});

// PROJECT ROUTES
app.get('/api/projects', (req, res) => {
  GalleryApp.find()
    .populate('author')
    .exec((err, projects) => {
      res.send({ projects });
    });
});
app.get('/api/project/:id', (req, res) => {
  GalleryApp.findById(req.params.id)
    .populate('author')
    .exec((err, project) => res.send({ err, project }));
});
app.post('/api/project/create', upload.single('aia'), (req, res) => {
  const {
    title, authorId, projectId, appInventorInstance,
  } = req.body;

  async.waterfall(
    [
      (next) => {
        User.findOne({ authorId, appInventorInstance }, (err, user) => {
          next(err, user);
        });
      },

      (user, next) => {
        GalleryApp.create(
          {
            title,
            author: user,
            projectId,
            appInventorInstance,
            aiaPath: req.file.path,
          },
          (err, project) => next(err, project, user),
        );
      },

      (project, user, next) => {
        User.findByIdAndUpdate(user._id, { $push: { projects: project._id } }, (err) => {
          next(err, project);
        });
      },
    ],
    (err, project) => {
      if (err) res.send(err);
      else res.send({ project });
    },
  );
});
app.post('/api/project/edit', (req, res) => {
  const {
    title, id, description, tutorialUrl, credits,
  } = req.body;

  GalleryApp.findByIdAndUpdate(
    id,
    {
      title,
      description,
      tutorialUrl,
      credits,
      lastModifiedDate: Date.now(),
    },
    { new: true },
  ).exec((err, project) => {
    if (err) return res.send(err);
    return res.json({ project });
  });
});
app.listen(8080, () => console.log('Listening on port 8080!'));
