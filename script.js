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

// Daily Goals - Open/Close Functionality
document.addEventListener("DOMContentLoaded", function () {
  // Get all elements
  const allElems = document.querySelectorAll(".elem");
  const allFullElems = document.querySelectorAll(".fullElem");
  const allCloseButtons = document.querySelectorAll(".back");

  // Add click event to all cards
  allElems.forEach((elem, index) => {
    elem.addEventListener("click", function () {
      // Hide all full page elements first
      allFullElems.forEach((fullElem) => {
        fullElem.style.display = "none";
      });

      // Show the corresponding full page element
      if (allFullElems[index]) {
        allFullElems[index].style.display = "block";
      }
    });
  });

  // Add click event to all close buttons
  allCloseButtons.forEach((closeBtn) => {
    closeBtn.addEventListener("click", function () {
      const parentFullElem = this.closest(".fullElem");
      if (parentFullElem) {
        parentFullElem.style.display = "none";
      }
    });
  });

  // Priority button selection for Daily Goals
  document.querySelectorAll(".priority-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      document
        .querySelectorAll(".priority-btn")
        .forEach((b) => b.classList.remove("active"));
      this.classList.add("active");
    });
  });

  // Load goals from localStorage
  loadGoals();

  // Add goal form submission
  const goalForm = document.getElementById("goal-form");
  if (goalForm) {
    goalForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const title = document.getElementById("goal-title").value.trim();
      const description = document
        .getElementById("goal-description")
        .value.trim();
      const category = document.getElementById("goal-category").value;
      const target = document.getElementById("goal-target").value;
      const priority = document.querySelector(".priority-btn.active").dataset
        .priority;

      if (!title) return;

      const newGoal = {
        id: Date.now(),
        title,
        description,
        category,
        target,
        priority,
        completed: false,
        createdAt: new Date().toISOString(),
      };

      dailyGoals.push(newGoal);
      saveGoals();
      renderGoals();
      updateProgress();

      // Reset form
      this.reset();
      document
        .querySelectorAll(".priority-btn")
        .forEach((b) => b.classList.remove("active"));
      document
        .querySelector('.priority-btn[data-priority="medium"]')
        .classList.add("active");
    });
  }
});

// Goals array
let dailyGoals = [];

// Load goals
function loadGoals() {
  const savedGoals = localStorage.getItem("dailyGoals");
  if (savedGoals) {
    dailyGoals = JSON.parse(savedGoals);
    renderGoals();
    updateProgress();
  }
}

// Save goals
function saveGoals() {
  localStorage.setItem("dailyGoals", JSON.stringify(dailyGoals));
}

// Render goals
function renderGoals() {
  const goalsList = document.getElementById("goals-list");
  if (!goalsList) return;

  if (dailyGoals.length === 0) {
    goalsList.innerHTML = `
      <div class="empty-state">
        <i class="ri-flag-line"></i>
        <p>No goals yet. Start by adding your first goal!</p>
      </div>
    `;
    return;
  }

  goalsList.innerHTML = dailyGoals
    .map(
      (goal) => `
    <div class="goal-item ${goal.completed ? "completed" : ""}" data-id="${
        goal.id
      }">
      <div class="goal-item-header">
        <div class="goal-title-section">
          <h4>
            <input type="checkbox" ${
              goal.completed ? "checked" : ""
            } onchange="toggleGoal(${goal.id})">
            <span style="${
              goal.completed ? "text-decoration: line-through;" : ""
            }">${goal.title}</span>
          </h4>
          ${
            goal.category
              ? `<span class="goal-category-badge">${getCategoryIcon(
                  goal.category
                )} ${goal.category}</span>`
              : ""
          }
        </div>
        <div class="goal-actions">
          <button class="goal-action-btn delete-btn" onclick="deleteGoal(${
            goal.id
          })">
            <i class="ri-delete-bin-line"></i>
          </button>
        </div>
      </div>
      ${
        goal.description
          ? `<p class="goal-description">${goal.description}</p>`
          : ""
      }
      <div class="goal-meta">
        <span class="goal-priority ${
          goal.priority
        }">${goal.priority.toUpperCase()}</span>
        ${
          goal.target
            ? `<span class="goal-target">Target: ${goal.target}</span>`
            : ""
        }
      </div>
    </div>
  `
    )
    .join("");
}

// Get category icon
function getCategoryIcon(category) {
  const icons = {
    health: "🏃",
    work: "💼",
    learning: "📚",
    personal: "🎯",
    finance: "💰",
    social: "👥",
    other: "✨",
  };
  return icons[category] || "✨";
}

// Toggle goal
function toggleGoal(id) {
  const goal = dailyGoals.find((g) => g.id === id);
  if (goal) {
    goal.completed = !goal.completed;
    saveGoals();
    renderGoals();
    updateProgress();
  }
}

// Delete goal
function deleteGoal(id) {
  if (confirm("Are you sure you want to delete this goal?")) {
    dailyGoals = dailyGoals.filter((g) => g.id !== id);
    saveGoals();
    renderGoals();
    updateProgress();
  }
}

// Update progress
function updateProgress() {
  const total = dailyGoals.length;
  const completed = dailyGoals.filter((g) => g.completed).length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  const completedCount = document.querySelector(".completed-count");
  const totalCount = document.querySelector(".total-count");
  const progressFill = document.querySelector(".progress-fill");
  const progressPercentage = document.querySelector(".progress-percentage");

  if (completedCount) completedCount.textContent = completed;
  if (totalCount) totalCount.textContent = total;
  if (progressFill) progressFill.style.width = `${percentage}%`;
  if (progressPercentage) progressPercentage.textContent = `${percentage}%`;
}

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
      rootElement.style.setProperty("--pri", "#FFFFFF"); // Primary bg: white
      rootElement.style.setProperty("--sec", "#1E1E1E"); // Secondary text: dark gray
      rootElement.style.setProperty("--tri", "#666666"); // Tertiary: medium gray
      rootElement.style.setProperty("--four", "#E0E0E0"); // Accent: light gray
      flag = 1;
    } else if (flag == 1) {
      rootElement.style.setProperty("--pri", "#121212"); // Primary bg: dark
      rootElement.style.setProperty("--sec", "#E8E8E8"); // Secondary text: light gray
      rootElement.style.setProperty("--tri", "#BBBBBB"); // Tertiary: medium light
      rootElement.style.setProperty("--four", "#333333"); // Accent: darker gray
      flag = 2;
    } else if (flag == 2) {
      rootElement.style.setProperty("--pri", "#F5F5F5"); // Primary bg: off-white
      rootElement.style.setProperty("--sec", "#2D2D2D"); // Secondary text: dark muted
      rootElement.style.setProperty("--tri", "#A0A0A0"); // Tertiary: neutral gray
      rootElement.style.setProperty("--four", "#D0D0D0"); // Accent: medium gray
      flag = 0;
    }
  });
}

changeTheme();
