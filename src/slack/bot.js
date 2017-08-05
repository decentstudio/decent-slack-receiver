import { RtmClient, RTM_EVENTS } from '@slack/client';
import log from 'npmlog';

function startListening({ authGrant, broker }) {
  const rtm = new RtmClient(authGrant.bot.bot_access_token);
  rtm.on(RTM_EVENTS.MESSAGE, (message) => { handleRtmMessage({ message, broker }) });
  rtm.start();
  log.info('bot', `Bot listening for incoming messages from ${authGrant.team_name}...`);
}

function handleRtmMessage({ broker, message }) {
  log.info('bot', 'Message:', message);
  broker.publish('slack.event.message', message);
}

const bot = {
  startListening
};

export default bot;