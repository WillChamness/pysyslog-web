import mongoose from "mongoose";

/*
 * Defines the structure of the Syslog message to be put into the Mongo database.
 */
const logSchema: mongoose.Schema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  facility: { type: Number, required: true },
  severity: { type: Number, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  hostname: { type: String, required: true },
  tag: String,
  content: String,
});

export default mongoose.model("Syslog", logSchema, "logs");
