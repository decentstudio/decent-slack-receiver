// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
import config from './config';
import * as broker from './broker';
import router from './router';
import bodyParser from 'body-parser';
import request from 'request';
import log from 'npmlog';
import express from 'express';
import { RtmClient, RTM_EVENTS } from '@slack/client';

let app = express();

app.get('/authorize', (req, res) => {
  getAuthorizationGrant(req.query.code);
});

app.listen(config.HTTP_PORT, (app, err) => { onStart(config.HTTP_PORT, app, err) });

function getAuthorizationGrant(code) {
  console.log('Getting authorization grant.');
  const postConfig = {
    url: 'https://slack.com/api/oauth.access',
    form: {
      client_id: config.SLACK_CLIENT_ID,
      client_secret: config.SLACK_CLIENT_SECRET,
      code
    }
  };
  request.post(postConfig, function (error, response, body) {
    console.log('error:', error);
    console.log('statusCode:', response && response.statusCode);
    const bodyObject = JSON.parse(body);
    console.log('body:', bodyObject);
    startBotListening(bodyObject.bot.bot_access_token);
  });
}

function startBotListening(botAccessToken) {
  console.log('Bot access token:', botAccessToken);
  const rtm = new RtmClient(botAccessToken);
  rtm.on(RTM_EVENTS.MESSAGE, handleRtmMessage);
  rtm.start();
}

function handleRtmMessage(message) {
  console.log('Message:', message);
}

function onStart(port, app, err) {
  if (!err) {
    const template = `Magic happens on port ${port}`;
    log.info('server', template);
  }
  else {
    log.error('server', err);
  }
}
