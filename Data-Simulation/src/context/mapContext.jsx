import { createContext, useEffect, useState } from "react";

export const mapContext = createContext(null);

const MapContextProvider = ({ children }) => {
  const [simulations, setSimulations] = useState(() => {
    const simulationsData = localStorage.getItem("simulations");
    return simulationsData ? JSON.parse(simulationsData) : [];
  });
  const [map, setMap] = useState(null);

  useEffect(() => {
    localStorage.setItem("simulations", JSON.stringify(simulations));
  }, [simulations]);

  return (
    <mapContext.Provider
      value={{
        simulations,
        setSimulations,
        map,
        setMap,
      }}
    >
      {children}
    </mapContext.Provider>
  );
};

export default MapContextProvider;
