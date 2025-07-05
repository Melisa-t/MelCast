import CurrentWeather from "./currentWeather.js";
import { API_KEY } from "../config.js";
import { clickButtons } from "../script.js";

class SearchWeather extends CurrentWeather {
  _data;
  parentEl = document.querySelector(`.content`);
  markUp;

  render(data) {
    if (!data) return;
    const localDate = new Date(data.location.localtime);
    this._localDate = localDate;
    this._data = data;
    this._clear();

    clickButtons();
  }

  _clear() {
    this.parentEl.innerHTML = ` `;
  }

  async getLocationData(query) {
    try {
      if (!query || query.trim().length === 0) return;
      const weatherData = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${query}&days=3&aqi=yes`
      );
      const data = await weatherData.json();
      if (!weatherData.ok) throw new Error(`${data.error.message}`);
      return data;
    } catch (err) {
      throw new Error(`${err.message}`);
    }
  }
}

export default new SearchWeather();
