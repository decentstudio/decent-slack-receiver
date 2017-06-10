# decent-slack-receiver

This API will be a single point of entry for events coming from slack.

## Run project

1. Navigate to the project directory

2. Install dependencies
   - `npm install`

3. Environment Variables
   - Create a .env file based on the .env.example file

4. Start
   - `npm start`
   - OR, to watch for changes to the code and restart the app automatically, run `npm run watch`


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
