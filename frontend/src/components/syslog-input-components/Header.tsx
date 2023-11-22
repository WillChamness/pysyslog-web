import ReactDatePicker from "react-datepicker";
import { ChangeEvent, useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import { validateTime, validateHostname } from "../../SyslogValidator";
import "react-datepicker/dist/react-datepicker.min.css";
import "../../styles/RowSeparator.css";
import "../../styles/InputLabel.css";

interface TimestampProps {
  date: Date;
  setDate: (date: Date) => void;
  time: string;
  setTime: (time: string) => void;
}

/*
 * Component for the timestamp.
 *
 * Contains two parts: the date and time. Date is retrieved via
 * react-datepicker, and time is set by an event handler that
 * checks the input when focus is off the textbox.
 *
 * Validation for both is not done here and is assumed to be
 * done before sending the message.
 * */
function Timestamp({ date, setDate, time, setTime }: TimestampProps) {
  const [validated, setValidated] = useState(false);
  // Handler for datepicker
  const handleDateOnChange = (date: Date) => setDate(date);

  // Handler for "time-input" textbox
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newTime = event.target.value;
    setTime(newTime);
    if (!validateTime(newTime)) setValidated(false);
    else setValidated(true);
  };

  // returns date and time inputs
  return (
    <Container>
      <Form.Group>
        <Row className="row-separator">
          <Col className="col-2">
            <label className="textbox-label">Date:</label>
          </Col>
          <Col>
            <ReactDatePicker
              selected={date}
              onChange={(date: Date) => handleDateOnChange(date)}
            />
          </Col>
        </Row>
        <Row className="row-separator">
          <Col className="col-2">
            <Form.Label htmlFor="time-input" className="textbox-label">
              Time:
            </Form.Label>
          </Col>
          <Col className="col-5">
            <Form.Control
              type="text"
              id="time-input"
              name="time"
              value={time}
              placeholder="hh:mm:ss"
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                handleChange(event)
              }
              isInvalid={!validated}
              style={{ marginLeft: "5px" }}
            />
            <Form.Control.Feedback type="invalid">
              Invalid format!
            </Form.Control.Feedback>
          </Col>
        </Row>
      </Form.Group>
    </Container>
  );
}

interface HostnameProps {
  hostname: string;
  setHostname: (newHostname: string) => void;
}

/*
 * Component for the hostname.
 *
 * The hostname can be a DNS hostname made up of ASCII characters or an IP address.
 * The host's FQDN should not be used, but validation is not performed to check if
 * a valid hostname is given.
 * */
function Hostname({ hostname, setHostname }: HostnameProps) {
  const [validated, setValidated] = useState(false);
  const tooltip = (
    <Tooltip>
      Represents the sending device. Can either be a DNS hostname or an IP
      address.
      <br />
      <br />
      The only characters allowed are alphanumeric characters and the '-' and
      '.' characters. This field is not validated otherwise. BSD Syslog assumes
      that the hostname is correct.
    </Tooltip>
  );
  // Handler for "hostname-input" textbox
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newHostname: string = event.target.value;
    setHostname(newHostname);
    if (!validateHostname(newHostname)) setValidated(false);
    else setValidated(true);
  };

  // Handler for randomize button
  const handleClick = () => {
    const firstOctet: number = Math.floor(Math.random() * 223 + 1);
    const secondOctet: number = Math.floor(Math.random() * 223 + 1);
    const thirdOctet: number = Math.floor(Math.random() * 223 + 1);
    const fourthOctet: number = Math.floor(Math.random() * 223 + 1);

    const ipAddr: string = `${firstOctet}.${secondOctet}.${thirdOctet}.${fourthOctet}`;

    setHostname(ipAddr);
    setValidated(true);
  };

  return (
    <Container>
      <Form.Group>
        <Row>
          <Col className="col-2">
            <Form.Label htmlFor="hostname-input" className="textbox-label">
              Hostname:
            </Form.Label>
          </Col>
        </Row>
        <Row className="row-separator">
          <Col className="col-6">
            <OverlayTrigger trigger="focus" overlay={tooltip} placement="right">
              <div>
                <Form.Control
                  type="text"
                  id="hostname-input"
                  value={hostname}
                  placeholder="localhost"
                  onChange={(event: ChangeEvent<HTMLInputElement>) =>
                    handleChange(event)
                  }
                  style={{ marginLeft: "5px" }}
                  isInvalid={!validated}
                />
                <Form.Control.Feedback type="invalid">
                  Must be a valid hostname!
                </Form.Control.Feedback>
              </div>
            </OverlayTrigger>
          </Col>
          <Col className="col-3">
            <Button variant="info" onClick={handleClick}>
              Randomize
            </Button>
          </Col>
        </Row>
      </Form.Group>
    </Container>
  );
}

export { Timestamp, Hostname };

interface HeaderProps extends TimestampProps, HostnameProps { }

/*
 * Wrapper component representing Timestamp and Hostname.
 * */
export default function Header({
  date,
  setDate,
  time,
  setTime,
  hostname,
  setHostname,
}: HeaderProps) {
  return (
    <fieldset>
      <legend>Header</legend>
      <Timestamp date={date} setDate={setDate} time={time} setTime={setTime} />
      <Hostname hostname={hostname} setHostname={setHostname} />
    </fieldset>
  );
}
