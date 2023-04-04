import React, { useEffect, useState } from 'react'
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase.js";
import { useNavigate } from "react-router-dom";
import { uid } from "uid";
import { set, ref, onValue, remove, update } from "firebase/database";

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
    update(ref(db, `/${auth.currentUser.uid}/${tempUidd}`),{
      todo:todo,
      tempUidd:tempUidd
    })
  };

  //delete
  const handleDelete = (uid) => {
    remove(ref(db, `/${auth.currentUser.uid}/${uid}`))
  };

  return (
    <div>
      <input
        type="text"
        placeholder='Add todo...'
        value={todo}
        onChange={(e) => setTodo(e.target.value)}
      />
      {
        todos.map((todo) => (
          <div>
            <h1>{todo.todo}</h1>
            <button onClick={() => handleUpdate(todo)}>Update</button>
            <button onClick={() => handleDelete(todo.uidD)}>Delete</button>
          </div>
        ))
      }
      {isEdit ? (
        <div>
          <button onClick={handleEditConfirm}>Confirm</button>
        </div>
      ) : (
        <div>
          <button onClick={writeToDoDatabase}>Add</button>
        </div>
      )}
      <button onClick={handleSignOut}>Sign out</button>
    </div>
  )
}
