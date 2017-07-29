import { RtmClient, RTM_EVENTS } from '@slack/client';
import log from 'npmlog';

function startListening({ authGrant, broker }) {
  const authGrantJson = JSON.parse(authGrant);
  const rtm = new RtmClient(authGrantJson.bot.bot_access_token);
  rtm.on(RTM_EVENTS.MESSAGE, (message) => { handleRtmMessage({ message, broker }) });
  rtm.start();
  log.info('bot', `Bot listening for incoming messages from ${authGrantJson.team_name}...`);
}

function handleRtmMessage({ broker, message }) {
  log.info('bot', 'Message:', message);
  broker.publish('slack.event.message', message);
}

const bot = {
  startListening
};

export default bot;