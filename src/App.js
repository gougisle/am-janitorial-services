import React, { useState } from "react";
import ManualEntryForm from "./components/ManualEntryForm";
import toastr from "toastr";
import { Container, Row, Col, Button } from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";
import { autoEntrySchema } from "./schemas/autoEntrySchema";
import {
  Formik,
  Field,
  Form as FormikForm,
  ErrorMessage,
  FieldArray,
} from "formik";
import PublicNav from "./components/PublicNav";
import "./App.css";
import AutoEntryForm from "./components/AutoEntryForm";
//TODO:
// [X] create service file to hold all the sheetsDB calls
// [X] add error handling to the form, should not be able to upload unless test is present
// [X] add toastr to provide feedback to user
// [X] clear the form after uploading
// [X] clear the state after exporting

function App() {
  const [leads, setLeads] = useState([]);

  const addSingleLeadToState = (singleLead) => {
    setLeads((prevState) => {
      let ns = [...prevState, singleLead];
      return ns;
    });
  };

  const addArrOfLeadsToState = (arrOfLeads) => {
    setLeads((prevState) => {
      let ns = [...prevState, ...arrOfLeads];
      return ns;
    });
  };

  const resetState = () => {
    setLeads([]);
  };
  return (
    <>
      {" "}
      <PublicNav leadsArr={leads} resetState={resetState}></PublicNav>
      <AutoEntryForm onUpload={addArrOfLeadsToState} />
      <ManualEntryForm onUpload={addSingleLeadToState} />
    </>
  );
}

export default App;
