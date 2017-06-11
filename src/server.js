// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
import config from './config';
import broker from './broker';
import slackRouter from './slack/router';
import log from 'npmlog';
import express from 'express';

broker.connect().then(broker => {
  let app = express();

  app.get('/', (req, res) => {
    res.json({ message: 'hooray! welcome to our api!' });
  });

  app.use('*', (req, res, next) => {
    req.broker = broker;
    next();
  });

  app.use('/api/slack', slackRouter);

  app.listen(config.HTTP_PORT, (app, err) => onStart(config.HTTP_PORT, app, err));
});

function onStart(port, app, err) {
  if (!err) {
    const template = `Magic happens on port ${port}`;
    log.info('server', template);
  }
  else {
    log.error('server', err);
  }
}
