import { loadHeaderFooter } from "./utils.mjs"
import CheckoutProcess from "./checkoutProcess.mjs"
// Load header and footer
loadHeaderFooter()

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM fully loaded and parsed")

    // DOM Elements
    const checkoutForm = document.getElementById("checkoutForm")
    const checkoutButton = document.getElementById("checkoutButton")
    const subtotalEl = document.getElementById("subtotal")
    const shippingEl = document.getElementById("shipping")
    const taxEl = document.getElementById("tax")
    const orderTotalEl = document.getElementById("orderTotal")
    const calculateTotalsButton = document.getElementById("calculateTotals")
    const zipCodeInput = document.getElementById("zipCode")
  
    // Initialize CheckoutProcess
    const checkout = new CheckoutProcess("so-cart", ".order-summary")
    checkout.init()
  
    // Log the item total to verify it
    console.log(`Item Total: $${checkout.itemTotal.toFixed(2)}`)
  
    // Calculate totals
    const calculateTotals = () => {
      const subtotal = checkout.itemTotal // Use itemTotal from CheckoutProcess
      const shipping = 10.0 // Example shipping cost
      const taxRate = 0.08 // Example tax rate (8%)
      const tax = parseFloat((subtotal * taxRate).toFixed(2))
      const orderTotal = subtotal + shipping + tax
  
      // Update DOM
      if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`
      if (shippingEl) shippingEl.textContent = `$${shipping.toFixed(2)}`
      if (taxEl) taxEl.textContent = `$${tax.toFixed(2)}`
      if (orderTotalEl) orderTotalEl.textContent = `$${orderTotal.toFixed(2)}`
    }
  
    if (calculateTotalsButton && zipCodeInput) {
      calculateTotalsButton.addEventListener("click", () => {
        const zipCode = zipCodeInput.value.trim()
        if (!zipCode) {
          alert("Please enter a valid zip code.")
          return
        }
        checkout.calculateOrderTotal(zipCode)
      })
    } else {
      console.error("Required elements for calculating totals are missing.")
    }
  
    // Handle form submission
    if (checkoutForm) {
      checkoutForm.addEventListener("submit", (event) => {
        event.preventDefault()
  
        // Validate form data
        const formData = new FormData(checkoutForm)
        let isValid = true
  
        for (const value of formData.values()) {
          if (!value.trim()) {
            isValid = false
            alert("All fields are required.")
            break
          }
        }
  
        if (isValid) {
          alert("Order successfully placed!")
          // Send data to server (mocked here)
          console.log("Form Data:", Object.fromEntries(formData))
        }
      })
    } else {
      console.error("Checkout form not found.")
    }
  
    // Calculate initial totals
    calculateTotals()
  })
