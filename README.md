# decent-slack-receiver

This API will be a single point of entry for events coming from slack.

## Development Guide
To run and make changes to this service locally: 

1. Run a rabbitmq container with ports 5672 and 15672 published.
    - `docker run -d --name=rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:management-alpine`
2. Make a .env file if you don't have one. Copy/paste the .env.example contents into this file, but change `RABBBITMQ_HOST` to `localhost` instead of `rabbitmq`. (This is so your local app can connect to your rabbitmq container.)
3. Run the app in watch mode so any changes your make will cause the app to be rebuilt and restarted.
    - `npm run watch`


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

## Slack Integration

To use the receiver with slack:

1. Create a new app in slack (or use an existing one). 
2. Add a bot in the Add Features section of the Basic Information page.
3. Copy the Client ID, Client Secret, and Verification Token values into your .env file.
4. If in development, with the app running on port 80 (`npm run watch`), use ngrok to create an https public endpoint. `ngrok http 80` (Run this in a separate terminal from your app.)
5. Copy the https endpoint from the terminal in which ngrok is running. Go to OAuth & Permissions, click "Add a new Redirect URL", and enter the ngrok https endpoint followed by `/api/slack/authorize`
6. Go to Manage Distribution and click the Add to Slack button.
7. Click Authorize on that page, and the receiver will receive the bot access token for the team and start listening for messages in whatever channel the bot is added to.
8. When messages are sent in the slack team you installed it on, the messages should appear in your console where your app is running. If you
   ran docker-compose, you will need to view the logs of the slack receiver container. `docker logs -f <container name or ID>`