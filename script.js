// import { API_KEY } from "./config.js";

document.addEventListener("DOMContentLoaded", async () => {
  // ✅ API FETCH
  // const weatherData = await fetch(
  //   `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=sofia&days=3`
  // );
  // const data = await weatherData.json();
  // console.log(data);

  // ✅ NIGHT MODE
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
});
