import { Request, Response } from "express";
import Syslog from "../models/syslog";
import dgram from "node:dgram";
import { Buffer } from "node:buffer";

type SyslogMessage = {
  facility: number;
  severity: number;
  date: string;
  time: string;
  hostname: string;
  tag: string;
  content: string;
};

/*
 * Wrapper class that contains all the logic for GET and POST requests
 */
export default class SyslogController {
  /*
   * Retrieves ALL syslog messages in the Mongo database.
   */
  static async getAll(req: Request, res: Response) {
    try {
      const docs = await Syslog.find().exec();
      if (docs)
        res.status(200).json({
          count: docs.length,
          logs: docs.map((doc) => {
            const log: SyslogMessage = {
              facility: doc.facility,
              severity: doc.severity,
              date: doc.date,
              time: doc.time,
              hostname: doc.hostname,
              tag: doc.tag || "(null)",
              content: doc.content || "(null)",
            };
            return log;
          }),
        });
      else res.status(404).json({ error: "No logs found" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: err });
    }
  }

  /*
   * Searches the Mongo database for logs sent by specific hosts.
   */
  static async getByHostname(req: Request, res: Response) {
    try {
      const docs = await Syslog.find({ hostname: req.params.hostname });
      if (docs)
        res.status(200).json({
          count: docs.length,
          logs: docs.map((doc) => {
            const log: SyslogMessage = {
              facility: doc.facility,
              severity: doc.severity,
              date: doc.date,
              time: doc.time,
              hostname: doc.hostname,
              tag: doc.tag || "(null)",
              content: doc.content || "(null)",
            };
            return log;
          }),
        });
      else
        res.status(404).json({
          error: `Could not find syslog with hostname '${req.params.hostname}`,
        });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: err });
    }
  }

  /*
   * Performs UDP socket programming on behalf of the browser.
   */
  static async postSendSyslogMessage(req: Request, res: Response) {
    const log: SyslogMessage = {
      facility: Number.parseInt(req.body.facility),
      severity: Number.parseInt(req.body.severity),
      date: req.body.date,
      time: req.body.time,
      hostname: req.body.hostname,
      tag: req.body.tag || "(null)",
      content: req.body.content || "(null)",
    };

    const pri: string = "<" + (8 * log.facility + log.severity) + ">";
    const header: string =
      "" + log.date + " " + log.time + " " + log.hostname + " "; // extra space intended; use string concatination, not embedded expression
    const msg: string = "" + log.tag + log.content; // lack of space intended

    const bytes: Buffer = Buffer.from(pri + header + msg);

    const host_address: string = process.env.SYSLOG_SERVER_ADDR || "127.0.0.1";
    let host_port: number;
    if (process.env.SYSLOG_SERVER_PORT)
      host_port = Number.parseInt(process.env.SYSLOG_SERVER_PORT);
    else host_port = 514;

    // send the log
    const socket = dgram.createSocket("udp4");
    socket.send(bytes, 0, bytes.length, host_port, host_address, (err) => {
      socket.close();
      if (err) {
        console.log(err);
        res.status(500).json({ error: err });
      } else {
        console.log("UDP message sent");
        res.status(202).json({ status: "sent" });
      }
    });
  }
}
