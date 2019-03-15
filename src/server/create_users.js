const request = require('request');
const async = require('async');

async.eachSeries([...Array(100).keys()], (value, cb) => {
  const email = `student${value}@no-reply.com`;
  const password = `password${value + 5}`;
  request({
    method: 'POST',
    url: 'https://gallery-b-dot-mit-appinventor-gallery.appspot.com/ode2/usercreation',
    headers:
   {
     'cache-control': 'no-cache',
     'Content-Type': 'application/x-www-form-urlencoded',
   },
    form: {
      email,
      password,
    },
  }, (error) => {
    if (error) throw new Error(error);

    console.log('email: ', email, '\tpassword: ', password);
    cb();
  });
});
