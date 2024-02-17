import React, { useState } from "react";
import { LoadScript, Autocomplete } from "@react-google-maps/api";
import { Field, ErrorMessage, useFormikContext } from "formik";

const libraries = ["places"];

export default function AddressAutocomplete() {
  const [autocomplete, setAutocomplete] = useState(null);

  const { setFieldValue } = useFormikContext();

  const onLoad = (autoC) => {
    setAutocomplete(autoC);
  };

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const newPlace = autocomplete.getPlace();
      const fullAddress = newPlace.formatted_address;
      const lat = newPlace.geometry.location.lat();
      const long = newPlace.geometry.location.lng();
      const locality = getLocality(newPlace);
      setFieldValue("address", fullAddress);
      setFieldValue("latitude", lat);
      setFieldValue("longitude", long);
      setFieldValue("location", locality);
    } else {
      console.error("Autocomplete is not loaded yet!");
    }
  };

  const getLocality = (placeObj) => {
    const addressData = placeObj.address_components;
    const filterNeighborhood = addressData.filter((a) =>
      a.types.includes("neighborhood")
    );
    const filterLocality = addressData.filter((a) =>
      a.types.includes("locality")
    );

    let locationName = "Could not find locality";
    if (filterLocality.length > 0) {
      locationName = filterLocality[0].long_name;
    }
    if (filterNeighborhood.length > 0) {
      locationName = filterNeighborhood[0].long_name;
    }

    const location = locationName;

    return location;
  };
  return (
    <>
      <label htmlFor="Address">Address:</label>
      <LoadScript
        googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_PLATFORM_KEY}
        libraries={libraries}
      >
        <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
          <Field
            className="form-control"
            id="Address"
            name="address"
            placeholder="ex. 123 Main Street Los Angles, CA"
          />
        </Autocomplete>

        <div className="error-text">
          <ErrorMessage
            name="address"
            component="div"
            className="field-error "
          />
        </div>
      </LoadScript>
    </>
  );
}
