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
  const parseLeadTypeOfir = (text, data) => {
    const lines = getSplitLines(text);

    const dateTimeLine = lines[2];
    const extractedDate = dateTimeLine.split(",")[2];

    data["Name"] = lines[0];
    data["Job_Type"] = lines[1];
    data["Date_Time"] = lines[2];
    data["Address"] = lines[3];

    const additional = lines.slice(7);
    let additionalAsStr = "";

    additional.forEach((item) => {
      additionalAsStr = additionalAsStr + " " + item;
    });
    data["Notes"] = additionalAsStr;
  };
  const parseLeadTypeMikey = (text, data) => {
    const lines = getSplitLines(text);

    data["Name"] = lines[0];
    data["Job_Type"] = cleanJobType(lines[4]);
    data["Date_Time"] = lines[2];
    data["Address"] = lines[3];

    function cleanJobType(jobTypeStr) {
      const pieces = jobTypeStr.split("-");
      const trimmed = pieces[1].trim();
      return trimmed;
    }
  };
  const parseLeadTypeCjc = (text, data) => {
    const lines = getSplitLines(text);

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
          data["Name"] = value;
          break;
        case "Address":
          data["Address"] = value;
          break;
        case "Date/Day":
          data["Date_Time"] = data["Date_Time"] + value;
          break;
        case "Time":
          data["Date_Time"] = value;
          break;
        case "House size":
        case "Furnace":
          data["Job_Type"] = value + " ";
          break;
        default:
          data["Notes"] = value || null;
          break;
      }
    });
  };
  const parseLeadTypeVicMarket = (text, data) => {
    const lines = getSplitLines(text); // splits all the lines
    const filteredLines = lines.filter((ln) => ln !== ""); //remove the empty lines

    const extractedName = filteredLines[3].split(" ")[0];

    const dateTimeLine = filteredLines[2].split(" "); //["01/15/2024", "4:00", "PM"]
    const extractedTime = dateTimeLine[1] + " " + dateTimeLine[2];

    const notesLines = filteredLines[filteredLines.length - 1];
    const extractedNotes = notesLines.split(":")[1].trim();

    data["Name"] = extractedName;
    data["Address"] = filteredLines[4];
    data["Date_Time"] = filteredLines[2];
    data["Job_Type"] = filteredLines[5];
    data["Notes"] = extractedNotes;
  };

  //#endregion
  //#region UTILITY
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
      Name: "",
      Job_Type: "",
      Address: "",
      Date_Time: "",
      Lead_Source: leadSourceName, // this will come from the type
      Notes: null,
    };

    if (type === 1) {
      parseLeadTypeOfir(trimmedInput, leadDetails); //OFIR
    } else if (type === 2) {
      parseLeadTypeMikey(trimmedInput, leadDetails); //MIKEY
    } else if (type === 3) {
      console.log("not implemented");
    } else if (type === 4) {
      parseLeadTypeCjc(trimmedInput, leadDetails); //CJC
    } else if (type === 5) {
      parseLeadTypeVicMarket(trimmedInput, leadDetails); //Victor's Marketing
    }
    // const jsonString = JSON.stringify(leadDetails, null, 2);
    // console.log("FINAL JSON >>>>> ", jsonString);

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

      //   setLeads((prevState) => {
      //     let ns = [...prevState, ...parsedLeads];
      //     return ns;
      //   },
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
