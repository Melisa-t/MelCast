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
