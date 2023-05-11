const express = require("express");
const cors = require("cors");
require("dotenv").config();
const axios = require("axios");
const PORT = process.env.PORT || 8080;

const app = express();
app.use(cors());

// const weather = require("./data/weather.json");
// filter function
// function filterData(lon, lat, searchQuery) {
// 	let result = [];
// 	if (searchQuery) {
// 		// this led to getting the answer as an array, but I was trying yo
// 		// treat it as an object - took a while to work out
// 		result = weather.filter((location) => location.city_name == searchQuery);
// 	} else if (lon && lat) {
// 		result = weather.filter(
// 			(location) => location.lon == lon && location.lat == lat
// 		);
// 	}
// 	return result;
// }
// HTTP: http://api.weatherbit.io/v2.0/forecast/daily
// days= up to 16 & lat & lon

async function getWeather(lon, lat) {
	const API = `http://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHER_BIT_KEY}&lat=${lat}&lon=${lon}&days=7`;
	let res = await axios.get(API);
	console.log(res.data.city_name);
	return res.data;
	// response.json(res);
}
// functions to put together weather forecast data to send user
function dayForecast(day) {
	return {
		date: day.datetime,
		description: `Low of ${day.min_temp} degrees rising to high of ${
			day.max_temp
		} with ${day.weather.description.toLowerCase()}`,
	};
}

// look at Tim's error handlers
// object.data.prop
function forecast(weatherDays) {
	return weatherDays.map((day) => {
		return {
			date: day.valid_date,
			description: `Low of ${day.min_temp} degrees and high of ${
				day.max_temp
			} degrees with ${day.weather.description.toLowerCase()}`,
		};
		console.log(day.valid_date);
	});

	// Tim's code
	//city.data.forEach((day) => {
	//	const fc = {date: day.valid_date, description: day.weather.description}};
	// forecasts.push(fc)
	//})
}

// endpoint for root
app.get("/", (request, response) => response.json("You reached the root"));

// endpoint for weather
app.get("/weather", async (request, response) => {
	// const { lat, lon, searchQuery } = request.query;
	try {
		// get from the weather api
		let lat = request.query.lat;
		let lon = request.query.lon;
		let results = await getWeather(lon, lat);
		let weatherForecast = forecast(results.data); // results.data is an array
		response.json(weatherForecast);
	} catch (error) {
		response.json("Error in coordinates");
	}
});

app.listen(PORT, () => console.log("App running on port " + PORT));
