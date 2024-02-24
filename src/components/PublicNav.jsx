import React from "react";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import ExportButton from "./ExportButton";
import { NavLink, NavItem } from "react-bootstrap";

function PublicNav() {
  return (
    <>
      {" "}
      <Navbar expand="lg" bg="dark" data-bs-theme="dark">
        <Container>
          <Navbar.Brand href="/">AM Janitorial Services</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <NavLink href="/">Auto Entry</NavLink>
              <NavLink href="/manual">Manual Entry</NavLink>
              <NavLink href="/map">Map</NavLink>
              <NavLink href="/">Map</NavLink>
            </Nav>
            <Nav className="justify-content-between gap-2">
              <NavItem>
                <ExportButton />
              </NavItem>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default PublicNav;
