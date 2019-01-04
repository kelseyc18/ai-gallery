const db = require('./db');

exports.new_user = (req, res) => {
  const {
    authorId, name, username, appInventorInstance,
  } = req.body;

  db.User.findAll({
    where: {
      authorId,
      appInventorInstance,
    },
  })
    .then((users) => {
      if (users.length > 0) {
        res.send({ user: users[0] });
      } else {
        db.User.create({
          name,
          username,
          authorId,
          appInventorInstance,
        })
          .then(user => res.send({ user }))
          .catch(err => res.send({ err }));
      }
    })
    .catch(err => res.send({ err }));
};

exports.user_detail = (req, res) => {
  db.User.findOne({
    where: {
      username: req.params.username,
    },
    include: [
      {
        all: true,
        nested: true,
        include: {
          all: true,
        },
      },
    ],
  })
    .then(user => res.send({ user }))
    .catch(err => res.send({ err }));
};
