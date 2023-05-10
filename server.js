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
// functions to put together weather forecast data to send user
function dayForecast(day) {
	return {
		date: day.datetime,
		description: `Low of ${day.low_temp} degrees rising to high of ${
			day.max_temp
		} with ${day.weather.description.toLowerCase()}`,
	};
}

function setupForecast(dataToReturn) {
	let array = [];
	for (i = 0; i < dataToReturn[0].data.length; i++) {
		array.push(dayForecast(dataToReturn[0].data[i]));
	}
	return array;
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
