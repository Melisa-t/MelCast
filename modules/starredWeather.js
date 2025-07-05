import { clickButtons } from "../script.js";
import CurrentWeather  from "./currentWeather.js";

class StarredWeather extends CurrentWeather {
  _data;
  parentEl = document.querySelector(`.city-list`);
  markUp;
  starred = [];
  errorMsg = `<p class="error-msg"> No starred locations found. Star some! </p>`;

  render(data) {
    if (!data) return;
    this._clear(data, this.errorMsg);
    this.markUp = this._generateMarkUp(data);
    this.parentEl.insertAdjacentHTML(`beforeend`, this.markUp);
    clickButtons();
  }

  _clear(data, errMsg) {
    if (data.length === 0) {
      this.parentEl.innerHTML = ` `;
      this.parentEl.insertAdjacentHTML(`beforeend`, errMsg);
    } else {
      this.parentEl.innerHTML = ` `;
    }
  }

  // every single time star icon is clicked save data in local storage

  saveStar(data) {
    const starId = this.createStarId(
      data?.location?.name,
      data?.location?.country,
      data?.location?.lat,
      data?.location?.lon
    );

    if (this.getStar(starId)) {
      this.removeStar(starId);
      localStorage.setItem(`stars`, JSON.stringify(this.starred));
      this.render(this.starred);
      return;
    }
    data.starId = starId;
    this.starred.push(data);
    localStorage.setItem(`stars`, JSON.stringify(this.starred));
    this.render(this.starred);
  }

  createStarId(name, country, lat, lon) {
    if (!name || !country || !lat || !lon) return;
    const starId = this.starWeatherHash(name, country, lat, lon);
    return starId;
  }

  starWeatherHash(param1, param2, param3, param4) {
    const combined = `${param1}:${param2}:${param3}:${param4}`; // keep order
    let hash = 0;
    for (let i = 0; i < combined.length; i++) {
      const chr = combined.charCodeAt(i);
      hash = (hash << 5) - hash + chr;
      hash |= 0; // convert to 32bit integer
    }
    return Math.abs(hash).toString(16); // return as positive hex
  }

  getStar(id) {
    if (!id) return;
    return this.starred.some((star) => {
      return star.starId === id;
    });
  }

  removeStar(id) {
    const index = this.starred.findIndex((item) => item.starId === id);
    if (index > -1) {
      this.starred.splice(index, 1);
    }
  }

  loadStars() {
    const localStars = localStorage.getItem(`stars`);
    if (!localStars) return;
    this.starred = JSON.parse(localStars);
  }

  _generateMarkUp(data) {
    return data
      .map((data) => {
        const starId = data?.starId || `Unknown`;
        const name = data?.location?.name || `Unknown`;
        const country = data?.location?.country || `Unknown`;
        const conditionIcon = data?.current?.condition?.icon || `Unknown`;
        const conditionText = data?.current?.condition?.text || `Unknown`;
        const currentTemp = data?.current?.temp_c || 0;
        return `<li class="city-list-item blur-border" data-id="${starId}">
      <p class="star-title"><span>${name}</span><span>${country}</span></p>
      <div class="star-city-conditions">
        <img
          class="star-weather"
          width="48"
          height="48"
          src="${conditionIcon}"
          alt="${conditionText}"
        />
        <p class="star-city-degree">
          ${parseInt(currentTemp)} <span class="temperature-unit">°C</span>
        </p>
        <p class="star-city-condition">${conditionText}</p>
      </div>
    </li>`;
      })
      .join(``);
  }
}

export default new StarredWeather();
