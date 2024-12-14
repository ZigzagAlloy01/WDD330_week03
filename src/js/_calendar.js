import { Calendar } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

export default class CalendarModule {
  constructor(events = [], tasks = []) {
    this.events = events;
    this.tasks = tasks;
    this.calendar = null;
  }

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

  mergeEventsAndTasks() {
    return [
      ...this.events.map((event) => ({
        title: `Event: ${event.name}`,
        start: event.date,
        color: "#007BFF",
      })),
      ...this.tasks.map((task) => ({
        title: `Task: ${task.name}`,
        start: task.dueDate,
        color: "#28A745",
      })),
    ];
  }

  handleDateClick(info) {
    const name = prompt("Enter the name of the event or task:");
    if (name) {
      const newEvent = { name, date: info.dateStr };
      this.events.push(newEvent);
      localStorage.setItem("events", JSON.stringify(this.events));
      this.calendar.addEvent({ title: name, start: info.dateStr });
    }
  }

  handleEventClick(info) {
    if (confirm(`Do you want to remove "${info.event.title}"?`)) {
      info.event.remove();
    }
  }
}
