import React, { useContext } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Formik, Field, Form as FormikForm, ErrorMessage } from "formik";
import { manualEntrySchema } from "../schemas/manualEntryShema";
import { generateUniqueId } from "../utils/utilityFunctions";
import AddressAutocomplete from "../components/AddressAutocomplete";
import { SERVICES_ARRAY, LEAD_SOURCES } from "../utils/constants";
import { LeadStoreContext } from "../App";

export default function ManualEntryForm({ onUpload }) {
  const [currentLeads, setCurrentLeads] = useContext(LeadStoreContext);
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
    const addSingleLeadToState = (newLead) => {
      setCurrentLeads((prevState) => {
        let ns = [...prevState];
        ns.push(newLead);
        return ns;
      });
    };

    if (values) {
      addSingleLeadToState(values);
    } else {
      console.error(
        "handleSubmit -- ManualEntryForm -- Did not receive values to upload"
      );
    }
  };

  const mapServiceOption = (service) => {
    return (
      <option key={service.id} value={service.code}>
        {" "}
        {service.name} - {service.code}
      </option>
    );
  };

  const mapLeadSourceOption = (source) => {
    return (
      <option key={source.id} value={source.shortName}>
        {" "}
        {source.shortName}
      </option>
    );
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
                style={{ width: "50%" }}
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
                    as="select"
                    className="form-control"
                    id="jobType"
                    name="jobType"
                    placeholder="ex. Carpet cleaning"
                  >
                    <option value={0}>Select an option...</option>
                    {SERVICES_ARRAY.map(mapServiceOption)}
                  </Field>

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
                    as="select"
                    className="form-control"
                    id="leadSource"
                    name="leadSource"
                  >
                    <option value={0}>Select an option...</option>
                    {LEAD_SOURCES.map(mapLeadSourceOption)}
                    <option value={"other"}> Other</option>
                  </Field>
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
