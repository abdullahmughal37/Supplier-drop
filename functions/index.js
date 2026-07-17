// SupplierDrop Cloud Functions.
//
// notifyOnSourcingRequest: whenever a merchant creates a sourcing request,
// queue an email to the addresses configured in Admin → Settings
// ("Notification emails"). Actual delivery is handled by the official
// "Trigger Email from Firestore" extension watching the `mail` collection —
// install it from the Firebase console and point it at collection `mail`.
//
// Deploy: firebase deploy --only functions   (requires the Blaze plan)
const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

initializeApp();

const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );

exports.notifyOnSourcingRequest = onDocumentCreated(
  "sourcingRequests/{id}",
  async (event) => {
    const req = event.data && event.data.data();
    if (!req) return;

    const db = getFirestore();
    const settings = (await db.doc("settings/global").get()).data() || {};
    const to = String(settings.notifyEmails || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (to.length === 0) return;

    await db.collection("mail").add({
      to,
      message: {
        subject: `New sourcing request: ${req.productName || "unknown product"}`,
        html: [
          `<h2>New sourcing request</h2>`,
          `<p><b>Product:</b> ${esc(req.productName)} (SKU: ${esc(req.productSku || "n/a")})</p>`,
          `<p><b>Merchant:</b> ${esc(req.merchantName)} &lt;${esc(req.merchantEmail)}&gt;</p>`,
          req.note ? `<p><b>Note:</b> ${esc(req.note)}</p>` : "",
          `<p>Open the admin dashboard → Requests to follow up.</p>`,
        ].join("\n"),
      },
    });
  }
);
