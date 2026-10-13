import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { dataErrors } from "./data";
import DataErrorScreen from "./components/DataErrorScreen";

createRoot(document.getElementById("root")!).render(
  <StrictMode>{dataErrors.length ? <DataErrorScreen errors={dataErrors} /> : <App />}</StrictMode>,
);
