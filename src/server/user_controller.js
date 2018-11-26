const keyczar = require('keyczarjs');
const fs = require('fs');
const db = require('./db');

let privateKey = keyczar.create(keyczar.TYPE_RSA_PRIVATE);
const publicKey = privateKey.exportPublicKey();
const contents = fs.readFileSync(`${__dirname}/authkey/1`);
const myPrivateSerialized = JSON.parse(contents);
console.log(myPrivateSerialized);
console.log('\n\n\n');
const privateSerialized = privateKey.toJson();
console.log(privateSerialized);
privateKey = keyczar.fromJson(privateSerialized);
const encrypted = keyczar.encryptWithSession(publicKey, 'plaintext');
const decrypted = keyczar.decryptWithSession(privateKey, encrypted);
// console.log(encrypted);
console.log(decrypted);

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
  const privateKey = keyczar.fromJson(privateSerialized);
  const decrypted = keyczar.decryptWithSession(privateKey, req.params.cookie);
  res.send(decrypted);
};
