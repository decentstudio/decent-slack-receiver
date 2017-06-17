# decent-slack-receiver

This API will be a single point of entry for events coming from slack.

## Run project

1. Navigate to the project directory

2. Install dependencies
   - `npm install`

3. Environment Variables
   - Create a .env file based on the .env.example file

4. Start
   - `npm run build-start` builds then runs the project
   - OR, to watch for changes to the code and rebuild/restart the app automatically, run `npm run watch`


## Docker Compose Usage (Development)
### Ubuntu 16.04

1. Navigate to the project directory.

2. Create a `.env` file based on the `.env.example` file.

3. Bring up the system:
   - `docker-compose up -d`

## Docker Usage (Development)
### Ubuntu 16.04

1. Navigate to the project directory

2. Create a `.env` file based on the `.env.example` file

3. Build the container:
   - `docker build -t decentstudio/decent-slack-receiver:latest .`

4. Run the container:
   - `docker run --name=decent-slack-receiver -d -p 8080:80 --env-file=.env decentstudio/decent-slack-receiver:latest`

## Environment Variables Setup

Make a file called .env in the root of the project, if you have not already. Add the following required environment variables, along with their values. Follow the .env.example file if needed.

- SLACK_VERIFICATION_TOKEN

- SLACK_CLIENT_ID

- SLACK_CLIENT_SECRET

- HTTP_PORT (set this to 80 for now)

- RABBITMQ_HOST

- RABBITMQ_PORT

- RABBITMQ_USER

- RABBITMQ_PASS

- RABBITMQ_VHOST

## Slack Integration

To use the receiver with slack, with the app running:

1. Create a new app in slack (or use an existing one). 
2. Add a bot in the Add Features section of the Basic Information page. 
3. If in development, use ngrok to create an https public endpoint. `ngrok http 8080`
4. Go to OAuth & Permissions and enter the ngrok https endpoint followed by `/api/slack/authorize`
5. Go to Manage Distribution and copy the Sharable URL and navigate to it, or click the Add to Slack button.
6. Click Authorize on that page, and the receiver will receive the bot access token for the team and start listening for messages in whatever channel the bot is added to.
7. When messages are sent in the slack team you installed it on, the messages should appear in your console where your app is running. If you
   ran docker-compose, you will need to view the logs of the slack receiver container. `docker logs -f <container>`