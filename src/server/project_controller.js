const async = require('async');

const User = require('../models/user');
const GalleryApp = require('../models/galleryapp');

exports.all_projects = (req, res) => {
  GalleryApp.find()
    .populate('author')
    .exec((err, projects) => {
      res.send({ projects });
    });
};

exports.project_by_id = (req, res) => {
  GalleryApp.findById(req.params.id)
    .populate('author')
    .exec((err, project) => res.send({ err, project }));
};

exports.create_project = (req, res) => {
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
};

exports.edit_project = (req, res) => {
  const {
    title, id, description, tutorialUrl, credits, isDraft,
  } = req.body;

  if (req.file) {
    const imagePath = req.file.path;

    GalleryApp.findByIdAndUpdate(
      id,
      {
        title,
        description,
        tutorialUrl,
        credits,
        lastModifiedDate: Date.now(),
        imagePath,
        isDraft,
      },
      { new: true },
    )
      .populate('author')
      .exec((err, project) => {
        if (err) return res.send(err);
        return res.json({ project });
      });
  } else {
    GalleryApp.findByIdAndUpdate(
      id,
      {
        title,
        description,
        tutorialUrl,
        credits,
        lastModifiedDate: Date.now(),
        isDraft,
      },
      { new: true },
    )
      .populate('author')
      .exec((err, project) => {
        if (err) return res.send(err);
        return res.json({ project });
      });
  }
};
