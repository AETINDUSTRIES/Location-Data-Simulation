import "../App.css";
import { FaChevronRight } from "react-icons/fa";
import { FaChevronLeft } from "react-icons/fa";
import Form from "./Form";
import Simulations from "./Simulations";
import { useState } from "react";
import SimulationForm from "./SimulationForm";
import { TiMinus } from "react-icons/ti";

export default function Sidebar({
  height,
  setHeight,
  visible,
  handleVisibility,
  setOpenNewSimulForm,
}) {
  const [openedSimulationDetails, setOpenedSimulationDetails] = useState(null);

  const heightBounds = (y) => (y >= 100 ? 100 : y <= 10 ? 10 : y);
  const calculateHeightPresentage = (y) => {
    const totalHeight = document.documentElement.scrollHeight;
    return (y / totalHeight) * 100;
  };

  const handleTouchStart = (e) => {
    setHeight(
      heightBounds(100 - calculateHeightPresentage(e.touches[0].clientY))
    );
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
    console.log("coordY", e.touches[0].clientY);
    setHeight(
      heightBounds(100 - calculateHeightPresentage(e.touches[0].clientY))
    );
    console.log(height);
  };

  const handleTouchEnd = (e) => {
    // setStartHeight(null);
  };

  const handleDoubleClick = (e) => {
    height === 100 ? setHeight(10) : setHeight(100);
  };

  return (
    <div
      className="sidemenu"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="arrow-container " onDoubleClick={handleDoubleClick}>
        <div className="arrow-circle-container" onClick={handleVisibility}>
          {visible ? (
            <FaChevronLeft onClick={handleVisibility} className="arrow left" />
          ) : (
            <FaChevronRight
              onClick={handleVisibility}
              className="arrow right"
            />
          )}
        </div>
        <TiMinus className="minus" />
      </div>
      <div className="content">
        {openedSimulationDetails ? (
          <SimulationForm
            simulation={openedSimulationDetails}
            closeSimulForm={() => {
              setOpenedSimulationDetails(null);
            }}
          />
        ) : (
          <Simulations
            openNewSimulForm={() => {
              setOpenNewSimulForm(true);
            }}
            setOpenedSimulationDetails={setOpenedSimulationDetails}
          />
        )}
      </div>
    </div>
  );
}
