const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const http = require('http');

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
      req.body.title
        ? `${req.body.title}_${Date.now()}`
        : `${Date.now()}_${file.originalname}`,
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
app.use(cookieParser());

// Make db accessible to router
app.use((req, _, next) => {
  req.db = db;
  next();
});

// USER ROUTES
app.get('/api/user/userInfo', UserController.user_info);
app.get('/api/user/uuid/:uuid', UserController.user_from_uuid);
app.get('/api/user/search', UserController.find_users);
app.get('/api/user/set_login_cookie', UserController.set_login_cookie);
app.get('/api/user/:username', UserController.user_detail);
app.post('/api/user/create', UserController.new_user);
app.post('/api/user/add_following', UserController.add_following);
app.post('/api/user/remove_following', UserController.remove_following);
app.post('/api/user/edit', upload.single('newImage'), UserController.edit_user);

// PROJECT ROUTES
app.get('/api/projects', ProjectController.all_projects);
app.get('/api/project/alltags', ProjectController.all_tags);
app.get('/api/project/featured', ProjectController.get_featured_projects);
app.get('/api/project/gallery_id', ProjectController.get_gallery_id);
app.get('/api/project/:id', ProjectController.project_by_id);
app.post('/api/project/create', upload.single('aia'), ProjectController.create_project);
app.post(
  '/api/project/update_or_create',
  upload.single('aia'),
  ProjectController.update_or_create_project,
);
const editProjectUploads = upload.fields([
  { name: 'newImage', maxCount: 1 },
  { name: 'screenshotFiles', maxCount: 3 },
]);
app.post('/api/project/edit', editProjectUploads, ProjectController.edit_project);
app.post('/api/project/createtag', ProjectController.create_tag);
app.post('/api/project/add_favorite', ProjectController.add_favorite);
app.post('/api/project/remove_favorite', ProjectController.remove_favorite);
app.post('/api/project/download/:id', ProjectController.add_download);
app.post('/api/project/set_featured_label', ProjectController.set_featured_label);
app.post('/api/project/remove', ProjectController.remove_project);

const port = process.env.PORT || 8090;
http.createServer(app).listen(port, '0.0.0.0');
console.log(`Listening on port ${port}!`);
