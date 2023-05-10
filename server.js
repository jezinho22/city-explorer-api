const express = require("express");
const cors = require("cors");
require("dotenv").config();
const PORT = process.env.PORT || 8080;

const app = express();
app.use(cors());

const weather = require("./data/weather.json");

// filter function
function filterData(lon, lat, searchQuery) {
	let result = [];
	if (searchQuery) {
		result = weather.filter((location) => location.city_name == searchQuery);
	} else if (lon && lat) {
		result = weather.filter(
			(location) => location.lon == lon && location.lat == lat
		);
	}

	return result;
}

function setupForecast(dataToReturn) {
	let todaysWeather = dataToReturn[0].data[2];

	let today = todaysWeather.datetime;
	let description = `Low of ${
		todaysWeather.low_temp
	} degrees rising to high of ${
		todaysWeather.max_temp
	} with ${todaysWeather.weather.description.toLowerCase()}`;

	let dayWeather = { today: today, description: description };
	return dayWeather;
}
// endpoint for root
app.get("/", (request, response) => response.json("You reached the root"));
// endpoint for weather
app.get("/weather", (request, response) => {
	let dataToReturn = weather;
	// prepare to return filtered data
	let lat = request.query.lat;
	let lon = request.query.lon;
	let searchQuery = request.query.searchQuery;
	// apply filter function
	dataToReturn = filterData(lon, lat, searchQuery);
	// get weather forecast from returned city
	let threeDaysWeather = setupForecast(dataToReturn);
	response.json(threeDaysWeather);
});

app.listen(PORT, () => console.log("App running on port " + PORT));
