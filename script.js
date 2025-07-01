import { API_KEY } from "./config.js";
// API

const weatherData = await fetch(
  `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=sofia&days=3`
);
const data = await weatherData.json();
console.log(data);
// NIGHT MODE

const switchBtn = document.querySelector("span.slider");
const html = document.querySelector(`html`);

const changeMode = function () {
  const data = html.getAttribute(`data-theme`);
  console.log(data);
  if (data === `light`) {
    html.setAttribute("data-theme", `dark`);
    console.log(`went thru light`);
    return;
  } else if (data === `dark`) {
    html.setAttribute("data-theme", `light`);
    console.log(`went thru dark`);
    return;
  }
};

switchBtn.addEventListener("click", changeMode);

// SCROLLING IN HOURLY FORECAST AND STARRED CITIES

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

const changeRightList = function () {
  document.querySelector(`.forecast-list`).scrollLeft += hourlyGap;
};

const changeLeftList = function () {
  document.querySelector(`.forecast-list`).scrollLeft -= hourlyGap;
};

const changeUpList = function () {
  document.querySelector(".city-list").scrollTop -= starGap;
};

const changeDownList = function () {
  document.querySelector(".city-list").scrollTop += starGap;
};

rightBtn.addEventListener(`click`, changeRightList);
lefttBtn.addEventListener(`click`, changeLeftList);
upBtn.addEventListener(`click`, changeUpList);
downBtn.addEventListener(`click`, changeDownList);
