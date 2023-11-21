import { Request, Response, NextFunction } from "express";
import { make, InitialRules } from "simple-body-validator";

/*
 * Middleware that performs extremely simple validation.
 *
 * Does not check the contents of the Syslog message. Instead,
 * this is assumed to be done by the Syslog collector.
 */
export function simpleValidate(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const log: object = {
    facility: req.body.facility,
    severity: req.body.severity,
    date: req.body.date,
    time: req.body.time,
    hostname: req.body.hostname,
    tag: req.body.tag,
    content: req.body.content,
  };

  const rules: InitialRules = {
    facility: "required|integer",
    severity: "required|integer",
    date: "required|string",
    time: "required|string",
    hostname: "required|string",
    tag: "string|nullable",
    content: "string|nullable",
  };

  const validator = make(log, rules);

  if (validator.validate()) next();
  else
    res
      .status(400)
      .json({ error: "Bad input", badInputs: validator.errors().all() });
}
