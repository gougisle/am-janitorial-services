import React, { useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Formik, Field, Form as FormikForm, ErrorMessage } from "formik";
import { manualEntrySchema } from "../schemas/manualEntryShema";
import toastr from "toastr";

export default function ManualEntryForm({ onUpload }) {
  const INITIAL_VALUES = {
    Name: "",
    Job_Type: "",
    Address: "",
    Time: "",
    Lead_Source: "",
    Notes: "",
  };

  const handleSubmit = (values) => {
    onUpload(values);
  };

  return (
    <>
      <Container>
        <h1 className="text-center mt-4">Manual Entry</h1>
        <Formik
          initialValues={INITIAL_VALUES}
          enableReinitialize={true}
          validationSchema={manualEntrySchema}
          onSubmit={handleSubmit}
        >
          {({ handleReset }) => (
            <FormikForm className="border p-4 mt-5 mb-5 bg-light">
              <div className="input-wrapper mb-3">
                <label htmlFor="Name">First Name</label>
                <Field
                  className="form-control"
                  id="Name"
                  name="Name"
                  placeholder="ex. John Smith"
                />
                <div className="error-text">
                  <ErrorMessage
                    name="Name"
                    component="div"
                    className="field-error "
                  />
                </div>
              </div>
              <div className="input-wrapper mb-3">
                <label htmlFor="Job_Type">Job Type:</label>
                <Field
                  className="form-control"
                  id="Job_Type"
                  name="Job_Type"
                  placeholder="ex. Carpet cleaning"
                />
                <div className="error-text">
                  <ErrorMessage
                    name="Job_Type"
                    component="div"
                    className="field-error "
                  />
                </div>
              </div>
              <div className="input-wrapper mb-3">
                <label htmlFor="Address">Address:</label>
                <Field
                  className="form-control"
                  id="Address"
                  name="Address"
                  placeholder="ex. 123 Main Street Los Angles, CA"
                />
                <div className="error-text">
                  <ErrorMessage
                    name="Address"
                    component="div"
                    className="field-error "
                  />
                </div>
              </div>
              <div className="input-wrapper mb-3">
                <label htmlFor="Time">
                  Time:{" "}
                  <i className="text-secondary">
                    (ex. '3pm-5pm', '3:00pm-5:00pm')
                  </i>{" "}
                </label>
                <Field
                  className="form-control"
                  id="Time"
                  name="Time"
                  placeholder="ex. 4:00 PM - 6:00 PM"
                />
                <div className="error-text">
                  <ErrorMessage
                    name="Time"
                    component="div"
                    className="field-error "
                  />
                </div>
              </div>
              <div className="input-wrapper mb-3">
                <label htmlFor="Lead_Source">Lead Source: </label>
                <Field
                  className="form-control"
                  id="Lead_Source"
                  name="Lead_Source"
                  placeholder=""
                />
                <div className="error-text">
                  <ErrorMessage
                    name="Lead_Source"
                    component="div"
                    className="field-error "
                  />
                </div>
              </div>
              {/* <div className="input-wrapper mb-3">
                <label htmlFor="Notes">Notes: </label>
                <Field
                  className="form-control"
                  id="Notes"
                  name="Notes"
                  placeholder="ex. Must wear mask and gloves"
                />
                <div className="error-text">
                  <ErrorMessage
                    name="Notes"
                    component="div"
                    className="field-error "
                  />
                </div>
              </div> */}

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
      </Container>
    </>
  );
}
