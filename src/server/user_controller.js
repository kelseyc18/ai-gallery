const User = require('../models/user');

exports.new_user = (req, res) => {
  const {
    authorId, name, username, appInventorInstance,
  } = req.body;

  const user = new User({
    authorId,
    name,
    username,
    appInventorInstance,
  });
  user.save((err, user) => res.send({ err, user }));
};

exports.user_detail = (req, res) => {
  User.findOne({ username: req.params.username })
    .populate({ path: 'projects', populate: { path: 'author' } })
    .exec((err, user) => res.send({ err, user }));
};
