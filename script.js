import { API_KEY } from "./config.js";

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const clickButtons = function () {
  // ✅ SCROLLING IN HOURLY FORECAST AND STARRED CITIES
  const rightBtn = document.querySelector(`.btn--right`);
  const lefttBtn = document.querySelector(`.btn--left`);
  const upBtn = document.querySelector(`.btn--up`);
  const downBtn = document.querySelector(`.btn--down`);

  const gapCalculator = function (element, child) {
    if (element === null) return;
    return (
      +window.getComputedStyle(element).gap.replace(/\D/g, "") +
      child?.offsetHeight
    );
  };

  const starGap = gapCalculator(
    document.querySelector(`.city-list`),
    document.querySelector(`.city-list-item`)
  );

  const hourlyGap = gapCalculator(
    document.querySelector(`.forecast-list`),
    document.querySelector(`.hourly-forecast`)
  );

  const changeRightList = () => {
    if (document.querySelector(`.forecast-list`) === null) return;
    document.querySelector(`.forecast-list`).scrollLeft += hourlyGap;
  };

  const changeLeftList = () => {
    if (document.querySelector(`.forecast-list`) === null) return;
    document.querySelector(`.forecast-list`).scrollLeft -= hourlyGap;
  };

  const changeUpList = () => {
    if (document.querySelector(`.city-list`) === null) return;
    document.querySelector(".city-list").scrollTop -= starGap;
  };

  const changeDownList = () => {
    if (document.querySelector(`.city-list`) === null) return;
    document.querySelector(".city-list").scrollTop += starGap;
  };

  rightBtn?.addEventListener(`click`, changeRightList);
  lefttBtn?.addEventListener(`click`, changeLeftList);
  upBtn?.addEventListener(`click`, changeUpList);
  downBtn?.addEventListener(`click`, changeDownList);
};

//  API FETCH

class WeatherClass {
  _data;
  parentEl;
  markUp;

  render(data) {
    this._clear();
    this.markUp = this._generateMarkUp(data);
    this.parentEl.insertAdjacentHTML(`afterbegin`, this.markUp);
  }
  _clear() {
    this.parentEl.innerHTML = ` `;
  }

  _generateMarkUp(data) {
    return ``;
  }
}

class CurrentWeatherCl extends WeatherClass {
  _data;
  parentEl = document.querySelector(`.content`);
  markUp;
  _localDate;

  render(data) {
    this._data = data;
    this._clear();
    this.markUp = this._generateMarkUp(data);
    this.parentEl.insertAdjacentHTML(`afterbegin`, this.markUp);
    this._pushStarLocation(data);
  }
  _clear() {
    this.parentEl.innerHTML = ` `;
  }

  _generateSpinner() {
    this._clear();
    const markup = `
    <div class="loader-div">
    <span class="loader"></span>
    <p class="loading-text">Fetching Data...</p>
    </div>
    `;
    this.parentEl.insertAdjacentHTML(`afterbegin`, markup);
  }

  async getLocationData() {
    try {
      const weatherData = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=auto:ip&days=3&aqi=yes`
      );

      const data = await weatherData.json();
      if (!weatherData.ok) throw new Error(`${data.error.message}`);
      const localDate = new Date(data.location.localtime);
      this._localDate = localDate;
      this._data = data;
      this.render(this._data);
      this.forecastHourArranger(this._data);
      forecastCl.render(this._data);
    } catch (err) {
      this._clear();
      this.parentEl.innerHTML = `<p class="err-text">${err}</p>`;
      forecastCl.parentEl.innerHTML = `<p class="err-text">${err}</p>`;
      this.parentEl.style.height = `530px`;
    }
  }

  forecastHourArranger = function (data) {
    const firstDayHours = data.forecast.forecastday[0].hour
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
      .join(``);
    const secondDayHours = data.forecast.forecastday[1].hour
      .filter((hours) => {
        const hoursForecastHour = new Date(hours.time);
        if (hoursForecastHour.getHours() < +6) return hours;
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
      .join(``);
    const finalHoursList = firstDayHours.concat(secondDayHours);
    return finalHoursList;
  };

  _pushStarLocation(data) {
    const starIcon = document.querySelector(`.star`);

    const isStarred = StarredWeather.starred.some(
      (loc) =>
        loc.location.name === data.location.name &&
        loc.location.country === data.location.country
    );

    // Initial icon setup
    starIcon.src = isStarred
      ? "https://i.ibb.co/0y1wchP7/star-fill.png"
      : "https://i.ibb.co/tPT5JxHP/icons8-star-50-1.png";

    starIcon.addEventListener(`click`, function () {
      const index = StarredWeather.starred.findIndex(
        (loc) =>
          loc.location.name === data.location.name &&
          loc.location.country === data.location.country
      );

      if (index > -1) {
        // Unstar
        StarredWeather.starred.splice(index, 1);
        StarredWeather.keepStarred();
        // Remove city from markup
        const cityItems = document.querySelectorAll(".city-list-item");
        cityItems.forEach((item) => {
          if (
            item.textContent.includes(data.location.name) &&
            item.textContent.includes(data.location.country)
          ) {
            item.remove();
          }
        });
        starIcon.src = "https://i.ibb.co/tPT5JxHP/icons8-star-50-1.png";
        StarredWeather.loadStarred();
      } else {
        // Star
        StarredWeather.starred.push(data);
        StarredWeather.renderStarredLocation(data);
        starIcon.src = "https://i.ibb.co/0y1wchP7/star-fill.png";
      }

      StarredWeather.keepStarred();
    });
  }

  _generateMarkUp(data) {
    return `
          <div class="location-container">
            <div class="location-box">
              <ion-icon class="location-img" name="location-outline"></ion-icon>
              <span>
                <p class="city-country-location" data-current-location="${
                  data.location.name
                } ${data.location.country}">${data.location.name}, ${
      data.location.country
    }</p>
                <p class="date">${this._localDate
                  .getDate()
                  .toString()
                  .padStart(2, 0)}/${(this._localDate.getMonth() + 1)
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
              <img class="star" src="https://i.ibb.co/tPT5JxHP/icons8-star-50-1.png" alt="">
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
                src="https://i.ibb.co/B5cx5BY0/protect.png"
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
          
          ${this.forecastHourArranger(data)}
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

const currentWeather = new CurrentWeatherCl();

class SearchWeatherCl extends CurrentWeatherCl {
  _data;
  parentEl = document.querySelector(`.content`);
  markUp;

  async getLocationData(query) {
    try {
      if (query.trim().length === 0) return;
      const weatherData = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${query}&days=3&aqi=yes`
      );
      const data = await weatherData.json();
      if (!weatherData.ok) throw new Error(`${data.error.message}`);

      const localDate = new Date(data.location.localtime);
      this._localDate = localDate;
      this._data = data;
      this._clear();
      this.render(this._data);

      forecastCl.render(this._data);
    } catch (err) {
      this._clear();
      this.parentEl.innerHTML = `<p class="err-text">${err}</p>`;
      forecastCl.parentEl.innerHTML = `<p class="err-text">${err}</p>`;
      this.parentEl.style.height = `530px`;
    }
  }
}

const SearchWeather = new SearchWeatherCl();

class ForecastCl extends CurrentWeatherCl {
  _data;
  parentEl = document.querySelector(`.daily-forecast`);
  markUp;
  _localDate;

  render(data) {
    this._clear();
    this._data = data;
    const localDate = new Date(data.location.localtime);
    this._localDate = localDate;
    this.markUp = this._generateMarkUp(data);
    this.parentEl.insertAdjacentHTML(`afterbegin`, this.markUp);
  }
  _clear() {
    this.parentEl.innerHTML = ` `;
  }

  _generateMarkUp(data) {
    return data.forecast.forecastday
      .filter((hour) => {
        const forecastDate = new Date(hour.date).getDate();
        if (this._localDate.getDate() < forecastDate) return hour;
      })
      .map((hour) => {
        let forecastDate = new Date(hour.date).getDate();
        return `<li class="forecast-list-item blur-border">
            <div class="forecast-day">${
              days[forecastDate === 6 ? (forecastDate = 0) : forecastDate + 1]
            }</div>
            <div class="forecast-weather-details">
              <img
                src="${hour.day.condition.icon}"
                alt="${hour.day.condition.text}"
                class="forecast-logo"
              />
              <p class="forecast-temperature">
                <span class="forecast-temperature-degree">${parseInt(
                  hour.day.avgtemp_c
                )}</span
                ><span class="temperature-unit">°C</span>
              </p>
              <p class="forecast-temperature-condition">${
                hour.day.condition.text
              }</p>
            </div>
            <div class="forecast-weather-conditions blur-border">
              <div class="forecast-wind-condition">
                <img
                  class="forecast-condition-icon"
                  src="https://img.icons8.com/?size=100&id=pLiaaoa41R9n&format=png&color=000000"
                  alt=""
                />
                <p><span class="forecast-wind">${parseInt(
                  hour.day.maxwind_kph
                )}</span> km/h</p>
              </div>
              <div class="forecast-precipitation-condition">
                <img
                  class="forecast-condition-icon"
                  src="https://img.icons8.com/?size=100&id=15362&format=png&color=000000"
                  alt=""
                />
                <p><span class="forecast-precipitation">${
                  hour.day.daily_chance_of_rain
                }</span>%</p>
              </div>
              <div class="forecast-uv-condition">
              
                <img
                  class="forecast-condition-icon"
                  src="https://i.ibb.co/B5cx5BY0/protect.png"
                  alt=""
                />
                <p><span class="uv-index">${parseInt(hour.day.uv)}</span></p>
              </div>
              <div class="forecast-minmax">
                <p>
                  Min: <span class="forecast-min-temp">${parseInt(
                    hour.day.mintemp_c
                  )}</span>
                  <span class="temperature-unit">°C</span>
                </p>
                <p>
                  Max: <span class="forecast-max-temp">${parseInt(
                    hour.day.maxtemp_c
                  )}</span>
                  <span class="temperature-unit">°C</span>
                </p>
              </div>
            </div>
          </li>`;
      })
      .join(` `);
  }
}

const forecastCl = new ForecastCl();

class StarredWeatherCl extends CurrentWeatherCl {
  _data;
  parentEl = document.querySelector(`.city-list`);
  markUp;
  starred = [];

  changeCurrentWeatherOnClick(e) {
    e.preventDefault();
    let currentLoc;
    currentLoc = "";
    const location = e.target.closest(`.city-list-item`).dataset.location;
    currentLoc = document.querySelector(`.city-country-location`).dataset
      .currentLocation;
    StarredWeather._getLocationData(currentLoc, location);
  }

  async _getLocationData(currentLoc, location) {
    if (currentLoc !== location) {
      currentWeather._generateSpinner();
      forecastCl._generateSpinner();
      await SearchWeather.getLocationData(location);
    }
  }

  loadStarred() {
    let data = localStorage.getItem("starred");
    if (data) {
      this.starred = JSON.parse(data);
      this.starred.forEach((location) => {
        this.renderStarredLocation(location);
      });
    }
    if (this.starred.length === 0) {
      const markup = `<p class="star-text">No starred cities found! </p>
`;
      this.parentEl.insertAdjacentHTML("afterbegin", markup);
    }
  }

  renderStarredLocation(data) {
    const exists = [...this.parentEl.querySelectorAll(".city-list-item")].some(
      (el) => el.textContent.includes(data.location.name)
    );
    if (exists) return;
    this._clear();
    const markup = this._generateMarkUp(this.starred);
    this.parentEl.insertAdjacentHTML("beforeend", markup);
  }

  keepStarred() {
    localStorage.setItem("starred", JSON.stringify(this.starred));
  }

  addStar(data) {
    this.starred.push(data);
    data.bookmarked = true;
    this.keepStarred();
  }

  _generateMarkUp(data) {
    return data
      .map(
        (data) =>
          `<li class="city-list-item blur-border" data-location="${
            data.location.name
          } ${data.location.country}">
      <p class="star-title"><span>${data.location.name}</span><span>${
            data.location.country
          }</span></p>
      <div class="star-city-conditions">
        <img
          class="star-weather"
          width="48"
          height="48"
          src="${data.current.condition.icon}"
          alt="${data.current.condition.text}"
        />
        <p class="star-city-degree">
          ${parseInt(
            data.current.temp_c
          )} <span class="temperature-unit">°C</span>
        </p>
        <p class="star-city-condition">${data.current.condition.text}</p>
      </div>
    </li>`
      )
      .join(``);
  }
}

const StarredWeather = new StarredWeatherCl();

// function for converting 12h to 24h time

const twelveHoursToTwentyFour = function (time) {
  const [hours, minutes] = time.split(`:`);
  const finalTime = `${+hours === 12 ? "00" : +hours + 12}:${minutes}`;
  return finalTime;
};

//loading search results

const loadSearch = function () {
  const searchForm = document.querySelector(`#markup-form`);
  if (!searchForm) return;

  let searchQuery;

  searchForm.addEventListener(`submit`, async function () {
    searchQuery = document.querySelector(`#search-input`).value;
    if (searchQuery.trim().length !== 0)
      document.querySelector(`#search-input`).value = ` `;
    currentWeather._generateSpinner();
    forecastCl._generateSpinner();
    await SearchWeather.getLocationData(searchQuery);
    clickButtons();
  });
};

//to initialize everything
const starredContainer = document.querySelector(`.star-container`);

const init = async function () {
  StarredWeather.loadStarred();
  currentWeather._generateSpinner();
  forecastCl._generateSpinner();
  await currentWeather.getLocationData();
  starredContainer.addEventListener(
    `click`,
    StarredWeather.changeCurrentWeatherOnClick
  );
  clickButtons();
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

// const starredContainer = document.querySelector(`.star-container`);
// starredContainer.addEventListener(`click`, function (e) {
//   if (!e.target.classList.contains(`.city-list-item`)) return;
// console.log(`hi`);
//   console.log(document.querySelector(`.star-title`).textContent);
// });
