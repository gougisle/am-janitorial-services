import React, { lazy, Suspense } from "react";
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import PublicNav from "./components/PublicNav";
import { Button } from "react-bootstrap";
import "./App.css";

const AutoEntryForm = lazy(() => import("./views/AutoEntryForm"));
const ManualEntryForm = lazy(() => import("./views/ManualEntryForm"));
const GoogleMapView = lazy(() => import("./views/GoogleMapView"));

function App() {
  //REMOVE the state later

  const addSingleLeadToState = (singleLead) => {
    let newLeadsArr = [];

    const storedLeads = getLeadsFromStorage();

    if (storedLeads && storedLeads.length > 0) {
      newLeadsArr = [...storedLeads];
      newLeadsArr.push(singleLead);
    } else {
      newLeadsArr.push(singleLead);
    }
    window.sessionStorage.setItem("currentLeads", JSON.stringify(newLeadsArr));
  };

  const addArrOfLeadsToState = (arrOfLeads) => {
    let newLeadsArr = [];

    const storedLeads = getLeadsFromStorage();

    if (storedLeads && storedLeads.length > 0) {
      newLeadsArr = [...storedLeads, ...arrOfLeads];
    } else {
      newLeadsArr = [...arrOfLeads];
    }

    window.sessionStorage.setItem("currentLeads", JSON.stringify(newLeadsArr));
  };

  const getLeadsFromStorage = () => {
    const leadsFromStorage = window.sessionStorage.getItem("currentLeads");
    if (leadsFromStorage) {
      console.log(JSON.parse(leadsFromStorage));
      return JSON.parse(leadsFromStorage);
    } else {
      console.log("No leads in storage");
      return null;
    }
  };
  return (
    <>
      {" "}
      <PublicNav />
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
