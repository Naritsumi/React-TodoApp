import React, { useEffect, useState } from 'react'
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase.js";
import { useNavigate } from "react-router-dom";
import { uid } from "uid";
import { set, ref, onValue, remove, update } from "firebase/database";
import { Container, Row, Col, ListGroup, Form, Button, Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { FaTrash, FaEdit, FaPlus, FaCheck, FaSignOutAlt } from 'react-icons/fa';

import "./homepage.css";

export default function Homepage() {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [tempUidd, setTempUidd] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        // read
        onValue(ref(db, `/${auth.currentUser.uid}`), (snapshot) => {
          setTodos([]);
          const data = snapshot.val();
          if (data !== null) {
            Object.values(data).map((todo) => {
              setTodos((oldArray) => [...oldArray, todo]);
            });
          }
        });
      } else if (!user) {
        navigate("/");
      }
    });
  }, []);


  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        navigate("/");
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  // add
  const writeToDoDatabase = () => {
    const uidD = uid();
    set(ref(db, `/${auth.currentUser.uid}/${uidD}`), {
      todo: todo,
      uidD: uidD
    });

    setTodo("");
  };

  // update
  const handleUpdate = (todo) => {
    setIsEdit(true);
    setTodo(todo.todo);
    setTempUidd(todo.uidD);
  };

  // confirm edit
  const handleEditConfirm = () => {
    update(ref(db, `/${auth.currentUser.uid}/${tempUidd}`), {
      todo: todo,
      tempUidd: tempUidd
    });

    setTodo("");
    setIsEdit(false);
  };

  //delete
  const handleDelete = (uid) => {
    remove(ref(db, `/${auth.currentUser.uid}/${uid}`))
  };

  return (
    <div className="homepage"
      style={{ backgroundImage: 'url(' + require('../images/Dark_blue.jpg') + ')' }}>
      <Navbar expand="lg">
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Button variant="danger"
              onClick={handleSignOut}
              style={{ marginRight: '10px' }}>
              <FaSignOutAlt />
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <Container>
        <Row className="justify-content-md-center">
          <Col md="8">
            <h1 className="text-center text-white my-4">To-Do App</h1>
            <Form>
              <Form.Group>
                <div class="row">
                  <div class="col-11">
                    <Form.Control
                      type="text"
                      placeholder="Add todo..."
                      value={todo}
                      onChange={(e) => setTodo(e.target.value)}
                    />
                  </div>
                  <div class="col-1" >
                    {isEdit ? (
                      <Button class="primary"
                        onClick={handleEditConfirm}>
                        <FaCheck />
                      </Button>
                    ) : (
                      <Button variant="success" onClick={writeToDoDatabase}>
                        <FaPlus />
                      </Button>
                    )}
                  </div>
                </div>
              </Form.Group>
            </Form>
            <ListGroup className="mt-5">
              {
                todos.map((todo) => (
                  <ListGroup.Item
                    className="d-flex justify-content-between align-items-center">
                    <div>                          
                      <Form.Check
                        type="checkbox"
                        style={{ textDecoration: 'none' }}
                        label={todo.todo}/>                        
                    </div>

                    <div>
                      <Button
                        className="hover-button"
                        variant="primary-outline"
                        onClick={() => handleUpdate(todo)}
                        style={{ backgroundColor: 'transparent' }}>
                        <FaEdit
                          className="text-edit" />
                      </Button>
                      <Button
                        className="hover-button"
                        variant="danger-outline"
                        onClick={() => handleDelete(todo.uidD)}
                        style={{ backgroundColor: 'transparent' }}>
                        <FaTrash
                          className="text-delete" />
                      </Button>
                    </div>
                  </ListGroup.Item>
                ))
              }
            </ListGroup>
          </Col>
        </Row>
      </Container>

    </div>
  )
}
