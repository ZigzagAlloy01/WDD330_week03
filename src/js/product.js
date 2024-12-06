import ProductData from "./ProductData.mjs";
import ProductDetails from "./ProductDetails.mjs";
import { getParams, changeValueFromKeyList } from "./utils.mjs";
import { loadHeaderFooter } from "./utils.mjs";

const productId = getParams("product");
const dataSource = new ProductData("tents");

const product = new ProductDetails(productId, dataSource);
const cartIconNotification = document.querySelector(".item-count");

product.init();
changeValueFromKeyList(cartIconNotification, "so-cart");
loadHeaderFooter();
