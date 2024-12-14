import { loadHeaderFooter } from "./utils.mjs";
import EventManager from "./_eventManager.js";
import TaskManager from "./_taskManager.js";
import CalendarModule from "./_calendar.js";

const eventForm = document.getElementById("eventForm");
const eventName = document.getElementById("eventName");
const eventDate = document.getElementById("eventDate");
const eventLocation = document.getElementById("eventLocation");
const eventList = document.getElementById("eventList");
const taskForm = document.getElementById("taskForm");
const taskName = document.getElementById("taskName");
const taskPriority = document.getElementById("taskPriority");
const teamMember = document.getElementById("teamMember")
const taskEventId = document.getElementById("taskEventId");
const taskList = document.getElementById("taskList");
const taskManager = new TaskManager();
const eventManager = new EventManager();
const storedEvents = JSON.parse(localStorage.getItem("events")) || [];
const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
const calendarModule = new CalendarModule(storedEvents, storedTasks);
const eventSearchBar = document.querySelector("#eventSearchBar");
const taskSearchBar = document.querySelector("#taskSearchBar");

document.addEventListener("DOMContentLoaded", () => {
  const calendarElement = document.getElementById("calendar");
  calendarModule.initCalendar(calendarElement);
});

function renderTasks() {
  taskList.innerHTML = "";
  const tasks = taskManager.getAllTasks();

  tasks.forEach((task) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${task.name}</strong> - Priority: ${task.priority}, Task ID: ${task.eventId}, <strong>Assigned to:</strong> ${task.member} ${
        task.completed ? "(Completed)" : ""
      }
      <button class="toggle" data-id="${task.id}">${task.completed ? "Undo" : "Complete"}</button>
      <button class="edit" data-id="${task.id}">Edit</button>
      <button class="delete" data-id="${task.id}">Delete</button>
    `;
    taskList.appendChild(li);
  });
}

taskForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = taskName.value;
  const member = teamMember.value;
  const priority = taskPriority.value;
  const eventId = taskEventId.value;

  taskManager.addTask(name, member, priority, eventId);
  renderTasks();

  taskForm.reset();
});

taskList.addEventListener("click", (e) => {
  const id = parseInt(e.target.dataset.id);

  if (e.target.classList.contains("toggle")) {
    taskManager.toggleTaskCompletion(id);
    renderTasks();
  }

  if (e.target.classList.contains("edit")) {
    const task = taskManager.getAllTasks().find((task) => task.id === id);
    if (task) {
      taskName.value = task.name;
      teamMember.value = task.member;
      taskPriority.value = task.priority;
      taskEventId.value = task.eventId;

      taskForm.onsubmit = (event) => {
        event.preventDefault();
        taskManager.editTask(id, {
          name: taskName.value,
          member: teamMember.value,
          priority: taskPriority.value,
          eventId: taskEventId.value,
        });
        renderTasks();
        taskForm.reset();
        taskForm.onsubmit = null;
      };
    }
  }

  if (e.target.classList.contains("delete")) {
    taskManager.deleteTask(id);
    renderTasks();
  }
});

function renderEvents() {
  eventList.innerHTML = "";
  const events = eventManager.getAllEvents();

  events.forEach((event) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${event.name}</strong> - ${event.date} @ ${event.location}
      <button class="edit" data-id="${event.id}">Edit</button>
      <button class="delete" data-id="${event.id}">Delete</button>
    `;
    eventList.appendChild(li);
  });
}

eventForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = eventName.value;
  const date = eventDate.value;
  const location = eventLocation.value;

  eventManager.addEvent(name, date, location);
  renderEvents();

  eventForm.reset();
});

eventList.addEventListener("click", (e) => {
  const id = parseInt(e.target.dataset.id);

  if (e.target.classList.contains("edit")) {
    const event = eventManager.getAllEvents().find((event) => event.id === id);
    if (event) {
      eventName.value = event.name;
      eventDate.value = event.date;
      eventLocation.value = event.location;

      eventForm.onsubmit = (event) => {
        event.preventDefault();
        eventManager.editEvent(id, {
          name: eventName.value,
          date: eventDate.value,
          location: eventLocation.value,
        });
        renderEvents();
        eventForm.reset();
        eventForm.onsubmit = null;
      };
    }
  }

  if (e.target.classList.contains("delete")) {
    eventManager.deleteEvent(id);
    renderEvents();
  }
});

eventSearchBar.addEventListener("input", (e) => {
  const searchEvent = e.target.value.toLowerCase();
  const events = eventManager.getAllEvents();
  const filteredEvents = events.filter((event) =>
    event.name.toLowerCase().includes(searchEvent),
  );
  eventList.innerHTML = "";
  filteredEvents.forEach((event) => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${event.name}</strong> - ${event.date} - ${event.location}`;
    li.dataset.id = event.id;
    eventList.appendChild(li);
  });
});

taskSearchBar.addEventListener("input", (e) => {
  const searchTask = e.target.value.toLowerCase();
  const tasks = taskManager.getAllTasks();
  const filteredTasks = tasks.filter((task) =>
    task.name.toLowerCase().includes(searchTask),
  );
  taskList.innerHTML = "";
  filteredTasks.forEach((task) => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${task.name}</strong> - Priority: ${task.priority} (Event ID: ${task.eventId})`;
    li.dataset.id = task.id;
    taskList.appendChild(li);
  });
});

renderEvents();
renderTasks();
loadHeaderFooter();
