const PDFDocument = require("pdfkit");
const Franchise = require("../models/Franchise");

exports.generateAgreementPDF = async (franchise) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const chunks = [];

      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", reject);

      // Header
      doc.fontSize(20).text("FRANCHISE AGREEMENT", { align: "center" });
      doc.moveDown();

      // Agreement Details
      doc.fontSize(12);
      doc.text(`Franchise Code: ${franchise.franchiseCode}`);
      doc.text(`Date: ${new Date().toLocaleDateString("en-IN")}`);
      doc.moveDown();

      doc.fontSize(14).text("PARTIES", { underline: true });
      doc.fontSize(12);
      doc.moveDown(0.5);
      doc.text("This Agreement is entered into between:");
      doc.moveDown();
      doc.text('1. UPL-SNIPE Partner  (Hereinafter referred to as "Company")');
      doc.moveDown();
      doc.text(
        `2. ${franchise.businessName} (Hereinafter referred to as "Franchise")`
      );
      doc.text(`   Owner: ${franchise.ownerName}`);
      doc.text(
        `   Address: ${franchise.address.street || ""}, ${
          franchise.address.city
        }, ${franchise.address.state} - ${franchise.address.pincode}`
      );
      doc.moveDown();

      // Terms and Conditions
      doc.fontSize(14).text("TERMS AND CONDITIONS", { underline: true });
      doc.fontSize(12);
      doc.moveDown(0.5);

      const terms = [
        "1. The Franchise agrees to operate the business in accordance with the standards set by the Company.",
        "2. The Franchise shall maintain confidentiality of all proprietary information.",
        "3. The Franchise agrees to pay all applicable fees and royalties as per the schedule.",
        "4. The Company reserves the right to terminate this agreement in case of breach of terms.",
        "5. The Franchise shall comply with all local, state, and federal laws and regulations.",
        "6. This agreement shall be valid for a period as specified in the master agreement.",
        "7. Any disputes arising from this agreement shall be subject to jurisdiction of the courts.",
        "8. The Franchise acknowledges that they have read and understood all terms and conditions.",
        "9. The Franchise agrees to participate in training programs as required by the Company.",
        "10. Both parties agree to act in good faith and maintain professional conduct.",
      ];

      terms.forEach((term) => {
        doc.text(term, { align: "left" });
        doc.moveDown(0.3);
      });

      doc.moveDown();

      // Signature Section
      doc.moveDown();
      doc.fontSize(12);
      doc.text("Accepted and Agreed:");
      doc.moveDown(2);

      // Company Signature
      doc.text("_________________________", { continued: false });
      doc.text("Company Representative", { continued: false });
      doc.moveDown(1.5);

      // Franchise Signature
      doc.text("_________________________", { continued: false });
      doc.text(`${franchise.ownerName}`, { continued: false });
      doc.text("Franchise Owner", { continued: false });
      doc.moveDown();

      doc.fontSize(10);
      doc.text(
        `Date of Acceptance: ${
          franchise.agreementAcceptedAt
            ? new Date(franchise.agreementAcceptedAt).toLocaleDateString(
                "en-IN"
              )
            : "N/A"
        }`
      );
      doc.moveDown();

      // Footer
      doc
        .fontSize(8)
        .text(
          "This is a computer-generated document. Original signed copy is maintained in company records.",
          { align: "center" }
        );

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};
