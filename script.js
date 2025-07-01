import { API_KEY } from "./config.js";

//  API FETCH

const weatherData = await fetch(
  `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=sofia&days=3&aqi=yes`
);
const data = await weatherData.json();
console.log(data.current);
const localDate = new Date(data.location.localtime);

// HTML CHANGER
const currentWeather = document.querySelector(`.content`);
const currentMarkup = `
          <input class="search-box" type="text" placeholder="Search.." />
          <div class="location-container">
            <div class="location-box">
              <ion-icon class="location-img" name="location-outline"></ion-icon>
              <span>
                <p class="city-country-location">${data.location.name}, ${
  data.location.country
}</p>
                <p class="date">${localDate
                  .getDate()
                  .toString()
                  .padStart(2, 0)}/${localDate
  .getMonth()
  .toString()
  .padStart(
    2,
    0
  )}/${localDate.getFullYear()} ${localDate.getHours()}:${localDate.getMinutes()}</p>
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
              <p><span class="wind">6</span> km/h</p>
            </div>
            <div class="precipitation-condition">
              <img
                class="condition-icon"
                src="https://img.icons8.com/?size=100&id=15362&format=png&color=000000"
                alt=""
              />
              <p><span class="precipitation">12</span>%</p>
            </div>
            <div class="uv-condition">
              <img
                class="condition-icon"
                src="https://img.icons8.com/?size=100&id=oVhznwPN2V1v&format=png&color=000000"
                alt=""
              />
              <p><span class="uv-index">10</span></p>
            </div>
            <div class="feels-minmax">
              <p>
                Feels like: <span class="feels-like">35</span>
                <span class="temperature-unit">°C</span>
              </p>
              <p>
                <span class="min-temp">12</span>
                <span class="temperature-unit">°C</span> /
                <span class="max-temp">40</span>
                <span class="temperature-unit">°C</span>
              </p>
            </div>
          </div>
          <div class="hours-forecast">
            <ul class="forecast-list">
              <li class="hourly-forecast blur-border">
                <p class="hour">12.00</p>
                <img
                  src="https://img.icons8.com/?size=100&id=18609&format=png&color=000000"
                  class="hourly-img"
                  alt=""
                  class="hourly-condition"
                />
                <p class="hour-degree">
                  13 <span class="temperature-unit">°C</span>
                </p>
                <p class="hour-precipitation">12%</p>
              </li>
              <li class="hourly-forecast blur-border">
                <p class="hour">12.00</p>
                <img
                  src="https://img.icons8.com/?size=100&id=18609&format=png&color=000000"
                  class="hourly-img"
                  alt=""
                  class="hourly-condition"
                />
                <p class="hour-degree">
                  13 <span class="temperature-unit">°C</span>
                </p>
                <p class="hour-precipitation">12%</p>
              </li>
              <li class="hourly-forecast blur-border">
                <p class="hour">12.00</p>
                <img
                  src="https://img.icons8.com/?size=100&id=18609&format=png&color=000000"
                  class="hourly-img"
                  alt=""
                  class="hourly-condition"
                />
                <p class="hour-degree">
                  13 <span class="temperature-unit">°C</span>
                </p>
                <p class="hour-precipitation">12%</p>
              </li>
              <li class="hourly-forecast blur-border">
                <p class="hour">12.00</p>
                <img
                  src="https://img.icons8.com/?size=100&id=18609&format=png&color=000000"
                  class="hourly-img"
                  alt=""
                  class="hourly-condition"
                />
                <p class="hour-degree">
                  13 <span class="temperature-unit">°C</span>
                </p>
                <p class="hour-precipitation">12%</p>
              </li>
              <li class="hourly-forecast blur-border">
                <p class="hour">12.00</p>
                <img
                  src="https://img.icons8.com/?size=100&id=18609&format=png&color=000000"
                  class="hourly-img"
                  alt=""
                  class="hourly-condition"
                />
                <p class="hour-degree">
                  13 <span class="temperature-unit">°C</span>
                </p>
                <p class="hour-precipitation">12%</p>
              </li>
              <li class="hourly-forecast blur-border">
                <p class="hour">12.00</p>
                <img
                  src="https://img.icons8.com/?size=100&id=18609&format=png&color=000000"
                  class="hourly-img"
                  alt=""
                  class="hourly-condition"
                />
                <p class="hour-degree">
                  13 <span class="temperature-unit">°C</span>
                </p>
                <p class="hour-precipitation">12%</p>
              </li>
              <li class="hourly-forecast blur-border">
                <p class="hour">12.00</p>
                <img
                  src="https://img.icons8.com/?size=100&id=18609&format=png&color=000000"
                  class="hourly-img"
                  alt=""
                  class="hourly-condition"
                />
                <p class="hour-degree">
                  13 <span class="temperature-unit">°C</span>
                </p>
                <p class="hour-precipitation">12%</p>
              </li>
              <li class="hourly-forecast blur-border">
                <p class="hour">12.00</p>
                <img
                  src="https://img.icons8.com/?size=100&id=18609&format=png&color=000000"
                  class="hourly-img"
                  alt=""
                  class="hourly-condition"
                />
                <p class="hour-degree">
                  13 <span class="temperature-unit">°C</span>
                </p>
                <p class="hour-precipitation">12%</p>
              </li>
              <li class="hourly-forecast blur-border">
                <p class="hour">12.00</p>
                <img
                  src="https://img.icons8.com/?size=100&id=18609&format=png&color=000000"
                  class="hourly-img"
                  alt=""
                  class="hourly-condition"
                />
                <p class="hour-degree">
                  13 <span class="temperature-unit">°C</span>
                </p>
                <p class="hour-precipitation">12%</p>
              </li>
              <li class="hourly-forecast blur-border">
                <p class="hour">12.00</p>
                <img
                  src="https://img.icons8.com/?size=100&id=18609&format=png&color=000000"
                  class="hourly-img"
                  alt=""
                  class="hourly-condition"
                />
                <p class="hour-degree">
                  13 <span class="temperature-unit">°C</span>
                </p>
                <p class="hour-precipitation">12%</p>
              </li>
              <li class="hourly-forecast blur-border">
                <p class="hour">12.00</p>
                <img
                  src="https://img.icons8.com/?size=100&id=18609&format=png&color=000000"
                  class="hourly-img"
                  alt=""
                  class="hourly-condition"
                />
                <p class="hour-degree">
                  13 <span class="temperature-unit">°C</span>
                </p>
                <p class="hour-precipitation">12%</p>
              </li>
              <li class="hourly-forecast blur-border">
                <p class="hour">12.00</p>
                <img
                  src="https://img.icons8.com/?size=100&id=18609&format=png&color=000000"
                  class="hourly-img"
                  alt=""
                  class="hourly-condition"
                />
                <p class="hour-degree">
                  13 <span class="temperature-unit">°C</span>
                </p>
                <p class="hour-precipitation">12%</p>
              </li>
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
              <span class="sunrise-hour">06:00</span>
            </div>
            <div class="sunset blur-border">
              <p class="sun-title">Sunset</p>
              <span class="sunset-hour">21:00</span>
            </div>
          </div>
`;
const parentElChanger = function (parentEl, markup) {
  parentEl.innerHTML = ``;
  parentEl.insertAdjacentHTML(`afterbegin`, markup);
};

parentElChanger(currentWeather, currentMarkup);

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
  document.querySelector(`.city-list-item`).offsetHeight;

const hourlyGap =
  +window
    .getComputedStyle(document.querySelector(`.forecast-list`))
    .gap.replace(/\D/g, "") +
  document.querySelector(`.hourly-forecast`).offsetWidth;

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
