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

const tags = ['Games', 'Entertainment', 'Arts and Music', 'Education', 'Lifestyle'];

users.forEach((user) => {
  db.User.create(user).then((user) => {
    console.log(
      user.get({
        plain: true,
      }),
    );
  });
});

tags.forEach((tagName) => {
  db.Tag.create({ tagName }).then((tag) => {
    console.log(tag.get({ plain: true }));
  });
});
