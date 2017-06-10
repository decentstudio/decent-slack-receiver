import { RtmClient, RTM_EVENTS } from '@slack/client';

function startListening(botAccessToken, teamName) {
  const rtm = new RtmClient(botAccessToken);
  rtm.on(RTM_EVENTS.MESSAGE, handleRtmMessage);
  rtm.start();
  console.log(`Bot listening for incoming messages from ${teamName}`);
}

function handleRtmMessage(message) {
  console.log('Message:', message);
}

const bot = {
  startListening
};

export default bot;