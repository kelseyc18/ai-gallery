module.exports = (sequelize, Sequelize) => {
  const Tag = sequelize.define('tag', {
    tagName: {
      type: Sequelize.STRING,
    },
  });
  return Tag;
};
