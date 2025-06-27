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

const rightBtn = document.querySelector(`.btn--right`);
const lefttBtn = document.querySelector(`.btn--left`);

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
rightBtn.addEventListener(`click`, changeRightList);
lefttBtn.addEventListener(`click`, changeLeftList);
