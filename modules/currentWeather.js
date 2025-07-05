import { API_KEY, WINDY_KEY } from "../config.js";
import { clickButtons } from "../script.js";
import { twelveHoursToTwentyFour } from "../script.js";
import StarredWeather from "./starredWeather.js";

export default class CurrentWeather {
  _data;
  parentEl = document.querySelector(`.content`);
  markUp;
  _localDate;

  render(data) {
    currentWeather._generateSpinner();
    const localDate = new Date(data.location.localtime);
    this._localDate = localDate;
    this.forecastHourArranger(this._data);
    this._data = data;
    this._clear();
    this.markUp = this._generateMarkUp(data);
    this.parentEl.insertAdjacentHTML(`afterbegin`, this.markUp);
    clickButtons();

    // this._createWindyMap(data);
  }

  createCityId(name, country, lat, lon) {
    if (!name || !country || !lat || !lon) return;
    const CityId = this.CityCountryHash(name, country, lat, lon);
    return CityId;
  }

  CityCountryHash(param1, param2, param3, param4) {
    const combined = `${param1}:${param2}:${param3}:${param4}`; // keep order
    let hash = 0;
    for (let i = 0; i < combined.length; i++) {
      const chr = combined.charCodeAt(i);
      hash = (hash << 5) - hash + chr;
      hash |= 0; // convert to 32bit integer
    }
    return Math.abs(hash).toString(16); // return as positive hex
  }

  // TO MOVE THE MAP TO STARRED LOCATION
  _createWindyMap(data) {
    windyInit(
      {
        key: `${WINDY_KEY}`,
        lat: `${data.location.lat}`,
        lon: `${data.location.lon}`,
        zoom: 6,
      },
      (windyAPI) => {
        const { store } = windyAPI;
        // All the params are stored in windyAPI.store
        store.set(`overlay`, `temp`);
        const { map } = windyAPI;
        // .map is instance of Leaflet map
      }
    );
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
      return data;
    } catch (err) {
      this._clear();
      this.parentEl.innerHTML = `<p class="err-text">${err}</p>`;
      //   forecastWeather.parentEl.innerHTML = `<p class="err-text">${err}</p>`;
      this.parentEl.style.height = `530px`;
    }
  }

  forecastHourArranger = function (data) {
    if (!data) return;
    const firstDayHours = data.forecast.forecastday[0].hour
      .filter((hours) => {
        const hoursForecastHour = new Date(hours.time);
        if (hoursForecastHour.getHours() >= this._localDate.getHours())
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

  _generateMarkUp(data) {
    const name = data?.location?.name || `Unknown`;
    const country = data?.location?.country || `Unknown`;
    const airQuality = data?.current?.air_quality || 0;
    const conditionIcon = data?.current?.condition?.icon || `Condition Image`;
    const currentTemp = data?.current?.temp_c || 0;
    const conditionText = data?.current?.condition?.text || `Unknown`;
    const windSpeed = data?.current?.wind_kph || 0;
    const chanceOfRain =
      data?.forecast?.forecastday[0]?.day?.daily_chance_of_rain || 0;
    const uvIndex = data?.current?.uv || 0;
    const feelsLike = data?.current?.feelslike_c || 0;
    const minTemp = data?.forecast?.forecastday[0]?.day?.mintemp_c || 0;
    const maxTemp = data?.forecast?.forecastday[0]?.day?.maxtemp_c || 0;
    const sunriseHour =
      data?.forecast?.forecastday[0]?.astro.sunrise || `Unknown`;
    const sunsetHour =
      data?.forecast?.forecastday[0]?.astro.sunset || `Unknown`;
    const cityId = this.createCityId(
      data?.location?.name,
      data?.location?.country,
      data?.location?.lat,
      data?.location?.lon
    );
    return `
          <div class="location-container">
            <div class="location-box">
              <ion-icon class="location-img" name="location-outline"></ion-icon>
              <span>
                <p class="city-country-location" data-cityid="${cityId}">${name}, ${country}</p>
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
                  airQuality["us-epa-index"]
                }</span>
              </p>
              <!-- <ion-icon name="star"></ion-icon>  -->
            </div>
          </div>
          <div class="weather-container">
            <img
              src=${conditionIcon}
              alt=""
              class="weather-logo"
            />
            <p class="temperature">
              <span class="temperature-degree">${parseInt(currentTemp)}</span
              ><span class="temperature-unit">°C</span>
            </p>
            <p class="temperature-condition">${conditionText}</p>
          </div>
          <div class="weather-conditions blur-border">
            <div class="wind-condition">
              <img
                class="condition-icon"
                src="https://img.icons8.com/?size=100&id=pLiaaoa41R9n&format=png&color=000000"
                alt=""
              />
              <p><span class="wind">${parseInt(windSpeed)}</span> km/h</p>
            </div>
            <div class="precipitation-condition">
              <img
                class="condition-icon"
                src="https://img.icons8.com/?size=100&id=15362&format=png&color=000000"
                alt=""
              />
              <p><span class="precipitation">${chanceOfRain}</span>%</p>
            </div>
            <div class="uv-condition">
              <img
                class="condition-icon"
                src="https://i.ibb.co/B5cx5BY0/protect.png"
                alt=""
              />
              <p><span class="uv-index">${parseInt(uvIndex)}</span></p>
            </div>
            <div class="feels-minmax">
              <p>
                Feels like: <span class="feels-like">${parseInt(
                  feelsLike
                )}</span>
                <span class="temperature-unit">°C</span>
              </p>
              <p>
                <span class="min-temp">${parseInt(minTemp)}</span>
                <span class="temperature-unit">°C</span> <span class="separator">/</span>
                <span class="max-temp">${parseInt(maxTemp)}</span>
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
              <span class="sunrise-hour">${sunriseHour.split(` `)[0]}</span>
            </div>
            <div class="sunset blur-border">
              <p class="sun-title">Sunset</p>
              <span class="sunset-hour">${twelveHoursToTwentyFour(
                sunsetHour.split(` `)[0]
              )}</span>
            </div>
          </div>
`;
  }
}

export const currentWeather = new CurrentWeather();
