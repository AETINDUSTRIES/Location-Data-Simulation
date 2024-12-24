import "../App.css";
import React, { useState, useEffect, useContext } from "react";
import { mapContext } from "../context/mapContext";
import { indicatorsContext } from "../context/indicatorsContext";
import { useDeviceContext } from "../context/DeviceContext"; // Import the DeviceContext
import { MdCancel } from "react-icons/md";
import { BsFillPinMapFill } from "react-icons/bs";
import Tooltip from "./Tooltip";
import MapModal from "./MapModal";

export default function Form({ closeNewSimulForm }) {
  const { simulations, setSimulations } = useContext(mapContext);

  const {
    errorMsg,
    setErrorMsg,
    successMsg,
    setSuccessMsg,
    infoMsg,
    setInfoMsg,
  } = useContext(indicatorsContext);

  const {
    devices,
    loading: devicesLoading,
    error: devicesError,
  } = useDeviceContext();

  const [formData, setFormData] = useState({
    longitude: "",
    latitude: "",
    simulationDuration: "",
    samplingDuration: "",
    name: "",
    speed: "",
    direction: "",
    distance: "",
    longitudeF: "",
    latitudeF: "",
    deviceId: "",
  });

  const [showMap, setShowMap] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleMapSelect = (coords) => {
    if (showMap === "start") {
      setFormData({
        ...formData,
        latitude: coords.lat,
        longitude: coords.lng,
      });
    } else if (showMap === "final") {
      setFormData({
        ...formData,
        latitudeF: coords.lat,
        longitudeF: coords.lng,
      });
    }
    setShowMap(null);
  };

  const nameIsValid = () => {
    return !simulations.some((simulation) => simulation.name === formData.name);
  };

  const finalCorrdsAreValid = () => {
    return !(
      formData.longitudeF === formData.longitude &&
      formData.latitudeF === formData.latitude
    );
  };

  // Controlling the usage of the direction parameter or the final point
  useEffect(() => {
    if (formData.longitudeF || formData.latitudeF) {
      setFormData({ ...formData, direction: "" });
    } else if (formData.direction) {
      setFormData({ ...formData, longitudeF: "", latitudeF: "" });
    }
  }, [formData.longitudeF, formData.latitudeF, formData.direction]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!nameIsValid()) {
      setErrorMsg("A simulation with the given name already exists.");
      return;
    }

    if (!finalCorrdsAreValid()) {
      setErrorMsg("Please provide a valid final point.");
      return;
    }

    setSimulations([...simulations, formData]);
    closeNewSimulForm();
    setSuccessMsg("The simulation was created successfully!");
    console.log(formData);
  };

  return (
    <div className="form-background">
      <div className="form-container">
        <div className="form-header">
          <div className="form-title">
            <h3>New Simulation</h3>
            <p>Fill the form with the simulation data then click start</p>
          </div>
          <div className="form-close">
            <MdCancel onClick={closeNewSimulForm} className="form-close-icon" />
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="label">Select Device</label>
            {devicesLoading ? (
              <p>Loading devices...</p>
            ) : devicesError ? (
              <p>Error loading devices: {devicesError}</p>
            ) : (
              <select
                className="input-field col"
                name="deviceId"
                value={formData.deviceId}
                onChange={handleInputChange}
                required
              >
                <option value="" disabled>
                  Select a device
                </option>
                {devices.map((device) => (
                  <option key={device._id} value={device._id}>
                    {device.vehicle.brand} / {device.vehicle.model}
                  </option>
                ))}
              </select>
            )}
          </div>
          <div className="input-group">
            <label className="label">Simulation name </label>
            <input
              className="input-field col"
              type="text"
              name="name"
              placeholder="Simulation name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="input-row">
            <div className="input-group">
              <label className="label">Simulation duration (minutes)</label>
              <input
                className="input-field row"
                type="number"
                step="any"
                name="simulationDuration"
                placeholder="Duration with minutes,ex: 2"
                value={formData.simulationDuration}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="input-group">
              <label className="label">Sampling duration (seconds)</label>
              <input
                className="input-field row"
                type="number"
                step="any"
                name="samplingDuration"
                placeholder="Time stamps to collect the data"
                value={formData.samplingDuration}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          <div className="input-group">
            <label className="label big">Start point coordinates</label>
            <div className="input-row">
              <div className="input-group">
                <label className="label">Latitude</label>
                <input
                  className="input-field row"
                  type="number"
                  step="any"
                  min="-90"
                  max="90"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="input-group">
                <label className="label">Longitude</label>
                <input
                  className="input-field row"
                  type="number"
                  step="any"
                  min="-180"
                  max="180"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <Tooltip text="Select start point on the map">
                <BsFillPinMapFill onClick={() => setShowMap("start")} />
              </Tooltip>
            </div>
          </div>

          <div className="input-group">
            <label className="label big">Final point coordinates</label>
            <div className="input-row">
              <div className="input-group">
                <label className="label">Latitude</label>
                <input
                  className="input-field row"
                  type="number"
                  step="any"
                  min="-90"
                  max="90"
                  name="latitudeF"
                  value={formData.latitudeF}
                  onChange={handleInputChange}
                  disabled={formData.direction}
                  required
                />
              </div>
              <div className="input-group">
                <label className="label">Longitude</label>
                <input
                  className="input-field row"
                  type="number"
                  step="any"
                  min="-180"
                  max="180"
                  name="longitudeF"
                  value={formData.longitudeF}
                  onChange={handleInputChange}
                  disabled={formData.direction}
                  required
                />
              </div>

              <Tooltip text="Select final point on the map">
                <BsFillPinMapFill onClick={() => setShowMap("final")} />
              </Tooltip>
            </div>
          </div>

          <div className="input-group">
            <label className="label">Speed (km/h)</label>
            <input
              className="input-field col"
              type="number"
              step="any"
              name="speed"
              placeholder="Object speed measured with km/h"
              value={formData.speed}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="input-row">
            <div className="input-group">
              <label className="label">Direction (Degrees °)</label>
              <input
                className="input-field row"
                type="number"
                step="any"
                min="-180"
                max="180"
                name="direction"
                placeholder="Object direction with degrees"
                value={formData.direction}
                onChange={handleInputChange}
                disabled={formData.longitudeF || formData.latitudeF}
                required
              />
            </div>
            <div className="input-group">
              <label className="label">Distance (km)</label>
              <input
                className="input-field row"
                type="number"
                step="any"
                name="distance"
                placeholder="The distance that the object should"
                value={formData.distance}
                onChange={handleInputChange}
                disabled={formData.longitudeF || formData.latitudeF}
                required
              />
            </div>
          </div>
          <div className="btn-container">
            <button className="btn-start" type="submit">
              Create new simulation
            </button>
          </div>
        </form>

        {showMap && (
          <MapModal
            onClose={() => setShowMap(null)}
            onSelectLocation={handleMapSelect}
          />
        )}
      </div>
    </div>
  );
}
