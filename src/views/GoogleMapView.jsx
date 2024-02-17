import React, { useState, useEffect } from "react";
import {
  GoogleMap,
  Marker,
  useJsApiLoader,
  InfoWindowF,
} from "@react-google-maps/api";
import { Container } from "react-bootstrap";
//import CalculationModal from "../components/CalculationModal";

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

  // const fetchData = async () => {
  //   await fetch(
  //     `${process.env.REACT_APP_SHEETS_DB_API_URL}?cast_numbers=latitude,longitude`
  //   )
  //     .then((response) => response.json())
  //     .then((data) => setMarkers(data));
  // };

  const fetchMapData = () => {
    fetch(`${process.env.REACT_APP_BEST_SHEET_API_URL}?_raw=1`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setMarkers(data);
      })
      .catch((error) => {
        console.error(error);
      });
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
        onClick={() => setActiveMarker(data.id)}
      >
        {activeMarker === data.id ? (
          <InfoWindowF onCloseClick={() => setActiveMarker(null)}>
            <div>
              {" "}
              <h6>{data.name}</h6>
              <ul>
                <li>
                  Time: <b>{data.time}</b>
                </li>
                <li>
                  Location: <b>{data.location}</b>{" "}
                </li>
                <li>
                  Service: <b>{data.jobType}</b>{" "}
                </li>
                <li>
                  Address: <b>{data.address}</b>
                </li>
                <li>
                  Lead Source: <b>{data.leadSource}</b>
                </li>
              </ul>
            </div>
          </InfoWindowF>
        ) : null}
      </Marker>
    );
  };

  useEffect(() => {
    fetchMapData();
  }, []);

  if (!isLoaded) {
    return (
      <Container>
        <div
          className="d-flex align-items-center justify-content-center"
          style={{ height: "90vH" }}
        >
          <h1>Map is Loading...</h1>
        </div>
      </Container>
    );
  }
  return (
    <>
      {" "}
      <Container fluid>
        <div className="wrapper" style={{ position: "relative" }}>
          <div id="google-map" className="d-flex justify-content-center">
            <GoogleMap
              center={center}
              zoom={7}
              mapContainerStyle={{ height: "93vH", width: "100%" }}
              onLoad={(map) => setMap(map)}
              options={{ mapTypeControl: false }}
            >
              {" "}
              {markers?.map(mapMarkers)}
            </GoogleMap>
          </div>
          {/* <CalculationModal></CalculationModal> */}
        </div>
      </Container>
    </>
  );
}
