import * as express from "express";
import * as cors from "cors";
import { onRequest } from "firebase-functions/v2/https";
import { setGlobalOptions } from "firebase-functions/v2";
import getToken from "./getToken";
import chatReply from "./chatReply";

const app = express();

const allowedOrigins = ["https://okmethod-gemini-trial.web.app", "https://okmethod-gemini-trial.firebaseapp.com"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  }),
);

app.post("/api/get-token", getToken);
app.post("/api/chat-reply", chatReply);

setGlobalOptions({ region: "asia-northeast1" });
exports.api = onRequest(app);
