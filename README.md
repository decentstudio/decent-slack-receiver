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

## Docker Usage
### Ubuntu 16.04 	

1. Navigate to the project directory

2. Create a `.env` file based on the `.env.example` file

3. Build the container:
   - `sudo docker build -t decent-event-receiver:1.0 .`

4. Run the container:
   - `sudo docker run -d --net=host --env-file=.env decent-event-receiver:1.0`

## Environment Variables Setup

Make a file called .env in the root of the project, if you have not already. Add the following required environment variables, along with their values. Follow the .env.example file if needed.

- SLACK_VERIFICATION_TOKEN

- HTTP_PORT

- RABBITMQ_HOST

- RABBITMQ_PORT

- RABBITMQ_USER

- RABBITMQ_PASS

- RABBITMQ_VHOST
