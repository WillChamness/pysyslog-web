import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import mongoose from "mongoose";
import syslogRoutes from "./api/routes/syslog";
import bodyParser from "body-parser";

// connecting to the DB
const mongoUri =
  process.env.MONGODB_URI || "mongodb://mongoadmin:m0ngoadminPW!@127.0.0.1";
mongoose.connect(mongoUri, {
  dbName: "syslog",
});

// creating web app
const app: Application = express();

// body parsing
app.use(
  bodyParser.urlencoded({
    extended: false,
  }),
);
app.use(bodyParser.json());

// cors & content security policy
app.use(cors());
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self' data: gap: 'self' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; media-src *; script-src 'self' 'unsafe-inline' 'unsafe-eval';",
  );
  next();
});

// API
app.use("/api/syslog", syslogRoutes);

export default app;
