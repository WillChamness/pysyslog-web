import { useRef, useState } from "react";
import generateSyslog from "../../SyslogValidator";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import "../../styles/RowSeparator.css";

interface SyslogPreviewerProps {
  facility: number;
  severity: number;
  date: Date;
  time: string;
  hostname: string;
  tag: string;
  content: string;
  separateWithSpace: boolean;
}

function SyslogPreviewer({
  facility,
  severity,
  date,
  time,
  hostname,
  tag,
  content,
  separateWithSpace,
}: SyslogPreviewerProps) {
  const [output, setOutput] = useState("");
  const validationResultRef = useRef<HTMLParagraphElement>(null);

  const handleClick = () => {
    /*
     * Handler for the preview button.
     *
     * Display a list of error messags if there are any problems. Otherwise, just
     * display the Syslog message.
     * */
    const validationResult: string | string[] = generateSyslog(
      facility,
      severity,
      date,
      time,
      hostname,
      tag,
      content,
      separateWithSpace,
    );
    let newOutput = "";

    // Case 1: there are errors
    if (Array.isArray(validationResult)) newOutput = "Invalid message";
    // Case 2: there are no errors
    else newOutput = validationResult;

    setOutput(newOutput);

    // scroll down to result after button press for convinience
    // wait 0.5 seconds to render as a precaution
    setTimeout(() => validationResultRef.current?.scrollIntoView(), 0.5);
  };

  // actual render on the screen
  return (
    <Container>
      <Row className="row-separator">
        <Col>
          <Button variant="info" onClick={handleClick}>
            Preview
          </Button>
        </Col>
      </Row>
      <Row className="row-separator" style={{ marginTop: "10px" }}>
        <p ref={validationResultRef} id="syslog-validation-result">
          {output}
        </p>
      </Row>
    </Container>
  );
}

export default SyslogPreviewer;
