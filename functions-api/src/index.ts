import express from "express";
import cors from "cors";
import { onRequest } from "firebase-functions/v2/https";
import { setGlobalOptions } from "firebase-functions/v2";
import { pathHeartbeat, pathGenText, pathGetToken, pathReplyChat } from "./lib/consts/paths.js";
import heartbeat from "./lib/routes/heartbeat.js";
import { genText, replyChat } from "./lib/routes/genText.js";
import getToken from "./lib/routes/getToken.js";

const app = express();

const allowedOrigins = [
  "https://okmethod-gemini-trial.web.app",
  "https://okmethod-gemini-trial.firebaseapp.com",
  "http://localhost:5173",
];

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

app.use(express.json());

app.get(pathHeartbeat, heartbeat);
app.post(pathGenText, genText);
app.post(pathGetToken, getToken);
app.post(pathReplyChat, replyChat);

setGlobalOptions({ region: "asia-northeast1" });

export const api = onRequest(app);

// for local only
if (process.env.NODE_ENV !== "production") {
  const host = process.env.LOCAL_HOST || "0.0.0.0";
  const port = process.env.LOCAL_PORT || 3000;
  app.listen(port as number, host as string, () => {
    console.log(`Server is running on ${host}:${port}`);
  });
}
