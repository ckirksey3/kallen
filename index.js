'use strict';

process.env.DEBUG = 'actions-on-google:*';
let ApiAiApp = require('actions-on-google').ApiAiApp;

let express = require('express');
let bodyParser = require('body-parser');

let HikingAPI = require('./hiking-api.js');
let hikingAPI = new HikingAPI(process.env.HIKING_API_KEY);

let app = express();
app.use(bodyParser.json({type: 'application/json'}));

// API.AI actions
const TRAILS_REQUESTED = 'trails.requested';

let last_question_asked;
let current_campaign_id;

app.post('/', function (request, response) {
  const assistant = new ApiAiApp({request: request, response: response});
  console.log('Request headers: ' + JSON.stringify(request.headers));
  console.log('Request body: ' + JSON.stringify(request.body));

	function handleError(error) {
    console.log(error);
    assistant.tell('Sorry, something went wrong');
    return;
  }

  function handleTrailsRequested() {
    assistant.tell('Some trails are coming right up!');
		hikingAPI.getTrails(40.0274, -105.2519).then(function (trails) {
			let responseMessage = 'Some nearby trails include ';
			let trail_count = 0;
			while (trail_count < 3 && trail_count < trails.length) {
				responseMessage += trails[trail_count].name + ' ';
			}
			assistant.tell(responseMessage);
		})
		.catch(handleError);
    return;
  }

  let actionMap = new Map();
  actionMap.set(TRAILS_REQUESTED, handleTrailsRequested);
  assistant.handleRequest(actionMap);
});

if (module === require.main) {
  let server = app.listen(process.env.PORT || 8080, function () {
    let port = server.address().port;
    console.log('App listening on port %s', port);
  });
}

module.exports = app;
