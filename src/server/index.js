const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const cors = require('cors');

const db = require('./db');

db.sequelize.sync().then(() => {
  console.log('Tables synced');
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `${__dirname}/uploads`);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      req.path === '/api/project/create'
        ? `${req.body.title}_${Date.now()}`
        : `${file.originalname}_${Date.now()}`,
    );
  },
});
const upload = multer({ storage });

const app = express();

const ProjectController = require('./project_controller');
const UserController = require('./user_controller');

app.use(cors());
app.use(express.static('dist'));
app.use(bodyParser.json());
app.use('/api/exports', express.static(`${__dirname}/uploads`));
app.use('/api/uploads', express.static(`${__dirname}/uploads`));

// Make db accessible to router
app.use((req, _, next) => {
  req.db = db;
  next();
});

// USER ROUTES
app.post('/api/user/create', UserController.new_user);
app.get('/api/user/cookie/:cookie', UserController.user_from_cookie);
app.get('/api/user/uuid/:uuid', UserController.user_from_uuid);
app.get('/api/user/:username', UserController.user_detail);

// PROJECT ROUTES
app.get('/api/projects', ProjectController.all_projects);
app.get('/api/project/alltags', ProjectController.all_tags);
app.get('/api/project/:id', ProjectController.project_by_id);
app.post('/api/project/create', upload.single('aia'), ProjectController.create_project);
app.post('/api/project/edit', upload.single('newImage'), ProjectController.edit_project);
app.post('/api/project/createtag', ProjectController.create_tag);
app.post('/api/project/add_tag', ProjectController.add_tag);
app.post('/api/project/remove_tag', ProjectController.remove_tag);
app.post('/api/project/add_favorite', ProjectController.add_favorite);
app.post('/api/project/remove_favorite', ProjectController.remove_favorite);
app.post('/api/project/download/:id', ProjectController.add_download);
app.listen(8090, () => console.log('Listening on port 8090!'));
