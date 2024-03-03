import React, { useContext } from "react";
import { Container, Button } from "react-bootstrap";
import { Formik, Field, Form as FormikForm, ErrorMessage } from "formik";
import { manualEntrySchema } from "../schemas/manualEntryShema";
import { generateUniqueId } from "../utils/utilityFunctions";
import AddressAutocomplete from "../components/AddressAutocomplete";
import { CONCISE_SERVICES_ARRAY, LEAD_SOURCES } from "../utils/constants";
import { LeadStoreContext } from "../App";

export default function ManualEntryForm() {
  const [currentLeads, setCurrentLeads] = useContext(LeadStoreContext);
  false && console.log(currentLeads);
  const INITIAL_VALUES = {
    id: generateUniqueId(),
    name: "",
    service: "",
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
        <div className="d-flex justify-content-center mt-4">
          <Formik
            initialValues={INITIAL_VALUES}
            enableReinitialize={true}
            validationSchema={manualEntrySchema}
            onSubmit={handleSubmit}
          >
            {({ handleReset }) => (
              <FormikForm
                style={{ width: "800px" }}
                className="border p-4 bg-light"
              >
                <div className="d-flex flex-column gap-2">
                  <div className="input-wrapper">
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
                  <div className="input-wrapper">
                    <label htmlFor="Job_Type">Job / Service:</label>
                    <Field
                      as="select"
                      className="form-control"
                      id="service"
                      name="service"
                      placeholder="ex. Carpet cleaning"
                    >
                      <option value={0}>Select an option...</option>
                      {CONCISE_SERVICES_ARRAY.map(mapServiceOption)}
                    </Field>

                    <div className="error-text">
                      <ErrorMessage
                        name="service"
                        component="div"
                        className="field-error "
                      />
                    </div>
                  </div>{" "}
                  <div className="input-wrapper">
                    <AddressAutocomplete></AddressAutocomplete>
                  </div>
                  <div className="input-wrapper">
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
                  <div className="input-wrapper">
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
                  <div className="button-wrapper d-flex flex-row justify-content-evenly gap-1">
                    <Button
                      type="submit"
                      variant="success"
                      className="p-2 w-50"
                    >
                      Upload
                    </Button>
                    <Button
                      type="button"
                      variant="outline-secondary"
                      className="p-2 w-50"
                      onClick={handleReset}
                    >
                      {" "}
                      Clear
                    </Button>
                  </div>
                </div>
              </FormikForm>
            )}
          </Formik>
        </div>
      </Container>
    </>
  );
}
