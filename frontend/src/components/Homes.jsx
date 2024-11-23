import React from 'react';
import { Navbar, Nav, Container, Button, Card, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap styles are included
import './css/home.css';

// Import images from the img folder
import samsungImage from './img/samsung.png';
import iphoneImage from './img/iphone.png'; 
import redmiImage from './img/redmi.png';
import vivoImage from './img/vivo.png'; 
import oppoImage from './img/oppo.png'; 
import motorolaImage from './img/motorola.png'; 
import huaweiImage from './img/huawei.png';
import honorImage from './img/honor.png';
import tecnoImage from './img/tecno.png';
import redmagicImage from './img/redmagic.png';
import oneplusImage from './img/oneplus.png'; 
import sonyImage from './img/sony.png';// Adjust the filename if needed

const Homes = () => {
  return (
    <div className="home-container">
      {/* Navigation Bar */}
      <Navbar bg="light" expand="lg" className="navbar fixed-top">
        <Container>
          <Navbar.Brand href="/" className="logo">THE PHONE SHOP</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link href="/home">Home</Nav.Link>
              <Nav.Link href="/catalog">Catalog</Nav.Link>
              <Nav.Link href="/trade-in">Trade-In</Nav.Link>
              <Nav.Link href="/contact">Contact</Nav.Link>
              <Nav.Link href="/login">Login</Nav.Link>
              <Nav.Link href="/register">Register</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Redmi Product Section */}
      <Container className="-product-section mt-5">
        <Row>
          <Col md={3}>
            <Card>
              <Card.Img variant="top" src={redmiImage} />
              <Card.Body>
                <Card.Title>Xiaomi Redmi Note 13 Pro+</Card.Title>
                <Button variant="primary" className="me-2">Learn More</Button>
                <Button variant="success">Add to Cart</Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card>
              <Card.Img variant="top" src={samsungImage} />
              <Card.Body>
                <Card.Title>Samsung Galaxy A55</Card.Title>
                <Button variant="primary" className="me-2">Learn More</Button>
                <Button variant="success">Add to Cart</Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card>
              <Card.Img variant="top" src={iphoneImage} />
              <Card.Body>
                <Card.Title>Apple iPhone 15</Card.Title>
                <Button variant="primary" className="me-2">Learn More</Button>
                <Button variant="success">Add to Cart</Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card>
              <Card.Img variant="top" src={vivoImage} />
              <Card.Body>
                <Card.Title>Vivo V25 Pro</Card.Title>
                <Button variant="primary" className="me-2">Learn More</Button>
                <Button variant="success">Add to Cart</Button>
              </Card.Body>
            </Card>
          </Col>           
          <Col md={3}>
            <Card>
              <Card.Img variant="top" src={huaweiImage} />
              <Card.Body>
                <Card.Title>Huawei Pura 70 Ultra</Card.Title>
                <Button variant="primary" className="me-2">Learn More</Button>
                <Button variant="success">Add to Cart</Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card>
              <Card.Img variant="top" src={motorolaImage} />
              <Card.Body>
                <Card.Title>Motorola Razr+ 2024</Card.Title>
                <Button variant="primary" className="me-2">Learn More</Button>
                <Button variant="success">Add to Cart</Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card>
              <Card.Img variant="top" src={oppoImage} />
              <Card.Body>
                <Card.Title>Oppo Reno 12 Pro</Card.Title>
                <Button variant="primary" className="me-2">Learn More</Button>
                <Button variant="success">Add to Cart</Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card>
              <Card.Img variant="top" src={honorImage} />
              <Card.Body>
                <Card.Title>Honor x9b</Card.Title>
                <Button variant="primary" className="me-2">Learn More</Button>
                <Button variant="success">Add to Cart</Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card>
              <Card.Img variant="top" src={sonyImage} />
              <Card.Body>
                <Card.Title>Sony Xperia 1V</Card.Title>
                <Button variant="primary" className="me-2">Learn More</Button>
                <Button variant="success">Add to Cart</Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card>
              <Card.Img variant="top" src={tecnoImage} />
              <Card.Body>
                <Card.Title>Tecno Pova 6 Pro</Card.Title>
                <Button variant="primary" className="me-2">Learn More</Button>
                <Button variant="success">Add to Cart</Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card>
              <Card.Img variant="top" src={redmagicImage} />
              <Card.Body>
                <Card.Title>ZTE nubia Red Magic 9 pro</Card.Title>
                <Button variant="primary" className="me-2">Learn More</Button>
                <Button variant="success">Add to Cart</Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card>
              <Card.Img variant="top" src={oneplusImage} />
              <Card.Body>
                <Card.Title>OnePlus Nord CE 3 Lite</Card.Title>
                <Button variant="primary" className="me-2">Learn More</Button>
                <Button variant="success">Add to Cart</Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      

    </div>
  );
};

export default Homes;
