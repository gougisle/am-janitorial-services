import React from "react";
import "./calculationmodal.css";

export default function CalculationModal() {
  return (
    <div id="calculation-modal">
      <h5 className="text-center">
        Calculate Distance & Time (NOT FUNCTIONAL)
      </h5>
      <div className="row">
        <div className="input-wrapper col">
          {/* <label htmlFor="start">Start:</label> */}
          <input
            id="orgin"
            type="text"
            className="form-control"
            placeholder="Origin"
          />
        </div>
        <div className="input-wrapper col">
          {/* <label htmlFor="start">End:</label> */}
          <input
            id="destination"
            type="text"
            className="form-control"
            placeholder="Destination"
          />
        </div>
        <div className="col">
          <button
            id="calulation-button"
            type="button"
            className="btn btn-primary w-100"
          >
            {" "}
            Calculate Route
          </button>
        </div>
      </div>
      <div className="row mt-3 mb-2">
        <div className="col text-start">Distance: XX mi.</div>
        <div className="col text-start">Travel Time: XX min</div>
      </div>
    </div>
  );
}
