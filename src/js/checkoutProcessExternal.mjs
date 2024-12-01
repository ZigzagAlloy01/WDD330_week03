import { getLocalStorage } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";

export default class CheckoutProcess {
  constructor(cartKey, outputSelector) {
    this.cartKey = cartKey;
    this.outputSelector = outputSelector;
    this.externalServices = new ExternalServices("https://wdd330-backend.onrender.com");
  }

  // Convert cart items into the required format for the checkout process
  packageItems(items) {
    return items.map(item => ({
      id: item.id,
      name: item.name,
      price: item.FinalPrice,
      quantity: item.Quantity,
    }));
  }

  // Handle checkout process
  async checkout(form) {
    const formData = this.formDataToJSON(form); // Convert form data to JSON
    const items = this.packageItems(getLocalStorage(this.cartKey)); // Package cart items
    const orderTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Build order object
    const order = {
      ...formData,
      orderDate: new Date().toISOString(),
      items,
      orderTotal: orderTotal.toFixed(2),
      shipping: 12, // Example shipping cost
      tax: (orderTotal * 0.08).toFixed(2), // Example tax rate (8%)
    };

    // Submit order via ExternalServices
    const response = await this.externalServices.checkout(order);
    console.log("Order Response:", response);
    if (response) alert("Order submitted successfully!");
  }

  // Convert form data into JSON
  formDataToJSON(formElement) {
    const formData = new FormData(formElement);
    const convertedJSON = {};
    formData.forEach((value, key) => {
      convertedJSON[key] = value;
    });
    return convertedJSON;
  }
}
