/*
  Weather App - script.js

  Detailed Hindi comments added so a new programmer (pehla din wala) bhi
  aasani se samajh sake. Neeche functions ka overview, data flow, aur
  har function ke andar explanation diya gaya hai.

  Functions in this file (short):
  - getWeather(city)
      Input: city (string) - city name user ne input field me diya
      Action: fetches weather data from OpenWeatherMap API
      Output: calls showWeather(data) with the JSON response

  - showWeather(data)
      Input: data (object) - JSON response from the weather API
      Action: updates the DOM to display icon, temperature, description
      Output: none (returns undefined),kyunki abhi api key non working hai. If city not found, shows error.

  Event handler:
  - form 'submit' event -> anonymous function (event)
      'event' is the Event object produced by the browser when the form
      is submitted. We use event.preventDefault() to stop the default
      behaviour (page reload) so we can handle form submission with JS.

  Value/data flow summary:
  1) User types city name into #cityInput element (variable: search)
  2) On form submit, handler reads search.value and calls getWeather(city)
  3) getWeather(city) fetches API and receives JSON 'data'
  4) getWeather calls showWeather(data)
  5) showWeather updates #weatherResult element to render info

  Note on returns: getWeather returns whatever showWeather returns, but
  showWeather doesn't explicitly return a value (so undefined). The main
  purpose is side-effects (DOM update), not returning values.api key non working hone ki bajah se bhi ho sakta hai ye reason run na hone ka.
*/

// Weather API ka base URL - yahan API key set karen
const API_KEY = "3265874a2c77ae4a04bb96236a642d2f"; // apna API key yahan daalna hoga

// DOM element references
const form = document.querySelector("form");
const search = document.querySelector("#cityInput");
const weather = document.querySelector("#weatherResult");

// getWeather: async function jo API se data lata hai
// Input: city (string) — user se aaya hua city name
// Behavior:
//  - screen par temporary "Loading..." dikhata hai
//  - OpenWeatherMap API ko fetch call bhejta hai
//  - response JSON banata hai aur showWeather ko forward karta hai
// Returns: showWeather(data) ka result (usually undefined due to non working api key)
const getWeather = async (city) => {
  // UX: user ko pata chale ke data aa raha hai
  weather.innerHTML = `<h2>Loading...</h2>`;

  // API URL: city name aur API key ke sath
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

  // fetch se response aata hai — network call
  // NOTE: network errors (e.g., no connection) will throw; a new programmer
  // may want to add try/catch here to show a friendly error message.
  const response = await fetch(url);
  const data = await response.json();
  // data ab API ka JSON object hai — ise showWeather ko pass karte hain
  return showWeather(data);
};

// showWeather: API response le kar DOM update karta hai
// Input: data (object) - OpenWeatherMap ka JSON response
// Behavior:
//  - agar API city nahi paati (404), to user ko "City Not Found" dikhata hai
//  - otherwise, icon, temperature aur description show karta hai
// Returns: none (undefined)
const showWeather = (data) => {
  // Console pe pura response dekhna debugging me useful hota hai
  console.log(data);

  // OpenWeatherMap error format me 'cod' field hoti hai; 404 matlab city nahi mili
  if (data.cod == "404") {
    weather.innerHTML = `<h2>City Not Found</h2>`;
    return; // yahan function khatam
  }

  // Agar sahi data mila to screen update karein
  // data.weather[0].icon -> icon code (image url banate hain)
  // data.main.temp -> current temperature (metric units set kiye hain)
  weather.innerHTML = `
        <div>
            <img
                src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png"
                alt="Weather Icon"
            />
        </div>
        <h2>${data.main.temp} °C</h2>
        <h4>${data.weather[0].description}</h4>
    `;
};

// Form submit handler:
// - function (event) yahan ek Event object leta hai jo browser provide karta hai
// - event.preventDefault() default form submit (page reload) rokta hai
// - handler search.value (jo user ne #cityInput me dala) ko getWeather ko pass karta hai
form.addEventListener("submit", function (event) {
  // search.value me jo user input hai wo string hoti hai
  console.log(search.value);

  // Data flow: search.value -> getWeather(city)
  getWeather(search.value); // cityInput.value

  // Prevent the browser's default submit behavior (reload). Agar ye na karein
  // to JS se fetch karne se pehle page reload ho jaayega aur humara SPA behaviour khatam.
  event.preventDefault();
});
