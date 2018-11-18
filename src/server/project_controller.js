const db = require('./db');

const { Op } = db.Sequelize;
const { sequelize, User, Project } = db;

const LIMIT = 12;

exports.all_projects = (req, res) => {
  const searchQuery = req.query.q || '';
  const offset = parseInt(req.query.offset, 10) || 0;

  Project.findAndCountAll({
    where: {
      title: {
        [Op.like]: `%${searchQuery}%`,
      },
    },
    offset,
    limit: LIMIT,
    distinct: true,
    include: [
      {
        all: true,
        include: {
          all: true,
        },
      },
    ],
  })
    .then((result) => {
      res.send({
        projects: result.rows,
        total: result.count,
        offset,
        limit: LIMIT,
      });
    })
    .catch(err => res.send({ err }));
};

exports.project_by_id = (req, res) => {
  Project.findByPk(req.params.id, {
    include: [
      {
        all: true,
        include: {
          all: true,
        },
      },
    ],
  })
    .then(project => res.send({ project }))
    .catch(err => res.send({ err }));
};

exports.create_project = (req, res) => {
  const {
    title, authorId, projectId, appInventorInstance,
  } = req.body;

  let newProject;
  sequelize
    .transaction(t => User.findByPk(authorId, { transaction: t }).then(user => Project.create(
      {
        title,
        projectId,
        appInventorInstance,
        aiaPath: req.file.path,
      },
      { transaction: t },
    ).then(
      (project) => {
        newProject = project;
        return user.addProject(project, { transaction: t });
      },
      { transaction: t },
    )))
    .then(_ => Project.findByPk(newProject.id)
      .then(project => res.send({ project }))
      .catch(err => res.send({ err })))
    .catch((err) => {
      res.send({ err });
    });
};

exports.edit_project = (req, res) => {
  const {
    title, id, description, tutorialUrl, credits, isDraft,
  } = req.body;

  if (req.file) {
    const imagePath = req.file.path;

    Project.update(
      {
        title,
        description,
        tutorialUrl,
        credits,
        imagePath,
        isDraft,
        lastModifiedDate: Date.now(),
      },
      {
        where: {
          id,
        },
      },
    )
      .then(project => res.send({ project }))
      .catch(err => res.send({ err }));
  } else {
    Project.update(
      {
        title,
        description,
        tutorialUrl,
        credits,
        isDraft,
        lastModifiedDate: Date.now(),
      },
      {
        where: {
          id,
        },
      },
    )
      .then(project => res.send({ project }))
      .catch(err => res.send({ err }));
  }
};
