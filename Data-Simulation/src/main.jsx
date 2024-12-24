import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import MapContextProvider from "./context/mapContext.jsx";
import IndicatorsContextProvider from "./context/indicatorsContext.jsx";
import { DeviceProvider } from "./context/DeviceContext.jsx";
import { UserProvider } from "./context/UserContext.jsx";

const userId = "606843aec2e39d1fb33514d0";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <UserProvider>
      <DeviceProvider userId={userId}>
        <IndicatorsContextProvider>
          <MapContextProvider>
            <App />
          </MapContextProvider>
        </IndicatorsContextProvider>
      </DeviceProvider>
    </UserProvider>
  </React.StrictMode>
);
