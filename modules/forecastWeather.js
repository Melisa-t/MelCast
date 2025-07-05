import CurrentWeather from "./currentWeather.js";
import { days } from "../script.js";

class Forecast extends CurrentWeather {
  _data;
  parentEl = document.querySelector(`.daily-forecast`);
  markUp;
  _localDate;

  render(data) {
    if (!data) return;
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
        const conditionIcon = hour?.day?.condition?.icon || `Unknown`;
        const conditionText = hour?.day?.condition?.text || `Unknown`;
        const avgTemp = hour?.day?.avgtemp_c || 0;
        const maxWind = hour?.day?.maxwind_kph || 0;
        const chanceOfRain =  hour?.day?.daily_chance_of_rain || 0;
        const uvIndex = hour?.day?.uv || 0;
        const minTemp = hour?.day?.mintemp_c || 0;
        const maxTemp = hour?.day?.maxtemp_c || 0;
        return `<li class="forecast-list-item blur-border">
            <div class="forecast-day">${days[forecastDate]}</div>
            <div class="forecast-weather-details">
              <img
                src="https:${conditionIcon}"
                alt="${conditionText}"
                class="forecast-logo"
              />
              <p class="forecast-temperature">
                <span class="forecast-temperature-degree">${parseInt(
                  avgTemp
                )}</span
                ><span class="temperature-unit">°C</span>
              </p>
              <p class="forecast-temperature-condition">${
                conditionText
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
                  maxWind
                )}</span> km/h</p>
              </div>
              <div class="forecast-precipitation-condition">
                <img
                  class="forecast-condition-icon"
                  src="https://img.icons8.com/?size=100&id=15362&format=png&color=000000"
                  alt=""
                />
                <p><span class="forecast-precipitation">${
                 chanceOfRain
                }</span>%</p>
              </div>
              <div class="forecast-uv-condition">
              
                <img
                  class="forecast-condition-icon"
                  src="https://i.ibb.co/B5cx5BY0/protect.png"
                  alt=""
                />
                <p><span class="uv-index">${parseInt(uvIndex)}</span></p>
              </div>
              <div class="forecast-minmax">
                <p>
                  Min: <span class="forecast-min-temp">${parseInt(
                    minTemp
                  )}</span>
                  <span class="temperature-unit">°C</span>
                </p>
                <p>
                  Max: <span class="forecast-max-temp">${parseInt(
                    maxTemp
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
