import React, { useEffect, useState } from 'react'
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase.js";
import { useNavigate } from "react-router-dom";
import { uid } from "uid";
import { set, ref, onValue, remove, update } from "firebase/database";
import { Container, Row, Col, ListGroup, Form, Button, Navbar, Nav } from 'react-bootstrap';
import { FaTrash, FaEdit, FaPlus, FaCheck, FaSignOutAlt } from 'react-icons/fa';

import "./homepage.css";

export default function Homepage() {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [tempUidd, setTempUidd] = useState("");

  const [checkedItems, setCheckedItems] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        // read
        onValue(ref(db, `/${auth.currentUser.uid}`).orderByChild('createdAt'), (snapshot) => {
          setTodos([]);
          const data = snapshot.val();
          if (data !== null) {
            Object.values(data).map((todo) => {
              setTodos((oldArray) => [...oldArray, todo]);
              setCheckedItems((oldObject) => ({ ...oldObject, [todo.uidD]: todo.completed }));
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
    const createdAt = new Date().toISOString();
    set(ref(db, `/${auth.currentUser.uid}/${uidD}`), {
      todo: todo,
      uidD: uidD,      
      createdAt: createdAt
    });

    setTodo("");
  };

  // prevents enter event
  const handleSubmit = (e) => {
    e.preventDefault();
    writeToDoDatabase();
  }

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

  //  delete
  const handleDelete = (uid) => {
    remove(ref(db, `/${auth.currentUser.uid}/${uid}`))
  };

  //  completed or not
  const handleCheckboxChange = (e, todo) => {
    const { checked } = e.target;
    setCheckedItems({ ...checkedItems, [todo.uidD]: checked });
    set(ref(db, `/${auth.currentUser.uid}/${todo.uidD}/completed`), checked);
  }

  const countIncompleteTasks = () => {
    const incompleteTasks = todos.filter((todo) => !todo.completed);
    return incompleteTasks.length;
  };

  return (
    <div className="homepage"
      style={{ backgroundImage: 'url(' + require('../images/Dark_blue.jpg') + ')' }}>
      <Navbar expand="sm">
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
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
            <Form onSubmit={handleSubmit}>
              <Form.Group>
                <div class="input-group">
                  <Form.Control
                    type="text"
                    placeholder="Add todo..."
                    value={todo}
                    onChange={(e) => setTodo(e.target.value)}
                  />
                  <div class="input-group-append">
                    {isEdit ? (
                      <Button class="primary" onClick={handleEditConfirm}>
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
            <ListGroup className="mt-4">
              {
                todos.map((todo) => (
                  <ListGroup.Item
                    className="d-flex justify-content-between align-items-center">
                    <div
                      style={{ marginTop: "5px" }} >
                      <Form.Check
                        type="checkbox"
                        label={todo.todo}
                        checked={checkedItems[todo.uidD]}
                        onChange={(e) => handleCheckboxChange(e, todo)}
                        className={checkedItems[todo.uidD] ? "my-form-check-checked" : "my-form-check"}
                      />
                    </div>
                    <div className="d-flex align-self-center">
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
              <ListGroup.Item className="mt-2">
                {countIncompleteTasks()} incomplete tasks
              </ListGroup.Item>
            </ListGroup>
          </Col>
        </Row>
      </Container>
    </div>
  )
}
