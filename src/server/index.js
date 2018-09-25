const express = require('express');
const os = require('os');
const mongoose = require('mongoose');

const app = express();

mongoose.connect(
  process.env.MONGODB_URI || 'mongodb://hal:abelson1@ds113703.mlab.com:13703/ai-gallery'
);
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

app.use(express.static('dist'));

// Make db accessible to router
app.use((req, _, next) => {
  req.db = db;
  next();
});

app.get('/api/getUsername', (req, res) => res.send({ username: os.userInfo().username }));
app.get('/api/getApps', (req, res) => res.send({ apps: ['app1', 'app2', 'app3'] }));
app.listen(8080, () => console.log('Listening on port 8080!'));
