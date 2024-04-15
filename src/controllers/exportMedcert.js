const pg = require("pg");
const config = require("../../config");
const fs = require("fs").promises;
const path = require("path");
const { PDFDocument, rgb } = require("pdf-lib");

module.exports = {
  exportMedcert: async (req, res) => {
    try {
      const formPath = "../documents/medicalCertificatePDF.pdf";
      const formUrl = path.resolve(__dirname, formPath);
      const destinationPDF = path.resolve(__dirname, "medicalCertificate.pdf");

      // Read the source PDF
      const pdfBuffer = await fs.readFile(formUrl);

      // Load the PDF document
      const pdfDoc = await PDFDocument.load(pdfBuffer);

      // Get the form fields from the PDF
      const form = pdfDoc.getForm();

      // Define the data to fill into the form fields
      const data = {
        fullName: "John Doe",
        age: "25",
        gender: "Male",
        facilityName: "True Medical Hospital"
      };

      // Set the value for the "fullname" field
      form.getTextField("fullName").setText(data.fullName);
      form.getTextField("age").setText(data.age);
      form.getTextField("gender").setText(data.gender);
      form.getTextField("facilityName").setText(data.facilityName);

      // Save the modified PDF to a new file
      const modifiedPdfBytes = await pdfDoc.save();
      await fs.writeFile(destinationPDF, modifiedPdfBytes);

      return res
        .status(200)
        .json({ result: { message: "PDF form filled successfully" } });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
