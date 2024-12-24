import "../App.css"
import { FaPlus } from "react-icons/fa6";
import { FaChevronUp } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa";
import Simulation from "./Simulation";
import { useState,useContext } from "react";
import { mapContext } from "../context/mapContext";


export default function Simulations({openNewSimulForm,setOpenedSimulationDetails}){
    const {
        simulations,setSimulations,
        map,setMap,
      }= useContext(mapContext);

    return(
        <div className="simulations">
            <div className="simulations-list-header">
                <div className="simulations-title">
                    Simulations
                </div>
                <div className="btn-plus">
                    <FaPlus onClick={openNewSimulForm}/>
                </div>
            </div>
            <div className={simulations.length===0?"centered simulations-list-content":"simulations-list-content"}>
                {simulations.map(simulation=>{
                    return <Simulation 
                    key={simulation.name} 
                    name={simulation.name} 
                    speed={simulation.speed}
                    finalPoint={[simulation.latitudeF,simulation.longitudeF]} 
                    startPoint={[simulation.latitude,simulation.longitude] }
                    direction={simulation.direction}
                    samplingDuration={simulation.samplingDuration}
                    simulationDuration={simulation.simulationDuration}
                    distance={simulation.distance}
                    deviceId={simulation.deviceId}
                    setOpenedSimulationDetails={setOpenedSimulationDetails}/>
                })}
                {simulations.length===0 && <p className="big" > No simulations to show </p>}
                
            </div>
        </div>
       
        
    )
}