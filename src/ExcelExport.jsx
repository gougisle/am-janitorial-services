import React from "react";
import * as FileSaver from "file-saver";
import XLSX from "sheetjs-style";
import { Button } from "react-bootstrap";

export default function ExcelExport({ excelData, fileName }) {
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheet.sheet;char=UTF-8";
  const fileExtension = ".xlsx";

  const exportToExcel = async () => {
    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };

  return (
    <>
      <Button disabled onClick={exportToExcel}>
        Export File
      </Button>
    </>
  );
}
