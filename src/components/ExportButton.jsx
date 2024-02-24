import React, { useState, useContext } from "react";
import { Button } from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";
import toastr from "toastr";
import { LeadStoreContext } from "../App";

export default function ExportButton() {
  const [isExporting, setIsExporting] = useState(false);
  const [currentLeads, setCurrentLeads] = useContext(LeadStoreContext);

  const onExportSucces = (res) => {
    console.log("Exported the following data: ", res);
    toastr.success(
      "Your Google Sheets document has been updated.",
      "Export Successful"
    );
    setCurrentLeads([]);
    setIsExporting(false);
  };

  const onExportError = (err) => {
    console.log("Export failed with the following: ", err);
    toastr.error(
      "Export failed due to some unexpected error.",
      "Export Failed"
    );
    setIsExporting(false);
  };

  const addRowsToGoogleSheet = (rowsData) => {
    fetch(process.env.REACT_APP_BEST_SHEET_API_URL, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(rowsData),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Export failed");
      })
      .then((data) => {
        onExportSucces(data);
      })
      .catch((error) => {
        onExportError(error);
      });
  };

  const handleExport = () => {
    setIsExporting(true);
    addRowsToGoogleSheet(currentLeads);
  };

  return (
    <>
      {" "}
      <Button
        disabled={currentLeads?.length < 1}
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
