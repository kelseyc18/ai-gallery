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
app.get('/api/user/:username', UserController.user_detail);

// PROJECT ROUTES
app.get('/api/projects', ProjectController.all_projects);
app.get('/api/project/:id', ProjectController.project_by_id);
app.post('/api/project/create', upload.single('aia'), ProjectController.create_project);
app.post('/api/project/edit', upload.single('newImage'), ProjectController.edit_project);
app.listen(8080, () => console.log('Listening on port 8080!'));
