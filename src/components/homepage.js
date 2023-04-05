import React, { useEffect, useState } from 'react'
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase.js";
import { useNavigate } from "react-router-dom";
import { uid } from "uid";
import { set, ref, onValue, remove, update } from "firebase/database";

// Visuals
import "./homepage.css";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import CheckIcon from '@mui/icons-material/Check';

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
      <input
        className='add-edit-input'
        type="text"
        placeholder="Add todo..."
        value={todo}
        onChange={(e) => setTodo(e.target.value)}
      />
      {
        todos.map((todo) => (
          <div className='todo'>
            <h1>{todo.todo}</h1>
            <EditIcon onClick={() => handleUpdate(todo)} className="edit-button"/>
            <DeleteIcon onClick={() => handleDelete(todo.uidD)} className="delete-button"/>
          </div>
        ))
      }
      {isEdit ? (
        <div>
          <CheckIcon onClick={handleEditConfirm} className="add-confirm-icon"/>
        </div>
      ) : (
        <div>
          <AddIcon onClick={writeToDoDatabase} className="add-confirm-icon"/>
        </div>
      )}
      <ExitToAppIcon onClick={handleSignOut} className="logout-icon"/>
    </div>
  )
}
