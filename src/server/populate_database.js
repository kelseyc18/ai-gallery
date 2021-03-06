const async = require('async');
const db = require('./db');

const { Op } = db.Sequelize;

db.sequelize.sync().then(() => {
  console.log('Tables synced');
});

const {
  User, Tag, Project, FeaturedLabel,
} = db;

const users = [
  {
    name: 'Kelsey',
    username: 'piazza_master',
    authorId: '1',
    appInventorInstance: 'ai2',
    bio: 'Kelsey is addicted to Piazza.',
  },
  {
    name: 'Mary',
    username: 'boba_master',
    authorId: '2',
    appInventorInstance: 'ai2',
    bio: 'Mary is addicted to boba.',
  },
  {
    name: 'Michelle',
    username: 'coffee_master',
    authorId: '3',
    appInventorInstance: 'ai2',
    bio: 'Michelle is addicted to coffee.',
  },
];

const projects = [
  {
    authorUsername: 'piazza_master',
    title: 'Apple',
    projectId: '1',
    appInventorInstance: 'ai2',
    aiaPath: 'Apple_1542641367816',
  },
  {
    authorUsername: 'piazza_master',
    title: 'Banana',
    projectId: '2',
    appInventorInstance: 'ai2',
    aiaPath: 'Banana_1542641375020',
    tags: ['Tutorials', 'Lifestyle'],
  },
  {
    authorUsername: 'boba_master',
    title: 'Cauliflower',
    projectId: '3',
    appInventorInstance: 'ai2',
    aiaPath: 'Cauliflower_1542641389678',
    featuredLabel: {
      ageDivision: 'Young',
      dateAwarded: '2018-08',
      category: 'Inventor',
      description: 'This award was given to the best invention about cauliflower (not broccoli)!',
    },
    tags: ['Education'],
  },
  {
    authorUsername: 'coffee_master',
    title: 'Dog',
    projectId: '4',
    appInventorInstance: 'ai2',
    aiaPath: 'Dog_1542641401480',
    featuredLabel: {
      ageDivision: 'Adult',
      dateAwarded: '2013-10',
      category: 'Most Creative',
      description: 'This award was given to the most creative use of dog pictures.',
    },
    tags: ['Games', 'Arts and Music'],
  },
];

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

      Project.create({
        title,
        projectId,
        appInventorInstance,
        aiaPath,
        imagePath,
        tutorialUrl,
        description,
      }).then((project) => {
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
