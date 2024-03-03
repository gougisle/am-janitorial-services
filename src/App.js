import React, { createContext, lazy, Suspense, useState } from "react";
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import PublicNav from "./components/PublicNav";
import "./App.css";

const AutoEntryForm = lazy(() => import("./views/AutoEntryForm"));
const ManualEntryForm = lazy(() => import("./views/ManualEntryForm"));
const GoogleMapView = lazy(() => import("./views/GoogleMapView"));

export const LeadStoreContext = createContext();

function App() {
  const [currentLeads, setCurrentLeads] = useState([]);

  return (
    <>
      <LeadStoreContext.Provider value={[currentLeads, setCurrentLeads]}>
        <PublicNav />
        <Router>
          <Suspense>
            <Routes>
              <Route path="/" element={<AutoEntryForm />}></Route>
              <Route path="/manual" element={<ManualEntryForm />}></Route>
              <Route
                path="/map"
                element={<GoogleMapView></GoogleMapView>}
              ></Route>
            </Routes>
          </Suspense>
        </Router>{" "}
      </LeadStoreContext.Provider>
    </>
  );
}

export default App;
