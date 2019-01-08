const { Base64Encode } = require('base64-stream');
const fs = require('fs');
const path = require('path');
const db = require('./db');

const { Op } = db.Sequelize;
const {
  sequelize, User, Project, Tag, UserFavoriteProjects, ProjectTags,
} = db;

const LIMIT = 12;

exports.all_projects = (req, res) => {
  const searchQuery = req.query.q || '';
  const offset = parseInt(req.query.offset, 10) || 0;

  Project.findAndCountAll({
    where: {
      title: {
        [Op.like]: `%${searchQuery}%`,
      },
      isDeleted: false,
    },
    offset,
    limit: LIMIT,
    order: [['creationDate', 'DESC']],
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
  Project.findOne({
    where: {
      id: req.params.id,
      isDeleted: false,
    },
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

exports.all_tags = (req, res) => {
  Tag.findAll()
    .then(allTags => res.send({ allTags }))
    .catch(err => res.send({ err }));
};

exports.create_tag = (req, res) => {
  const { tagName } = req.body;
  Tag.create({ tagName })
    .then(tag => res.send({ tag }))
    .catch(err => res.send({ err }));
};

exports.create_project = (req, res) => {
  const {
    title, authorId, projectId, appInventorInstance,
  } = req.body;

  let newProject;
  sequelize
    .transaction(t => User.findOne({ where: { authorId, appInventorInstance } }, { transaction: t })
      .then(user => Project.create(
        {
          title,
          projectId,
          appInventorInstance,
          aiaPath: path.basename(req.file.path),
        },
        { transaction: t },
      ).then(
        (project) => {
          newProject = project;
          return user.addProject(project, { transaction: t });
        },
        { transaction: t },
      )))
    .then(() => Project.findByPk(newProject.id)
      .then((project) => {
        const filepath = req.file.path;
        const readStream = fs.createReadStream(`${filepath}`);
        const writeStream = fs.createWriteStream(`${filepath}.asc`);
        readStream.pipe(new Base64Encode()).pipe(writeStream);
        res.send({ project });
      })
      .catch(err => res.send({ err })))
    .catch((err) => {
      res.send({ err });
    });
};

exports.edit_project = (req, res) => {
  const {
    title, id, description, tutorialUrl, credits, isDraft, tagIds,
  } = req.body;

  if (req.file) {
    const imagePath = `api/uploads/${path.basename(req.file.path)}`;

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
      .then(() => {
        Project.findByPk(id, {
          include: [
            {
              all: true,
              include: {
                all: true,
              },
            },
          ],
        })
          .then((project) => {
            Tag.findAll({
              where: {
                id: {
                  [Op.in]: JSON.parse(tagIds),
                },
              },
            })
              .then((tags) => {
                project.setTags(tags).then(() => {
                  project.reload().then(() => res.send({ project }));
                });
              })
              .catch(err => res.send({ err }));
          })
          .catch(err => res.send({ err }));
      })
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
      .then(() => {
        Project.findByPk(id, {
          include: [
            {
              all: true,
              include: {
                all: true,
              },
            },
          ],
        })
          .then((project) => {
            Tag.findAll({
              where: {
                id: {
                  [Op.in]: JSON.parse(tagIds),
                },
              },
            })
              .then((tags) => {
                project.setTags(tags).then(() => {
                  project.reload().then(() => res.send({ project }));
                });
              })
              .catch(err => res.send({ err }));
          })
          .catch(err => res.send({ err }));
      })
      .catch(err => res.send({ err }));
  }
};

exports.add_download = (req, res) => {
  const { id } = req.params;

  Project.findByPk(id, {
    include: [
      {
        all: true,
        include: {
          all: true,
        },
      },
    ],
  })
    .then(project => project.increment('numDownloads'))
    .then(project => project.reload().then(() => res.send({ project })))
    .catch(err => res.send({ err }));
};

exports.add_favorite = (req, res) => {
  const { userId, projectId } = req.body;

  Project.findByPk(projectId, {
    include: [
      {
        all: true,
        include: {
          all: true,
        },
      },
    ],
  })
    .then((project) => {
      User.findByPk(userId).then((user) => {
        user.addFavoriteProject(project).then(() => {
          project.reload().then(() => res.send({ project }));
        });
      });
    })
    .catch(err => res.send({ err }));
};

exports.remove_favorite = (req, res) => {
  const { userId, projectId } = req.body;

  UserFavoriteProjects.findOne({
    where: {
      userId,
      projectId,
    },
  })
    .then((favoriteProjectAssociation) => {
      favoriteProjectAssociation.destroy().then(() => {
        Project.findByPk(projectId, {
          include: [
            {
              all: true,
              include: {
                all: true,
              },
            },
          ],
        }).then(project => res.send({ project }));
      });
    })
    .catch(err => res.send({ err }));
};
