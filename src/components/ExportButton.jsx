import React, { useState } from "react";
import { Button } from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";
import toastr from "toastr";
import { getLeadsFromStorage } from "../utils/utilityFunctions";

export default function ExportButton({ leadData, reset }) {
  const [isExporting, setIsExporting] = useState(false);

  const currentLeads = getLeadsFromStorage();

  const onExportPostResponse = (res) => {
    console.log("Exported the follwing: ", res);
    toastr.success(
      "Your Google Sheets document has been updated",
      "Export Successful"
    );
    clearLeadsFromStorage();
    setIsExporting(false);
  };

  const clearLeadsFromStorage = () => {
    window.sessionStorage.setItem("currentLeads", "");
  };

  const addRowsToGoogleSheetV2 = (rowsData) => {
    fetch(process.env.REACT_APP_BEST_SHEET_API_URL, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(rowsData),
    })
      .then((r) => r.json())
      .then((data) => {
        // The response comes here
        onExportPostResponse(data);
        console.log(data);
      })
      .catch((error) => {
        // Errors are reported there
        toastr.error("Unable to Export data", "Error");
        console.log(error);
      });
  };

  const handleExport = () => {
    setIsExporting(true);
    addRowsToGoogleSheetV2(currentLeads);
  };

  return (
    <>
      {" "}
      <Button
        disabled={!currentLeads}
        className="btn btn-warning w-100"
        type="button"
        onClick={handleExport}
      >
        {" "}
        {isExporting ? (
          <Spinner animation="border" size="sm" />
        ) : (
          <span>Export to Google Sheets ({currentLeads?.length || 0})</span>
        )}
      </Button>
    </>
  );
}
