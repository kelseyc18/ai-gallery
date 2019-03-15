// DOES NOT WORK

const fs = require('fs');
const request = require('request');
const async = require('async');
const path = require('path');

const projects = require('./projects.json');

// const baseUrl = 'http://gallery-b-dot-mit-appinventor-gallery.appspot.com';
const baseUrl = 'http://localhost:8888';

async.eachSeries(projects, (project, cb) => {
  console.log('start ', project.aiaPath);
  const title = project.aiaPath.split('.aia')[0];

  const form = {
    title,
    description: project.description,
    projectId: project.projectId,
    email: `${project.authorUsername}@gmail.com`,
    isFeatured: project.featuredLabel !== null ? 'true' : 'false',
  };

  if (project.tutorialUrl !== null) {
    form.moreInfo = project.tutorialUrl;
  }

  const options = {
    method: 'POST',
    url: `${baseUrl}/ode2/receivegalleryprojectinfo`,
    form,
  };

  console.log(form);
  request(options, (error, response, body) => {
    if (error) throw new Error(error);

    console.log('created gallery id ', body, ' title ', title);
    const galleryId = body;
    fs.createReadStream(`./uploads/${project.aiaPath}`).pipe(request.post(`${baseUrl}/ode2/receivegalleryproject/${galleryId}`));
  });
}, (err) => {
  if (err) throw new Error(err);
  console.log('All done!');
});
