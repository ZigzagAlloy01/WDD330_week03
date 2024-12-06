import {
  getLocalStorage,
  setLocalStorage,
  changeValueFromKeyList,
  loadHeaderFooter,
} from "./utils.mjs";

const cartIconNotification = document.querySelector(".item-count");
// Example coupon codes and their discounts
document.addEventListener("DOMContentLoaded", function () {
  // Example coupon codes and their discounts
  const couponCodes = {
    SAVE10: 0.1, // 10% off
    SAVE20: 0.2, // 20% off
  };

  const applyCouponButton = document.getElementById("apply-coupon-btn");
  applyCouponButton.addEventListener("click", applyCoupon);

  function applyCoupon() {
    const couponCode = document.getElementById("coupon-code").value.trim();
    const cartTotalElement = document.querySelector(".cart-total");
    const discountMessage = document.getElementById("discount-message");

    // Get the current cart total as a number
    let cartTotal = parseFloat(
      cartTotalElement.innerText.replace(/[^0-9.-]+/g, ""),
    ); // Ensure the value is a number

    if (isNaN(cartTotal)) {
      // If the cart total is not a valid number, log an error and return
      console.error("Invalid cart total:", cartTotal);
      return;
    }

    // Check if the coupon code is valid
    if (couponCodes[couponCode]) {
      // Calculate discount
      const discountPercentage = couponCodes[couponCode];
      const discountAmount = cartTotal * discountPercentage;

      // Update the cart total with the discount
      cartTotal -= discountAmount;

      // Update the displayed total
      cartTotalElement.innerText = cartTotal.toFixed(2);

      // Display success message
      discountMessage.innerText = `Coupon applied! You saved $${discountAmount.toFixed(2)}`;
    } else {
      // Invalid coupon code
      discountMessage.innerText = "Invalid coupon code. Please try again.";
      cartTotalElement.innerText = cartTotal; // Reset to original price if invalid coupon
    }
  }
});

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart");
  if (!cartItems) {
    const cartTotal = document.querySelector(".cart-footer");
    cartTotal.setAttribute("class", "hide");
  }

  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    document.querySelector(".product-list").innerHTML =
      "<p>Your cart is empty</p>";
    return;
  }
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  document.querySelector(".product-list").innerHTML = htmlItems.join("");
  attachRemoveListeners();

  calculateTotal(cartItems);
}

function cartItemTemplate(item) {
  const newItem = `<li class="cart-card divider">
  <a href="#" class="cart-card__image">
    <img
      src="${item.Image}"
      alt="${item.Name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <p class="cart-card__quantity">qty: ${item.Quantity}</p>
  <p class="cart-card__price">$${item.FinalPrice}</p>
  <!-- Remove Button -->
    <button class="remove-item" data-id="${item.Id}">X</button>
</li>`;

  return newItem;
}

function attachRemoveListeners() {
  // Attach event listeners to each remove button (X)
  const removeButtons = document.querySelectorAll(".remove-item");

  removeButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const itemId = button.getAttribute("data-id");
      removeItemFromCart(itemId);
    });
  });
}

function removeItemFromCart(itemId) {
  // we need to fin the way to delite only one item !!!!
  let cart = getLocalStorage("so-cart") || [];

  // Remove the item with the given ID
  cart = cart.filter((item) => item.Id !== itemId);

  // Update localStorage with the new cart
  setLocalStorage("so-cart", cart);

  // Re-render the cart after removing the item
  renderCartContents();
}

function calculateTotal(cartItems) {
  // Need to find a way not to display total after the item has been removed
  let total = 0;
  cartItems.map((item) => (total += item.FinalPrice * item.Quantity));
  let cartPElement = document.querySelector(".cart-total");
  cartPElement.innerHTML = "";
  cartPElement.insertAdjacentHTML("afterbegin", `Total: $${total}`);
}

renderCartContents();
changeValueFromKeyList(cartIconNotification, "so-cart");
loadHeaderFooter();
