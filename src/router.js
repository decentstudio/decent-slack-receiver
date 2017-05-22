import * as express from 'express'
import * as log from 'npmlog'
import * as config from './config'

const router = express.Router(),
      slackVerificationToken = config.SLACK_VERIFICATION_TOKEN;

//////////////////////////
// Universal Middleware //
//////////////////////////

function wrapLogRequestBody (req, res, next) {
  log.info('router', req.body);
  next();
}

function wrapAuthorizeSlack (req, res, next) {
  if (req.body.token === slackVerificationToken) {
    next();
    return;
  }
  res.status(400).send("Access denied.");
}

router.all('*', wrapLogRequestBody, wrapAuthorizeSlack);

//////////
// Root //
//////////

router.get('/', (req, res) => {
  res.json({ message: 'hooray! welcome to our api!' });
});

////////////
// Events //
////////////

function wrapVerifyEndpoint (req, res, next) {
  if (req.body.type !== "url_verification") {
    next();
    return;
  }
  res.send(req.body.challenge);
}

function eventHandler (req, res) {
  res.status(200).end();
}

router.post('/event', wrapVerifyEndpoint, eventHandler);

//////////////
// Commands //
//////////////

function commandHandler (req, res) {
  res.status(200);
  res.json({
    'response_type': 'ephemeral',
    'text': 'Command received! One moment...'
  });
}

router.post('/command', commandHandler);

export default router;
