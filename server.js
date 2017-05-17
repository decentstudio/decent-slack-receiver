// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express = require('express');        // call express
var app = express();                 // define our app using express
var bodyParser = require('body-parser');
var http = require('http');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function (req, res) {
  res.json({ message: 'hooray! welcome to our api!' });
});

router.post('/', function (req, res) {
  console.log(req.body);

  // URL verification required for the Slack Events API
  if (req.body.type === "url_verification") {
    res.send(req.body.challenge);
  }

  // Verify that the request is coming from slack by making sure
  // the token sent is the same as our app token
  // Comment this out if testing without using Slack
  if (req.body.token !== "NzZYknIbrEjXjfqusU3Htxn5") {
    res.status(400);
    res.send("Access denied.");
  }

  // We must immediately (within 2 seconds) send a 200 response
  // or else Slack will retry the message
  res.status(200);
  res.send();

  // Send the event on to the event receiver


  // Just testing webhooks
  if (req.body.event.text.includes('eth')) {
    return;
  }

  const options = {
    hostname: 'https://hooks.slack.com',
    port: 80,
    path: '/services/T57D8BH3R/B5DQWM7EV/bhi8dfsXFuWkx4FQKP1a4kuM',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const request = http.request(options, (result) => {
    console.log(result);
  });

  request.on('error', (error) => {
    console.error(`Error: ${error.message}`);
  });

  request.write(`{"text": "Hello from the slack receiver."}`);
  request.end();

});

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
