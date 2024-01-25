import React, { useState } from "react";
import { Button } from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";
import toastr from "toastr";

export default function ExportButton({ leadData, reset }) {
  const [isExporting, setIsExporting] = useState(false);

  const onExportPostResponse = (res) => {
    console.log(res);
    if (res.created) {
      toastr.success(
        "Your Google Sheets document has been updated",
        "Export Successful"
      );
      reset();
    }
    if (res.error) {
      toastr.error("Fail");
    }
    setIsExporting(false);
  };

  //need to move this API KEY to .env file
  const addRowsToGoogleSheet = (rowsData) => {
    fetch(process.env.REACT_APP_SHEETS_DB_PRIVATE_KEY, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: rowsData,
      }),
    })
      .then((response) => response.json())
      .then(onExportPostResponse);
  };

  const handleExport = () => {
    setIsExporting(true);
    addRowsToGoogleSheet(leadData);
  };

  return (
    <>
      {" "}
      <Button
        disabled={leadData.length < 1}
        className="btn btn-warning w-100"
        type="button"
        onClick={handleExport}
      >
        {" "}
        {isExporting ? (
          <Spinner animation="border" size="sm" />
        ) : (
          <span>Export to Google Sheets ({leadData.length})</span>
        )}
      </Button>
    </>
  );
}
