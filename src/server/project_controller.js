const { Base64Encode } = require('base64-stream');
const fs = require('fs');
const path = require('path');
const db = require('./db');

const { Op } = db.Sequelize;
const {
  sequelize, User, Project, Tag, UserFavoriteProjects, FeaturedLabel, UserFollowers, ProjectTags,
} = db;

const LIMIT = 12;

function getProjectIdsWithTagId(selectedTagId) {
  if (selectedTagId) {
    return ProjectTags.findAll({
      where: {
        tagId: selectedTagId,
      },
    }).then(results => results.map(row => row.projectId));
  }
  return new Promise((resolve) => {
    resolve(undefined);
  });
}

function getRecentProjects(req, res) {
  const searchQuery = req.query.q ? decodeURIComponent(req.query.q) : '';
  const offset = parseInt(req.query.offset, 10) || 0;
  const { selectedTagId } = req.query;

  getProjectIdsWithTagId(selectedTagId).then((projectIds) => {
    const where = {
      title: {
        [Op.like]: `%${searchQuery}%`,
      },
      isDeleted: false,
    };

    if (projectIds) {
      where.id = { [Op.in]: projectIds };
    }

    Project.findAndCountAll({
      where,
      offset,
      limit: LIMIT,
      order: [['creationDate', 'DESC']],
      distinct: true,
      include: {
        all: true,
      },
    })
      .then((result) => {
        res.send({
          projects: result.rows,
          total: result.count,
          offset,
          limit: LIMIT,
          sortBy: 'recent',
        });
      })
      .catch(err => res.send({ err }));
  });
}

function getPopularProjects(req, res) {
  const searchQuery = req.query.q ? decodeURIComponent(req.query.q) : '';
  const offset = parseInt(req.query.offset, 10) || 0;
  const { selectedTagId } = req.query;

  UserFavoriteProjects.findAll({
    attributes: [
      'projectId',
      [sequelize.fn('COUNT', sequelize.col('projectId')), 'count'],
    ],
    group: ['projectId'],
    order: [[sequelize.literal('count'), 'DESC']],
  }).then((result) => {
    let projectIds = result.map(row => row.projectId);

    getProjectIdsWithTagId(selectedTagId).then((projectIdsWithTag) => {
      if (projectIdsWithTag) {
        projectIds = projectIds.filter(id => projectIdsWithTag.indexOf(id) > -1);
      }

      Project.findAndCountAll({
        where: {
          id: {
            [Op.in]: projectIds,
          },
          title: {
            [Op.like]: `%${searchQuery}%`,
          },
          isDeleted: false,
        },
        include: {
          all: true,
        },
        offset,
        distinct: true,
        limit: LIMIT,
        order: [['creationDate', 'DESC']],
      }).then((result) => {
        res.send({
          projects: result.rows,
          total: result.count,
          offset,
          limit: LIMIT,
          sortBy: 'popular',
        });
      });
    });
  })
    .catch(err => res.send({ err }));
}

function getFollowingProjects(req, res) {
  const searchQuery = req.query.q ? decodeURIComponent(req.query.q) : '';
  const offset = parseInt(req.query.offset, 10) || 0;
  const { followerId, selectedTagId } = req.query;

  UserFollowers.findAll({
    where: {
      followerId,
    },
  }).then((result) => {
    const followeeIds = result.map(row => row.followeeId);

    getProjectIdsWithTagId(selectedTagId).then((projectIds) => {
      const where = {
        author_id: {
          [Op.in]: followeeIds,
        },
        title: {
          [Op.like]: `%${searchQuery}%`,
        },
        isDeleted: false,
      };

      if (projectIds) {
        where.id = { [Op.in]: projectIds };
      }

      Project.findAndCountAll({
        where,
        include: {
          all: true,
        },
        distinct: true,
        offset,
        limit: LIMIT,
        order: [['creationDate', 'DESC']],
      }).then((result) => {
        res.send({
          projects: result.rows,
          total: result.count,
          offset,
          limit: LIMIT,
          sortBy: 'following',
        });
      });
    });
  })
    .catch(err => res.send({ err }));
}

exports.all_projects = (req, res) => {
  const sortBy = req.query.sortBy || 'recent';

  switch (sortBy.toLowerCase()) {
    case 'recent':
      return getRecentProjects(req, res);
    case 'popular':
      return getPopularProjects(req, res);
    case 'following':
      return getFollowingProjects(req, res);
    default:
      return getRecentProjects(req, res);
  }
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

// TODO: Wrap in transaction
exports.edit_project = (req, res) => {
  const {
    title, id, description, tutorialUrl, credits, isDraft, tagIds, screenshots,
  } = req.body;

  const imagePath = (req.files.newImage && req.files.newImage[0]) ? `api/uploads/${path.basename(req.files.newImage[0].path)}` : null;
  const parsedScreenshots = screenshots ? JSON.parse(screenshots) : [];
  let newScreenshotFileCounter = 0;
  parsedScreenshots.forEach((screenshotInfo) => {
    if (screenshotInfo.file) {
      const screenshotPath = `api/uploads/${path.basename(req.files.screenshotFiles[newScreenshotFileCounter].path)}`;
      screenshotInfo.src = screenshotPath; // eslint-disable-line
      screenshotInfo.file = undefined; // eslint-disable-line
      newScreenshotFileCounter += 1;
    }
  });

  Project.update(
    {
      title,
      description,
      tutorialUrl,
      credits,
      isDraft,
      imagePath,
      lastModifiedDate: Date.now(),
      screenshots: JSON.stringify(parsedScreenshots),
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
                [Op.in]: tagIds ? JSON.parse(tagIds) : [],
              },
            },
          })
            .then((tags) => {
              project.setTags(tags).then(() => {
                project.reload().then((project) => {
                  res.send({ project });
                });
              });
            });
        });
    }).catch(err => res.send({ err }));
};

exports.update_or_create_project = (req, res) => {
  const {
    title, authorId, projectId, appInventorInstance,
  } = req.body;

  const filepath = req.file.path;
  const readStream = fs.createReadStream(`${filepath}`);
  const writeStream = fs.createWriteStream(`${filepath}.asc`);
  readStream.pipe(new Base64Encode()).pipe(writeStream);

  // TODO: Use transaction
  Project.findOrCreate({
    where: {
      projectId,
      appInventorInstance,
      isDeleted: false,
    },
  }).spread((project) => {
    project.update({
      title,
      aiaPath: path.basename(req.file.path),
      lastModifiedDate: Date.now(),
    }).then(() => {
      User.findOne({
        where: { authorId, appInventorInstance },
      }).then((user) => {
        user.addProject(project).then(() => {
          project.reload().then(project => res.send({ project }));
        });
      });
    });
  });
};

exports.remove_project = (req, res) => {
  const { projectId } = req.body;

  Project.update({
    isDeleted: true,
  }, {
    where: {
      id: projectId,
    },
  }).spread(count => res.send({ count }))
    .catch(err => res.send({ err }));
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

exports.set_featured_label = (req, res) => {
  const { projectId, featuredLabel } = req.body;

  Project.findByPk(projectId, {
    include: [
      {
        all: true,
        include: {
          all: true,
        },
      },
    ],
  }).then((project) => {
    if (featuredLabel) {
      const {
        ageDivision, dateAwarded, category, description,
      } = featuredLabel;

      FeaturedLabel.findOrCreate({
        where: {
          ageDivision,
          dateAwarded,
          category,
        },
      }).spread((label) => {
        label.update({ description }).then(() => {
          label.reload().then((label) => {
            project.setFeaturedLabel(label).then(() => {
              project.reload().then(project => res.send({ project }));
            });
          });
        });
      });
    } else {
      project.setFeaturedLabel(null).then(() => {
        project.reload().then(project => res.send({ project }));
      });
    }
  }).catch(err => res.send({ err }));
};

exports.get_featured_projects = (req, res) => {
  const offset = parseInt(req.query.offset, 10) || 0;

  FeaturedLabel.findAndCountAll({
    where: {
      projectId: {
        [Op.ne]: null,
      },
    },
    offset,
    limit: LIMIT,
    order: [['dateAwarded', 'DESC']],
  }).then((result) => {
    const projectIds = result.rows.map(label => label.projectId);

    Project.findAll({
      where: {
        id: {
          [Op.in]: projectIds,
        },
      },
      include: {
        all: true,
      },
    }).then((projects) => {
      res.send({
        projects,
        total: result.count,
        offset,
        limit: LIMIT,
      });
    });
  }).catch(err => res.send({ err }));
};

exports.get_gallery_id = (req, res) => {
  const { projectId, appInventorInstance } = req.query;

  Project.findAndCountAll({
    where: {
      projectId,
      appInventorInstance,
      isDeleted: false,
    },
  }).then((result) => {
    if (result.count > 0) {
      return res.send(result.rows[0].id.toString());
    }
    return res.send('0');
  }).catch(err => res.send({ err }));
};
