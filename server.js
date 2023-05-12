const express = require("express");
const cors = require("cors");
require("dotenv").config();
const axios = require("axios");
const PORT = process.env.PORT || 8080;

const app = express();
app.use(cors());

// endpoint for root
app.get("/", (request, response) => response.json("You reached the root"));

// endpoint for weather
app.get("/weather", async (request, response) => {
	try {
		const { lat, lon } = request.query;
		const API = `http://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHER_BIT_KEY}&lat=${lat}&lon=${lon}&days=7`;
		const results = await axios.get(API); //returns result.data and we want .data
		// set up data to return to client
		const forecasts = makeForecasts(results.data.data);
		console.log(results.data.city_name);
		response.json(forecasts);
	} catch (error) {
		console.log(error);
		const forecasts = {};
		response.json(forecasts);
	}
});
function makeForecasts(days) {
	return days.map((day) => {
		return {
			date: day.valid_date,
			description: `Low of ${day.min_temp} degrees and high of ${
				day.max_temp
			} degrees with ${day.weather.description.toLowerCase()}.`,
		};
		console.log(day.valid_date);
	});

	// Tim's code
	//city.data.forEach((day) => {
	//	const fc = {date: day.valid_date, description: day.weather.description}};
	// forecasts.push(fc)
	//})
}

app.listen(PORT, () => console.log("App running on port " + PORT));
