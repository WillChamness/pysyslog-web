import Dropdown from "react-bootstrap/Dropdown";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import "../../styles/ScrollableDropdown.css";
import "../../styles/RowSeparator.css";

const facilities: string[] = [
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

interface facilityProps {
  facility: number;
  setFacility: (facility: number) => void;
}

/*
 * Component for Facility
 *
 * Syslog facility can be an integer from 0 to 23, each representing a different
 * situation.
 * */
function Facility({ facility, setFacility }: facilityProps) {
  const tooltip = (
    <Tooltip>
      Represents the type of application that spawned the message.
      <br /> <br />
      Pri = 8*facility + severity
    </Tooltip>
  );
  // handler for dropdown button
  const handleClick = (chosenFacility: number) => {
    setFacility(chosenFacility);
  };

  return (
    <Container id="facility-container">
      <Row xs="auto">
        <Col>
          <label>Facility:</label>
        </Col>
        <Col>
          <OverlayTrigger trigger="focus" overlay={tooltip} placement="top">
            <Dropdown>
              <Dropdown.Toggle variant="info">
                {facilities[facility]}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {facilities.map((item, index) => (
                  <Dropdown.Item
                    key={item}
                    href="#"
                    onClick={() => handleClick(index)}
                  >
                    {item}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </OverlayTrigger>
        </Col>
      </Row>
    </Container>
  );
}

const severities: string[] = [
  "Emergency (0)",
  "Alert (1)",
  "Critical (2)",
  "Error (3)",
  "Warning (4)",
  "Notice (5)",
  "Informational (6)",
  "Debug (7)",
];

interface severityProps {
  severity: number;
  setSeverity: (severity: number) => void;
}

/*
 * Component for Severity.
 *
 * Syslog severity can be an integer from 0 to 7, each representing how important
 * the message is.
 */
function Severity({ severity, setSeverity }: severityProps) {
  const tooltip = (
    <Tooltip>
      Represents how important the message is.
      <br /> <br />
      Pri = 8*facility + severity
    </Tooltip>
  );
  // handler for dropdown button
  function handleClick(chosenSeverity: number) {
    setSeverity(chosenSeverity);
  }

  return (
    <Container id="severity-container">
      <Row xs="auto">
        <Col>
          <label>Severity:</label>
        </Col>
        <Col>
          <OverlayTrigger trigger="focus" overlay={tooltip} placement="top">
            <Dropdown>
              <Dropdown.Toggle variant="info">
                {severities[severity]}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {severities.map((item, index) => (
                  <Dropdown.Item
                    href="#"
                    key={item}
                    onClick={() => handleClick(index)}
                  >
                    {item}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </OverlayTrigger>
        </Col>
      </Row>
    </Container>
  );
}

export { Facility, Severity };

interface priProps extends facilityProps, severityProps { }

/*
 * Wrapper component representing Facililty and Severity.
 */
export default function Pri({
  facility,
  setFacility,
  severity,
  setSeverity,
}: priProps) {
  return (
    <fieldset>
      <legend>Pri</legend>
      <Container>
        <Row className="row-separator">
          <Facility facility={facility} setFacility={setFacility} />
        </Row>
        <Row className="row-separator">
          <Severity severity={severity} setSeverity={setSeverity} />
        </Row>
      </Container>
    </fieldset>
  );
}
