module.exports = (sequelize, Sequelize) => {
  const Project = sequelize.define('project', {
    title: {
      type: Sequelize.STRING,
    },
    imagePath: {
      type: Sequelize.STRING,
    },
    creationDate: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
    lastModifiedDate: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
    tutorialUrl: {
      type: Sequelize.STRING,
    },
    credits: {
      type: Sequelize.STRING,
    },
    description: {
      type: Sequelize.TEXT,
    },
    isDraft: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    isDeleted: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    numDownloads: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    aiaPath: {
      type: Sequelize.STRING,
    },
    projectId: {
      type: Sequelize.STRING,
    },
    appInventorInstance: {
      type: Sequelize.STRING,
    },
    screenshots: {
      type: Sequelize.STRING,
    },
  });
  return Project;
};
