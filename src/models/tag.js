module.exports = (sequelize, Sequelize) => {
  const Tag = sequelize.define('tag', {
    tagId: {
      type: Sequelize.INTEGER,
    },
    tagName: {
      type: Sequelize.STRING,
    },
  });
  return Tag;
};
