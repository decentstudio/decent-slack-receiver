# decent-slack-receiver

This API will be a single point of entry for events coming from slack.

## Run project

1. Navigate to the project directory

2. Install dependencies
   - `npm install`

3. Build
   - `npm run build`

4. Environment Variables
   - Create a .env file based on the .env.example file

5. Start
   - `npm start`


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
   - `docker build -t decent-event-receiver:1.0 .`

4. Run the container:
   - `docker run --name=decent-slack-receiver -d -p 8080:80 --env-file=.env decent-event-receiver:1.0`

Note:

On Windows 10 Pro we have seen that sometimes a `--hostname=localhost` flag is necessary in step 4 above.

## Environment Variables Setup

Make a file called .env in the root of the project, if you have not already. Add the following required environment variables, along with their values. Follow the .env.example file if needed.

- SLACK_VERIFICATION_TOKEN

- RABBITMQ_HOST

- RABBITMQ_PORT

- RABBITMQ_USER

- RABBITMQ_PASS

- RABBITMQ_VHOST
