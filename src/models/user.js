'use strict'

module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define('user', {
    name: {
      type: Sequelize.STRING,
    },
    username: {
      type: Sequelize.STRING,
    },
    authorId: {
      type: Sequelize.STRING,
    },
    appInventorInstance: {
      type: Sequelize.STRING,
    },
    imagePath: {
      type: Sequelize.STRING,
    },
    bio: {
      type: Sequelize.STRING,
    },
  });
  return User;
};
