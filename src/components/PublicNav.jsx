import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import ExportButton from "./ExportButton";
import { NavLink, NavItem } from "react-bootstrap";

function PublicNav({ leadsArr, resetState }) {
  return (
    <Navbar expand="lg" bg="dark" data-bs-theme="dark">
      <Container>
        <Navbar.Brand href="/">AM Janitorial Services</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <NavItem>
              <NavLink href="/">Auto Entry</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/manual">Manual Entry</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/map">Map</NavLink>
            </NavItem>
          </Nav>
          <Nav className="justify-content-between">
            <NavItem>
              <ExportButton leadData={leadsArr} reset={resetState} />
            </NavItem>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default PublicNav;
