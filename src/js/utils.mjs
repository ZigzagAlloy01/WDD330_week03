// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}
// or a more concise version if you are into that sort of thing:
// export const qs = (selector, parent = document) => parent.querySelector(selector);

// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}
// save data to local storage
export function setLocalStorage(key, data) {
  if (!Array.isArray(data)) {
    data = [data]; // Wrap the single item in an array
  }
  localStorage.setItem(key, JSON.stringify(data));
}
// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}
// get item details
export function getParams(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const product = urlParams.get(param)
  return product
}

// generates content with HTML template 
export function renderListWithTemplate(template, parentElement, list, position="afterbegin", clear=false) {
  if (clear) {
    parentElement.insertAdjacentHTML(position, ``); 
  } else {
    const html = list.map(template);
    parentElement.insertAdjacentHTML(position, html.join(""));
  }
}

export function renderWithTemplate(template, parentElement, data, position="afterbegin", clear=false) {
  parentElement.insertAdjacentHTML(position, template);
  if(callback) {
    callback(data);
  }
}

export async function convertToText(response) {
  if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.text();
}

export async function loadTemplate(path) {
  const html = await fetch(path).then(convertToText);
  const template = document.createElement('template');
  template.innerHTML = html;
  return template;
}

export async function loadHeaderFooter() {
  const headerTemplate = await loadTemplate('/partials/header.html');
  const footerTemplate = await loadTemplate('/partials/footer.html');
  
  // Obtener los elementos del DOM
  const headerElement = document.getElementById('main-header');
  const footerElement = document.getElementById('main-footer');
  
  // Insertar el contenido de las plantillas en los elementos correspondientes
  headerElement.innerHTML = headerTemplate.innerHTML;
  footerElement.innerHTML = footerTemplate.innerHTML;
}

// change the value of an element based on a LocalStorage variable
export function changeValueFromKeyList(element, key) {
  if (!element) {
    console.error("Provided element is null.");
    return;
  }
  const data = getLocalStorage(key);
  element.textContent = data ? data.length : "";
}