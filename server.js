// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
const dotenv = require('dotenv').config();
const express = require('express');        // call express
const app = express();                 // define our app using express
const bodyParser = require('body-parser');
const http = require('http');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = process.env.PORT || 8080;        // set our port

const SLACK_VERIFICATION_TOKEN = process.env.SLACK_VERIFICATION_TOKEN;

// ROUTES FOR OUR API
// =============================================================================
const router = express.Router();              // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', (req, res) => {
  res.json({ message: 'hooray! welcome to our api!' });
});

// Endpoint for events
router.post('/', (req, res) => {
  // URL verification required for the Slack Events API
  if (req.body.type === "url_verification") {
    res.send(req.body.challenge);
  }

  // Verify that the request is coming from slack
  if (req.body.token !== SLACK_VERIFICATION_TOKEN) {
    res.status(400);
    res.send("Access denied.");
  }

  console.log(req.body);

  // We must immediately (within 2 seconds) send a 200 response
  // or else Slack will retry the message
  res.status(200);
  res.send();

  // Send the event on to the event receiver

});

// Endpoint for slash commands
router.post('/command', (req, res) => {
  // Verify that the request is coming from slack
  if (req.body.token !== SLACK_VERIFICATION_TOKEN) {
    res.status(400);
    res.send("Access denied.");
  }

  // Respond immediately so the user knows command was received
  res.status(200);
  res.json({
    'response_type': 'ephemeral',
    'text': 'Command received! One moment...'
  });
  console.log(req.body);

  // Send request to queue
});

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
