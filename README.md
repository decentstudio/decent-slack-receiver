# decent-slack-receiver

This API will be a single point of entry for events coming from slack.

### Docker Usage
## Ubuntu 16.04 	

1. Navigate to the project directory

2. Create a `.env` file based on the `.env.example` file

3. Build the container:
   - `sudo docker build -t decent-event-receiver:1.0 .`

4. Run the container:
   - `sudo docker run -d -p 8080:8080 --env-file=.env decent-event-receiver:1.0`
