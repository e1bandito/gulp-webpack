function Timer(selector, obj) {
  let that = this;
  let timer;
  let start = false;
  let timerContainer = document.querySelector(selector);

  if (obj.days < 0 || obj.days === 0) {
    obj.days = "0";
  }

  if (obj.hours < 0 || obj.hours > 24) {
    obj.hours = "24";
  }

  if (obj.hours === 0) {
    obj.hours = "00";
  }

  if (obj.minutes < 0 || obj.minutes > 60 || obj.minutes === 0) {
    obj.minutes = "00";
  }

  if (obj.seconds < 0 || obj.seconds > 60 || obj.seconds === 0) {
    obj.seconds = "00";
  }

  const timerHtml = `
    <ul class="timer__list">
      <li class="timer__item">
        <p class="timer__num timer__num--days">${obj.days}</p>
        <p class="timer__text">дни</p>
      </li>
      <li class="timer__item">
        <p class="timer__num timer__num--hours">${obj.hours}</p>
        <p class="timer__text">часы</p>
      </li>
      <li class="timer__item">
        <p class="timer__num timer__num--minutes">${obj.minutes}</p>
        <p class="timer__text">минуты</p>
      </li>
      <li class="timer__item">
        <p class="timer__num timer__num--seconds">${obj.seconds}</p>
        <p class="timer__text">секунды</p>
      </li>
    </ul>`;

  timerContainer.innerHTML = timerHtml;

  let timerDays = document.querySelector(`${selector} .timer__num--days`);
  let timerHours = document.querySelector(`${selector} .timer__num--hours`);
  let timerMinutes = document.querySelector(`${selector} .timer__num--minutes`);
  let timerSeconds = document.querySelector(`${selector} .timer__num--seconds`);

  function getDays() {
    let days = obj.days;
    days--;
    timerDays.innerHTML = days;
    obj.days = days;
  }

  function getHours() {
    let hours = obj.hours;
    if (hours > 24) {
      hours = 24;
    }
    if (hours === "00") {
      hours = 24;
      getDays();
    }
    hours--;
    if (hours < 10) {
      hours = "0" + hours;
    }
    timerHours.innerHTML = hours;
    obj.hours = hours;
  }

  function getMin() {
    let min = obj.minutes;
    if (min === "00") {
      min = 60;
      getHours();
    }
    min--;
    if (min < 10) {
      min = "0" + min;
    }
    timerMinutes.innerHTML = min;
    obj.minutes = min;
  }

  function getSec() {
    let sec = obj.seconds;
    if (
      obj.days === "0" &&
      obj.hours === "00" &&
      obj.minutes === "00" &&
      obj.seconds === "00"
    ) {
      that.stop();
      return;
    }
    if (sec === "00") {
      sec = 60;
      getMin();
    }
    sec--;
    if (sec < 10) {
      sec = "0" + sec;
    }
    timerSeconds.innerHTML = sec;
    obj.seconds = sec;
  }

  that.stop = function () {
    clearInterval(timer);
    start = false;
  };

  that.start = function () {
    if (!start) {
      timer = setInterval(function () {
        getSec();
        start = true;
      }, 1000);
    }
  };

  that.start();
}

export default Timer;
