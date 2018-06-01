var api_key;

const request = require('request-promise-native');

var HikingAPI = function(hiking_project_api_key) {
    api_key = hiking_project_api_key;
};

/**
 * Gets a list of the nearby trails for a given lat, long
 * @param {string} lat - latitude of location
 * @param {string} long - longitude of location
 */
HikingAPI.prototype.getTrails = function (lat, long) {
	var options = {
    uri: 'https://www.hikingproject.com/data/get-trails',
		qs: {
			key: api_key,
			lat: lat,
			lon: long,
			maxDistance: 10
		},
		json: true
	};
	return new Promise(function(resolve, reject) {
		request(options).then(function (trails) {
			resolve(trails.trails);
		})
		.catch(function (err) {
			console.log('failed!');
			reject(err);
		});
	});
};

module.exports = HikingAPI;
