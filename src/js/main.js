import ProductData from "./ProductData.mjs";
import ProductListing from "./ProductList.mjs";
import { changeValueFromKeyList } from "./utils.mjs";
import { loadHeaderFooter } from "./utils.mjs";
import EventManager from "./_eventManager.js";

// Initialize the EventManager
const eventManager = new EventManager();

// DOM Elements
const eventForm = document.getElementById("eventForm");
const eventName = document.getElementById("eventName");
const eventDate = document.getElementById("eventDate");
const eventLocation = document.getElementById("eventLocation");
const eventList = document.getElementById("eventList");
const category = "tents";
const dataSource = new ProductData(category);
const element = document.querySelector(".product-list");

const listElement = document.querySelector(".product-list");
const productList = new ProductListing("tents", dataSource, listElement);
/*const cartIconNotification = document.querySelector(".item-count");*/

// create an instance of your ProductListing class
const products = new ProductListing(category, dataSource, element);
const searchBar = document.getElementById("searchBar");

// Function to render events
function renderEvents() {
  eventList.innerHTML = ""; // Clear existing list
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

// Handle form submission
eventForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = eventName.value;
  const date = eventDate.value;
  const location = eventLocation.value;

  eventManager.addEvent(name, date, location);
  renderEvents();

  // Reset form
  eventForm.reset();
});

// Handle event list actions (edit/delete)
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
        eventForm.onsubmit = null; // Reset behavior
      };
    }
  }

  if (e.target.classList.contains("delete")) {
    eventManager.deleteEvent(id);
    renderEvents();
  }
});

searchBar.addEventListener("input", () => {
  const searchTerm = searchBar.value.toLowerCase();
  const productItems = document.querySelectorAll(".product-card");

  productItems.forEach((item) => {
    const productName = item
      .querySelector(".card__name")
      .textContent.toLowerCase();
    if (productName.includes(searchTerm)) {
      item.style.display = "block";
    } else {
      item.style.display = "none";
    }
  });
});


// Initial render
renderEvents();

products.init();

/*changeValueFromKeyList(cartIconNotification, "so-cart");*/
loadHeaderFooter();