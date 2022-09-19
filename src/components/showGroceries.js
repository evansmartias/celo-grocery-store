import React from 'react';
import { useState } from "react";
import { Card, Form, Badge, Button, Row } from 'react-bootstrap';




export const Ideas = (props) => {

const [newPrice, setNewPrice] = useState('');

return ( 
    <Row xs={1} md={3} className="g-4">
    {props.groceries.map((g)=> (
    <Card key={g.index} style={{ width: '28rem' }}>
            <Card.Header>
            <Badge bg="secondary" className="ms-auto">
              {g.sold} Sold
            </Badge>
            </Card.Header>
       <div className=" ratio ratio-4x3">
          <img src={g.image} alt={g.description} style={{ objectFit: "cover" }} />
        </div>
      <Card.Body>
        <Card.Title>{g.name}</Card.Title>
        <Card.Title>{g.price  / 1000000000000000000} cUSD</Card.Title>
        <Card.Title>{g.location}</Card.Title>
        <Card.Text className="flex-grow-1">{g.description}</Card.Text>


        {props.walletAddress === g.owner &&(
       
       <Button variant="dark"  onClick={()=> props.toggleSoldout(g.index)}>
         Toggle Sold out
       </Button>
   
      )}

     {props.walletAddress === g.owner &&(
       <Form>
       <Form.Group className="mb-1 mt-4" >
         <Form.Control type="number" placeholder="Enter new price" onChange={(e) => setNewPrice(e.target.value)} />
       </Form.Group>
       <Button variant="dark" className="mt-1" onClick={()=> props.modifyPrice(g.index, newPrice)}>
         Change Price
       </Button>
     </Form>
      )}


     {props.walletAddress !== g.owner && g.soldout === false &&(
      <Button className="mt-2" onClick ={()=> props.buy(g.index)}>Buy Grocery</Button>
      )}

{props.walletAddress !== g.owner && g.soldout === true &&(
       <Card.Title>SOLD OUT</Card.Title>
      )}

    {props.walletAddress === g.owner &&(
      <Button className="mt-4" onClick ={()=> props.deleteGrocery(g.index)}>Delete this grocery</Button>
      )}

      </Card.Body>
    </Card>
  ))}
</Row>
  
)};
