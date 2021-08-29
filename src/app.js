let now = new Date();
let months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "June",
  "July",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
let currentMonth = months[now.getMonth()];
let currentDay = days[now.getDay()];
let currentDate = now.getDate();

let hour = now.getHours();
if (hour < 10) {
  hour = `0${hour}`;
}
let minutes = now.getMinutes();
if (minutes < 10) {
  minutes = `0${minutes}`;
}
let date = document.querySelector("#date");
date.innerHTML = `${currentDay} ${currentDate}th ${currentMonth}`;
let timestamp = document.querySelector("#timestamp");
timestamp.innerHTML = `${hour}:${minutes}`;

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return days[day];
}

function displayForecast(response) {
  console.log(response.data.daily);
  let forecast = response.data.daily;

  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;
  // let days = ["Tue", "Wed", "Thur", "Fri", "Sat", "Sun"];
  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `
        <div class="col-2">
          <div class="card forecast">
            <div class="card-body">
              <div class="forecast-day">${formatDay(forecastDay.dt)}</div>
              <div class="forecast-temperatures">
                <span class="forecast-temperature-max">${Math.round(
                  forecastDay.temp.max
                )}°</span>/
                <span class="forecast-temperature-min">${Math.round(
                  forecastDay.temp.min
                )}°</span>
              </div>
              <img src="http://openweathermap.org/img/wn/${
                forecastDay.weather[0].icon
              }@2x.png"
              width="50"
              />
            </div>
          </div>
        </div>
      
  `;
    }
  });
  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  let latitude = coordinates.lat;
  let longitude = coordinates.lon;

  let apiKey = "d4e31f25da5e889fefeac7617a05a07c";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

  axios.get(apiUrl).then(displayForecast);
}

function currentWeather(response) {
  let cityElement = document.querySelector("#city");
  let temperatureElement = document.querySelector("#temp");
  let descriptionElement = document.querySelector("#description");
  let windElement = document.querySelector("#windspeed");
  let humidityElement = document.querySelector("#humidity");

  celsiusTemperature = response.data.main.temp;
  cityElement.innerHTML = response.data.name;
  temperatureElement.innerHTML = Math.round(celsiusTemperature);
  descriptionElement.innerHTML = response.data.weather[0].main;
  windElement.innerHTML = `Wind: ${Math.round(response.data.wind.speed)} m/s `;
  humidityElement.innerHTML = `Humidity: ${response.data.main.humidity}%`;

  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");

  document
    .querySelector("#icon")
    .setAttribute(
      "src",
      `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
    );

  getForecast(response.data.coord);
}
function search(city) {
  let apiKey = "d4e31f25da5e889fefeac7617a05a07c";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(currentWeather);
}

function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#search-input").value;
  search(city);
}

let searchLocation = document.querySelector("#search");
searchLocation.addEventListener("submit", handleSubmit);

function showPosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let apiKey = "d4e31f25da5e889fefeac7617a05a07c";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

  axios.get(apiUrl).then(currentWeather);
}
function handleCurrentLocation() {
  navigator.geolocation.getCurrentPosition(showPosition);
}
let currentLocationButton = document.querySelector("#current-location");
currentLocationButton.addEventListener("click", handleCurrentLocation);

function displayFahrenheitTemperature(event) {
  event.preventDefault();
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  let fahrenheitTemperature = (celsiusTemperature * 9) / 5 + 32;
  let temperatureElement = document.querySelector("#temp");
  temperatureElement.innerHTML = Math.round(fahrenheitTemperature);
}
let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", displayFahrenheitTemperature);

function displayCelsiusTemperature(event) {
  event.preventDefault();
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  let temperatureElement = document.querySelector("#temp");
  temperatureElement.innerHTML = Math.round(celsiusTemperature);
}
let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", displayCelsiusTemperature);

let celsiusTemperature = null;

search("Stockholm");
