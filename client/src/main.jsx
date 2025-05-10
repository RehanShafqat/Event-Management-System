import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import store from "./Redux/store.js";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./components/MyComponents/ThemeProvider.jsx";
createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <BrowserRouter>
      <ThemeProvider attribute="class"
        defaultTheme="system"
        enableSystem
        storageKey="vite-ui-theme">
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </Provider>
);
