const db = require('./db');

db.sequelize.sync().then(() => {
  console.log('Tables synced');
});

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
  },
  {
    authorUsername: 'boba_master',
    title: 'Cauliflower',
    projectId: '3',
    appInventorInstance: 'ai2',
    aiaPath: 'Cauliflower_1542641389678',
  },
  {
    authorUsername: 'coffee_master',
    title: 'Dog',
    projectId: '4',
    appInventorInstance: 'ai2',
    aiaPath: 'Dog_1542641401480',
    imagePath: 'api/uploads/1542641469895_IMG_9507.jpg',
  },
];

const tags = ['Games', 'Entertainment', 'Arts and Music', 'Education', 'Lifestyle'];

function populateUsers() {
  users.forEach((user) => {
    db.User.create(user).then((user) => {
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
    db.Tag.create({ tagName }).then((tag) => {
      console.log(tag.get({ plain: true }));
    });
  });
}

function populateProjects() {
  projects.forEach((projectData) => {
    const {
      title, projectId, appInventorInstance, aiaPath, imagePath,
    } = projectData;

    db.Project.create({
      title,
      projectId,
      appInventorInstance,
      aiaPath,
      imagePath,
    }).then((project) => {
      db.User.findOne({ where: { username: projectData.authorUsername } }).then((user) => {
        user.addProject(project);
      });
      console.log(project.get({ plain: true }));
    });
  });
}

if (process.argv[2] === 'setup') {
  populateUsers();
  populateTags();
} else if (process.argv[2] === 'projects') {
  populateProjects();
}
