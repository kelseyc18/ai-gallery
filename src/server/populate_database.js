const async = require('async');
const db = require('./db');

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
    imagePath: 'api/uploads/1542641469895_IMG_9507.jpg',
    aiaPath: 'Apple_1542641367816',
  },
  {
    authorUsername: 'piazza_master',
    title: 'Banana',
    projectId: '2',
    appInventorInstance: 'ai2',
    aiaPath: 'Banana_1542641375020',
  },
  {
    authorUsername: 'boba_master',
    title: 'Cauliflower',
    projectId: '3',
    appInventorInstance: 'ai2',
    aiaPath: 'Cauliflower_1542641389678',
    featuredLabel: {
      ageDivision: 'Youth',
      dateAwarded: '2018-08',
      category: 'Inventor',
      description: 'This award was given to the best invention about cauliflower (not broccoli)!',
    },
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
  },
];

const tags = ['Games', 'Tutorials', 'Arts and Music', 'Education', 'Lifestyle'];

function populateUsers() {
  users.forEach((user) => {
    User.create(user).then((user) => {
      console.log(
        user.get({
          plain: true,
        }),
      );
    });
  });
}

function populateTags() {
  tags.forEach((tagName) => {
    Tag.create({ tagName }).then((tag) => {
      console.log(tag.get({ plain: true }));
    });
  });
}

function populateProjects() {
  async.eachSeries(projects, (projectData, cb) => {
    const {
      title,
      projectId,
      appInventorInstance,
      aiaPath,
      imagePath,
      featuredLabel,
    } = projectData;

    Project.create({
      title,
      projectId,
      appInventorInstance,
      aiaPath,
      imagePath,
    }).then((project) => {
      User.findOne({ where: { username: projectData.authorUsername } }).then((user) => {
        user.addProject(project).then(() => {
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
}

if (process.argv[2] === 'setup') {
  populateUsers();
  populateTags();
} else if (process.argv[2] === 'projects') {
  populateProjects();
}
