import { useState, useRef, useEffect, useContext } from "react";
import "../App.css";
import { BsChevronDown } from "react-icons/bs";
import { BsChevronUp } from "react-icons/bs";
import { BsFillPauseFill } from "react-icons/bs";
import { BsFillPlayFill } from "react-icons/bs";
import { BsFillStopFill } from "react-icons/bs";
import { BsFillPinMapFill } from "react-icons/bs";
import SimulationDetails from "./SimulationDetails";
import { mapContext } from "../context/mapContext";
import L from "leaflet"; // Import Leaflet to access the L object
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";
import * as turf from "@turf/turf";
import axios from "axios";
import { indicatorsContext } from "../context/indicatorsContext";
import config from "../config";

export default function Simulation({
  setOpenedSimulationDetails,
  name,
  speed,
  startPoint,
  finalPoint,
  samplingDuration,
  simulationDuration,
  direction,
  distance,
  deviceId,
}) {
  const [showDetails, setShowDetails] = useState(false);
  const [stoped, setStoped] = useState(true);
  const [paused, setPaused] = useState(true);
  const pausedRef = useRef(paused);
  const markers = useRef(null);
  const route = useRef(null);
  const interval = useRef(null);
  const samplingInterval = useRef(null);

  const { simulations, setSimulations, map, setMap } = useContext(mapContext);

  const {
    errorMsg,
    setErrorMsg,
    successMsg,
    setSuccessMsg,
    infoMsg,
    setInfoMsg,
  } = useContext(indicatorsContext);

  const drawPath = (
    startPoint,
    finalPoint,
    speed,
    direction,
    distance,
    simulationDuration
  ) => {
    if (!map) {
      //Error handling
      return;
    }

    if (interval.current) clearInterval(interval.current);

    //Clearing previous polyline and markers if any
    if (markers.current) {
      markers.current.remove();
      map.removeControl(route.current);
    }

    const endPoint = calculateFinalPoint(
      startPoint,
      direction,
      distance,
      finalPoint
    );

    //Creating the routing control and adding it to the map
    route.current = L.Routing.control({
      waypoints: [L.latLng(startPoint), L.latLng(endPoint)],
      lineOptions: {
        addWaypoints: false,
        styles: [
          { color: "black", opacity: 0.15, weight: 9 },
          { color: "white", opacity: 0.8, weight: 6 },
          { color: "#ef233c", opacity: 1, weight: 2 },
        ],
      },
      plan: new L.Routing.Plan([L.latLng(startPoint), L.latLng(endPoint)], {
        draggableWaypoints: false,
      }),
    }).addTo(map);
    route.current.hide();

    map.fitBounds([startPoint, endPoint]); //zoom into the route

    //Handling route found event to animate the route
    route.current.on("routesfound", (e) => {
      const route = e.routes[0];
      const coords = route.coordinates.slice(); //making a copy of the coordinates array
      markers.current = L.marker(coords[0]).addTo(map); // marker init

      //Simulating vehicle movement
      let duration = simulationDuration * 60; //seconds
      let time = 0;
      const delay = 1000 / 24; // standard number of frames per second used in computer animations "24fps"
      //transforming coords array to turf compatible form
      const turfCoords = turf.lineString(
        coords.map((coords) => [coords.lng, coords.lat])
      );
      interval.current = setInterval(() => {
        if (!pausedRef.current) {
          if (time < duration) {
            calculatePosition(speed, time, turfCoords);
            time += delay / 1000;
          } else {
            clearInterval(interval.current);
            setStoped(true);
            setPaused(true);
          }
        }
      }, delay);
    });

    route.current.on("routingerror", () => {
      setErrorMsg("An error occurred while routing, please try again ");
    });
  };

  const calculateFinalPoint = (startPoint, direction, distance, finalPoint) => {
    if (direction === "") return finalPoint;
    else {
      const newCoords = turf.destination(
        [startPoint[1], startPoint[0]],
        distance,
        direction
      );
      return [
        newCoords.geometry.coordinates[1],
        newCoords.geometry.coordinates[0],
      ];
    }
  };

  function calculateDistance(speed, time) {
    return ((speed / 3.6) * time) / 1000; // in km
  }

  function calculatePosition(speed, time, turfCoords) {
    const distance = calculateDistance(speed, time);
    const newCoords = turf.along(turfCoords, distance);

    //updating the marker position
    markers.current.setLatLng(
      L.latLng(
        newCoords.geometry.coordinates[1],
        newCoords.geometry.coordinates[0]
      )
    );

    //comparing newCoords with finalCoords coords[coords.length] to check the end of the simulation
    if (
      newCoords.geometry.coordinates[0] ===
        turfCoords.geometry.coordinates[
          turfCoords.geometry.coordinates.length - 1
        ][0] &&
      newCoords.geometry.coordinates[1] ===
        turfCoords.geometry.coordinates[
          turfCoords.geometry.coordinates.length - 1
        ][1]
    ) {
      clearInterval(interval.current);
      setStoped(true);
      setPaused(true);
    }
  }

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  const dataSampling = async () => {
    if (!pausedRef.current) {
      try {
        console.log(markers.current.getLatLng());

        const payload = {
          Gps_Status: true,
          long: markers.current.getLatLng().lng.toString(),
          lat: markers.current.getLatLng().lat.toString(),
          alt: "0",
          Course: 0,
          timestamp: new Date().toISOString(),
          speed: `${speed}`,
        };

        const apiEndpoint = `${config.baseUrl}:8443/test/trackAPI/device/postLocation/${deviceId}`;

        const res = await axios.post(apiEndpoint, payload);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    }
  };

  useEffect(() => {
    if (!stoped) {
      drawPath(
        startPoint,
        finalPoint,
        speed,
        direction,
        distance,
        simulationDuration
      );
      samplingInterval.current = setInterval(
        dataSampling,
        samplingDuration * 1000
      );
    } else {
      clearInterval(interval.current);
      clearInterval(samplingInterval.current);
      if (markers.current) {
        markers.current.remove();
        markers.current = null;
      }
      if (route.current) {
        map.removeControl(route.current);
        route.current = null;
      }
    }
  }, [stoped]);

  return (
    <>
      <div className="simulation">
        <span className="locate-icon">
          <BsFillPinMapFill
            onClick={() => {
              if (finalPoint) map.fitBounds([startPoint, finalPoint]);
              else map.fitBounds([startPoint, markers.current._latlng]);
            }}
          />
        </span>
        <div className="simulation-content">
          {name}
          <div className="simulation-ctrl">
            {stoped ? (
              <BsFillPlayFill
                onClick={() => {
                  setStoped(false);
                  setPaused(false);
                }}
              />
            ) : paused ? (
              <div className="centered">
                <BsFillPlayFill onClick={() => setPaused(false)} />
                <BsFillStopFill onClick={() => setStoped(true)} />
              </div>
            ) : (
              <div className="centered">
                <BsFillPauseFill onClick={() => setPaused(true)} />
                <BsFillStopFill onClick={() => setStoped(true)} />
              </div>
            )}
            {showDetails ? (
              <BsChevronUp onClick={() => setShowDetails(false)} />
            ) : (
              <BsChevronDown onClick={() => setShowDetails(true)} />
            )}
          </div>
        </div>
      </div>
      {showDetails && (
        <SimulationDetails
          speed={speed}
          startPoint={startPoint}
          finalPoint={finalPoint}
          samplingDuration={samplingDuration}
          simulationDuration={simulationDuration}
          direction={direction}
          distance={distance}
          name={name}
          setOpenedSimulationDetails={setOpenedSimulationDetails}
        />
      )}
    </>
  );
}
