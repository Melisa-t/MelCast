import { API_KEY } from "./config.js";

let coords = [];
function success(position) {
  coords = [position.coords.latitude, position.coords.longitude];
}
function error() {
  throw error("Unable to retrieve your location");
}

if (!navigator.geolocation) {
  throw error("Geolocation is not supported by your browser");
} else {
  navigator.geolocation.getCurrentPosition(success, error);
}
//  API FETCH

class WeatherClass {
  data;
  parentEl;
  markUp;

  render(data) {
    this._clear();
    this.markUp = this._generateMarkUp(data);
    this.parentEl.insertAdjacentHTML(`afterbegin`, this.markUp);
  }
  _clear() {
    parentEl.innerHTML = ``;
  }

  _generateMarkUp(data) {
    return ``;
  }

  _createSpinner() {
    this.parentEl.insertAdjacentHTML(`afterbegin`, this.markUp);
  }
}

class CurrentWeather extends WeatherClass {
  _data;
  parentEl = document.querySelector(`.content`);
  markUp;
  _localDate;

  render(data) {
    this._clear();
    this._data = data;
    this.markUp = this._generateMarkUp(data);
    this.parentEl.insertAdjacentHTML(`afterbegin`, this.markUp);
  }
  _clear() {
    this.parentEl.innerHTML = ``;
  }

  async getLocationData() {
    const weatherData = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=auto:ip&days=3&aqi=yes`
    );
    const data = await weatherData.json();

    const localDate = new Date(data.location.localtime);
    this._localDate = localDate;
    this._data = data;

    this.render(this._data);
  }

  _generateMarkUp(data) {
    return `

          <div class="location-container">
            <div class="location-box">
              <ion-icon class="location-img" name="location-outline"></ion-icon>
              <span>
                <p class="city-country-location">${data.location.name}, ${
      data.location.country
    }</p>
                <p class="date">${this._localDate
                  .getDate()
                  .toString()
                  .padStart(2, 0)}/${this._localDate
      .getMonth()
      .toString()
      .padStart(2, 0)}/${this._localDate.getFullYear()} ${this._localDate
      .getHours()
      .toString()
      .padStart(2, 0)}:${this._localDate
      .getMinutes()
      .toString()
      .padStart(2, 0)}</p>
              </span>
            </div>

            <div class="star-air">
              <ion-icon class="star" name="star-outline"></ion-icon>
              <p class="air-quality">
                Air Quality: <span class="air-quality-score">${
                  data.current.air_quality["us-epa-index"]
                }</span>
              </p>
              <!-- <ion-icon name="star"></ion-icon>  -->
            </div>
          </div>
          <div class="weather-container">
            <img
              src=${data.current.condition.icon}
              alt=""
              class="weather-logo"
            />
            <p class="temperature">
              <span class="temperature-degree">${parseInt(
                data.current.temp_c
              )}</span
              ><span class="temperature-unit">°C</span>
            </p>
            <p class="temperature-condition">${data.current.condition.text}</p>
          </div>
          <div class="weather-conditions blur-border">
            <div class="wind-condition">
              <img
                class="condition-icon"
                src="https://img.icons8.com/?size=100&id=pLiaaoa41R9n&format=png&color=000000"
                alt=""
              />
              <p><span class="wind">${parseInt(
                data.current.wind_kph
              )}</span> km/h</p>
            </div>
            <div class="precipitation-condition">
              <img
                class="condition-icon"
                src="https://img.icons8.com/?size=100&id=15362&format=png&color=000000"
                alt=""
              />
              <p><span class="precipitation">${
                data.forecast.forecastday[0].day.daily_chance_of_rain
              }</span>%</p>
            </div>
            <div class="uv-condition">
              <img
                class="condition-icon"
                src="https://img.icons8.com/?size=100&id=oVhznwPN2V1v&format=png&color=000000"
                alt=""
              />
              <p><span class="uv-index">${parseInt(data.current.uv)}</span></p>
            </div>
            <div class="feels-minmax">
              <p>
                Feels like: <span class="feels-like">${parseInt(
                  data.current.feelslike_c
                )}</span>
                <span class="temperature-unit">°C</span>
              </p>
              <p>
                <span class="min-temp">${parseInt(
                  data.forecast.forecastday[0].day.mintemp_c
                )}</span>
                <span class="temperature-unit">°C</span> /
                <span class="max-temp">${parseInt(
                  data.forecast.forecastday[0].day.maxtemp_c
                )}</span>
                <span class="temperature-unit">°C</span>
              </p>
            </div>
          </div>
          <div class="hours-forecast">
            <ul class="forecast-list">
          
          ${data.forecast.forecastday[0].hour
            .filter((hours) => {
              const hoursForecastHour = new Date(hours.time);
              if (hoursForecastHour.getHours() > this._localDate.getHours())
                return hours;
            })
            .map((hour) => {
              return `<li class="hourly-forecast blur-border">
                <p class="hour">${hour.time.split(` `)[1]}</p>
                <img
                  src="${hour.condition.icon}"
                  class="hourly-img"
                  alt=""
                  class="hourly-condition"
                />
                <p class="hour-degree">
                  ${parseInt(
                    hour.temp_c
                  )} <span class="temperature-unit">°C</span>
                </p>
                <p class="hour-precipitation">${hour.chance_of_rain}%</p>
              </li>`;
            })
            .join(``)}
            </ul>
            <ion-icon
              class="btn btn--left"
              name="chevron-back-outline"
            ></ion-icon>
            <ion-icon
              class="btn btn--right"
              name="chevron-forward-outline"
            ></ion-icon>
          </div>
          <div class="sunrise-sunset-container">
            <div class="sunrise blur-border">
              <p class="sun-title">Sunrise</p>
              <span class="sunrise-hour">${
                data.forecast.forecastday[0].astro.sunrise.split(` `)[0]
              }</span>
            </div>
            <div class="sunset blur-border">
              <p class="sun-title">Sunset</p>
              <span class="sunset-hour">${twelveHoursToTwentyFour(
                data.forecast.forecastday[0].astro.sunset.split(` `)[0]
              )}</span>
            </div>
          </div>
`;
  }
}

const currentWeatherCl = new CurrentWeather();

class SearchWeatherCl extends CurrentWeather {
  _data;
  parentEl = document.querySelector(`.content`);
  markUp;

  async getLocationData(query) {
    const weatherData = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${query}&days=3&aqi=yes`
    );
    const data = await weatherData.json();

    const localDate = new Date(data.location.localtime);
    this._localDate = localDate;
    this._data = data;

    this.render(this._data);
  }
}

const SearchWeather = new SearchWeatherCl();

const twelveHoursToTwentyFour = function (time) {
  const [hours, minutes] = time.split(`:`);
  const finalTime = `${+hours === 12 ? "00" : +hours + 12}:${minutes}`;
  return finalTime;
};

const loadSearch = function () {
  const searchForm = document.querySelector(`#markup-form`);
  if (!searchForm) return;
  
  let searchQuery;

  searchForm.addEventListener(`submit`, async function () {

    searchQuery = document.querySelector(`#search-input`).value;
    console.log(searchQuery);
    document.querySelector(`#search-input`).value = ` `;

    await SearchWeather.getLocationData(searchQuery);
  });
};

const init = async function () {
  await currentWeatherCl.getLocationData();
  loadSearch();
};

init();

//  NIGHT MODE
const switchBtn = document.querySelector("span.slider");
const html = document.documentElement;

const applyTheme = (theme) => {
  html.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
  html.offsetHeight;
};

const toggleTheme = () => {
  const currentTheme = html.getAttribute("data-theme");
  const newTheme = currentTheme === "light" ? "dark" : "light";
  applyTheme(newTheme);
};

const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
  applyTheme(savedTheme);
} else {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(prefersDark ? "dark" : "light");
}

switchBtn?.addEventListener("click", toggleTheme);

// ✅ SCROLLING IN HOURLY FORECAST AND STARRED CITIES
const rightBtn = document.querySelector(`.btn--right`);
const lefttBtn = document.querySelector(`.btn--left`);
const upBtn = document.querySelector(`.btn--up`);
const downBtn = document.querySelector(`.btn--down`);

const starGap =
  +window
    .getComputedStyle(document.querySelector(`.city-list`))
    .gap.replace(/\D/g, "") +
  document.querySelector(`.city-list-item`)?.offsetHeight;

const hourlyGap =
  +window
    .getComputedStyle(document.querySelector(`.forecast-list`))
    .gap.replace(/\D/g, "") +
  document.querySelector(`.hourly-forecast`)?.offsetWidth;

const changeRightList = () => {
  document.querySelector(`.forecast-list`).scrollLeft += hourlyGap;
};

const changeLeftList = () => {
  document.querySelector(`.forecast-list`).scrollLeft -= hourlyGap;
};

const changeUpList = () => {
  document.querySelector(".city-list").scrollTop -= starGap;
};

const changeDownList = () => {
  document.querySelector(".city-list").scrollTop += starGap;
};

rightBtn?.addEventListener(`click`, changeRightList);
lefttBtn?.addEventListener(`click`, changeLeftList);
upBtn?.addEventListener(`click`, changeUpList);
downBtn?.addEventListener(`click`, changeDownList);
