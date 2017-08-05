import express from 'express';
import log from 'npmlog';
import config from '../config';
import bodyParser from 'body-parser';
import rp from 'request-promise';
import bot from './bot';
import NodeCouchDb from 'node-couchdb';

const dbName = 'decent-news';
const couch = new NodeCouchDb();
couch.createDatabase(dbName)
  .then(() => console.log('Database created successfully'),
  (error) => { });

const router = express.Router(),
  slackVerificationToken = config.SLACK_VERIFICATION_TOKEN,
  wrapParseUrlEncodedBody = bodyParser.urlencoded({ extended: true }),
  wrapParseJsonBody = bodyParser.json(),
  logPrefix = 'Slack Router:';

/*
  Slack universal middleware
*/

function wrapLogRequestBody(req, res, next) {
  log.info(logPrefix, req.body);
  next();
}

router.use(
  wrapParseJsonBody,
  wrapParseUrlEncodedBody,
  wrapLogRequestBody
);

////////////
// Events //
////////////

function wrapAuthorizeSlack(req, res, next) {
  if (req.body.token === slackVerificationToken) {
    next();
    return;
  }
  log.info(logPrefix, 'Verification token invalid. Sending 400 Access denied.');
  res.status(400).send('Access denied.');
}

function wrapVerifyEndpoint(req, res, next) {
  if (req.body.type !== 'url_verification') {
    next();
    return;
  }
  res.send(req.body.challenge);
}

function eventHandler(req, res) {
  req.broker.publish(`slack.event.${req.body.event.type}`, req.body);
  res.sendStatus(200);
}

router.post('/event',
  wrapVerifyEndpoint,
  wrapAuthorizeSlack,
  eventHandler);

//////////////
// Commands //
//////////////

function commandHandler(req, res) {
  req.broker.publish('slack.command', req.body);
  res.status(200);
  res.json({
    'response_type': 'ephemeral',
    'text': 'Command received! One moment...'
  });
}

router.post('/command', commandHandler);

////////////////////////////////////////////////////
// Authorization When Teams Install the Slack App //
////////////////////////////////////////////////////

router.get('/authorize', handleAuthorization);

function handleAuthorization(req, res) {
  log.info(logPrefix, 'A team is installing the app.');
  if (req.query.code) {
    getAuthorizationGrant(req)
      .then((authGrantString) => {
        const authGrant = JSON.parse(authGrantString);
        log.info('Received auth grant:', authGrant);
        bot.startListening({ authGrant, broker: req.broker });
        log.info(`Bot listening to new messages from ${authGrant.team_name}`);
        return saveToDb(authGrant);
      })
      .then(() => res.sendStatus(200))
      .catch(() => {
        res.sendStatus(500);
      });
  } else {
    res.status(400);
    res.send('code not included in query string');
  }
}

function getAuthorizationGrant(req) {
  log.info(logPrefix, 'Getting authorization grant.');
  const postConfig = {
    url: 'https://slack.com/api/oauth.access',
    form: {
      client_id: config.SLACK_CLIENT_ID,
      client_secret: config.SLACK_CLIENT_SECRET,
      code: req.query.code
    }
  };
  return rp.post(postConfig);
}

function saveToDb(authGrant) {
  log.info('Saving auth grant to couchdb');
  log.info('Type of authGrant:', typeof authGrant);
  return couch.uniqid()
    .then(ids => {
      return couch.insert(dbName, {
        _id: ids[0],
        authGrant
      });
    })
    .then(({ data, headers, statuses }) => {
      console.log('Document inserted:', data);
      return Promise.resolve();
    }, err => {
      console.log('Error inserting document:', err);
      return Promise.reject();
    });
}

export default router;
