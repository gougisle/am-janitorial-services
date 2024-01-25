import toastr from "toastr";
import axios from "axios";

const sheetsEndpoint = "https://sheetdb.io/api/v1/hk4c7n1fx6cgv";

const onExportSuccess = (res) => {
  console.log(res);
  if (res.created) {
    toastr.success(`Successfully added ${res.created} new records`);
  }

  if (res.error) {
    toastr.error(`Unable to export data - Error: ${res.error}`);
  }
};

const addRowsToGoogleSheet = (rowsData) => {
  fetch(sheetsEndpoint, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      data: rowsData,
    }),
  })
    .then((response) => Promise.resolve(response))
    .catch((error) => Promise.reject(error));
};

export { addRowsToGoogleSheet };
