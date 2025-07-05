import { clickButtons } from "../script.js";
import CurrentWeather, { currentWeather } from "./currentWeather.js";

class StarredWeather extends CurrentWeather {
  _data;
  parentEl = document.querySelector(`.city-list`);
  markUp;
  starred = [];

  render() {
    this._clear();
    this.markUp = this._generateMarkUp(this.starred);
    this.parentEl.insertAdjacentHTML(`beforeend`, this.markUp);
    clickButtons();
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
      .map(
        (data) =>
          `<li class="city-list-item blur-border" data-id="${
            data.starId}">
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

export default new StarredWeather();

//   render(data) {
//     this._pushStarLocation(data);
//     clickButtons();
//   }

//   _pushStarLocation(data) {
//     console.log(`data yo`, data);
//     if (!this.starred) return;
//     const isStarred = this.starred.some((loc) => {
//       console.log(`loc yo`, loc);
//       loc.location.name === data.location.name &&
//         loc.location.country === data.location.country;
//     });

//     // Initial icon setup
//     starIcon.src = isStarred
//       ? "https://i.ibb.co/0y1wchP7/star-fill.png"
//       : "https://i.ibb.co/tPT5JxHP/icons8-star-50-1.png";
//     const index = this.starred.findIndex(
//       (loc) =>
//         loc.location.name === data.location.name &&
//         loc.location.country === data.location.country
//     );

//     if (index > -1) {
//       // Unstar
//       this.starred.splice(index, 1);
//       this.keepStarred();
//       // Remove city from markup
//       const cityItems = document.querySelectorAll(".city-list-item");
//       cityItems.forEach((item) => {
//         if (
//           item.textContent.includes(data.location.name) &&
//           item.textContent.includes(data.location.country)
//         ) {
//           item.remove();
//         }
//       });
//       starIcon.src = "https://i.ibb.co/tPT5JxHP/icons8-star-50-1.png";
//       this.loadStarred();
//     } else {
//       // Star
//       this.starred.push(data);
//       data.bookmarked = true;
//       this.renderStarredLocation(data);
//       this.keepStarred();
//       starIcon.src = "https://i.ibb.co/0y1wchP7/star-fill.png";
//     }
//   }

//   async _getLocationData(currentLoc, location) {
//     if (currentLoc === location) return;
//     const weatherData = await fetch(
//       `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${query}&days=3&aqi=yes`
//     );
//     const data = await weatherData.json();
//     return data;
//   }

//   changeCurrentWeatherOnClick(e) {
//     e.preventDefault();
//     let currentLoc = "";
//     if (
//       !e.target.classList.contains(`city-list`) &&
//       (e.target === document.querySelector(`.btn--up`) ||
//         e.target === document.querySelector(`.btn--down`))
//     )
//       return;

//     const location = e.target.closest(`.city-list-item`).dataset.location;
//     if (!document.querySelector(`.city-country-location`))
//       this.render(this._getLocationData(currentLoc, location));

//     if (document.querySelector(`.city-country-location`)) {
//       currentLoc = document.querySelector(`.city-country-location`).dataset
//         .currentLocation;
//       this.render(this._getLocationData(currentLoc, location));
//     }
//   }

//   loadStarred() {
//     let data = localStorage.getItem("starred");
//     console.log(this.starred);
//     console.log(data);
//     if (data) {
//       this.starred = JSON.parse(data);
//       this.starred.forEach((location) => {
//         this.renderStarredLocation(location);
//       });
//     }
//     if (this.starred.length === 0) {
//       const markup = `<p class="star-text">No starred cities found! </p>
// `;
//       this.parentEl.insertAdjacentHTML("afterbegin", markup);
//     }
//   }

//   renderStarredLocation(data) {
//     const exists = [...this.parentEl.querySelectorAll(".city-list-item")].some(
//       (el, i) => {
//         el.textContent.includes(data.location.name);
//       }
//     );
//     if (exists) return;
//     this._clear();
//     const markup = this._generateMarkUp(this.starred);
//     this.parentEl.insertAdjacentHTML("beforeend", markup);
//     starIconFetcher(data);
//   }

//   keepStarred() {
//     localStorage.setItem("starred", JSON.stringify(this.starred));
//   }
