function generateUniqueId() {
  // Generate a timestamp
  var timestamp = Date.now().toString(36);

  // Generate a random string
  var randomStr = Math.random().toString(36).substring(2);

  // Concatenate the timestamp and random string to create the unique ID
  var uniqueId = timestamp + randomStr;

  return uniqueId;
}

const getLeadsFromStorage = () => {
  const leadsFromStorage = window.sessionStorage.getItem("currentLeads");
  if (leadsFromStorage) {
    console.log(JSON.parse(leadsFromStorage));
    return JSON.parse(leadsFromStorage);
  } else {
    return null;
  }
};

export { generateUniqueId, getLeadsFromStorage };
