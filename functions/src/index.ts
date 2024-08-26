/* eslint-disable object-curly-spacing */

import * as express from "express";
import * as cors from "cors";
import * as functions from "firebase-functions";
import getToken from "./getToken";
import chatReply from "./chatReply";

const app = express();

const allowedOrigins = [
  "https://okmethod-gemini-trial.web.app",
  "https://okmethod-gemini-trial.firebaseapp.com",
];

app.use(
  cors({
    origin: function(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

app.post("/api/get-token", getToken);
app.post("/api/chat-reply", chatReply);

exports.api = functions.region("asia-northeast1").https.onRequest(app);
