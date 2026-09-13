import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import { AppRoutes } from "./routes/AppRoutes";
import "./styles.css";
import "./extras.css";
createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  </BrowserRouter>,
);
