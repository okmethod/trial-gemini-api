/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import * as express from "express";
import * as cors from "cors";
import * as functions from "firebase-functions";

const app = express();

const allowedOrigins = ["https://okmethod-gemini-trial.web.app", "https://okmethod-gemini-trial.firebaseapp.com"];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
}));


app.get("/api/api-key", (_, res) => {
  const apiKey = functions.config().api?.key;
  if (!apiKey) {
    res.status(500).json({error: "API key not configured"});
  } else {
    res.json({apiKey});
  }
});

exports.api = functions.region("asia-northeast1").https.onRequest(app);

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
