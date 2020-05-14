//weather image
var weatherIcon = document.getElementById("weatherIcon");
//zip code form
var zipCodeForm = document.getElementById("zipCodeForm");
//user input
var zipCode = document.getElementById("zipCode");
//the response from the api will be saved here
var weather;
var sunrise;
var sunset

zipCodeForm.addEventListener("submit", getWeather);
zipCode.addEventListener("input", validateZip)


//make sure the user entered a vaild zip code
function validateZip(event){
	const zip = document.getElementById(event.target.id).value.trim();
	event.preventDefault();

	if(isNaN(zip)){
		showElement("error");
		showText("error", "Zip code should be a series of 5 numbers, like 90210");
	}
	else{
		hideElement("error");
	}
}

function getWeather(event){
	//stop it from refreshing the page
	event.preventDefault();

	//create the url for the request
	var endpoint = "https://api.openweathermap.org/data/2.5/weather";
	var apiKey = "9ac7bf65622ba8aa0a9501916687b069";
	var queryString = "zip=" + zipCodeForm.zipCode.value + "&units=imperial&appid=" + apiKey;
	var url = endpoint +"?"+queryString;

	console.log(url)

	//create the request to get the weather data
	var xhr = new XMLHttpRequest();
	xhr.addEventListener("load", responseReceivedHandler);
	xhr.responseType = "json";
	xhr.open("GET", url);
	xhr.send();

	console.log("getWeather")
}

function responseReceivedHandler(){
	weather = this.response;


	if(this.status === 200){
		var description = weather.weather[0].description;

		setBackground(description);
		hideElement("zipCodeForm")
		showElement("results");

		//add flex centering to the results
		document.getElementById("results").classList.add("flex");
		document.getElementById("weatherInfo").classList.add("flex");
		document.getElementById("questions").classList.add("flex");

		showText("city", weather.name);
		showText("temperature", weather.main.temp);
		showText("high", weather.main.temp_max);
		showText("low", weather.main.temp_min);

		sunrise = getTime(weather.sys.sunrise);
		sunset = getTime(weather.sys.sunset);
		showText("sunrise", sunrise);
		showText("sunset", sunset);

		showText("description", description.charAt(0).toUpperCase() + description.slice(1));

		if(description.includes("rain") || description === "mist") {
			weatherIcon.src = "rain.png";
		}
		else if(description.includes("snow")){
			weatherIcon.src = "snow.png";
		}
		else if(description.includes("storm")){
			weatherIcon.src = "storm.png";
		}
		else if(description.includes("cloud") || description.includes("overcast")){
			weatherIcon.src = "cloud.png";
		}
		else if(description.includes("clear")){ 
			weatherIcon.src = "sun.png"
		}
		else{
			weatherIcon.src = "http://openweathermap.org/wn/" + weather.weather[0].icon +"@2x.png";
		}
	}

	else{
		addToText("error", "<br>Error: " + weather.cod + ": " + weather.message);
	}

	console.log("responseReceivedHandler")
	console.log(this.response);

}

//set Background image

function setBackground(description){
	//var description = weather.weather[0].description;

	if(description.includes("rain")|| description === "mist"){
		document.body.style.backgroundImage = "url('rainy1.png')";
	}

	else if(description.includes("snow")){
		document.body.style.backgroundImage = "url('snowy.png')";
	}

	else if(description.includes("storm")){
		document.body.style.backgroundImage = "url('thunder.png')";
		document.body.style.backgroundRepeat = "no-repeat";
		document.body.style.backgroundSize = "cover";
		document.querySelector("#heading").style.color = "white";
	}

	else{
		document.body.style.backgroundImage = "url('sunny.png')";
	}
}


//check answers
addClickEvent("cold-clothes", checkClothes);
addClickEvent("wet-clothes", checkClothes);
addClickEvent("hot-clothes", checkClothes);

function checkClothes(event){
	var description = weather.weather[0].description;

	if(this.value === "cold"){
		showElement("clothes");
		if(description.includes("rain") || description.includes("storm") || description === "mist"){
			wrong("clothes");
			showText("clothes", "Mr. Bear sees rain outside. He might need more than just his coat.");
		}
		else if(weather.main.temp_max > 59){
			wrong("clothes");
			showText("clothes", "Mr. Bear doesn't think it is cold when it is " + weather.main.temp_max + " degrees. He doesn't want to wear a coat.")
		}

		else{
			removeWrong("clothes");
			correct("clothes");
			showText("clothes", "Nice job! Mr. Bear should wear his coat today in this cold weather.");
		}
	}

	else if(this.value === "wet"){
		showElement("clothes");
		if(description.includes("rain") || description.includes("storm") || description === "mist"){
			removeWrong("clothes");
			correct("clothes");
			showText("clothes", "That's right! Mr. Bear needs his umbrella when it's rainy outside.");
		}
		else{
			wrong("clothes");
			showText("clothes", "Mr. Bear doesn't carry his umbrella unless it's raining.")
		}
	}

	else if(this.value === "hot"){
		showElement("clothes");
		if(description.includes("rain") || description.includes("storm") || description === "mist"){
			wrong("clothes");
			showText("clothes", "Mr. Bear sees rain outside. He might need more than shorts and a shirt.");
		}
		else if(weather.main.temp_max < 60){
			wrong("clothes");
			showText("clothes", "Mr. Bear doesn't think it is hot when it is " + weather.main.temp_max + " degrees. He needs clothes that will keep him warmer.")
		}

		else{
			removeWrong("clothes");
			correct("clothes");
			showText("clothes", "Nice job! Mr. Bear can wear shorts today because it's warm outside.");
		}
	}
}

addClickEvent("hot", checkHotCold);
addClickEvent("cold", checkHotCold);

function checkHotCold(event){
	showElement("hotWord");
	if(this.value === "hot"){
		if(weather.main.temp_max > 59){
			removeWrong("hotWord");
			correct("hotWord");
			showText("hotWord", "Good work! " + weather.main.temp_max + " degrees is going to be pretty warm today!");
		}
		else{
			wrong("hotWord");
			showText("hotWord", "It's really not very warm outside unless it's going to be over 60 degrees. It looks like today's temperature is going to hit " 
				+ weather.main.temp_max + " degrees .");
		}
	}
	else if(this.value === "cold"){
		if(weather.main.temp_max < 60){
			removeWrong("hotWord");
			correct("hotWord");
			showText("hotWord", "Good work! It is going to be pretty cool today!");
		}
		else{
			wrong("hotWord");
			showText("hotWord", "It's really not very cold outside unless it's going to be less than 60 degrees. It looks like today's temperature is going to hit " 
				+ weather.main.temp_max + " degrees .");
		}
	}

}

addClickEvent("wet", checkWetDry);
addClickEvent("dry", checkWetDry);

function checkWetDry(){

	var description = weather.weather[0].description;
		
	if(this.value === "wet"){
		showElement("dryWord");
		if(description.includes("rain") || description.includes("storm") || description === "mist" ||  description.includes("snow")){
			removeWrong("dryWord");
			correct("dryWord");
			showText("wetWord", "Good job! " + description.charAt(0).toUpperCase() + description.slice(1) + "is a wet kind of weather.");
		}
		else{
			wrong("dryWord");
			showText("dryWord", "Mist, rain, snow, and storms are wet kinds of weather. Our weather today is just "
				+ description + ".");
		}
	}
	else if(this.value === "dry"){
		showElement("dryWord");
		if(description.includes("rain") || description.includes("storm") || description === "mist" ||  description.includes("snow")){
			wrong("dryWord");
			showText("dryWord", "Mist, rain, snow, and storms are wet kinds of weather. Our weather today is just "
				+ description + ".");
		}
		else{
			removeWrong("dryWord");
			correct("dryWord");
			showText("dryWord", "That's right! " + description.charAt(0).toUpperCase() + description.slice(1) + " means there won't be any rain or snow to make it wet.");
		}
	}


}

//add event listener

function addClickEvent(elementId, action){
	document.getElementById(elementId).addEventListener("click", action);
}

// Display the text in the element
function showText(elementId, text) {
   document.getElementById(elementId).innerHTML = text;
}

function addToText(elementId, text){
	document.getElementById(elementId).innerHTML += text;
}

//style right and wrong answers
function correct(elementId){
	document.getElementById(elementId).classList.add("correct");
}

function wrong(elementId){
	document.getElementById(elementId).classList.add("wrong");
}

function removeWrong(elementId){
	document.getElementById(elementId).classList.remove("wrong");
}

function removeCorrect(elementId){
	document.getElementById(elementId).classList.remove("correct");
}

// Show the element
function showElement(elementId) {
   document.getElementById(elementId).classList.remove("hidden");
}

// Hide the element
function hideElement(elementId) {
   document.getElementById(elementId).classList.add("hidden");
}

//pull just the time from a date
function getTime(weatherData){
	//turn the JSON numbers into actual date
	var date = new Date(weatherData*1000)
	//pull the info needed from that date
	var hour = date.getHours();
	var minutes = date.getMinutes();
	var dayNight;

	//choose AM or PM
	(hour > 11) ? dayNight = "PM" : dayNight = "AM";

	//convert from military time
	if(hour > 12){
		hour-=12;
	}

	if(minutes<10){
		minutes = "0" + minutes;
	}

	return hour + ":" + minutes + " " + dayNight;

}

//getWeather(90210);

/*

Proper response format:
{"coord":{
	"lon":-118.41,
	"lat":34.09},
"weather":[{
	"id":800,
	"main":"Clear",
	"description":"clear sky",
	"icon":"01n"}],
"base": "stations",
"main":{
	"temp":67.5,
	"feels_like":70.63,
	"temp_min":62.6,
	"temp_max":73.4,
	"pressure":1010,
	"humidity":82},
"visibility":16093,
"wind":{
	"speed":1.48,
	"deg":14},
"clouds":{
	"all":1},
"dt":1588852810,
"sys":{"type":1,"id":5872,"country":"US","sunrise":1588856279,"sunset":1588905738},
"timezone":-25200,
"id":0,
"name":"Beverly Hills",
"cod":200}

Errors:
{"cod":401, "message": "Invalid API key. Please see http://openweathermap.org/faq#error401 for more info."}
	*/