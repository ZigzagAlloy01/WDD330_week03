export function qs(selector, parent = document) {
  return parent.querySelector(selector)
}

export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key))
}

export function setLocalStorage(key, data) {
  if (!Array.isArray(data)) {
    data = [data]
  }
  localStorage.setItem(key, JSON.stringify(data))
}

export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault()
    callback()
  })
  qs(selector).addEventListener("click", callback)
}

export function getParams(param) {
  const queryString = window.location.search
  const urlParams = new URLSearchParams(queryString)
  const product = urlParams.get(param)
  return product
}

export function renderListWithTemplate(template, parentElement, list, position="afterbegin", clear=false) {
  if (clear) {
    parentElement.insertAdjacentHTML(position, ``) 
  } else {
    const html = list.map(template)
    parentElement.insertAdjacentHTML(position, html.join(""))
  }
}

export function renderWithTemplate(template, parentElement, data, position="afterbegin", clear=false) {
  parentElement.insertAdjacentHTML(position, template)
  if(callback) {
    callback(data)
  }
}

export async function convertToText(response) {
  if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
  }
  return response.text()
}

export async function loadTemplate(path) {
  const html = await fetch(path).then(convertToText)
  const template = document.createElement('template')
  template.innerHTML = html
  return template
}

export async function loadHeaderFooter() {
  const headerTemplate = await loadTemplate('/partials/header.html')
  const footerTemplate = await loadTemplate('/partials/footer.html')
  const headerElement = document.getElementById('main-header')
  const footerElement = document.getElementById('main-footer')
  
  headerElement.innerHTML = headerTemplate.innerHTML
  footerElement.innerHTML = footerTemplate.innerHTML
}

export function changeValueFromKeyList(element, key) {
  if (!element) {
    console.error("Provided element is null.")
    return
  }
  const data = getLocalStorage(key)
  element.textContent = data ? data.length : ""
}