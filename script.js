function goBack() {
  let allElems = document.querySelectorAll(".elem");
  let fullElemPage = document.querySelectorAll(".fullElem");
  let fullElemPageBackBtn = document.querySelectorAll(".fullElem .back");

  allElems.forEach(function (elem) {
    elem.addEventListener("click", function () {
      fullElemPage[elem.id].style.display = "block";
    });
  });

  fullElemPageBackBtn.forEach(function (back) {
    back.addEventListener("click", function () {
      fullElemPage[back.id].style.display = "none";
    });
  });
}
goBack();

function todoList() {
  let currentTask = [];

  if (localStorage.getItem("currentTask")) {
    currentTask = JSON.parse(localStorage.getItem("currentTask"));
  }

  function renderTask() {
    let allTask = document.querySelector(".allTask");
    let sum = "";

    currentTask.forEach(function (elem, idx) {
      sum += `
        <div class="task">
          <h5>${elem.task} <span class=${elem.important}>imp</span></h5>
          <button id=${idx}>Mark as Completed</button>
        </div>
      `;
    });

    // ✅ pehle HTML render
    allTask.innerHTML = sum;

    // ✅ fir localStorage update
    localStorage.setItem("currentTask", JSON.stringify(currentTask));

    // ✅ fir button events
    document.querySelectorAll(".task button").forEach(function (btn) {
      btn.addEventListener("click", function () {
        currentTask.splice(btn.id, 1);
        renderTask();
      });
    });
  }

  renderTask();

  let form = document.querySelector(".addTask form");
  let taskInput = document.querySelector(".addTask form #task-inp");
  let taskDetailsInput = document.querySelector(".addTask form textarea");
  let taskCheckbox = document.querySelector(".addTask form #check");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    currentTask.push({
      task: taskInput.value,
      details: taskDetailsInput.value,
      important: taskCheckbox.checked,
    });

    renderTask();

    taskCheckbox.checked = false;
    taskInput.value = "";
    taskDetailsInput.value = "";
  });
}
todoList();

function dailyPlanner() {
  let dayPlanner = document.querySelector(".day-planner");
  let dayPlanData = JSON.parse(localStorage.getItem("dayPlanData")) || {};

  let hours = Array.from({ length: 18 }, function (elem, idx) {
    return `${6 + idx}:00 - ${7 + idx}:00`;
  });

  wholedaySum = "";
  hours.forEach(function (elem, idx) {
    let saveData = dayPlanData[idx] || "";
    wholedaySum =
      wholedaySum +
      `  <div class="day-planner-time">
  <p>${elem}</p>
  <input id="${idx}" type="text" placeholder="..." value="${saveData}" />
  </div>`;
  });
  dayPlanner.innerHTML = wholedaySum;

  let dayPlannerInput = document.querySelectorAll(".day-planner input");
  dayPlannerInput.forEach(function (elem) {
    elem.addEventListener("input", function () {
      dayPlanData[elem.id] = elem.value;
      localStorage.setItem("dayPlanData", JSON.stringify(dayPlanData));
    });
  });
}
dailyPlanner();

function motivationalQuote() {
  let motivationAuthor = document.querySelector(".motivation-1 h3");
  let motivationQuoteContent = document.querySelector(".motivation-1 h2");

  async function quote() {
    let raw = await fetch(
      "https://motivational-spark-api.vercel.app/api/quotes/random"
    );
    let data = await raw.json();

    motivationAuthor.innerHTML = data.author;
    motivationQuoteContent.innerHTML = data.quote;
  }
  quote();
}
motivationalQuote();

function pomodoroTimer() {
  let timer = document.querySelector(".pomo-timer h1");
  let startBtn = document.querySelector(".pomo-timer .start-timer");
  let pauseBtn = document.querySelector(".pomo-timer .pause-timer");
  let resetBtn = document.querySelector(".pomo-timer .reset-timer");
  let session = document.querySelector(".pomodoro-fullpage .session");

  let totalSeconds = 25 * 60;
  let timerInterval = null;
  function updateTimer() {
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = totalSeconds % 60;

    timer.innerHTML = `${String(minutes).padStart(2, "0")}:${String(
      seconds
    ).padStart("2", "0")}`;
  }

  function startTimer() {
    if (timerInterval) return;
    timerInterval = setInterval(function () {
      if (totalSeconds > 0) {
        totalSeconds--;
        updateTimer();
      } else {
        clearInterval(timerInterval);
        timerInterval = null;
      }
    }, 1000);
  }

  function pauseTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
  }

  function resetTimer() {
    totalSeconds = 25 * 60;
    clearInterval(timerInterval);
    timerInterval = null;
    updateTimer();
  }

  startBtn.addEventListener("click", startTimer);
  pauseBtn.addEventListener("click", pauseTimer);
  resetBtn.addEventListener("click", resetTimer);
}
pomodoroTimer();

document.addEventListener("DOMContentLoaded", function () {
  let temp = document.querySelector("header .header2 h2");
  let location = document.querySelector("header .header1 h4");
  let condition = document.querySelector("header .header2 h4");
  let icon = document.querySelector(".weather-circle");
  let heatindex = document.querySelector(".heatindex");
  let humidity = document.querySelector(".humidity");
  let wind = document.querySelector(".wind");
  let dateElement = document.querySelector("header .header1 h2");
  let timeElement = document.querySelector("header .header1 h1");
  let apiKey = "ec9d609340f74ffd902110819251302";
  let city = "Bhopal";

  async function weatherAPICall() {
    try {
      let response = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`
      );
      let data = await response.json();

      // Update weather information in the dashboard
      temp.innerHTML = `${Math.floor(data.current.temp_c)}°C`;
      location.innerHTML = `${data.location.name} (${data.location.region})`;
      condition.innerHTML = `${data.current.condition.text}`;
      icon.innerHTML = `<img src="${data.current.condition.icon}">`;

      // Update weather details
      heatindex.innerHTML = `Heat Index: ${Math.floor(
        data.current.heatindex_c
      )}°C`;
      humidity.innerHTML = `Humidity: ${data.current.humidity}%`;
      wind.innerHTML = `Wind: ${data.current.wind_kph} km/h`;

      // Update date and time from API
      updateDateTime(data.location.localtime);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      condition.innerHTML = "Unable to fetch weather";
    }
  }

  // Function to update date and time
  function updateDateTime() {
    const date = new Date();

    // Date: 10 Jan 2026
    const options = { day: "numeric", month: "long", year: "numeric" };
    const formattedDate = date.toLocaleDateString("en-GB", options);

    // Time: Saturday, 12:24:05 PM
    const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
    const time = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });

    dateElement.innerHTML = formattedDate;
    timeElement.innerHTML = `${dayName}, ${time}`;
  }
  updateDateTime();
  setInterval(updateDateTime, 1000);

  weatherAPICall();
});

function changeTheme() {
  let theme = document.querySelector(".theme");
  let rootElement = document.documentElement;
  let flag = 0;

  theme.addEventListener("click", function () {
    if (flag == 0) {
      rootElement.style.setProperty("--pri", "#F8F4E1");
      rootElement.style.setProperty("--sec", "#222831");
      rootElement.style.setProperty("--tri", "#948979");
      rootElement.style.setProperty("--four", "#393E46");
      flag = 1;
    } else if (flag == 1) {
      rootElement.style.setProperty("--pri", "#F1EFEC");
      rootElement.style.setProperty("--sec", "#030303");
      rootElement.style.setProperty("--tri", "#D4C9BE");
      rootElement.style.setProperty("--four", "#123458");
      flag = 2;
    } else if (flag == 2) {
      rootElement.style.setProperty("--pri", "#F8F4E1");
      rootElement.style.setProperty("--sec", "#A8DF8E");
      rootElement.style.setProperty("--tri", "#F0FFDF");
      rootElement.style.setProperty("--four", "#FFD8DF");
      flag = 0;
    }
  });
}

changeTheme();
