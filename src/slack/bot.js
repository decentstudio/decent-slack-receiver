import { RtmClient, RTM_EVENTS } from '@slack/client';
import log from 'npmlog';

function startListening(botAccessToken, teamName, broker) {
  console.log('broker:', broker);
  const rtm = new RtmClient(botAccessToken);
  rtm.on(RTM_EVENTS.MESSAGE, handleRtmMessage.bind(null, broker));
  rtm.start();
  log.info('bot', `Bot listening for incoming messages from ${teamName}...`);
}

function handleRtmMessage(broker, message) {
  log.info('bot', 'Message:', message);
  broker.publish('slack.event.message', message);
}

const bot = {
  startListening
};

export default bot;