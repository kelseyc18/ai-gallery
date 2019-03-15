const fs = require('fs');
const request = require('request');
const async = require('async');
const path = require('path');

const projects = require('./projects.json');

async.eachSeries(projects, (project, cb) => {
  console.log('start ', project.aiaPath);
  const title = project.aiaPath.split('.aia')[0];

  const formData = {
    title,
    projectName: title,
    description: project.description,
    projectId: project.projectId,
    email: `${project.authorUsername}@gmail.com`,
    aiaFile:
    {
      value: fs.createReadStream(`./uploads/${project.aiaPath}`),
      options:
        {
          filename: project.aiaPath,
          contentType: null,
        },
    },
    isFeatured: project.featuredLabel !== null ? 'true' : 'false',
  };

  if (project.imagePath !== null) {
    const imagePath = project.imagePath.split('api/')[1];
    formData.imageFile = {
      value: fs.createReadStream(imagePath),
      options:
    {
      filename: path.basename(imagePath),
      contentType: null,
    },
    };
  }

  if (project.tutorialUrl !== null) {
    formData.moreInfo = project.tutorialUrl;
  }

  const options = {
    method: 'POST',
    url: 'http://gallery-b-dot-mit-appinventor-gallery.appspot.com/ode2/receivegalleryproject/',
    headers:
    {
      'Postman-Token': 'f2d0d392-9661-4403-a399-b58bad53006e',
      'cache-control': 'no-cache',
      'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW',
    },
    formData,
  };

  console.log(formData);
  request(options, (error) => {
    if (error) throw new Error(error);

    console.log('finish ', project.aiaPath);
    cb();
  });
}, (err) => {
  if (err) throw new Error(err);
  console.log('All done!');
});
