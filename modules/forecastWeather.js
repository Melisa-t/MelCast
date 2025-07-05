import CurrentWeather from "./currentWeather.js";
import { days } from "../script.js";

class Forecast extends CurrentWeather {
  _data;
  parentEl = document.querySelector(`.daily-forecast`);
  markUp;
  _localDate;

  render(data) {
    this._generateSpinner();
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
        const forecastDate = new Date(hour.date).getDay();
        if (this._localDate.getDay() !== forecastDate) return hour;
      })
      .map((hour) => {
        let forecastDate = new Date(hour.date).getDay();
        return `<li class="forecast-list-item blur-border">
            <div class="forecast-day">${days[forecastDate]}</div>
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

export default new Forecast();
