import Pri from "./syslog-input-components/Pri";
import Header from "./syslog-input-components/Header";
import Msg from "./syslog-input-components/Msg";
import SyslogPreviewer from "./syslog-input-components/SyslogPreviewer";
import { useState, MouseEvent, useRef } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import { validateAll } from "../SyslogValidator";
import "../styles/RowSeparator.css";
import "../styles/FadeTransition.css";

// global to be injected after build time at production
declare global {
  var BROWSER_SYSLOG_API_ENV: {
    baseUrl: string;
    apiPath: string;
  };
}

/*
 * A wrapper component containing the entire Syslog input form.
 * */
function SyslogInput() {
  const [facility, setFacility] = useState(0);
  const [severity, setSeverity] = useState(0);
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState("");
  const [hostname, setHostname] = useState("");
  const [tag, setTag] = useState("");
  const [content, setContent] = useState("");
  const [separateWithSpace, setSeparateWithSpace] = useState(true);
  const [apiMessage, setApiMessage] = useState("");
  const [showingAlert, setShowingAlert] = useState(false);
  const [status, setStatus] = useState("danger");
  const [submitCounter, setSubmitCounter] = useState(0);
  const alertRef = useRef<HTMLDivElement>(null);

  function handleSubmit(event: MouseEvent) {
    event.preventDefault();
    sendPostRequest(
      facility,
      severity,
      date,
      time,
      hostname,
      tag,
      content,
      separateWithSpace,
      status,
      submitCounter,
      setApiMessage,
      setStatus,
      setSubmitCounter,
    );
  }

  return (
    <Container fluid="lg">
      <form>
        <Row className="mb-4">
          <Col>
            <h3>Send Syslog Message</h3>
          </Col>
        </Row>
        <Row>
          <Col className="col-5">
            <Pri
              facility={facility}
              setFacility={setFacility}
              severity={severity}
              setSeverity={setSeverity}
            />
          </Col>
        </Row>
        <Row className="row-separator">
          <Col className="col-md-5 col-12">
            <Header
              date={date}
              setDate={setDate}
              time={time}
              setTime={setTime}
              hostname={hostname}
              setHostname={setHostname}
            />
          </Col>
        </Row>
        <Row className="mb-4">
          <Col className="col-md-5 col-8">
            <Msg
              tag={tag}
              setTag={setTag}
              content={content}
              setContent={setContent}
              separateWithSpace={separateWithSpace}
              setSeparateWithSpace={setSeparateWithSpace}
            />
          </Col>
        </Row>
        <Row>
          <Col className="col-md-4 col-7">
            <SyslogPreviewer
              facility={facility}
              severity={severity}
              date={date}
              time={time}
              hostname={hostname}
              tag={tag}
              content={content}
              separateWithSpace={separateWithSpace}
            />
          </Col>
          <Col>
            <Button
              variant="info"
              type="submit"
              onClick={(event: MouseEvent) => {
                // refresh alert
                setShowingAlert(false);
                setShowingAlert(true);
                handleSubmit(event);
                // if alert is not showing, need to wait for transition animation before scrolling
                setTimeout(() => alertRef.current?.scrollIntoView(), 0.5);
              }}
            >
              Submit
            </Button>
          </Col>
        </Row>
        <Row>
          <Col className="col-5">
            <Alert ref={alertRef} show={showingAlert} variant={status}>
              <Alert.Heading>
                <p>{`${apiMessage}${submitCounter === 1 ? "" : " x" + submitCounter
                  }`}</p>
                <hr />
                <div className="d-flex justify-content-end">
                  <Button
                    onClick={() => setShowingAlert(false)}
                    variant={`outline-${status}`}
                  >
                    Close
                  </Button>
                </div>
              </Alert.Heading>
            </Alert>
          </Col>
        </Row>
      </form>
    </Container>
  );
}

/**
 * Helper function that generates and sends the syslog parts to the API server.
 *
 * It is assumed that the API server will generate the proper
 * Syslog message before forwarding it to the Syslog server.
 */
function sendPostRequest(
  facility: number,
  severity: number,
  date: Date,
  time: string,
  hostname: string,
  tag: string,
  content: string,
  separateWithSpace: boolean,
  status: string,
  originalCounter: number,
  setApiMessage: (apiMessage: string) => void,
  setStatus: (status: string) => void,
  setSubmitCounter: (newCounter: number) => void,
): boolean {
  const DEFAULT_COUNTER: number = 1;
  let returnMessage: string = "";
  let currentStatus: string = "";
  let sameErrorType: boolean = false;
  const month: string = date.toString().split(" ")[1];
  let day: string = date.toString().split(" ")[2];

  // check for errors
  if (Number.parseInt(day) < 10) day = " " + Number.parseInt(day); // replace leading zero with space
  const errors: string[] = validateAll(
    month + " " + day,
    time,
    hostname,
    tag,
    content,
  );
  if (errors.length !== 0) {
    currentStatus = "danger";
    const newCounter =
      status === currentStatus ? originalCounter + 1 : DEFAULT_COUNTER;
    returnMessage = "Invalid message!";
    setApiMessage(returnMessage);
    setStatus(currentStatus);
    setSubmitCounter(newCounter);
    return status === "danger";
  }

  // send to the syslog server via the API
  const apiServerUrl: string =
    globalThis.BROWSER_SYSLOG_API_ENV.baseUrl || "http://127.0.0.1:3000";
  const apiLocation: string =
    globalThis.BROWSER_SYSLOG_API_ENV.apiPath || "/api/syslog";

  fetch(apiServerUrl + apiLocation, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      facility: facility,
      severity: severity,
      date: month + " " + day,
      time: time,
      hostname: hostname,
      tag: tag,
      content: separateWithSpace ? " " + content.trim() : content.trim(),
    }),
  })
    .then((res) => {
      if (200 <= res.status && res.status <= 299) {
        returnMessage = "Success!";
        currentStatus = "success";
      } else if (300 <= res.status && res.status <= 399) {
        returnMessage = "Redirected! Maybe maintainence is being done?";
        currentStatus = "warning";
      } else if (400 <= res.status && res.status <= 499) {
        returnMessage = "Client-side error! See browser console for log.";
        currentStatus = "danger";
        res.json().then(console.log);
      } else {
        currentStatus = "danger";
        returnMessage = "Server-side error! See browser console for log.";
        res.json().then(console.log);
      }
      const newCounter =
        status === currentStatus ? originalCounter + 1 : DEFAULT_COUNTER;
      setSubmitCounter(newCounter);
      setApiMessage(returnMessage);
      setStatus(currentStatus);
    })
    .catch((error) => {
      currentStatus = "danger";
      returnMessage = "Something went wrong! See browser console for log.";
      console.log(error);
    });

  return sameErrorType;
}

export default SyslogInput;
