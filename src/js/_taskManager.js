class TaskManager {
  constructor() {
    this.tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  }

  saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(this.tasks));
  }

  addTask(name, member, priority, eventId) {
    const newTask = {
      id: Date.now(),
      name,
      member,
      priority,
      eventId,
      completed: false,
    };
    this.tasks.push(newTask);
    this.saveTasks();
  }

  editTask(id, updatedDetails) {
    const taskIndex = this.tasks.findIndex((task) => task.id === id);
    if (taskIndex > -1) {
      this.tasks[taskIndex] = { ...this.tasks[taskIndex], ...updatedDetails };
      this.saveTasks();
    }
  }

  deleteTask(id) {
    this.tasks = this.tasks.filter((task) => task.id !== id);
    this.saveTasks();
  }

  toggleTaskCompletion(id) {
    const task = this.tasks.find((task) => task.id === id);
    if (task) {
      task.completed = !task.completed;
      this.saveTasks();
    }
  }

  getTasksByEvent(eventId) {
    return this.tasks.filter((task) => task.eventId === eventId);
  }

  getAllTasks() {
    return this.tasks;
  }
}

export default TaskManager;
