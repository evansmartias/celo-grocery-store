import React, { useState } from "react";

import { Button, Modal, Form, FloatingLabel, Nav, Container, Navbar } from "react-bootstrap";

const Home = (props) => {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");


  const isFormFilled = () => name && image && description && location && price;

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
<>
    <Navbar>
      <Container>
        <Navbar.Brand href="#home">Celo Groceries</Navbar.Brand>
        <Navbar.Toggle />
        <Nav className="me-auto">
        <Nav.Link href="#home">Balance: {props.cUSDBalance}cUSD</Nav.Link>
       
          </Nav>
        <Navbar.Collapse className="justify-content-end">
        
        <Button
        onClick={handleShow}
        variant="dark"
        
      >
        <h4> Add new Grocery </h4>
      </Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>

    
      
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>New grocery</Modal.Title>
        </Modal.Header>
        <Form>
          <Modal.Body>
            <FloatingLabel
              controlId="inputName"
              label="Name"
              className="mb-3"
            >
              <Form.Control
                type="text"
                onChange={(e) => {
                  setName(e.target.value);
                }}
                placeholder="name"
              />
            </FloatingLabel>

            <FloatingLabel
              controlId="inputImage"
              label="image"
              className="mb-3"
            >
              <Form.Control
                type="text"
                style={{ height: "80px" }}
                onChange={(e) => {
                  setImage(e.target.value);
                }}
              />
            </FloatingLabel>
            
            <FloatingLabel
              controlId="inputDescription"
              label="Description "
              className="mb-3"
            >
              <Form.Control
                as="textarea"
                placeholder="description"
                style={{ height: "80px" }}
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
              />
            </FloatingLabel>

            <FloatingLabel
              controlId="location"
              label="location"
              className="mb-3"
            >
              <Form.Control
                 type="text"
                placeholder="location"
                style={{ height: "80px" }}
                onChange={(e) => {
                  setLocation(e.target.value);
                }}
              />
            </FloatingLabel>


            <FloatingLabel
              controlId="price"
              label="price"
              className="mb-3"
            >
              <Form.Control
                 type="number"
                placeholder="price"
                style={{ height: "80px" }}
                onChange={(e) => {
                  setPrice(e.target.value);
                }}
              />
            </FloatingLabel>
            
           
          </Modal.Body>
        </Form>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            variant="dark"
            disabled={!isFormFilled()}
            onClick={() => {
              props.addGrocery( 
                name,
                image,
                description,
                location,
                price,
              );
              handleClose();
            }}
          >
            Add new grocery
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Home;
