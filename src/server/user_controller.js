const keyczar = require('keyczarjs');
// const base64 = require('base-64');
const fs = require('fs');

const db = require('./db');

// TODO: Currently, this only works if the authkey zip file has been
// unzipped.
const contents = fs.readFileSync(`${__dirname}/authkey/1`);
const contents2 = fs.readFileSync(`${__dirname}/authkey/meta`);
const keysetSerialized = JSON.stringify({
  1: JSON.stringify(JSON.parse(contents)),
  meta: JSON.stringify(JSON.parse(contents2)),
});
const keyset = keyczar.fromJson(keysetSerialized);

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

exports.user_info = (req, res) => {
  console.log(req.params.cookie);
  const encrypted = keyset.encrypt('blackjack');
  console.log(encrypted);
  const decrypted = keyset.decrypt(encrypted);
  // console.log(base64.decode(req.params.cookie));
  // const decrypted = keyset.decrypt();
  res.send(decrypted);
};
