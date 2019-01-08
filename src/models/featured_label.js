module.exports = (sequelize, Sequelize) => {
  const FeaturedLabel = sequelize.define('featuredLabel', {
    ageDivision: {
      type: Sequelize.STRING,
    },
    dateAwarded: {
      type: Sequelize.DATEONLY,
    },
    category: {
      type: Sequelize.STRING,
    },
  });
  return FeaturedLabel;
};
