import express, { Router } from "express";
import SyslogController from "../controllers/syslog";
import { simpleValidate } from "../middleware/check-syslog-syntax";

// creating the router
const router: Router = express.Router();

// Creating the routes to /api/syslog
router.get("/", SyslogController.getAll);
router.get("/:hostname", SyslogController.getByHostname);
router.post("/", simpleValidate, SyslogController.postSendSyslogMessage);

export default router;
