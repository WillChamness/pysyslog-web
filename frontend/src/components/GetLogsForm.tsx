import { useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import HostnameForm from "./getlogs-form-components/HostnameForm";
import LogsTable from "./getlogs-form-components/LogsTable";

function GetLogsForm() {
  const [logs, setLogs] = useState<string[][]>([[]]);
  return (
    <Container>
      <Row>
        <Col className="col-5">
          <HostnameForm setLogs={setLogs} />
        </Col>
      </Row>
      <Row style={{ marginTop: "20px", marginBottom: "50px" }}>
        <Col>
          <LogsTable rows={logs} />
        </Col>
      </Row>
    </Container>
  );
}

export default GetLogsForm;
