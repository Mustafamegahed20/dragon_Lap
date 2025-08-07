import { Routes, Route } from "react-router-dom";
import WithTitle from "./WithTitle";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import OrderTracking from "./pages/OrderTracking";
import About from "./pages/About";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";

export const routes = [
  { path: "/", title: "Home - Dragon Lap", component: Home },
  { path: "/products", title: "Products - Dragon Lap", component: Products },
  {
    path: "/products/:id",
    title: "Product Details - Dragon Lap",
    component: ProductDetails,
  },
  { path: "/cart", title: "Cart - Dragon Lap", component: Cart },
  { path: "/checkout", title: "Checkout - Dragon Lap", component: Checkout },
  { path: "/signin", title: "Sign In - Dragon Lap", component: SignIn },
  { path: "/signup", title: "Sign Up - Dragon Lap", component: SignUp },
  {
    path: "/order-tracking",
    title: "Order Tracking - Dragon Lap",
    component: OrderTracking,
  },
  { path: "/about", title: "About Us - Dragon Lap", component: About },
  { path: "/faq", title: "FAQ - Dragon Lap", component: FAQ },
  { path: "/contact", title: "Contact - Dragon Lap", component: Contact },
  {
    path: "/admin",
    title: "Admin - Dragon Lap",
    component: Admin,
    adminOnly: true,
  },
];
