// CheckoutProcess.js
import { getLocalStorage } from "./utils.mjs";

export default class CheckoutProcess {
  constructor(cartKey, outputSelector) {
    this.cartKey = cartKey; // Key to fetch cart items from localStorage
    this.outputSelector = outputSelector; // Selector for displaying totals
    this.list = [];
    this.itemTotal = 0;
    this.shipping = 0;
    this.tax = 0;
    this.orderTotal = 0;
    this.taxRate = 0.06; // 6% sales tax
    this.baseShipping = 10; // Base shipping cost
    this.additionalItemShipping = 2; // Shipping cost for additional items
  }

  // Initialize the checkout process
  init() {
    try {
      const storedData = getLocalStorage(this.cartKey);
      if (!storedData) {
        console.warn(`No data found for key: ${this.cartKey}`);
        this.displayEmptyCartMessage();
        return;
      }
      this.list = Array.isArray(storedData) ? storedData : [];
      if (this.list.length > 0) {
        this.calculateItemSummary();
      } else {
        this.displayEmptyCartMessage();
      }
    } catch (error) {
      console.error("Error initializing CheckoutProcess:", error);
      this.displayEmptyCartMessage();
    }
  }

  // Calculate and display item subtotal
  calculateItemSummary() {
    if (!this.list || this.list.length === 0) {
      console.warn("Cart is empty. Cannot calculate summary.");
      return;
    }

    // Calculate subtotal
    this.itemTotal = this.list.reduce(
      (total, item) => total + item.FinalPrice * item.Quantity,
      0
    );

    // Display item subtotal
    this.updateSummarySection("subtotal", `$${this.itemTotal.toFixed(2)}`);
  }

  // Calculate and display order total (shipping, tax, and total)
  calculateOrderTotal(zipCode) {
    if (!zipCode || zipCode.trim() === "") {
      alert("Please enter a valid zip code to calculate shipping and tax.");
      return;
    }

    if (this.list.length === 0) {
      console.warn("Cart is empty. Cannot calculate totals.");
      this.displayEmptyCartMessage();
      return;
    }

    // Calculate shipping: $10 for the first item, $2 for each additional item
    const totalItems = this.list.reduce((sum, item) => sum + item.Quantity, 0);
    this.shipping =
      this.baseShipping +
      Math.max(0, (totalItems - 1) * this.additionalItemShipping);

    // Calculate tax: 6% of the item total
    this.tax = parseFloat((this.itemTotal * this.taxRate).toFixed(2));

    // Calculate the total order cost
    this.orderTotal = this.itemTotal + this.shipping + this.tax;

    // Display the results
    this.displayOrderTotals();
  }

  // Display order totals in the summary section
  displayOrderTotals() {
    this.updateSummarySection("shipping", `$${this.shipping.toFixed(2)}`);
    this.updateSummarySection("tax", `$${this.tax.toFixed(2)}`);
    this.updateSummarySection("total", `$${this.orderTotal.toFixed(2)}`);
  }

  // Display a message when the cart is empty
  displayEmptyCartMessage() {
    const summaryElement = document.querySelector(this.outputSelector);
    if (summaryElement) {
      summaryElement.innerHTML = "<p>Your cart is empty.</p>";
    } else {
      console.error(
        `Output selector (${this.outputSelector}) does not match any element.`
      );
    }
  }

  // Update specific section in the summary
  updateSummarySection(key, value) {
    const element = document.querySelector(`#${key}`);
    if (element) {
      element.textContent = value;
    } else {
      console.error(`Element with ID ${key} not found in the DOM.`);
    }
  }
}
