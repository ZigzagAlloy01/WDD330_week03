class TaskManager {
    constructor() {
      // Load tasks from LocalStorage or initialize an empty array
      this.tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    }
  
    saveTasks() {
      // Save tasks to LocalStorage
      localStorage.setItem("tasks", JSON.stringify(this.tasks));
    }
  
    addTask(name, priority, eventId) {
      const newTask = {
        id: Date.now(), // Unique task ID
        name,
        priority,
        eventId, // Link to an event
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
      // Filter tasks linked to a specific event
      return this.tasks.filter((task) => task.eventId === eventId);
    }
  
    getAllTasks() {
      return this.tasks;
    }
  }
  
  export default TaskManager;
  