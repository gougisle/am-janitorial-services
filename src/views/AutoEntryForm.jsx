import React, { useContext } from "react";
import {
  Formik,
  Field,
  Form as FormikForm,
  ErrorMessage,
  FieldArray,
} from "formik";
import { LeadStoreContext } from "../App";
import { autoEntrySchema } from "../schemas/autoEntrySchema";
import { Container, Row, Col, Button } from "react-bootstrap";
import { generateUniqueId } from "../utils/utilityFunctions";
import axios from "axios";
import {
  LEAD_SOURCES,
  AUTO_GEN_LEAD_TYPES,
  SERVICES_ARRAY,
} from "../utils/constants";

//TO-DO:
// implemented the geocode service into this form so that we get lat/lng && neigborhood data from Google Maps

export default function AutoEntryForm() {
  const [currentLeads, setCurrentLeads] = useContext(LeadStoreContext);

  const leadSourceOptions = LEAD_SOURCES.filter(
    (source) =>
      AUTO_GEN_LEAD_TYPES[source.shortName] &&
      AUTO_GEN_LEAD_TYPES[source.shortName] === source.id
  );

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
    resultData.service = findService(lines[1]);
    resultData.time = timeBlock;
    resultData.location = geocodeData.location;
    resultData.latitude = geocodeData.latitude;
    resultData.longitude = geocodeData.longitude;
    resultData.address = geocodeData.fullAddress;
    //console.log("parseLeadTypeOfir data --- ", resultData);
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
    resultData.service = findService(lines[4]);
    resultData.time = timeBlock;
    resultData.location = geocodeData.location;
    resultData.latitude = geocodeData.latitude;
    resultData.longitude = geocodeData.longitude;
    resultData.address = geocodeData.fullAddress;

    //console.log("parseLeadTypeMikey data --- ", resultData);
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

    resultData.service = findService(text);
    //console.log("parseLeadTypeCjc data --- ", resultData);
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
    resultData.service = findService(filteredLines[5]);
    resultData.time = timeBlock;
    resultData.location = geocodeData.location;
    resultData.latitude = geocodeData.latitude;
    resultData.longitude = geocodeData.longitude;
    resultData.address = geocodeData.fullAddress;

    //console.log("parseLeadTypeVicMarket data --- ", resultData);
    return resultData;
  };
  //#endregion

  //#region UTILITY
  function findService(textStr) {
    const found = [];
    let result;

    for (const serv of SERVICES_ARRAY) {
      // global search for the service name within a given string
      const serviceNameRegex = new RegExp(serv.name, "gi");
      if (textStr.match(serviceNameRegex)) {
        if (found.includes(serv.code)) {
          continue;
        } else {
          found.push(serv.code);
        }
      }
    }

    if (found.length < 1) {
      result = "Could not identify service(s), please enter manually {404}";
    }
    if (found.length === 1) {
      result = found[0];
    }
    if (found.length > 1) {
      result = found.join(", ");
    }

    console.log("The final result >>> ", result);

    return result;
  }
  /* getGeoCodeData summary
   * accepts an address string, makes request to Google Geocode API then  then returns Lat, Long and Neighborhood data,
   */
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
  /* formatGeoCodeData summary
   * will accept the raw data from Google Geocode request, extract Lat, Long, and Locality data, then format that data into an object to be returned out of the parent method
   */
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
  const mapLeadGenOptions = (leadSource) => {
    return (
      <option value={leadSource.id} key={leadSource.id}>
        {leadSource.shortName} - {leadSource.name}
      </option>
    );
  };
  const getSplitLines = (text) => {
    return text.split("\n");
  };

  function validateObject(obj) {
    for (const key in obj) {
      if (!obj.hasOwnProperty(key)) {
        continue;
      }
      if (!obj[key]) {
        return false; // Property has no value
      }
    }
    return true; // All properties have values
  }

  //#endregion

  const parseLeadByType = async (text, leadSourceId) => {
    const trimmedInput = text.trim();

    const seletedLeadSource = leadSourceOptions.filter(
      (option) => Number(option.id) === Number(leadSourceId)
    )[0];
    const initialValues = {
      id: generateUniqueId(),
      name: "",
      service: "",
      time: "",
      location: "",
      leadSource: seletedLeadSource.shortName,
      latitude: "",
      longitude: "",
      address: "",
      errors: "",
      input: text,
    };

    let parsedLeadData;

    if (leadSourceId === AUTO_GEN_LEAD_TYPES.OFI) {
      parsedLeadData = parseLeadTypeOfir(trimmedInput, initialValues);
    } else if (leadSourceId === AUTO_GEN_LEAD_TYPES.MIK) {
      parsedLeadData = parseLeadTypeMikey(trimmedInput, initialValues);
    } else if (leadSourceId === AUTO_GEN_LEAD_TYPES.CJC) {
      parsedLeadData = parseLeadTypeCjc(trimmedInput, initialValues);
    } else if (leadSourceId === AUTO_GEN_LEAD_TYPES.VPPC) {
      parsedLeadData = await parseLeadTypeVicMarket(
        trimmedInput,
        initialValues
      );
    }

    //console.log("after going thru parsing methods --- ", parsedLeadData);
    return parsedLeadData;
  };
  const handleLeadsUpload = async (values) => {
    const leadSourceId = Number(values.leadSource);
    const arrayOfLeads = values.leads;

    let results = [];

    for (let index = 0; index < arrayOfLeads.length; index++) {
      const element = arrayOfLeads[index];
      const parsedLead = await parseLeadByType(element.text, leadSourceId);
      checkforErrors(parsedLead);
      results.push(parsedLead);
    }

    setCurrentLeads((prevState) => {
      let ns = [...prevState, ...results];
      return ns;
    });
  };

  const checkforErrors = (object) => {
    const errorsCaught = [];
    object.name = "";
    const unknownServiceRegex = new RegExp(/\{404\}/, "gi");
    if (object.service.match(unknownServiceRegex)) {
      const err = "Services not found in storage";
      errorsCaught.push(err);
    }
    if (!validateObject(object)) {
      const err = `One or more properties were missing after parsing methods`;
      errorsCaught.push(err);
    }

    object.errors = errorsCaught.join(" // ");
  };

  return (
    <Container>
      <h1 className="text-center mt-4">Auto Entry</h1>
      <div className="d-flex justify-content-center">
        <Formik
          initialValues={INITIAL_VALUES}
          onSubmit={handleLeadsUpload}
          enableReinitialize={true}
          validationSchema={autoEntrySchema}
        >
          {({ values, handleReset }) => (
            <FormikForm
              className="border p-4 mt-5 mb-5 bg-light"
              style={{ width: "100%", maxWidth: 800 }}
            >
              <Row className="lead-source-select-row mb-3">
                {/* SELECT / UPLOAD / RESET */}
                <Col className="d-flex">
                  <div className="w-100">
                    <Field
                      className="form-control"
                      as="select"
                      name="leadSource"
                    >
                      <option value={0}> Select an option</option>
                      {leadSourceOptions.map(mapLeadGenOptions)}
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
                              <div className="col-2 text-center">
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
      </div>
    </Container>
  );
}