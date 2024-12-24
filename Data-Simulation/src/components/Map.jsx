import "../App.css";
import "leaflet/dist/leaflet.css";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  Polyline,
  useMap,
} from "react-leaflet";
import config from "../config";
import { mapContext } from "../context/mapContext";
import { useEffect, useContext, useRef, useState } from "react";
import L from "leaflet"; // Import Leaflet to access the L object
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";
import { indicatorsContext } from "../context/indicatorsContext";

function Map() {
  const { map, setMap } = useContext(mapContext);

  const {
    errorMsg,
    setErrorMsg,
    successMsg,
    setSuccessMsg,
    infoMsg,
    setInfoMsg,
  } = useContext(indicatorsContext);

  const mapInit = (options) => {
    if (!map) {
      setErrorMsg("An error occured while Loading the Map");
      return;
    }
    setErrorMsg(null);
    map.locate(options);
  };

  useEffect(() => {
    mapInit({ setView: true });
  }, [map]);

  return (
    <>
      <MapContainer
        center={[25.679953991424775, 5.89845351553821]}
        zoom={13}
        ref={setMap}
      >
        <TileLayer
          attribution='Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery &copy; <a href="https://www.mapbox.com/">Mapbox</a>'
          url={config.api}
        />
      </MapContainer>
    </>
  );
}

export default Map;
