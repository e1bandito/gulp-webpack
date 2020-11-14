let burger = function (button, nav) {
  let burgerBtn = document.querySelector(button);
  let navigation = document.querySelector(nav);
  let body = document.querySelector("body");

  if (burgerBtn) {
    burgerBtn.addEventListener("click", function () {
      body.classList.toggle("body-lock");
      burgerBtn.classList.add("burger__anim");
      burgerBtn.classList.toggle("burger__anim--open");

      if (!navigation.classList.contains("nav--anim")) {
        navigation.classList.add("nav--anim");
      }
      navigation.classList.toggle("nav--open");
    });
  }
};

export default burger;
