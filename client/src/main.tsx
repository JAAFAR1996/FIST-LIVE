import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { initializeClientEnvSideEffects } from "./lib/config/env";

initializeClientEnvSideEffects();

createRoot(document.getElementById("root")!).render(<App />);
