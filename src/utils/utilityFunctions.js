function generateUniqueId() {
  // Generate a timestamp
  var timestamp = Date.now().toString(36);
  // Generate a random string
  var randomStr = Math.random().toString(36).substring(2);
  // Concatenate the timestamp and random string to create the unique ID
  var uniqueId = timestamp + randomStr;
  return uniqueId;
}

export { generateUniqueId };
