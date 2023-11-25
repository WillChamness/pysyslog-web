import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";

export default function NavBar() {
  return (
    <Navbar
      expand="lg"
      style={{ paddingLeft: "15px" /*CSS file doesn't apply padding??*/ }}
    >
      <Navbar.Brand>
        <Link to="/" id="navbrand">
          Syslog
        </Link>
      </Navbar.Brand>
      <Navbar.Collapse className="justify-content-end">
        <Nav.Link>
          <Link className="navlink" to="/sendlogs">
            Send Logs
          </Link>
        </Nav.Link>
        <Nav.Link>
          <Link className="navlink" to="/getlogs">
            Get Logs
          </Link>
        </Nav.Link>
        <Nav.Link
          className="navlink"
          href="https://github.com/WillChamness/pysyslog-server#bsd-syslog-overview"
          target="_blank"
          rel="noopener noreferrer"
        >
          About
        </Nav.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}
