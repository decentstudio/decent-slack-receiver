// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
import * as config from './config';
import * as broker from './broker';
import router from './router';
import * as bodyParser from 'body-parser';
import * as http from 'http';
import * as log from 'npmlog';

const express = require('express');

const httpPort = config.HTTP_PORT;

broker.connect().then(
  (connection) => {
    let app = express();

    app.get('/', (req, res) => {
      res.json({ message: 'hooray! welcome to our api!' });
    });

    app.use('/api', router);

    app.listen(httpPort, (app, err) => { onStart(httpPort, app, err) });
  });

function onStart (port, app, err) {
  if (!err) {
    const template = `Magic happens on port ${port}`;
    log.info('server', template);
  }
  else {
    log.error('server', err);
  }
}


