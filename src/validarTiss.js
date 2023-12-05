const fs = require("fs");
const xmlData = fs.readFileSync("./src/remessa.xml", "utf8");
const xsdData = fs.readFileSync("./src/tissXSD/3_05_00.xsd", "utf8");

const libxmljs = require("libxmljs");
const xmlDoc = libxmljs.parseXml(xmlData);
const xsdDoc = libxmljs.parseXml(xsdData);
const isValid = xmlDoc.validate(xsdDoc);

if (isValid) {
  console.log("XML is valid according to the schema.");
} else {
  console.log("XML is not valid according to the schema.");
  console.log(xmlDoc.validationErrors); // Log any validation errors
}
