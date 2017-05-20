# decent-slack-receiver

This API will be a single point of entry for events coming from slack.

### Docker Usage
## Ubuntu 16.04 	

`cd to the project root`

Build the container:

`sudo docker build -t decent-event-receiver:1.0 .`

Run the container:

`sudo docker run -d -p 8080:8080 decent-event-receiver:1.0`
