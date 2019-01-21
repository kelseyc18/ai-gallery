const keyczar = require('keyczarjs');
const base64 = require('base-64');
const fs = require('fs');
const protobuf = require('protobufjs');
const path = require('path');

const db = require('./db');

const { User, UserFollowers, Project } = db;
const { Op } = db.sequelize;

const LIMIT = 8;

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

  User.findAll({
    where: {
      authorId,
      appInventorInstance,
    },
  })
    .then((users) => {
      if (users.length > 0) {
        res.send({ user: users[0] });
      } else {
        User.create({
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
  User.findOne({
    where: {
      username: req.params.username,
    },
    include: [
      {
        model: Project,
        as: 'projects',
        where: { isDeleted: false },
        order: [['creationDate', 'DESC']],
        include: [{ model: User, as: 'author' }],
      },
      { model: User, as: 'Followers' },
      { model: User, as: 'Followees' },
      { model: Project, as: 'FavoriteProjects' },
    ],
  }).then(user => res.send({ user }))
    .catch(err => res.send({ err }));
};

exports.user_from_cookie = (req, res) => {
  const cookie = req.params.cookie.replace(/_/g, '/').replace(/-/g, '+');
  const decrypted = keyset.decryptBinary(base64.decode(cookie));
  protobuf.load(`${__dirname}/cookie.proto`, (err, root) => {
    if (err) throw err;

    const CookieMessage = root.lookupType('cookieauth.cookie');
    const buffer = Buffer.from(decrypted, 'binary');
    const userInfo = CookieMessage.decode(buffer);
    const { uuid } = userInfo;

    User.findOne({ where: { authorId: uuid } })
      .then(user => res.send({ user, userInfo }))
      .catch(err => res.send({ err }));
  });
};

exports.user_from_uuid = (req, res) => {
  User.findOne({ where: { authorId: req.params.uuid } })
    .then(user => res.send({ user }))
    .catch(err => res.send({ err }));
};

exports.add_following = (req, res) => {
  const { followerId, followeeId } = req.body;

  User.findByPk(followerId)
    .then((follower) => {
      User.findByPk(followeeId).then((followee) => {
        follower.addFollowees(followee).then(() => {
          followee
            .reload({
              include: [
                {
                  all: true,
                  include: {
                    all: true,
                  },
                },
              ],
            })
            .then(followee => res.send({ followee }));
        });
      });
    })
    .catch(err => res.send({ err }));
};

exports.remove_following = (req, res) => {
  const { followerId, followeeId } = req.body;

  UserFollowers.findOne({
    where: {
      followerId,
      followeeId,
    },
  })
    .then((followingAssociation) => {
      followingAssociation.destroy().then(() => {
        User.findByPk(followeeId, {
          include: [
            {
              all: true,
              include: {
                all: true,
              },
            },
          ],
        }).then(followee => res.send({ followee }));
      });
    })
    .catch(err => res.send({ err }));
};

exports.find_users = (req, res) => {
  const searchQuery = req.query.q ? decodeURIComponent(req.query.q) : '';
  const offset = parseInt(req.query.offset, 10) || 0;

  User.findAndCountAll({
    where: {
      [Op.or]: {
        name: {
          [Op.like]: `%${searchQuery}%`,
        },
        username: {
          [Op.like]: `%${searchQuery}%`,
        },
      },
    },
    offset,
    limit: LIMIT,
  }).then((result) => {
    res.send({
      users: result.rows,
      total: result.count,
      offset,
      limit: LIMIT,
      searchQuery,
    });
  });
};

exports.edit_user = (req, res) => {
  const {
    id, name, bio, featuredProjectId,
  } = req.body;

  const imagePath = req.file ? `api/uploads/${path.basename(req.file.path)}` : null;

  User.update(
    {
      name,
      bio,
      imagePath,
      featuredProjectId,
    },
    {
      where: {
        id,
      },
    },
  )
    .then(() => {
      User.findByPk(id, {
        include: [
          {
            model: Project,
            as: 'projects',
            where: { isDeleted: false },
            order: [['creationDate', 'DESC']],
            include: [{ model: User, as: 'author' }],
          },
          { model: User, as: 'Followers' },
          { model: User, as: 'Followees' },
          { model: Project, as: 'FavoriteProjects' },
        ],
      }).then(user => res.send({ user }));
    })
    .catch(err => res.send({ err }));
};
