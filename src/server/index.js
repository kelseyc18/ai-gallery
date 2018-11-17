const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');

const db = require('./db');

db.sequelize.sync().then(() => {
  console.log('Tables synced');
});

const upload = multer({ dest: 'uploads/' });

const app = express();

const ProjectController = require('./project_controller');
const UserController = require('./user_controller');

app.use(express.static('dist'));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    encoded: true,
  }),
);

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
