import { Navbar, Nav, Container } from "react-bootstrap";
import { FaList } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function MyNavbar() {
  return (
    <Navbar bg="white" expand="lg" className="shadow-sm py-2">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <FaList size={26} className="text-primary me-2" />
          <strong>Listify</strong>
        </Navbar.Brand>

        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Nav>
            <Nav.Link as={Link} to="/about">About us</Nav.Link>
            <Nav.Link as={Link} to="/contact">Contacts</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
