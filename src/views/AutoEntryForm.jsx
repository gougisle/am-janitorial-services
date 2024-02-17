import React from "react";
import {
  Formik,
  Field,
  Form as FormikForm,
  ErrorMessage,
  FieldArray,
} from "formik";
import toastr from "toastr";
import { autoEntrySchema } from "../schemas/autoEntrySchema";
import { Container, Row, Col, Button } from "react-bootstrap";
import { generateUniqueId } from "../utils/utilityFunctions";
import axios from "axios";

//TO-DO:
// implemented the geocode service into this form so that we get lat/lng && neigborhood data from Google Maps

export default function AutoEntryForm({ onUpload }) {
  const LEAD_TYPES = [
    { id: 0, label: "Select a Lead Source" },
    { id: 1, label: "OFIR" }, // V1
    { id: 2, label: "MIKEY" }, //V1
    //{ id: 3, label: "BEN *(do not use)" }, //needs work
    { id: 4, label: "CJC" }, //V1
    { id: 5, label: "Victor's Marketing" }, //V1
  ];
  const INITIAL_VALUES = {
    leadSource: 0,
    leads: [
      {
        text: "",
      },
    ],
  };

  //#region PARSING METHODS
  const parseLeadTypeOfir = async (text, rawShape) => {
    let resultData = { ...rawShape };
    const lines = getSplitLines(text);

    const dateTimePieces = lines[2].split(","); //["January 16"," 2024"," 8:00 am"]

    const splitStartTime = dateTimePieces[2].trim().split(" "); //["8:00", "am"]
    const timeContext = splitStartTime[1].toUpperCase(); // "AM"
    const hourStart = Number(splitStartTime[0].split(":")[0]) || null; // 8 || null

    let hourEnd = null;

    if (hourStart !== null) {
      if (hourStart === 12) {
        hourEnd = 2;
      } else {
        hourEnd = hourStart + 2;
      }
    }

    const timeBlock = `${hourStart} ${timeContext} - ${hourEnd} ${
      hourEnd === 12 ? "PM" : timeContext
    }`;

    const addressLine = lines[3];
    const geocodeData = await getGeoCodeData(addressLine);

    resultData.name = lines[0];
    resultData.jobType = lines[1];
    resultData.time = timeBlock;
    resultData.location = geocodeData.location;
    resultData.latitude = geocodeData.latitude;
    resultData.longitude = geocodeData.longitude;
    resultData.address = geocodeData.fullAddress;
    console.log("parseLeadTypeOfir data --- ", resultData);
    return resultData;
  };
  const parseLeadTypeMikey = async (text, rawShape) => {
    let resultData = { ...rawShape };
    const lines = getSplitLines(text);

    const addressLine = lines[3];
    const geocodeData = await getGeoCodeData(addressLine); // fetch the data for this address

    const dateTimeStr = lines[2]; // "Tue Jan 16th 2:00 PM - 4:00 PM"
    const splitDateTime = dateTimeStr.split("-"); // ["Tue Jan 16th 2:00 PM ", " 4:00 PM"]
    const hourStart = splitDateTime[1].trim();
    const hourEnd = splitDateTime[0].trim().substring(12);

    const timeBlock = `${hourStart} - ${hourEnd}`;

    resultData.name = lines[0];
    resultData.jobType = cleanJobType(lines[4]);
    resultData.time = timeBlock;
    resultData.location = geocodeData.location;
    resultData.latitude = geocodeData.latitude;
    resultData.longitude = geocodeData.longitude;
    resultData.address = geocodeData.fullAddress;

    function cleanJobType(jobTypeStr) {
      const pieces = jobTypeStr.split("-");
      const trimmed = pieces[1].trim();
      return trimmed;
    }
    console.log("parseLeadTypeMikey data --- ", resultData);
    return resultData;
  };
  const parseLeadTypeCjc = async (text, rawShape) => {
    let resultData = { ...rawShape };
    const lines = getSplitLines(text);
    let addressFromLead = "";
    let geocodeData = null;

    lines.forEach((line) => {
      const [key, value] = line
        .split(":")
        .join("%")
        .split(";")
        .join("%")
        .split("%")
        .map((part) => part.trim());
      switch (key) {
        case "Name":
          resultData.name = value;
          break;
        case "Address":
          addressFromLead = value;
          break;
        case "Time":
          resultData.time = value;
          break;
        case "House size":
        case "Furnace":
          resultData.jobType = value + " ";
          break;
        default:
          break;
      }
    });

    if (addressFromLead) {
      geocodeData = await getGeoCodeData(addressFromLead);
      resultData.location = geocodeData.location;
      resultData.latitude = geocodeData.latitude;
      resultData.longitude = geocodeData.longitude;
      resultData.address = geocodeData.fullAddress;
    }
    console.log("parseLeadTypeCjc data --- ", resultData);
    return resultData;
  };
  const parseLeadTypeVicMarket = async (text, rawShape) => {
    let resultData = { ...rawShape };
    const lines = getSplitLines(text); // splits all the lines
    const filteredLines = lines.filter((ln) => ln !== ""); //remove the empty lines

    const extractedName = filteredLines[3].split(" ")[0];
    const addressLine = filteredLines[4];

    const geocodeData = await getGeoCodeData(addressLine); // fetch the data for this address

    const dateTimeLine = filteredLines[2].split(" "); //["01/15/2024", "4:00", "PM"]

    const timeContext = dateTimeLine[2]; //AM or PM
    const hourStart = Number(dateTimeLine[1].split(":")[0]) || null; // --> ["4", "00"] --(w/ index [0])--> "4"

    let hourEnd = null;

    if (hourStart !== null) {
      if (hourStart === 12) {
        hourEnd = 2;
      } else {
        hourEnd = hourStart + 2;
      }
    }

    const timeBlock = `${hourStart} ${timeContext} - ${hourEnd} ${
      hourEnd === 12 ? "PM" : timeContext
    }`;

    resultData.name = extractedName;
    resultData.jobType = filteredLines[5];
    resultData.time = timeBlock;
    resultData.location = geocodeData.location;
    resultData.latitude = geocodeData.latitude;
    resultData.longitude = geocodeData.longitude;
    resultData.address = geocodeData.fullAddress;

    console.log("parseLeadTypeVicMarket data --- ", resultData);
    return resultData;
  };

  //#endregion
  //#region UTILITY

  // "getGeoCodeData" accepts an address string, makes Google geocode HTTP request, extracts LAT, LNG and Neighborhood data, then return that data
  const getGeoCodeData = async (addressStr) => {
    let results = {};
    try {
      const splitAddress = addressStr.split(" ");
      const formattedAddress = splitAddress.join("+");
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${formattedAddress}&key=${process.env.REACT_APP_GOOGLE_MAPS_PLATFORM_KEY}`;
      const response = await axios.get(url);
      const data = response.data.results[0];
      results = await formatGeoCodeData(data);
    } catch (err) {
      console.error(err);
    }

    return results;
  };
  // "formatGeoCodeData" will accept the data from Google Geocode HTTP request and return the lat, lng and neigborhood
  const formatGeoCodeData = (rawData) => {
    const locationData = rawData.geometry.location;
    const addressData = rawData.address_components;
    const filterLocality = addressData.filter((a) =>
      a.types.includes("locality")
    );

    const filterNeighborhood = rawData.address_components.filter((a) =>
      a.types.includes("neighborhood")
    );

    let locationName = "Could not find locality";

    if (filterNeighborhood.length > 0) {
      locationName = filterNeighborhood[0].long_name;
    }
    if (filterLocality.length > 0) {
      locationName = filterLocality[0].long_name;
    }

    const location = locationName;
    const latitude = locationData.lat.toString();
    const longitude = locationData.lng.toString();
    const fullAddress = rawData.formatted_address;

    return { latitude, longitude, location, fullAddress };
  };

  const mapLeadGenOptions = (leadGen) => {
    return (
      <option value={leadGen.id} key={leadGen.id}>
        {leadGen.label}
      </option>
    );
  };
  const getSplitLines = (text) => {
    return text.split("\n");
  };
  //#endregion

  const parseLeadByType = async (text, type) => {
    const trimmedInput = text.trim();
    const leadSourceName = LEAD_TYPES.filter((t) => t.id === type)[0].label;
    const initialValues = {
      id: generateUniqueId(),
      name: "",
      jobType: "",
      time: "",
      location: "",
      leadSource: leadSourceName, // this will come from the type
      latitude: "",
      longitude: "",
      address: "",
    };

    let results;

    if (type === 1) {
      results = parseLeadTypeOfir(trimmedInput, initialValues); //OFIR [geocode added]
    } else if (type === 2) {
      results = parseLeadTypeMikey(trimmedInput, initialValues); //MIKEY [geocode added]
    } else if (type === 3) {
      console.log("not implemented");
    } else if (type === 4) {
      results = parseLeadTypeCjc(trimmedInput, initialValues); //CJC [geocode added]
    } else if (type === 5) {
      results = await parseLeadTypeVicMarket(trimmedInput, initialValues); //Victor's Marketing [geocode added]
    }

    console.log("after going thru parsing methods --- ", results);
    return results;
  };
  const handleLeadsUpload = async (values) => {
    const leadGenSourceId = Number(values.leadSource);
    const arrayOfLeads = values.leads;

    let results = [];

    for (let index = 0; index < arrayOfLeads.length; index++) {
      const element = arrayOfLeads[index];
      const parsedLead = await parseLeadByType(element.text, leadGenSourceId);
      results.push(parsedLead);
    }
    onUpload(results);
  };

  return (
    <Container>
      <h1 className="text-center mt-4">Auto Entry</h1>
      <Formik
        initialValues={INITIAL_VALUES}
        onSubmit={handleLeadsUpload}
        enableReinitialize={true}
        validationSchema={autoEntrySchema}
      >
        {({ values, handleReset }) => (
          <FormikForm className="border p-4 mt-5 mb-5 bg-light">
            <Row className="lead-source-select-row mb-3">
              {/* SELECT / UPLOAD / RESET */}
              <Col className="d-flex gap-2">
                <div className="w-50">
                  <Field className="form-control" as="select" name="leadSource">
                    {LEAD_TYPES.map(mapLeadGenOptions)}
                  </Field>{" "}
                  <div className="error-text">
                    <ErrorMessage
                      name="leadSource"
                      component="div"
                      className="field-error "
                    ></ErrorMessage>
                  </div>
                </div>
              </Col>
              <Col className="d-flex gap-2">
                <div className="w-100">
                  <Button className="w-100" variant="success" type="submit">
                    Upload
                  </Button>
                </div>
                <div className="w-100">
                  <Button
                    className="w-100"
                    type="button"
                    variant="outline-secondary"
                    onClick={handleReset}
                  >
                    Clear
                  </Button>
                </div>
              </Col>
            </Row>
            <Row className="lead-input-row mb-3">
              <Col>
                <FieldArray name="leads">
                  {({ remove, push }) => (
                    <div>
                      {" "}
                      <Button
                        type="button"
                        variant="primary"
                        className="mb-3 py-3 w-100"
                        onClick={() => push({ text: "" })}
                      >
                        Add New Lead
                      </Button>
                      {values.leads.length > 0 &&
                        values.leads.map((lead, index) => (
                          <div className="row" key={index}>
                            <div className="col mb-2">
                              <div className="form-group">
                                <Field
                                  className="form-control"
                                  as="textarea"
                                  name={`leads.${index}.text`}
                                  placeholder="Enter a lead here"
                                />
                              </div>{" "}
                              <div className="error-text">
                                {" "}
                                <ErrorMessage
                                  name={`leads.${index}.text`}
                                  component="div"
                                  className="field-error"
                                />
                              </div>
                            </div>
                            <div className="col-1 text-center">
                              <Button
                                type="button"
                                variant="outline-danger"
                                onClick={() => remove(index)}
                              >
                                X
                              </Button>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </FieldArray>
              </Col>
            </Row>
          </FormikForm>
        )}
      </Formik>
    </Container>
  );
}
