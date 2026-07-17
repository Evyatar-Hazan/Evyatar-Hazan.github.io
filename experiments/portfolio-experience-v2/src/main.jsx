import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "./App.jsx";
import "@fontsource/inter/latin-300.css";
import "@fontsource/inter/latin-400.css";
import "@fontsource/inter/latin-500.css";
import "@fontsource/inter/latin-600.css";
import "@fontsource/noto-sans-hebrew/hebrew-300.css";
import "@fontsource/noto-sans-hebrew/hebrew-400.css";
import "@fontsource/noto-sans-hebrew/hebrew-500.css";
import "./styles.css";
import "./cinema.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
