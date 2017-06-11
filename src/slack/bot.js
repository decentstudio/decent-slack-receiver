import { RtmClient, RTM_EVENTS } from '@slack/client';
import log from 'npmlog';

function startListening(botAccessToken, teamName) {
  const rtm = new RtmClient(botAccessToken);
  rtm.on(RTM_EVENTS.MESSAGE, handleRtmMessage);
  rtm.start();
  log.info('bot', `Bot listening for incoming messages from ${teamName}...`);
}

function handleRtmMessage(message) {
  log.info('bot', 'Message:', message);
}

const bot = {
  startListening
};

export default bot;