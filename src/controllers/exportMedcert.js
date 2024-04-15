const pg = require("pg");
const config = require("../../config");
const { PDFDocument } = require("pdf-lib");
const fs = require("fs").promises;
const path = require("path");

module.exports = {
  exportMedcert: async (req, res) => {
    try {
      const formPath = "../documents/medicalCertificate.pdf";
      const formUrl = path.resolve(__dirname, formPath);

      // Check if the file exists
      try {
        await fs.access(formUrl);
        console.log("File exists!");
      } catch (error) {
        console.error("File does not exist:", error);
        return res.status(404).json({ error: "PDF file not found" });
      }

      // Read the PDF file
      let pdfBytes;
      try {
        pdfBytes = await fs.readFile(formUrl);
      } catch (error) {
        console.error("Error reading PDF file:", error);
        return res.status(500).json({ error: "Failed to read PDF file" });
      }

      // Load the PDF document
      let pdfDoc;
      try {
        pdfDoc = await PDFDocument.load(pdfBytes);
      } catch (error) {
        console.error("Error loading PDF document:", error);
        return res.status(500).json({ error: "Failed to load PDF document" });
      }

      // Get the form fields and fill in the text fields
      const form = pdfDoc.getForm();
      const fullName = form.getTextField("fullname");
      fullName.setText("Mario");

      // Save the modified PDF
      let modifiedPdfBytes;
      try {
        modifiedPdfBytes = await pdfDoc.save();
      } catch (error) {
        console.error("Error saving modified PDF:", error);
        return res.status(500).json({ error: "Failed to save modified PDF" });
      }

      // Verify the modified PDF
      if (!modifiedPdfBytes || modifiedPdfBytes.length === 0) {
        console.error("Modified PDF is empty or invalid");
        return res.status(500).json({ error: "Modified PDF is empty or invalid" });
      }

      // Set response headers and send the modified PDF as the response
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "attachment; filename=modified.pdf");
      res.send(modifiedPdfBytes);
    } catch (error) {
      console.error("Error generating med cert:", error);
      res.status(500).json({ error: error.message });
    }
  },
};
