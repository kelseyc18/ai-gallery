const Sequelize = require('sequelize');
const path = require('path');

const db = {};

const sequelize = new Sequelize('database', 'username', 'password', {
  host: 'localhost',
  dialect: 'sqlite',
  operatorsAliases: false,
  storage: path.resolve(__dirname, '../server/database.db'),
  logging: false,
});
sequelize.sync();

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Models/tables
db.User = require('../models/user')(sequelize, Sequelize);
db.Project = require('../models/project')(sequelize, Sequelize);
db.Tag = require('../models/tag')(sequelize, Sequelize);

// Relations

// Adds attribute `author_id` to Project
// Users will have `getProjects` and `setProjects`
db.UserProjects = db.User.hasMany(db.Project, { foreignKey: 'author_id', as: 'projects' });
db.Project.belongsTo(db.User, { foreignKey: 'author_id', as: 'author' });

// Adds attribute `tags` to project
const ProjectTags = sequelize.define('projectTags', {});
db.ProjectTags = ProjectTags;

db.Project.belongsToMany(db.Tag, {
  as: 'Tags',
  through: ProjectTags,
  foreignKey: 'projectId',
});

db.Tag.belongsToMany(db.Project, {
  as: 'TaggedProjects',
  through: ProjectTags,
  foreignKey: 'tagId',
});

const UserFavoriteProjects = sequelize.define('userFavoriteProjects', {});
db.UserFavoriteProjects = UserFavoriteProjects;

db.Project.belongsToMany(db.User, {
  as: 'FavoritedUsers',
  through: UserFavoriteProjects,
  foreignKey: 'projectId',
});
db.User.belongsToMany(db.Project, {
  as: 'FavoriteProjects',
  through: UserFavoriteProjects,
  foreignKey: 'userId',
});

// `root_project_id` will be added on Project / Target model
db.Project.hasMany(db.Project, { foreignKey: 'root_project_id', as: 'RootProject' });
db.Project.hasMany(db.Project, { foreignKey: 'parent_project_id', as: 'ParentProject' });

module.exports = db;
