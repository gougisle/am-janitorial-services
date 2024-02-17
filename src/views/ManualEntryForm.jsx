import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Formik, Field, Form as FormikForm, ErrorMessage } from "formik";
import { manualEntrySchema } from "../schemas/manualEntryShema";
import { generateUniqueId } from "../utils/utilityFunctions";
import AddressAutocomplete from "../components/AddressAutocomplete";

export default function ManualEntryForm({ onUpload }) {
  const INITIAL_VALUES = {
    id: generateUniqueId(),
    name: "",
    jobType: "",
    time: "",
    latitude: "", // hydrated indirectly via <AddressAutocomplete />
    longitude: "", // hydrated indirectly via <AddressAutocomplete />
    location: "", // hydrated indirectly via <AddressAutocomplete />
    address: "",
    leadSource: "",
  };

  const handleSubmit = (values) => {
    console.log(values);
    if (values) {
      onUpload(values);
    } else {
      console.error(
        "handleSubmit -- ManualEntryForm -- Did not receive values to upload"
      );
    }
  };

  return (
    <>
      <Container>
        <h1 className="text-center mt-4">Manual Entry</h1>
        <div className="d-flex justify-content-center">
          <Formik
            initialValues={INITIAL_VALUES}
            enableReinitialize={true}
            validationSchema={manualEntrySchema}
            onSubmit={handleSubmit}
          >
            {({ handleReset }) => (
              <FormikForm
                style={{ width: "100%" }}
                className="border p-4 mt-5 mb-5 bg-light"
              >
                <div className="input-wrapper mb-3">
                  <label htmlFor="Name">Client Name:</label>
                  <Field
                    className="form-control"
                    id="name"
                    name="name"
                    placeholder="ex. John Smith"
                  />
                  <div className="error-text">
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="field-error "
                    />
                  </div>
                </div>
                <div className="input-wrapper mb-3">
                  <label htmlFor="Job_Type">Job / Service:</label>
                  <Field
                    className="form-control"
                    id="jobType"
                    name="jobType"
                    placeholder="ex. Carpet cleaning"
                  />
                  <div className="error-text">
                    <ErrorMessage
                      name="jobType"
                      component="div"
                      className="field-error "
                    />
                  </div>
                </div>{" "}
                <Row className="input-wrapper mb-3">
                  <Col>
                    <AddressAutocomplete></AddressAutocomplete>
                  </Col>
                </Row>
                <div className="input-wrapper mb-3">
                  <label htmlFor="Time">Time: </label>
                  <Field
                    className="form-control"
                    id="time"
                    name="time"
                    placeholder="ex. 3pm-5pm"
                  />
                  <div className="error-text">
                    <ErrorMessage
                      name="time"
                      component="div"
                      className="field-error "
                    />
                  </div>
                </div>
                <div className="input-wrapper mb-3">
                  <label htmlFor="Lead_Source">Lead Source: </label>
                  <Field
                    className="form-control"
                    id="leadSource"
                    name="leadSource"
                    placeholder=""
                  />
                  <div className="error-text">
                    <ErrorMessage
                      name="leadSource"
                      component="div"
                      className="field-error "
                    />
                  </div>
                </div>
                <Button type="submit" className="btn btn-success w-25 p-2 me-3">
                  Upload
                </Button>
                <Button
                  type="button"
                  variant="outline-secondary"
                  className="w-25 p-2"
                  onClick={handleReset}
                >
                  {" "}
                  Clear
                </Button>
              </FormikForm>
            )}
          </Formik>
        </div>
      </Container>
    </>
  );
}
