import React, { useState, useEffect } from "react";
import {
  GoogleMap,
  Marker,
  useJsApiLoader,
  InfoWindowF,
} from "@react-google-maps/api";
import CalculationModal from "../components/CalculationModal";

const libraries = ["geocoding", "places", "marker"];
const center = { lat: 34.2505334, lng: -118.548408 };

export default function GoogleMapView() {
  const [map, setMap] = useState(/** @type google.maps.Map*/ (null));
  const [markers, setMarkers] = useState();
  const [activeMarker, setActiveMarker] = useState(null);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_PLATFORM_KEY,
    libraries,
  });

  const fetchData = async () => {
    await fetch(
      `${process.env.REACT_APP_SHEETS_DB_API_URL}?cast_numbers=latitude,longitude`
    )
      .then((response) => response.json())
      .then((data) => setMarkers(data));
  };

  const mapMarkers = (data) => {
    const markerPosition = {
      lat: data.latitude,
      lng: data.longitude,
    };

    //Inside the Info Window display everything
    return (
      <Marker
        key={`Map_Marker_${data.id}`}
        position={markerPosition}
        title={data.id}
        // label={data.id}
        onClick={() => setActiveMarker(data.id)}
      >
        {activeMarker === data.id ? (
          <InfoWindowF onCloseClick={() => setActiveMarker(null)}>
            <ul>
              <li>
                Client name: <b>{data.name}</b>
              </li>
              <li>Time: {data.time}</li>
              <li>Location: {data.location}</li>
              <li>Service: {data.jobType}</li>
              <li>Lead Source: {data.leadSource}</li>
            </ul>
          </InfoWindowF>
        ) : null}
      </Marker>
    );
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (!isLoaded) {
    return (
      <div className="container">
        <div
          className="d-flex align-items-center justify-content-center"
          style={{ height: "90vH" }}
        >
          <h1>Map is Loading...</h1>
        </div>
      </div>
    );
  }
  return (
    <>
      {" "}
      <div className="container-fluid">
        <div className="wrapper" style={{ position: "relative" }}>
          <div id="google-map" className="d-flex justify-content-center">
            <GoogleMap
              center={center}
              zoom={7}
              mapContainerStyle={{ height: "90vH", width: "100%" }}
              onLoad={(map) => setMap(map)}
              options={{ mapTypeControl: false }}
            >
              {markers?.map(mapMarkers)}
            </GoogleMap>
          </div>
          <CalculationModal></CalculationModal>
        </div>
      </div>
    </>
  );
}
