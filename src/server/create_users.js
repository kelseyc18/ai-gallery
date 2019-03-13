const request = require('request');
const async = require('async');

async.eachSeries([...Array(100).keys()], (value, cb) => {
  const email = `student${value}@no-reply.com`;
  const password = `password${value + 5}`;
  request({
    method: 'POST',
    url: 'http://localhost:8888/ode2/usercreation',
    formData: {
      email,
      password,
    },
  }, (error) => {
    if (error) throw new Error(error);

    console.log('created user with email ', email, ' password ', password);
    cb();
  });
});
