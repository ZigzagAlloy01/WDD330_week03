import { Calendar } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

export default class CalendarModule {
  constructor(events = [], tasks = []) {
    this.events = events;
    this.tasks = tasks;
    this.calendar = null;
  }

  // Method to initialize the calendar
  initCalendar(calendarElement) {
    this.calendar = new Calendar(calendarElement, {
      plugins: [dayGridPlugin, interactionPlugin],
      initialView: "dayGridMonth",
      headerToolbar: {
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,dayGridWeek,dayGridDay",
      },
      editable: true,
      selectable: true,
      events: this.mergeEventsAndTasks(),
      dateClick: (info) => this.handleDateClick(info),
      eventClick: (info) => this.handleEventClick(info),
    });

    this.calendar.render();
  }

  // Merge tasks and events into a single list for the calendar
  mergeEventsAndTasks() {
    return [
      ...this.events.map((event) => ({
        title: `Event: ${event.name}`,
        start: event.date,
        color: "#007BFF", // Blue for events
      })),
      ...this.tasks.map((task) => ({
        title: `Task: ${task.name}`,
        start: task.dueDate,
        color: "#28A745", // Green for tasks
      })),
    ];
  }

  // Handle date click to schedule a new task/event
  handleDateClick(info) {
    const name = prompt("Enter the name of the event or task:");
    if (name) {
      const newEvent = { name, date: info.dateStr };
      this.events.push(newEvent); // Add to events list (can also add to tasks)
      localStorage.setItem("events", JSON.stringify(this.events));
      this.calendar.addEvent({ title: name, start: info.dateStr });
    }
  }

  // Handle event click to delete or edit
  handleEventClick(info) {
    if (confirm(`Do you want to remove "${info.event.title}"?`)) {
      info.event.remove();
    }
  }
}
