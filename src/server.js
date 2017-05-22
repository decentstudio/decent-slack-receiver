// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
import * as config from './config';
import router from './router';
import * as bodyParser from 'body-parser';
import * as http from 'http';
import * as log from 'npmlog';

const express = require('express');

const httpPort = config.HTTP_PORT;

const wrapParseUrlEncodedBody = bodyParser.urlencoded({ extended: true });
const wrapParseJsonBody = bodyParser.json();

const app = express();

app.all('*', wrapParseUrlEncodedBody, wrapParseJsonBody);

app.use('/api', router);

function onStart (port, app, err) {
  if (!err) {
    const template = `Magic happens on port ${port}`;
    log.info('server', template);
  }
  else {
    log.error('server', err);
  }
}

app.listen(httpPort, (app, err) => { onStart(httpPort, app, err) });
