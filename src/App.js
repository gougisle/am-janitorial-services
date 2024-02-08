import React, { lazy, useState, Suspense } from "react";
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import PublicNav from "./components/PublicNav";
import "./App.css";

const AutoEntryForm = lazy(() => import("./views/AutoEntryForm"));
const ManualEntryForm = lazy(() => import("./views/ManualEntryForm"));
const GoogleMapView = lazy(() => import("./views/GoogleMapView"));

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
      <PublicNav leadsArr={leads} resetState={resetState} />
      <Router>
        <Suspense>
          <Routes>
            <Route
              path="/"
              element={<AutoEntryForm onUpload={addArrOfLeadsToState} />}
            ></Route>
            <Route
              path="manual"
              element={<ManualEntryForm onUpload={addSingleLeadToState} />}
            ></Route>
            <Route path="map" element={<GoogleMapView></GoogleMapView>}></Route>
          </Routes>
        </Suspense>
      </Router>
    </>
  );
}

export default App;
