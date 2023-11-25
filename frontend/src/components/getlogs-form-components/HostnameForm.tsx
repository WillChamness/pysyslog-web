import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import { ChangeEvent, MouseEvent, useState } from "react";
import { validateHostname } from "../../SyslogValidator";
import "../../styles/RowSeparator.css";

// global to be injected after build time during production
declare global {
  var BROWSER_SYSLOG_API_ENV: {
    baseUrl: string;
    apiPath: string;
  };
}

const FACILITIES: string[] = [
  "Kernel (0)",
  "User-level (1)",
  "Mail (2)",
  "System daemons (3)",
  "Security/authorization (4)",
  "Syslog Internal (5)",
  "Printer (6)",
  "Network news (7)",
  "UUCP (8)",
  "Clock daemon (9)",
  "Security/authorization (10)",
  "FTP (11)",
  "NTP (12)",
  "Log audit (13)",
  "Log alert (14)",
  "Clock daemon (15)",
  "Local0 (16)",
  "Local1 (17)",
  "Local2 (18)",
  "Local3 (19)",
  "Local4 (20)",
  "Local5 (21)",
  "Local6 (22)",
  "Local7 (23)",
];

const SEVERITIES: string[] = [
  "Emergency (0)",
  "Alert (1)",
  "Critical (2)",
  "Error (3)",
  "Warning (4)",
  "Notice (5)",
  "Informational (6)",
  "Debug (7)",
];

interface HostnameFormProps {
  setLogs: (newLogs: string[][]) => void;
}

function HostnameForm({ setLogs }: HostnameFormProps) {
  const tooltip = (
    <Tooltip>
      Represents the sending device. Can either be a DNS hostname or an IP
      address.
      <br />
      <br />
      The only characters allowed are alphanumeric characters and the '-' and
      '.' characters.
    </Tooltip>
  );
  const [hostname, setHostname] = useState("");
  const [valid, setValid] = useState(false);

  // handler for submit button
  const handleSubmit = (event: MouseEvent) => {
    event.preventDefault();
    if (!valid) {
      const emptyArray: string[][] = [[]];
      setLogs(emptyArray);
    } else getLogs(setLogs, hostname);
  };

  // handler for "Get All" button
  const handleClick = () => {
    getLogs(setLogs);
  };

  // handler for textbox
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newHostname = event.target.value;
    setHostname(newHostname);
    const hostnameIsValid = validateHostname(newHostname);
    setValid(hostnameIsValid);
  };

  return (
    <Container>
      <form>
        <Form.Group>
          <Row>
            <Col className="col-2">
              <Form.Label htmlFor="hostname-input">Hostname:</Form.Label>
            </Col>
          </Row>
          <Row className="mb-2">
            <Col className="col-md-7 col-6">
              <OverlayTrigger
                trigger="focus"
                overlay={tooltip}
                placement="right"
              >
                <div>
                  <Form.Control
                    id="hostname-input"
                    type="text"
                    placeholder="localhost"
                    onChange={handleChange}
                    isInvalid={!valid}
                  ></Form.Control>
                  <Form.Control.Feedback type="invalid">
                    Must be a valid hostname!
                  </Form.Control.Feedback>
                </div>
              </OverlayTrigger>
            </Col>
          </Row>
          <Row>
            <Col className="col-md-5 col-4">
              <Button
                type="submit"
                onClick={handleSubmit}
                variant="info"
                style={{ marginLeft: "5px" }}
              >
                Submit
              </Button>
            </Col>
            <Col>
              <Button
                type="button"
                onClick={handleClick}
                variant="info"
                style={{ marginLeft: "5px" }}
              >
                Get all
              </Button>
            </Col>
          </Row>
        </Form.Group>
      </form>
    </Container>
  );
}

async function getLogs(
  setLogs: (newLogs: string[][]) => void,
  hostname?: string,
) {
  let getAllLogs: boolean;
  // use truthy value of hostname
  if (hostname === undefined) getAllLogs = true;
  else getAllLogs = false;

  // get the data from the API
  const apiServerUrl =
    globalThis.BROWSER_SYSLOG_API_ENV.baseUrl || "http://127.0.0.1";
  const apiLocation =
    globalThis.BROWSER_SYSLOG_API_ENV.apiPath || "/api/syslog";

  const response = await fetch(
    `${apiServerUrl}${apiLocation}${getAllLogs ? "" : "/" + hostname}`,
  );
  console.log(response);
  const data = await response.json();

  // check for errors or none found
  if (!response.ok || data.count === 0) {
    const emptyArray: string[][] = [[]];
    setLogs(emptyArray);
    return;
  }
  // turn the nested object into nested arrays
  const logsArray: string[][] = [];

  for (const log of data.logs) {
    const facility: string = FACILITIES[log.facility];
    const severity: string = SEVERITIES[log.severity];
    const date: string = log.date;
    const time: string = log.time;
    const hostname: string = log.hostname;
    const tag: string = log.tag;
    const content: string = log.content;
    logsArray.push([facility, severity, date, time, hostname, tag, content]);
  }

  setLogs(logsArray);
}

export default HostnameForm;
