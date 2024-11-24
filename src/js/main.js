import ProductData from "./ProductData.mjs";
import ProductListing from "./ProductList.mjs";
import { changeValueFromKeyList } from "./utils.mjs";
import { loadHeaderFooter } from './utils.mjs';

const category = "tents";
const dataSource = new ProductData(category);
const element = document.querySelector(".product-list");

//
const listElement = document.querySelector(".product-list");
const productList = new ProductListing("tents", dataSource, listElement);
const cartIconNotification = document.querySelector(".item-count");

// create an instance of your ProductListing class
const products = new ProductListing(category, dataSource, element);
products.init();

changeValueFromKeyList(cartIconNotification, "so-cart");
loadHeaderFooter()
