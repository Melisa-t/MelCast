import StarredWeather from "./modules/starredWeather.js";
import searchWeather from "./modules/searchWeather.js";
import { currentWeather } from "./modules/currentWeather.js";
import forecastWeather from "./modules/forecastWeather.js";
import starredWeather from "./modules/starredWeather.js";

export const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export const clickButtons = function () {
  // ✅ SCROLLING IN HOURLY FORECAST AND STARRED CITIES
  const rightBtn = document.querySelector(`.btn--right`);
  const lefttBtn = document.querySelector(`.btn--left`);
  const upBtn = document.querySelector(`.btn--up`);
  const downBtn = document.querySelector(`.btn--down`);

  const gapCalculator = function (parent, child) {
    if (parent === null) return;
    return (
      +window.getComputedStyle(parent).gap.replace(/\D/g, "") +
      child?.offsetHeight
    );
  };
  const cityList = document.querySelector(`.city-list`);
  const cityListItem = document.querySelector(`.city-list-item`);

  const starGap = gapCalculator(cityList, cityListItem);

  const forecastList = document.querySelector(`.forecast-list`);
  const forecastListItem = document.querySelector(`.hourly-forecast`);

  const hourlyGap = gapCalculator(forecastList, forecastListItem);

  const changeRightList = () => {
    if (forecastList === null) return;
    forecastList.scrollLeft += hourlyGap;
  };

  const changeLeftList = () => {
    if (forecastList === null) return;
    forecastList.scrollLeft -= hourlyGap;
  };

  const changeUpList = () => {
    if (cityList === null) return;
    cityList.scrollTop -= starGap;
  };

  const changeDownList = () => {
    if (cityList === null) return;
    cityList.scrollTop += starGap;
  };

  rightBtn?.addEventListener(`click`, changeRightList);
  lefttBtn?.addEventListener(`click`, changeLeftList);
  upBtn?.addEventListener(`click`, changeUpList);
  downBtn?.addEventListener(`click`, changeDownList);
};

// function for converting 12h to 24h time

export const twelveHoursToTwentyFour = function (time) {
  const [hours, minutes] = time.split(`:`);
  const finalTime = `${+hours === 12 ? "00" : +hours + 12}:${minutes}`;
  return finalTime;
};

const checkStarIcon = function (data, icon) {
  const starId = starredWeather.createStarId(
    data?.location?.name,
    data?.location?.country,
    data?.location?.lat,
    data?.location?.lon
  );
  if (starredWeather.getStar(starId)) {
    icon.src = `https://i.ibb.co/0y1wchP7/star-fill.png`;
  }
  if (!starredWeather.getStar(starId)) {
    icon.src = `https://i.ibb.co/tPT5JxHP/icons8-star-50-1.png`;
  }
};

const starIconFetcher = function (data) {
  const starIcon = document.querySelector(`.star`);
  checkStarIcon(data, starIcon);
  starIcon.addEventListener(`click`, () => {
    starredWeather.saveStar(data);
    checkStarIcon(data, starIcon);
  });
};

const renderErrorMessage = function (errorMessage) {
  forecastWeather.parentEl.innerHTML = ` `;
  currentWeather.parentEl.innerHTML = ` `;
  currentWeather.parentEl.innerHTML = `<p class="err-text">${errorMessage}</p>`;
  forecastWeather.parentEl.innerHTML = `<p class="err-text">${errorMessage}</p>`;
  currentWeather.parentEl.style.height = `530px`;
};

//loading search results

const loadSearch = function () {
  const searchForm = document.querySelector(`#markup-form`);
  if (!searchForm) return;

  let searchQuery;

  searchForm.addEventListener(`submit`, async function () {
    searchQuery = document.querySelector(`#search-input`).value;
    if (searchQuery.trim().length === 0) return;
    document.querySelector(`#search-input`).value = ` `;
    currentWeather._generateSpinner();
    forecastWeather._generateSpinner();
    try {
      const searchData = await searchWeather.getLocationData(searchQuery);

      currentWeather.render(searchData);
      forecastWeather.render(searchData);

      starIconFetcher(searchData);
    } catch (err) {
      renderErrorMessage(err.message);
    }
  });
};

const changeCurrentWeatherOnClick = async function (e) {
  e.preventDefault();
  if (
    !e.currentTarget === starContainer ||
    e.target === document.querySelector(`.btn--up`) ||
    e.target === document.querySelector(`.btn--down`)
  )
    return;

  const location = e.target.closest(`.city-list-item`)?.dataset?.id;
  if (document.querySelector(`.city-country-location`)) {
    {
      const renderedCurrentData = starredWeather.starred.find(
        (data) => data.starId === location
      );
      currentWeather.render(renderedCurrentData);
      forecastWeather.render(renderedCurrentData);
      starIconFetcher(renderedCurrentData);
    }
  }
  if (!document.querySelector(`.city-country-location`)) {
    const renderedCurrentData = starredWeather.starred.find(
      (data) => data.starId === location
    );
    currentWeather.render(renderedCurrentData);
    forecastWeather.render(renderedCurrentData);
    starIconFetcher(renderedCurrentData);
  }
};

//to initialize everything

const starContainer = document.querySelector(`.star-container`);

const init = async function () {
  try {
    starredWeather.loadStars();
    const weatherData = await currentWeather.getLocationData();
    currentWeather.render(weatherData);
    forecastWeather.render(weatherData);
    starIconFetcher(weatherData);
    starredWeather.render(starredWeather.starred);
    starContainer.addEventListener(`click`, changeCurrentWeatherOnClick);
    loadSearch();
  } catch (err) {
    renderErrorMessage(err.message);
  }
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

