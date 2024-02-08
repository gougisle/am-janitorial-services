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
  const parseLeadTypeOfir = async (text, data) => {
    const lines = getSplitLines(text);

    const dateTimeLine = lines[2];
    const extractedDate = dateTimeLine.split(",")[2];

    const addressLine = lines[3];
    const geocodeData = await getGeoCodeData(addressLine);

    data.name = lines[0];
    data.jobType = lines[1];
    data.time = lines[2];
    data.location = geocodeData.location;
    data.latitude = geocodeData.latitude;
    data.longitude = geocodeData.longitude;
    data.address = geocodeData.fullAddress;
  };
  const parseLeadTypeMikey = async (text, data) => {
    const lines = getSplitLines(text);

    const addressLine = lines[3];

    const geocodeData = await getGeoCodeData(addressLine); // fetch the data for this address

    data.name = lines[0];
    data.jobType = cleanJobType(lines[4]);
    data.time = lines[2];
    data.location = geocodeData.location;
    data.latitude = geocodeData.latitude;
    data.longitude = geocodeData.longitude;
    data.address = geocodeData.fullAddress;

    function cleanJobType(jobTypeStr) {
      const pieces = jobTypeStr.split("-");
      const trimmed = pieces[1].trim();
      return trimmed;
    }
  };

  const parseLeadTypeCjc = async (text, data) => {
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
          data.name = value;
          break;
        case "Address":
          addressFromLead = value;
          break;
        case "Time":
          data.time = value;
          break;
        case "House size":
        case "Furnace":
          data.jobType = value + " ";
          break;
        default:
          break;
      }
    });

    if (addressFromLead) {
      geocodeData = await getGeoCodeData(addressFromLead);
      data.location = geocodeData.location;
      data.latitude = geocodeData.latitude;
      data.longitude = geocodeData.longitude;
      data.address = geocodeData.fullAddress;
    }
  };
  const parseLeadTypeVicMarket = async (text, data) => {
    const lines = getSplitLines(text); // splits all the lines
    const filteredLines = lines.filter((ln) => ln !== ""); //remove the empty lines

    const extractedName = filteredLines[3].split(" ")[0];
    const addressLine = filteredLines[4];

    const geocodeData = await getGeoCodeData(addressLine); // fetch the data for this address
    // console.log("geocodeData ---- ", geocodeData);

    const dateTimeLine = filteredLines[2].split(" "); //["01/15/2024", "4:00", "PM"]
    const extractedTime = dateTimeLine[1] + " " + dateTimeLine[2];

    data.name = extractedName;
    data.jobType = filteredLines[5];
    data.time = extractedTime;
    data.location = geocodeData.location;
    data.latitude = geocodeData.latitude;
    data.longitude = geocodeData.longitude;
    data.address = geocodeData.fullAddress;

    console.log("parseLeadTypeVicMarket data --- ", data);
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
  const parseLeadByType = (text, type) => {
    const trimmedInput = text.trim();
    const leadSourceName = LEAD_TYPES.filter((t) => t.id === type)[0].label;

    const leadDetails = {
      name: "",
      jobType: "",
      time: "",
      location: "",
      leadSource: leadSourceName, // this will come from the type
      latitude: "",
      longitude: "",
      address: "",
    };

    if (type === 1) {
      parseLeadTypeOfir(trimmedInput, leadDetails); //OFIR [geocode added]
    } else if (type === 2) {
      parseLeadTypeMikey(trimmedInput, leadDetails); //MIKEY [geocode added]
    } else if (type === 3) {
      console.log("not implemented");
    } else if (type === 4) {
      parseLeadTypeCjc(trimmedInput, leadDetails); //CJC [geocode added]
    } else if (type === 5) {
      parseLeadTypeVicMarket(trimmedInput, leadDetails); //Victor's Marketing [geocode added]
    }

    return leadDetails;
  };
  const handleLeadsUpload = async (values) => {
    const leadGenSourceId = Number(values.leadSource);
    const arrayOfLeads = values.leads;

    try {
      const parsedLeads = arrayOfLeads.map((lead) => {
        return parseLeadByType(lead.text, leadGenSourceId);
      });

      onUpload(parsedLeads);
    } catch (err) {
      console.error("handleLeadsUpload ::: ", err);
      toastr.error(
        "Something went wrong while uploading, please refresh and try again",
        "Could Not Upload"
      );
    }
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
                <div>
                  <Field
                    className="form-control w-100 "
                    as="select"
                    name="leadSource"
                  >
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
                <div>
                  <Button variant="success" type="submit" className="w-100">
                    Upload
                  </Button>
                </div>
                <div>
                  {" "}
                  <Button
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
