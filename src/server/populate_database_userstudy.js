const async = require('async');
const { Base64Encode } = require('base64-stream');
const fs = require('fs');
const path = require('path');

const db = require('./db');

const { Op } = db.Sequelize;

db.sequelize.sync().then(() => {
  console.log('Tables synced');
});

const {
  User, Tag, Project, FeaturedLabel,
} = db;

const users = require('./users.json');
const projects = require('./projects.json');

const tags = ['Games', 'Tutorials', 'Arts and Music', 'Education', 'Lifestyle'];

function populateUsers() {
  return new Promise((resolve, reject) => {
    async.each(users, ((user, cb) => {
      User.create(user).then((user) => {
        console.log(
          user.get({ plain: true }),
        );
        cb();
      });
    }), (err) => {
      if (err) reject(err);
      resolve();
    });
  });
}

function populateTags() {
  return new Promise((resolve, reject) => {
    async.each(tags, ((tagName, cb) => {
      Tag.create({ tagName }).then((tag) => {
        console.log(tag.get({ plain: true }));
        cb();
      });
    }), (err) => {
      if (err) reject(err);
      resolve();
    });
  });
}

function populateProjects() {
  return new Promise((resolve, reject) => {
    async.eachSeries(projects, (projectData, cb) => {
      const {
        title,
        projectId,
        appInventorInstance,
        imagePath,
        aiaPath,
        featuredLabel,
        tutorialUrl,
        description,
        tags,
        authorUsername,
      } = projectData;

      const aiaPathNoFileExtension = path.parse(aiaPath).name;

      Project.create({
        title,
        projectId,
        appInventorInstance,
        aiaPath: aiaPathNoFileExtension,
        imagePath,
        tutorialUrl,
        description,
      }).then((project) => {
        const readStream = fs.createReadStream(`./uploads/${aiaPath}`);
        const writeStream = fs.createWriteStream(`./uploads/${aiaPathNoFileExtension}.asc`);
        readStream.pipe(new Base64Encode()).pipe(writeStream);

        User.findOne({ where: { username: authorUsername } }).then((user) => {
          user.addProject(project).then(() => {
            Tag.findAll({
              where: {
                tagName: {
                  [Op.in]: tags || [],
                },
              },
            }).then((tags) => {
              project.setTags(tags).then(() => {
                if (featuredLabel) {
                  const {
                    ageDivision, dateAwarded, category, description,
                  } = featuredLabel;

                  FeaturedLabel.findOrCreate({
                    where: {
                      ageDivision,
                      dateAwarded,
                      category,
                    },
                  }).spread((label) => {
                    label.update({ description }).then(() => {
                      label.reload().then((label) => {
                        project.setFeaturedLabel(label).then(() => {
                          project.reload().then((project) => {
                            console.log(project.get({ plain: true }));
                            cb();
                          });
                        });
                      });
                    });
                  });
                } else {
                  console.log(project.get({ plain: true }));
                  cb();
                }
              });
            });
          });
        });
      });
    }, (err) => {
      if (err) reject(err);
      resolve();
    });
  });
}

populateUsers().then(() => {
  populateTags().then(() => {
    populateProjects();
  });
});
