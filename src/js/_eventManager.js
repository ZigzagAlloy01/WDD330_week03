class EventManager {
  constructor() {
    this.events = JSON.parse(localStorage.getItem("events")) || [];
  }

  saveEvents() {
    localStorage.setItem("events", JSON.stringify(this.events));
  }

  addEvent(name, date, location) {
    const newEvent = {
      id: Date.now(),
      name,
      date,
      location,
    };
    this.events.push(newEvent);
    this.saveEvents();
  }

  editEvent(id, updatedDetails) {
    const eventIndex = this.events.findIndex((event) => event.id === id);
    if (eventIndex > -1) {
      this.events[eventIndex] = {
        ...this.events[eventIndex],
        ...updatedDetails,
      };
      this.saveEvents();
    }
  }

  deleteEvent(id) {
    this.events = this.events.filter((event) => event.id !== id);
    this.saveEvents();
  }

  getAllEvents() {
    return this.events;
  }
}

export default EventManager;
